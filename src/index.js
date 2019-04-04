import {select, selectAll, mouse} from 'd3';
import { newGame, event } from './game.js';
import {handDescriptions} from './hand-descriptions.js';
const g = newGame();

function updateCardDeck(add){
  if(add != undefined){
    g.addCardsToDeck(add);
  }

  const deckJoin = select('.deck')
    .selectAll('.face-down.card')
      .data(g.getDeck());

  deckJoin.enter()
    .append('div')
    .attr('class','face-down card');

  deckJoin.exit()
    .remove();

  select('.deck')
    .selectAll('.face-down.card')
    .style('top', (d, i) => `${-i}px`);

  select('.remaining-count')
    .text(g.getDeck().length);
}

function drawCard(){
  // take the top card from the deck array
  // create a dom node
  // append it to the deck-container
  const drawnCard = g.drawCard();
  if(!drawnCard){ return false; }

  return select('.card-container')
    .append('div')
    .call(parent=>{
      parent.attr('class', 'active card')
        .attr('data-code', drawnCard.code);

      parent.append('img')
        .attr('src',`images/${drawnCard.code}.svg`)
        .attr('draggable','false');
    });
}

function updateScore(score, checklist){
  const lastHand = score.handHistory[score.handHistory.length - 1];

  select('.total-score')
    .text(`Score: ${Number(score.total).toLocaleString()}`);

  if(lastHand){
    select('.last-score')
      .html(`${lastHand.name} &ndash; ${ Number(lastHand.score.points).toLocaleString()} (+${lastHand.score.cards} cards)`);
  }

  const checkListMarkup = Object.entries(g.getChecklist())
    .map(([handName, complete])=>`<span data-handname="${handName}" class="hand-check-item ${(complete ? 'done' : 'todo' )}">${handName}</span>`)
    .join(' &ndash; ');

  select('.hand-record')
    .html(checkListMarkup);
  
  selectAll('span[data-handname]')
    .each(function(){

      select(this).on('mouseover', function(){
        handDescriptions[this.dataset.handname];
        const rect = select('.hand-record').node()
          .getBoundingClientRect();

        select('.tooltip')
          .style('display','block')
          .style('top', `${ rect.top + rect.height }px`)
          .style('left', `${ rect.left }px`)
          .style('width', `${rect.width}px`)
          .style('opacity', 1)
          .html(`<span class="tooltip-title">${this.dataset.handname}:</span> ${handDescriptions[this.dataset.handname]}`);
      });

      select(this).on('mouseout', function(){
        select('.tooltip')
          .style('opacity', 0)
          .style('z-index', 0);
          //.style('display', 'none');
      });
    });
}

const mouseWithin = (node) => {
  const loc = mouse(select('body').node());
  const rectangle = node.getBoundingClientRect();
  const rectanglePosition = [
    rectangle.x+window.scrollX,
    rectangle.y+window.scrollY
  ];
  return (
    ( loc[0] > rectanglePosition[0]  &&  loc[0] < rectanglePosition[0] + rectangle.width )
    &&
    ( loc[1] > rectanglePosition[1]  &&  loc[1] < rectanglePosition[1] + rectangle.height )
  );
}

const dragging = {
  on: false,
  origin: {},
  currentTarget: undefined,
};

let dragTargets;

function startDrag(){
  dragging.on = true; //pageX
  const globalLocation = mouse(select('body').node());
  
  dragging.origin.x = globalLocation[0];
  dragging.origin.y = globalLocation[1];
  select('.active.card')
    .classed('dragging',true);
}

function drag(){
  if(dragging.on){
    const currentlocation = mouse(select('body').node());
		const offset = {
      x: currentlocation[0] - dragging.origin.x,
      y: currentlocation[1] - dragging.origin.y
    }

    dragTargets.classed('targeted', function(){ return mouseWithin(this) })

    select('.active.card')
      .classed('dragging',true)
      .style('left', `${offset.x}px`)
      .style('top', `${offset.y}px`);
  }
}

function stopDrag(){
  dragging.on = false;
  const t = select('.targeted');
  const snapTo = {x:0, y:0};
  const activeCard = select('.active.card');
  activeCard.classed('dragging',false);

  if(t && t.node()){
    //add the card as a child of that slot;
    t.classed('occupied', true);
    t.node().appendChild(activeCard.node());
    activeCard.classed('active', false);
    activeCard.classed('placed', true);
    activeCard.on('mousedown', null);
    dragTargets.classed('targeted', false);

    cardPlaced();
  }

  activeCard
    .style('left', `${snapTo.x}px`)
    .style('top', `${snapTo.y}px`);
}

function cardPlaced(){
  // put the current table state into a data structure for
  // testing for complete rows etc.
  selectAll('.card-space')
    .each(function(){
      const coords = this.dataset;
      const placedCard = select(this).select('.card');
      if(placedCard.node()){
        const cardData = placedCard.node().dataset;
        g.setCard(coords.row, coords.col, cardData.code);
      }
    });
  
 
  const rowResults = g.checkRows();

  for(let i = 0; i<rowResults.length; i++){
    if(rowResults[i]){
      // remove score and remove that row
      const rowElements = selectAll(`[data-row="${i}"]`);
      rowElements.classed('occupied', false);
      rowElements.selectAll('.card.placed')
        .transition()
        .duration(500)
        .style('opacity', 0)
        .style('transform', `translateZ(0) scale(2)  rotate(0.5turn)`)
        .on('end', ()=>{/* transition done */})
        .remove();

      g.clearRow(i);
      const score = g.getScore();
      updateCardDeck(rowResults[i].score.cards);
      updateScore(score, g.getChecklist());
    } else {
      updateCardDeck();
    }
  }

  // draw a new card and if it's not the last make it active
  const newCard = drawCard();

  if(!newCard){
    console.log('gameOver')
    //clear board and say game over
  }else{
    addDragListeners(newCard);
    // set the drag targets to available spaces
    dragTargets = selectAll('.card-space:not(.occupied)');
  }
}

function addDragListeners(targetNode){
  select('body').on('mouseup', stopDrag);  
  select('body').on('mousemove', drag);
  targetNode.on('mousedown', startDrag);
  targetNode.on('mousemove', drag);
}

const main = () => {
  updateCardDeck(32);
  const newCard = drawCard();
  updateScore(g.getScore(), g.getChecklist());
  addDragListeners(newCard);
  dragTargets = selectAll('.card-space:not(.occupied)');
}

window.onload = main;