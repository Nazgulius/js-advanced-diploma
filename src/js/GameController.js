import GamePlay from './GamePlay.js';

export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
  }

  init() {
    // TODO: add event listeners to gamePlay events
    // TODO: load saved stated from stateService
    const img = document.getElementById('game-container');
    //img.addEventListener('load', () => {
    document.addEventListener('DOMContentLoaded', () => {
      console.log('work');
      gamePlay.drawUi('prairie');
    })

  }

  onCellClick(index) {
    // TODO: react to click
  }

  onCellEnter(index) {
    // TODO: react to mouse enter
  }

  onCellLeave(index) {
    // TODO: react to mouse leave
  }
}
