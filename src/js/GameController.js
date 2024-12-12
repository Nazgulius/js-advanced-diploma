import themes from './themes.js';
import PositionedCharacter from './PositionedCharacter.js';
import Bowman from './characters/Bowman.js';
import Daemon from './characters/Daemon.js';
import Magician from './characters/Magician.js';
import Swordsman from './characters/Swordsman.js';
import Undead from './characters/Undead.js';
import Vampire from './characters/Vampire.js';
import GamePlay from './GamePlay.js';
import { characterGenerator, generateTeam } from './generators.js';
import cursors from './cursors.js';
import GameState from './GameState.js';


export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
    this.massUnits = [];
    this.teamPlayer = ['bowman', 'magician', 'swordsman'];
    this.teamCmp = ['daemon', 'undead', 'vampire'];
    this.selectedPlayerCharacter = null; // Храним информацию о выбранном персонаже игрока  
    this.selectedCharacterPosition = null;
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

      const countTeamPlayer = 3;
      const countTeamCmp = 3;
      // генерация команды
      const team2 = generateTeam([Bowman, Swordsman, Magician], 3, countTeamPlayer); // массив из 4 случайных персонажей playerTypes с уровнем 1, 2 или 3
      const team3 = generateTeam([Daemon, Undead, Vampire], 3, countTeamCmp); // массив из 4 случайных персонажей playerTypes с уровнем 1, 2 или 3
      let massUnits = [];

      // геренируем команду игрока
      const randomPointsLeft = this.randomPositionPlayerLeft(this.gamePlay.boardSize, countTeamPlayer);
      randomPointsLeft.forEach((point, index) => {
        this.massUnits.push(new PositionedCharacter(team2.getCharacters()[index], point));
      });

      // геренируем команду противника
      const randomPointsRight = this.randomPositionPlayerRight(this.gamePlay.boardSize, countTeamCmp);
      randomPointsRight.forEach((point, index) => {
        this.massUnits.push(new PositionedCharacter(team3.getCharacters()[index], point));
      });

      this.gamePlay.redrawPositions(this.massUnits); // выводим на поле

      GameState.from();
    });

    this.listeners();

  }

  // рандомим команду игрока
  randomPositionPlayerLeft(boardSize, countUnits) {
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
  randomPositionPlayerRight(boardSize, countUnits) {
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

  listeners() {
    this.gamePlay.addCellEnterListener(this.onCellEnter.bind(this));
    this.gamePlay.addCellLeaveListener(this.onCellLeave.bind(this));
    this.gamePlay.addCellClickListener(this.onCellClick.bind(this));
  }


  onCellClick(index) {
    // TODO: react to click

    // Ищем персонажа по индексу ячейки 
    const positionedCharacter = this.massUnits.find(unit => unit.position === index);

    // снимаем выделение у всех, кроме выбранного персонажа
    for (let unit of this.massUnits) {
      if (unit.position != index) {
        this.gamePlay.deselectCell(unit.position);
        unit.selected = false;
      }
    }

    if (positionedCharacter) {
      const character = positionedCharacter.character; // Получаем самого персонажа  
      //if (character.type === 'bowman' || character.type === 'magician' || character.type === 'swordsman') {
      if (this.teamPlayer.includes(character.type)) {
        this.gamePlay.selectCell(index); // Показать выделение  
        character.selected = true;
        this.selectedPlayerCharacter = character; // Сохраняем выбранного персонажа 
        this.selectedCharacterPosition = index; // Сохраняем позицию выбранного персонажа  
      } else {
        GamePlay.showError('Выбран вражеский персонаж!');
      }
    } else {
      this.selectedPlayerCharacter = null;
    }

  }

  onCellEnter(index) {
    // TODO: react to mouse enter
    // Ищем персонажа по индексу ячейки  
    const positionedCharacter = this.massUnits.find(unit => unit.position === index);

    // Если персонаж найден, показываем информацию  
    if (positionedCharacter) {
      const character = positionedCharacter.character; // Получаем самого персонажа  
      const tooltipMessage = this.formatCharacterInfo(character); // Форматируем информацию  
      this.gamePlay.showCellTooltip(tooltipMessage, index); // Показать подсказку  

      if (this.teamPlayer.includes(character.type)) {
        this.gamePlay.setCursor(cursors.pointer);
      } else {
        if (this.selectedPlayerCharacter) {
          if (this.teamCmp.includes(character.type)) {
            // Если персонаж врага, показываем курсор перекрестия  
            this.gamePlay.setCursor(cursors.crosshair);

            // Вычисляем расстояние  
            const distance = this.calculateDistance(this.selectedCharacterPosition, index, this.gamePlay.boardSize);

            // Проверяем возможность атаки  
            if (distance <= this.selectedPlayerCharacter.attackRange) {
              this.gamePlay.selectCell(index, 'red'); // Показать выделение  
            }
          } else if (this.teamPlayer.includes(character.type)) {
            // Если персонаж наш, показываем указатель  
            this.gamePlay.setCursor(cursors.pointer);
          }
        }
      }
    } 


    /* альтернативный вариант выделений.
    // Если выбран персонаж, проверяем доступные ячейки для перемещения  
    if (this.selectedPlayerCharacter) {
      if (positionedCharacter && this.teamPlayer.includes(positionedCharacter.character.type)) {
        this.gamePlay.setCursor(cursors.pointer); // Указатель для своего персонажа  
      } else {
        this.gamePlay.setCursor(cursors.crosshair); // Указатель для вражеского персонажа  
        return; // Выходим, если курсор на вражеском персонаже  
      }

      // Получаем скорость для выбранного персонажа  
      const moveRange = this.selectedPlayerCharacter.speedCell;

      // Снимаем выделение с предыдущих ячеек  
      this.massUnits.forEach((unit) => {
        if (unit.selected) {
          const previousIndex = unit.position;
          this.gamePlay.deselectCell(previousIndex);
        }
      });

      // Выбираем ячейки в диапазоне перемещения  
      this.highlightAvailableMoves(index, moveRange);
    } else {
      // Если персонаж не выбран, просто показываем информацию о ячейке  
      if (positionedCharacter) {
        const character = positionedCharacter.character;
        const tooltipMessage = this.formatCharacterInfo(character);
        this.gamePlay.showCellTooltip(tooltipMessage, index);
      }
    }*/
  }

  onCellLeave(index) {
    // TODO: react to mouse leave
    const positionedCharacter = this.massUnits.find(unit => unit.position === index);

    if (this.selectedPlayerCharacter) {
      //if (positionedCharacter && this.teamCmp.includes(positionedCharacter.character.type)) {
      if (positionedCharacter) {
        // Если уходит курсор с вражеского персонажа, снимаем выделение  
        this.gamePlay.deselectCell(index);
      } else {
        // Если курсор уходит с пустой ячейки или своего персонажа, меняем курсор  
        this.gamePlay.setCursor(cursors.auto);
      }
    } else {
      // Если персонаж не выбран, просто меняем курсор  
      this.gamePlay.setCursor(cursors.auto);
    }

    this.gamePlay.hideCellTooltip(index);
  }

  // Метод форматирования информации о персонаже  
  formatCharacterInfo({ level, attack, defence, health }) {
    return `\u{1F396}${level} \u{2694}${attack} \u{1F6E1}${defence} \u{2764}${health}`;
  }

  // Метод для расчёта расстояния  
  calculateDistance(position1, position2, boardSize) {
    const x1 = position1 % boardSize; // X координата первого персонажа  
    const y1 = Math.floor(position1 / boardSize); // Y координата первого персонажа  
    const x2 = position2 % boardSize; // X координата второго персонажа  
    const y2 = Math.floor(position2 / boardSize); // Y координата второго персонажа  

    // Вычисляем расстояние как сумму абсолютных разностей по X и Y  
    return Math.abs(x1 - x2) + Math.abs(y1 - y2);
  }

  highlightAvailableMoves(startIndex, moveRange) {
    const startX = startIndex % this.gamePlay.boardSize; // X координата текущего положения  
    const startY = Math.floor(startIndex / this.gamePlay.boardSize); // Y координата текущего положения  

    // Проходим по всем ячейкам поля  
    for (let x = Math.max(0, startX - moveRange); x <= Math.min(this.gamePlay.boardSize - 1, startX + moveRange); x++) {
      for (let y = Math.max(0, startY - moveRange); y <= Math.min(this.gamePlay.boardSize - 1, startY + moveRange); y++) {
        const targetIndex = y * this.gamePlay.boardSize + x;
        const distance = Math.abs(x - startX) + Math.abs(y - startY);

        // Если ячейка в пределах допустимого расстояния  
        if (distance <= moveRange) {
          this.gamePlay.selectCell(targetIndex, 'green'); // Выделяем ячейку зеленым  
        }
      }
    }
  }
}
