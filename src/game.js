import {shuffle} from 'd3';
const Hand = require('pokersolver').Hand;


const handScore = {
  'High Card': { cards:0, points:0 },
  'Pair': { cards:1, points:100 },
  'Two Pair': { cards:2, points:200 },
  'Three of a Kind': { cards:3, points:300 },
  'Straight': { cards:4, points:400 },
  'Flush': { cards:5, points:500 },
  'Full House': { cards:6, points:600 },
  'Four of a Kind': { cards:8, points:800 },
  'Straight Flush': { cards:12, points:1200 },
  'Royal Flush': { cards:16, points:1600 }
};

const firstHandBonus = {cards:5, points:500}; 

const normaliseCards = (hand) => hand.map(d=>d.replace('1','A').toUpperCase());
const normaliseName = (hand) => {
  if(hand.name == 'Straight Flush' && hand.descr == 'Royal Flush'){
    hand.name = 'Royal Flush';
  }
  return hand;
}
export function newGame(){
  let cardsDrawn = 0;
  const game = {};

  let handTypeChecklist = newChecklist();
  const score = {
    total: 0,
    handHistory: []
  }
  const table = {
    rows:[
      ['empty','empty','empty','empty','empty'],
      ['empty','empty','empty','empty','empty'],
      ['empty','empty','empty','empty','empty']
    ]
  };


  let secondaryDeck = fullDeck();
  let deck = [];
  
  game.reset = () => {
    score.total = 0;
    score.handHistory = [];
    table.rows = [
      ['empty','empty','empty','empty','empty'],
      ['empty','empty','empty','empty','empty'],
      ['empty','empty','empty','empty','empty']
    ];
    handTypeChecklist = newChecklist();
    secondaryDeck = fullDeck();
    deck = [];
  };

  game.addCardsToDeck = (n) => {
    if(secondaryDeck.length < n){
      secondaryDeck.push( ...fullDeck());
    }
    for(let i=0; i<n; i++){
      const cardToAdd = secondaryDeck.pop();
      deck.unshift(cardToAdd);
    }
    return game;
  };

  game.getDeck = () => {
    return deck;
  };

  game.table = () => {
    return table;
  };

  game.setCard = (row, column, card) => {
    table.rows[Number(row)][Number(column)] = card;
    return game;
  };

  game.clearRows = ()=>{
    // if the rows have no empty items add 
    // them to the to be cleared stack then start from 
    const clearable = table.rows.map((row)=>(row.indexOf('empty') < 0));

    let clearPoints = 0;
    let clear = true;
    const cleared = [false,false,false]
    for(let i = table.rows.length; i--; i > -1){
      clear = (clearable[i] && clear);
      if(clear){
        clearPoints += 111;
        table.rows[i] = ['empty', 'empty', 'empty', 'empty', 'empty'];
        cleared[i] = true;
      }
    }

    score.total += clearPoints;
    return {
      rowsCleared:cleared,
      points:clearPoints
    };
  };

  game.scoreRow = (rowIndex)=>{
    const row = table.rows[rowIndex];
    if(row.indexOf('empty') > -1){ return false }
    const hand = normaliseName( Hand.solve(normaliseCards(row)) );
    hand.score = simpleClone(handScore[hand.name])
    
    if(!handTypeChecklist[hand.name]){
      hand.score.points += firstHandBonus.points;
      hand.score.cards += firstHandBonus.cards;
      hand.firstOfTypeBonus = true;
      handTypeChecklist[hand.name] = true;
    }
    score.total += hand.score.points;
    hand.id = (new Date()).getTime();
    console.log('pushing to history')
    console.log( `${hand.name}, ${hand.descr}, ${hand.cards.map(c=>`${c.value}${c.suit}`)}` )
     
    score.handHistory.push(simpleClone(hand));
    console.log(score.handHistory);
    return hand;
  };

  game.getScore = () => {
    return score;
  };

  game.getChecklist = () => {
    return handTypeChecklist;
  };

  game.drawCard = () => {
    cardsDrawn += 1;
    return deck.pop();
  };

  game.history = () =>{
    return score.handHistory;
  }

  return game;
}

// utilities

function simpleClone(o){ return JSON.parse(JSON.stringify(o)) };

function fullDeck(){
  // returns 32 cards, 
  // shuffled (i.e. a full deck minus card from 2-5 includive)
  return shuffle(['hearts','diamonds','spades','clubs']
      .reduce((deck, suit)=>{
        for(let i=1; i<=13;i ++){
          deck.push({
            suit,
            number: i,
            name: i,
            code: numberToCode(i, suit),
          })
        }
        return deck;
      }, [])
    .filter((c)=>(c.number == 1 || c.number > 6)));
}

function numberToCode(number, suit){
  const code = (n)=>{
    if(n<10){
      return n
    }else{
      return {10:'T',11:'J',12:'Q',13:'K'}[n];
    }
  }
  return `${code(number)}${suit[0]}`;
}

function newChecklist(){
  return Object.keys(handScore).reduce((acc,current)=>{
    acc[current] = false;
    return acc;
  },{});
}
