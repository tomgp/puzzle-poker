// import React, { Component } from 'react';
import { Client } from 'boardgame.io/react';
import { Game } from 'boardgame.io/core';

import { Table } from './components/table';

import { discard, placeCard, setup } from './game-logic.js';
import './style/app.css';



const PokerPuzzle = Game({
  setup,
  moves: {
    placeCard,
    discard
  }
})

const App = Client({
  game:PokerPuzzle,
  board : Table
})

export default App;
