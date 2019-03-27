

export const shuffle = (deck) => { // fisher-yates shuffle (https://bost.ocks.org/mike/shuffle/)
	let current = deck.length;
	// While there remain elements to shuffle…
	while (current) {
		// Pick a remaining element…
		const i = Math.floor(Math.random() * current--);
		// And swap it with the current element.
		const t = deck[current];
		deck[current] = deck[i];
		deck[i] = t;
	}
	return deck;
}

export const newDeck = () => {
  return ['hearts','diamonds','spades','clubs']
    .reduce((deck, suit)=>{
      for(let i=1; i<=13;i ++){
        deck.push({
          suit,
          number: i,
          name: `${numberToName(i)} of ${suit}`,
          code: `${numberToCode(i)}${suit[0]}`
        }) 
      }
      return deck;
    }, []);
}

function numberToName (n){
  let name = String(n); 
  switch (n) {
    case 1:
      name = 'ace'
      break;
    case 11:
      name = 'jack'
      break;
    case 12:
      name = 'queen'
      break;
    case 13:
      name = 'king'
      break;
  
    default:
      break;
  }
  return name;
}

function numberToCode(n){
  let name = String(n); 
  switch (n) {
    case 1:
      name = 'A'
      break;
    case 10:
      name = 'T'
      break;
    case 11:
      name = 'J'
      break;
    case 12:
      name = 'Q'
      break;
    case 13:
      name = 'K'
      break;
  
    default:
      break;
  }
  return name;
}