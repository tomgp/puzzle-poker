const Hand = require('pokersolver').Hand;

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


function fullDeck(){
  return ['hearts','diamonds','spades','clubs'].reduce((deck, suit)=>{
    for(let i=1; i<=13;i ++){
      deck.push({
        suit,
        number: i,
        name: i,
        code: numberToCode(i, suit),
      })
    }
    return deck;
  }, []);
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

export function newGame(){

  const table = {
    rows:[
      ['empty','empty','empty','empty','empty'],
      ['empty','empty','empty','empty','empty'],
      ['empty','empty','empty','empty','empty'],
    ]
  };

  const deck = fullDeck().filter((c)=>(c.number == 1 || c.number > 6));
  console.log('filtered deck', deck, deck.length);

  function game(){}

  game.table = () => {
    return table;
  }

  game.clearRow = (n) => {
    table.rows[n] = ['empty','empty','empty','empty','empty'];
  }

  game.setCard = (card, row, column) => {
    table.rows[row][column] = card;
  }

  game.checkRows = ()=>{
    return table.rows.map(row=>{
      if(row.indexOf('empty') > -1){
        return false;
      }
      return Hand.solve(row);
    })
  }

  return game;
}
