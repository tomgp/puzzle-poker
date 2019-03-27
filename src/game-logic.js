import { newDeck, shuffle } from './deck';
const Hand = require('pokersolver').Hand;

const clone = (s) => JSON.parse(JSON.stringify(s));

const handScore = {
  'High Card': { points:0, cards:0 },
  'Pair': { cards:1, points:100 },
  'Two Pair': { cards:2, points:200 },
  'Three of a Kind': { cards:3, points:300 },
  'Straight': { cards:4, points:400 },
  'Flush': { cards:5, points:500 },
  'Full House': { cards:6, points:600 },
  'Four of a Kind': { cards:8, points:800 },
  'Straight Flush': { cards:12, points:1200 },
  'Royal Flush': { cards:16, points:1600 },
  'First of type': { points:500, cards:5 }
};

function getRow (grid, row){
  return grid[row];
}

function isHandComplete (a){
  return a.reduce((acc, current)=> (acc && (current!==null)), true);
}

export const setup = () => ({ 
  grid: Array(3).fill([]).map(()=>Array(5).fill(null)),
  deck: shuffle(newDeck()),
  score: 0,
  handsComplete: {},
  multiplier: 1,
  discard: [],
  history: [],
  endGame: false,
  handTypeRecord: {}
});

export const discard = (currentState)=>{
  const newState = clone(currentState);
  newState.discard.push( newState.deck.pop() );
  return newState;
}

export const placeCard = (currentState, ctx, row, column)=>{
  const newState = clone(currentState);
  if(newState.deck.length === 0){
    return newState;
  }
  newState.grid[row][column] = newState.deck.pop();
  
  const rowHand = getRow(newState.grid, row);
  const rowComplete = isHandComplete(rowHand);

  if(rowComplete){
    const handCode = rowHand.map(d=>d.code);
    const handType = Hand.solve(handCode).name;
    newState.score = handScore[handType].points + newState.score;
    // add the hand to the history
    newState.history.push({
      cards: clone(handCode), name: handType
    });
    // clear the row
    newState.grid[row] = Array(5).fill(null);
    newState.handTypeRecord[handType] = true;
    if( Object.keys(newState.handTypeRecord).length === 10 ){
      newState.handTypeRecord = {};
      newState.bonusScore = 500;
    }
    newState.score = newState.score + newState.bonusScore;
  }
  if(newState.deck.length === 0){
    newState.endGame = true;
  }
  return newState;
}
