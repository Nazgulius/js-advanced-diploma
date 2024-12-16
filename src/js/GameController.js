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
    this.gameState = new GameState();
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

    // логика для перемещения или атаки
    if (this.selectedPlayerCharacter) {
      if (this.calculationAvailableMoves(this.selectedCharacterPosition, this.selectedPlayerCharacter.speedCell, index)) {
        if (!positionedCharacter) {
          this.makeMove({
            from: this.selectedCharacterPosition,  // Начальная позиция  
            to: index,    // Конечная позиция   
          });
        } else if (this.teamPlayer.includes(positionedCharacter.character.type)) {
          // Если щелкаем на своего персонажа, выберите его  
          this.gamePlay.selectCell(index);
          positionedCharacter.selected = true;
          this.selectedPlayerCharacter = positionedCharacter.character; // Сохраняем выбранного персонажа  
          this.selectedCharacterPosition = index; // Сохраняем позицию выбранного персонажа  
        } else {
          // Если противник, выполняем атаку без перемещения 
          this.makeAttack({
            from: this.selectedCharacterPosition,  // Начальная позиция  
            to: index,    // Конечная позиция 
            target: positionedCharacter,
            // attacker: This.selectedPlayerCharacter,
          });
          // действие противника  

        }
      }
    } else if (positionedCharacter) {
      // Если выбранный персонаж еще не установлен и щелкаем на другого
      const character = positionedCharacter.character; // Получаем самого персонажа  
      if (this.teamPlayer.includes(character.type)) {
        this.gamePlay.selectCell(index); // Показать выделение  
        character.selected = true;
        this.selectedPlayerCharacter = character; // Сохраняем выбранного персонажа 
        this.selectedCharacterPosition = index; // Сохраняем позицию выбранного персонажа  
      } else {
        // Ошибка, так как выбран вражеский персонаж
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


    // логика для выделения    
    // Если курсор на выбранном персонаже, показываем желтое выделение  
    if (this.selectedPlayerCharacter) {
      const moveRange = this.selectedPlayerCharacter.speedCell;
      const attackRange = this.selectedPlayerCharacter.attackRange;
      const isValidMove = this.calculationAvailableMoves(this.selectedCharacterPosition, moveRange, index);

      // Вычисляем расстояние  
      const distance = this.calculateDistance(this.selectedCharacterPosition, index, this.gamePlay.boardSize);

      // Проверяем возможность атаки  
      if (positionedCharacter) {
        if (distance <= attackRange && this.teamCmp.includes(positionedCharacter.character.type)) {

          this.gamePlay.selectCell(index, 'red'); // Показать выделение врага 
        }
      }

      if (isValidMove) {
        this.gamePlay.selectCell(index, 'green'); // Подсветка ячейки  
      } else {
        this.gamePlay.setCursor(cursors.notallowed); // Недоступное действие
      }
    }

    // логика для курсора
    if (positionedCharacter) {
      const character = positionedCharacter.character; // Получаем самого персонажа

      if (this.teamPlayer.includes(character.type)) {
        this.gamePlay.setCursor(cursors.pointer);
      } else {
        if (this.selectedPlayerCharacter) {

          if (this.teamCmp.includes(character.type)) {
            // Если персонаж врага, показываем курсор перекрестия  
            this.gamePlay.setCursor(cursors.crosshair);

          } else if (this.teamPlayer.includes(character.type)) {
            // Если персонаж наш, показываем указатель  
            this.gamePlay.setCursor(cursors.pointer);
          }
        }
      }
    }

    // Показываем информацию о ячейке  
    if (positionedCharacter) {
      const character = positionedCharacter.character;
      const tooltipMessage = this.formatCharacterInfo(character);
      this.gamePlay.showCellTooltip(tooltipMessage, index);
    }
  }


  onCellLeave(index) {
    // TODO: react to mouse leave
    this.gamePlay.deselectCell(index); // Снятие выделения
    this.gamePlay.setCursor(cursors.auto); // Убираем курсор  
    this.gamePlay.hideCellTooltip(index); // Скрываем подсказку  

    // Выделение персонажа оставляем, если он выбран
    if (this.selectedPlayerCharacter) {
      this.gamePlay.selectCell(this.selectedCharacterPosition, 'yellow');
    }
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

  // Метод расчёта клеток для хода 
  calculationAvailableMoves(startIndex, moveRange, cursorIndex) {
    const startX = startIndex % this.gamePlay.boardSize; // X координата текущего положения  
    const startY = Math.floor(startIndex / this.gamePlay.boardSize); // Y координата текущего положения  
    let cursorOnValidCell = false; // Для отслеживания, находится ли курсор на допустимой ячейке  

    // Подсвечиваем доступные ячейки в пределах диапазона  
    for (let dx = -moveRange; dx <= moveRange; dx++) {
      for (let dy = -moveRange; dy <= moveRange; dy++) {
        // Проверяем, что мы движемся по горизонтали, вертикали или диагонали  
        if (Math.abs(dx) === Math.abs(dy) || dx === 0 || dy === 0) {
          const targetX = startX + dx;
          const targetY = startY + dy;

          // Проверяем, находятся ли целевые координаты в пределах границ поля  
          if (targetX >= 0 && targetX < this.gamePlay.boardSize &&
            targetY >= 0 && targetY < this.gamePlay.boardSize) {
            const targetIndex = targetY * this.gamePlay.boardSize + targetX;
            //this.gamePlay.selectCell(targetIndex, 'red'); // Подсветка всех доступных ячеек, на будущее  

            // Проверяем, равен ли targetIndex текущему индексу курсора  
            if (targetIndex === cursorIndex) {
              cursorOnValidCell = true; // Курсор на допустимой ячейке  
            }
          }
        }
      }
    }

    return cursorOnValidCell; // Возвращаем true или false  
  }

  // Смена игрока после успешного хода
  switchPlayer() {
    this.gameState.currentPlayer = (this.gameState.currentPlayer === 'Игрок 1') ? 'Игрок 2' : 'Игрок 1';
    console.log(`Сейчас ход: ${this.gameState.currentPlayer}`);
  }

  // сделать ход
  makeMove(move) {
    console.log('makeMove начало');
    // Проверка возможности хода  
    if (this.gameState.isValidMove(move)) {
      // Обновление состояния игры 
      for (let unit of this.massUnits) {
        if (unit.position === move.from) {
          unit.position = move.to;
          this.gamePlay.redrawPositions(this.massUnits); // выводим на поле
        }
      }

      this.switchPlayer(); // Смена игрока после успешного хода
    } else {
      console.log('Неверный ход, попробуйте снова.');
    }
  }

  async makeAttack(attack) {
    console.log('атака началась');
    // Проверка возможности хода  
    if (this.gameState.isValidMove(attack)) { // возможно переделать на валидность атаки, а не мува. Или сделать общую валидность, типо make, действия 

      // Обновление состояния игры 
      for (let unit of this.massUnits) {
        if (unit.position === attack.from) {
          const attacker = unit.character; // атакующий персонаж
          const target = attack.target.character; // атакованный персонаж 
          
          const damage = Math.max(attacker.attack - target.defence, attacker.attack * 0.1);
          target.health -= damage; // проверить, достаточно target или нужна attack.target 
          console.log('атаковали на ' + damage + ' отображение урона');
          await this.gamePlay.showDamage(attack.target.position, damage); // показать анимацию с промисом   
          // 
          this.gamePlay.redrawPositions(this.massUnits); // выводим на поле 
        }
      }
      this.switchPlayer(); // Смена игрока после успешного хода 
    } else {
      console.log('Неверный ход, попробуйте снова.');
    }
  }
}
