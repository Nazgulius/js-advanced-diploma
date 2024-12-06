import themes from './themes.js';
import PositionedCharacter from './PositionedCharacter.js';
import Bowman from './characters/Bowman.js';
import Daemon from './characters/Daemon.js';
import Magician from './characters/Magician.js';
import Swordsman from './characters/Swordsman.js';
import Undead from './characters/Undead.js';
import Vampire from './characters/Vampire.js';
import { characterGenerator, generateTeam } from './generators.js';

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

      /*
      const playerGenerator = characterGenerator([Bowman, Swordsman, Magician], 2); // тип и макс уровень
      const cmpGenerator = characterGenerator([Daemon, Undead, Vampire], 2); // тип и макс уровень

      let massUnits = [];
      // рандомим команду игрока и указываем количество юнитов
      randomPositionPlayerLeft(this.gamePlay.boardSize, 3).forEach((point) => {
        massUnits.push(new PositionedCharacter(playerGenerator.next().value, point));
      });
      // рандомим команду противника и указываем количество юнитов
      randomPositionPlayerRight(this.gamePlay.boardSize, 3).forEach((point) => {
        massUnits.push(new PositionedCharacter(cmpGenerator.next().value, point));
        
        //this.gamePlay.redrawPositions(massUnits);
      });*/

      
      // генерация команды
      const team2 = generateTeam([Bowman, Swordsman, Magician], 3, 4); // массив из 4 случайных персонажей playerTypes с уровнем 1, 2 или 3
      const team3 = generateTeam([Daemon, Undead, Vampire], 3, 4); // массив из 4 случайных персонажей playerTypes с уровнем 1, 2 или 3
      let massUnits2 = [];

      // геренируем команду игрока
      const randomPointsLeft = randomPositionPlayerLeft(this.gamePlay.boardSize, 3); 
      randomPointsLeft.forEach((point, index) => {
          massUnits2.push(new PositionedCharacter(team2.getCharacters()[index], point));
      });

      // геренируем команду противника
      const randomPointsRight = randomPositionPlayerRight(this.gamePlay.boardSize, 3); 
      randomPointsRight.forEach((point, index) => {
          massUnits2.push(new PositionedCharacter(team3.getCharacters()[index], point));
      });
      
      this.gamePlay.redrawPositions(massUnits2); // выводим на поле

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
