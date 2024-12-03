import themes from './themes.js';
import GamePlay from './GamePlay.js';

export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
  }

  init() {
    // TODO: add event listeners to gamePlay events
    // TODO: load saved stated from stateService
    // const img = document.getElementById('game-container');

    document.addEventListener('DOMContentLoaded', () => {
      this.gamePlay.drawUi(themes.prairie);

      // нужно найти зависимость от ЛВЛ для смены карт
      if (false) {
        for (const item in themes) {
          console.log(themes[item]);
        }
      }
    });
    


    console.log('Position player');
    const boardSize = 8; 
    let randomOff = [];

    // Создаем массив для левых двух столбцов  
    const randomPositionPlayer = [];
    for (let row = 0; row < boardSize; row++) {
      randomPositionPlayer.push(row * boardSize);
      randomPositionPlayer.push(row * boardSize + 1);
    }

    // Используем цикл для выбора случайных позиций  
    while (randomOff.length < 3) { // Указать, сколько позиций выбрать  
      const p = Math.floor(Math.random() * randomPositionPlayer.length);

      // Проверяем на дубликаты  
      if (!randomOff.includes(randomPositionPlayer[p])) {
        console.log(randomPositionPlayer[p]);
        randomOff.push(randomPositionPlayer[p]);
      }
    }
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
