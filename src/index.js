import {select, selectAll, mouse} from 'd3';
const Hand = require('pokersolver').Hand;

var table = {
  rows:[
    ['empty','empty','empty','empty','empty'],
    ['empty','empty','empty','empty','empty'],
    ['empty','empty','empty','empty','empty'],
  ]
}

const deck = [];

function checkRows(rows){
  return rows.map(row=>{
    console.log(row);
    if(row.indexOf('empty') > -1){
      console.log('?');
      return false;
    }
    console.log('!');
    return Hand.solve(row);
  });
}

function numberToCode(number, suit){
  return number+suit[0];
}

function fullDeck(){
  return ['hearts','diamonds','spades','clubs'].reduce((deck, suit)=>{
    for(let i=1; i<=13;i ++){
      deck.push({
        suit,
        number: i,
        name: i,
        code: suit[0] + i,
      })
    }
    return deck;
  }, []);
}

function addCardsToDeck(n){
  if(n==undefined){
    deck.push(...fullDeck())
  }
}

addCardsToDeck();
console.log(deck);

const mouseWithin = (node) => {
  const loc = mouse(select('body').node());
  const rect = node.getBoundingClientRect()
  return (
    ( loc[0] > rect.x  &&  loc[0] < rect.x + rect.width )
    &&
    ( loc[1] > rect.y  &&  loc[1] < rect.y + rect.height )
  );
}

const dragging = {
  on: false,
  origin: {},
  currentTarget: undefined,
};

let dragTargets;

function startDrag(){
  console.log('start');
  dragging.on = true;
  const globalLocation = mouse(select('body').node());
  dragging.origin.x = globalLocation[0];
  dragging.origin.y = globalLocation[1];
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
      .style('left', `${offset.x}px`)
      .style('top', `${offset.y}px`);
  }
}

function stopDrag(){
  dragging.on = false;
  const t = select('.targeted');
  const snapTo = {x:0, y:0};
  const activeCard = select('.active.card');

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
      console.log('coord', coords);
      const placedCard = select(this).select('.card');
      if(placedCard.node()){
        const cardData = placedCard.node().dataset;
        console.log('card data', cardData)
        table.rows[Number(coords.row)][Number(coords.col)] = String(cardData.code);
      }
    });
  
 
  //const rowResults = checkRows(table.rows);
  

  // draw a new card and make it active
  cardNum ++;
  const newCard = select('.deck-container')
    .append('div')
      .attr('class','active card')
      .attr('data-code','h' + cardNum)
      .text('new ' + cardNum);

  addDragListeners(newCard);
  // set the drag targets to available spaces
  dragTargets = selectAll('.card-space:not(.occupied)');

}

function addDragListeners(targetNode){
  select('body').on('mouseup', stopDrag);  
  select('body').on('mousemove', drag);
  targetNode.on('mousedown', startDrag);
  targetNode.on('mousemove', drag);
}
var cardNum = 0;
const main = () => {
  addDragListeners( select('.active.card') );
  dragTargets = selectAll('.card-space:not(.occupied)');
}

window.onload = main;