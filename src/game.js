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

export function newGame(){
  let cardsDrawn = 0;
  const game = {};

  const handTypeChecklist = newChecklist();
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



  const secondaryDeck = fullDeck();
  const deck = [];
  
  game.addCardsToDeck = (n) => {
    if(secondaryDeck.length < n){
      secondaryDeck.push( ...fullDeck());
    }
    for(let i=0; i<n; i++){
      const cardToAdd = secondaryDeck.pop();
      deck.push(cardToAdd);
    }
    return game;
  }

  game.getDeck = () => {
    return deck;
  }

  game.table = () => {
    return table;
  }

  game.setCard = (row, column, card) => {
    table.rows[Number(row)][Number(column)] = card;
    return game;
  }

  game.clearRow = (row)=>{
    table.rows[row] = ['empty','empty','empty','empty','empty'];
    return game;
  }

  game.checkRows = () => {
    return table.rows.map(row => {
      if(row.indexOf('empty') > -1){ return false }
      const hand = Hand.solve(row);
      const handValue = simpleClone(handScore[hand.name]);
      hand.score = handValue;
      if(!handTypeChecklist[hand.name]){
        hand.score.points += firstHandBonus.points;
        hand.score.cards += firstHandBonus.cards;
        hand.firstOfTypeBonus = true;
        handTypeChecklist[hand.name] = true;
      }
      score.total += handValue.points;
      score.handHistory.push(simpleClone(hand));
      return hand;
    });
  }

  game.getScore = () => {
    return score;
  }

  game.getChecklist = () => {
    return handTypeChecklist;
  }

  game.drawCard = () => {
    cardsDrawn += 1;
    return deck.pop();
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
