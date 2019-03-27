import React from 'react';
import './gameboard.css';

const Deck = ({deck})=>(<div className='deck'>DECK {deck.length-1}</div>);

const Card = ({card, active})=>(<div className={active?'active-card':'card'}>{ (card && card.name) ? card.name : 'NO MORE'}</div>);

const Score = ({score})=>(<div className='score'>SCORE: {score}</div>);

const HandRecord = ()=>(<div className='record'>RECORD</div>);

const History = ({hands})=>{
  return (<div className='history'>{
    hands.map((hand, i)=>{
      return ( <div key={`handHistory${i}`}>
      {hand.name} {hand.cards}
      </div>) }) }</div>
  )
}

const EmptySpace = ({row, column, placeCard}) => 
  (<div className='empty-card-space' onClick={ () => placeCard(row, column) }>SPACE</div>)

const Row = ({cards, rowNumber, placeCard})=>{
  const columns = cards.map((c, i)=>{
    if(c!=null){
      return (<Card key={`row-card-${i}`} card={c}></Card>);
    }
    return (<EmptySpace 
      placeCard={placeCard}
      key={`row-space-${i}`}
      row={rowNumber}
      column={i} ></EmptySpace>);
  });
  return (<div className='card-row'>{ columns }</div>);
};


const CardGrid = ({grid, placeCard})=>{
  const rows = grid.map((d,i)=>(<Row key={`row-${i}`} cards={d} rowNumber={i} placeCard={placeCard}></Row>));

  return (<div className='board'>{rows}</div>)
};

export const Table = ({G, moves})=>(<div className='table'>
  <Deck deck={G.deck}></Deck>
  <Card card={G.deck[G.deck.length-1]} active={true}></Card>
  <Score score={G.score}></Score>
  <CardGrid grid={G.grid} placeCard={moves.placeCard}></CardGrid>
  <HandRecord></HandRecord>
  <History hands={G.history}></History>
</div>);