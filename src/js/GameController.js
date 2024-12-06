import themes from './themes.js';
import GamePlay from './GamePlay.js';
import PositionedCharacter from './PositionedCharacter.js';
import Bowman from './characters/Bowman.js';
import Vampire from './characters/Vampire.js';

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

      let massUnits = [];
      // рандомим команду игрока и указываем количество юнитов
      randomPositionPlayerLeft(this.gamePlay.boardSize, 3).forEach((unit) => {
        massUnits.push(new PositionedCharacter(new Bowman(1), unit));
      });
       // рандомим команду противника и указываем количество юнитов
      randomPositionPlayerRight(this.gamePlay.boardSize, 3).forEach((unit) => {
        massUnits.push(new PositionedCharacter(new Vampire(1), unit));
      });

      this.gamePlay.redrawPositions(massUnits);


    });


    // рандомим команду игрока
    function randomPositionPlayerLeft(boardSize, countUnits) {
      let randomUnitsLeft = []; // массив для рандомных юнитов
      const randomPositionPlayerLeft = []; // массив левых двух столбцов 

      for (let row = 0; row < boardSize; row++) {
        randomPositionPlayerLeft.push(row * boardSize);
        randomPositionPlayerLeft.push(row * boardSize + 1);
      }

      // Используем цикл для выбора случайных позиций  
      while (randomUnitsLeft.length < countUnits) {
        const p = Math.floor(Math.random() * randomPositionPlayerLeft.length);

        // добавляем случайные позиции
        if (!randomUnitsLeft.includes(randomPositionPlayerLeft[p])) {
          randomUnitsLeft.push(randomPositionPlayerLeft[p]);
        }
      }

      return randomUnitsLeft;
    }

    // рандомим команду противника
    function randomPositionPlayerRight(boardSize, countUnits) {
      let randomUnitsRight = []; // массив для рандомных юнитов
      const randomPositionPlayerRight = []; // массив правых двух столбцов 

      for (let row = 0; row < boardSize; row++) {
        randomPositionPlayerRight.push(row * boardSize + (boardSize - 2)); 
        randomPositionPlayerRight.push(row * boardSize + (boardSize - 1)); 
      }

      // Используем цикл для выбора случайных позиций  
      while (randomUnitsRight.length < countUnits) { 
        const p = Math.floor(Math.random() * randomPositionPlayerRight.length);

        // добавляем случайные позиции
        if (!randomUnitsRight.includes(randomPositionPlayerRight[p])) {
          randomUnitsRight.push(randomPositionPlayerRight[p]);
        }
      }
      
      return randomUnitsRight;
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
