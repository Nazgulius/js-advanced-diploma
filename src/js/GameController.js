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

      const boardSize = this.gamePlay.boardSize;

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
          // console.log(randomPositionPlayer[p]); // заменить на добавление персонажа

          // massUnits.push(randomPositionPlayer[p]);
          randomOff.push(randomPositionPlayer[p]);
        }
      }


      let massUnits = [];

      randomOff.forEach((unit) => {
        massUnits.push(new PositionedCharacter(new Bowman(1), unit));
      })
      this.gamePlay.redrawPositions(massUnits);

      // рандомим команду противника
      let randomOffRight = [];

      // Создаем массив для правых двух столбцов  
      const randomPositionPlayerRight = [];
      for (let row = 0; row < size; row++) {
        randomPositionPlayerRight.push(row * size + (size - 2)); // Предпоследний столбец  
        randomPositionPlayerRight.push(row * size + (size - 1)); // Последний столбец  
      }

      // Используем цикл для выбора случайных позиций  
      while (randomOffRight.length < 8) { // Укажите, сколько позиций вы хотите выбрать  
        const p = Math.floor(Math.random() * randomPositionPlayerRight.length);

        // Проверяем на дубликаты  
        if (!randomOffRight.includes(randomPositionPlayerRight[p])) {
          console.log(randomPositionPlayerRight[p]);
          randomOffRight.push(randomPositionPlayerRight[p]);
        }
      }

    });



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
