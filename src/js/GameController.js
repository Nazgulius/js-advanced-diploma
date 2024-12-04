import themes from './themes.js';
import GamePlay from './GamePlay.js';
import PositionedCharacter from './PositionedCharacter.js';
import Bowman from './characters/Bowman.js';

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
      const character = new Bowman(1);
      const position = 0; 
      const character2 = new Bowman(1);
      const position2 = 8; 
      const positionedCharacter = new PositionedCharacter(character, position);
      const positionedCharacter2 = new PositionedCharacter(character2, position2);
      console.log(positionedCharacter);
      console.log(positionedCharacter2);
      let mass = [];
      mass.push(positionedCharacter);
      mass.push(positionedCharacter2);
      new GamePlay().redrawPositions([positionedCharacter]);
    });
    


    console.log('Position player');
    const boardSize = 8; 
    let randomOff = [];

    // Создает массив для левых двух столбцов  
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
        console.log(randomPositionPlayer[p]); // заменить на добавление персонажа
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
