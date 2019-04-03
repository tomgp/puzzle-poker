const Hand = require('pokersolver').Hand;

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
