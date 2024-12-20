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
    // Сбрасываем выделение предыдущих персонажей  
    // this.massUnits.forEach(unit => {
    //   this.gamePlay.deselectCell(unit.position); // Снять выделение  
    // });

    const positionedCharacter = this.massUnits.find(unit => unit.position === index);
    const distance = this.calculateDistance(this.selectedCharacterPosition, index, this.gamePlay.boardSize);

    if (this.selectedPlayerCharacter) {
      this.gamePlay.selectCell(this.selectedCharacterPosition, 'yellow');
    }

    // Если уже есть выбранный персонаж  
    if (this.selectedPlayerCharacter) {
      const moveRange = this.selectedPlayerCharacter.speedCell;
      const isValidMove = this.calculationAvailableMoves(this.selectedCharacterPosition, moveRange, index);

      // Проверяем, является ли текущая ячейка допустимым перемещением  
      if (isValidMove && !positionedCharacter) {
        // Если перемещение допустимо и ячейка свободна, выполняем перемещение  
        this.makeMove({
          from: this.selectedCharacterPosition,  // Начальная позиция  
          to: index   // Конечная позиция   
        });

        this.gamePlay.deselectCell(this.selectedCharacterPosition); // Снять выделение с предыдущей  
        this.gamePlay.selectCell(index, 'yellow'); // Выделить нового персонажа на новой позиции  
        this.selectedCharacterPosition = null; // Сбросить позицию  
        this.selectedPlayerCharacter = null; // Сбросить выбор персонажа для следующего хода  

        this.switchPlayer(); // Переключение на другого игрока  
        this.makeCmpLogic(); // Логика компьютера  
        return;
      }
      // Проверяем атаку на вражеского персонажа  
      else if (positionedCharacter && this.teamCmp.includes(positionedCharacter.character.type)) {
        if (distance <= this.selectedPlayerCharacter.attackRange) {
          this.makeAttack({
            from: this.selectedCharacterPosition,  // Начальная позиция  
            to: index,    // Конечная позиция   
            target: positionedCharacter,
          });

          this.gamePlay.deselectCell(this.selectedCharacterPosition); // Снять выделение с предыдущей  
          this.selectedPlayerCharacter = null; // Сбросить выбор персонажа после атаки  
          this.selectedCharacterPosition = null;
          this.switchPlayer(); // Смена игрока после успешного хода  
          this.makeCmpLogic(); // Логика компьютера 
        } else {
          GamePlay.showError('Вражеский персонаж вне досягаемости.');
          return;
        }
      }
      // Если кликнули на своего персонажа или пустую ячейку  
      else {
        // Сбрасываем выделение предыдущих персонажей  
        this.massUnits.forEach(unit => {
          this.gamePlay.deselectCell(unit.position); // Снять выделение  
        });
        this.gamePlay.redrawPositions(this.massUnits); // выводим на поле 

        // Тут ничего больше не делаем, просто сбрасываем выделение  
        if (positionedCharacter) {
          // Если кликнули на своего персонажа, выделяем его  
          this.selectedCharacterPosition = index; // Сохраняем позицию выбранного персонажа  
          this.selectedPlayerCharacter = positionedCharacter.character; // Сохраняем выбранного персонажа  
          this.gamePlay.selectCell(index, 'yellow'); // Выделяем своего персонажа  
        } else {
          // Если пустая ячейка, просто возвращаемся  
          this.selectedPlayerCharacter = null; // Сбросить выбор персонажа  
          this.selectedCharacterPosition = null; // Очистить позицию  
        }
        return;
      }
    }
    // Если никакой персонаж не выбран, выбираем персонажа, если он относится к команде игрока  
    else if (positionedCharacter) {
      if (this.teamPlayer.includes(positionedCharacter.character.type)) {
        // Снять выделение со всех персонажей  
        this.massUnits.forEach(unit => {
          this.gamePlay.deselectCell(unit.position); // Снять выделение с предыдущих ячеек  
        });

        // Выделяем нового персонажа  
        this.selectedPlayerCharacter = positionedCharacter.character; // Сохраняем выбранного персонажа  
        this.selectedCharacterPosition = index; // Сохраняем позицию выбранного персонажа  
        this.gamePlay.selectCell(index, 'yellow'); // Выделяем своего персонажа  
      } else {
        // Если выбран вражеский персонаж, можно показать окно  
        GamePlay.showError('Выбран вражеский персонаж!');
      }
    }
  }

  onCellEnter(index) {
    // TODO: react to mouse enter
    // Ищем персонажа по индексу ячейки  
    const positionedCharacter = this.massUnits.find(unit => unit.position === index);
    const distance = this.calculateDistance(this.selectedCharacterPosition, index, this.gamePlay.boardSize);

    // Логика для выделения при наведении 
    this.selectionLogic(positionedCharacter, index, distance);

    // Логика для курсора  
    this.cursorsLogic(positionedCharacter, distance);

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

    // Сбрасываем выделение выбранного персонажа 
    if (this.selectedPlayerCharacter) {
      this.gamePlay.selectCell(this.selectedCharacterPosition, 'yellow');
    }

    // Сброс выделения, если мы не уходим с выделенной ячейки  
    if (this.selectedPlayerCharacter) {
      const isSelectedCharacterPosition = this.selectedCharacterPosition === index;
      // Если уходим с ячейки, которая не выбрана  
      if (!isSelectedCharacterPosition) {
        // Дополнительно показываем выделение на выбранном персонаже  
        this.gamePlay.selectCell(this.selectedCharacterPosition, 'yellow'); // Желтое выделение  
      }
    } else {
      this.gamePlay.deselectCell(index);
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

  // направление от одной позиции к другой и возвращает объект с разницей по координатам X и Y
  calculateDirection(position1, position2, boardSize) {
    const x1 = position1 % boardSize; // X координата первого персонажа  
    const y1 = Math.floor(position1 / boardSize); // Y координата первого персонажа  
    const x2 = position2 % boardSize; // X координата второго персонажа  
    const y2 = Math.floor(position2 / boardSize); // Y координата второго персонажа  

    const direction = {
      x: x2 - x1, // Разница по X  
      y: y2 - y1  // Разница по Y  
    };

    return direction; // Возвращаем направление  
  }

  // функция проверяет, находится ли позиция в пределах границ игрового поля
  validatePosition(position) {
    const x = position.x;
    const y = position.y;

    // Проверка на пределах поля  
    return (
      Number.isInteger(x) &&
      Number.isInteger(y) &&
      x >= 0 &&
      x < this.gamePlay.boardSize &&
      y >= 0 &&
      y < this.gamePlay.boardSize
    );
  }

  // Смена игрока после успешного хода
  switchPlayer() {
    this.gameState.currentPlayer = (this.gameState.currentPlayer === 'Игрок 1') ? 'Игрок 2' : 'Игрок 1';
    console.log(`Сейчас ход: ${this.gameState.currentPlayer}`);
  }

  // Логика для курсора  
  cursorsLogic(positionedCharacter, distance) {
    if (positionedCharacter) {
      const character = positionedCharacter.character; // Получаем самого персонажа  

      if (this.teamPlayer.includes(character.type)) {
        this.gamePlay.setCursor(cursors.pointer); // Указатель для своего персонажа  
      } else if (this.selectedPlayerCharacter) {
        if (this.teamCmp.includes(character.type)) {
          if (distance <= this.selectedPlayerCharacter.attackRange) {
            this.gamePlay.setCursor(cursors.crosshair); // Если персонаж врага, показываем курсор перекрестия  
          } else {
            this.gamePlay.setCursor(cursors.notallowed); // Недоступное действие  
          }
        }
      }
    } else {
      // Если на ячейке нет персонажа, указатель остается как есть  
      this.gamePlay.setCursor(cursors.auto);
    }
  }

  // Логика для выделения при наведении 
  selectionLogic(positionedCharacter, index, distance) {
    if (this.selectedPlayerCharacter) {
      const moveRange = this.selectedPlayerCharacter.speedCell;
      const attackRange = this.selectedPlayerCharacter.attackRange;
      const isValidMove = this.calculationAvailableMoves(this.selectedCharacterPosition, moveRange, index);

      if (isValidMove) {
        this.gamePlay.selectCell(index, 'green'); // Подсветка ячейки для перемещения  
      } else {
        this.gamePlay.setCursor(cursors.notallowed); // Недоступное действие  
      }

      // Проверяем возможность атаки  
      if (positionedCharacter) {
        if (distance <= attackRange && this.teamCmp.includes(positionedCharacter.character.type)) {
          this.gamePlay.selectCell(index, 'red'); // Показать выделение врага   
        }
      }
    }
  }

  // перемещение
  makeMove(move) {
    // Проверка возможности хода  
    if (this.gameState.isValidMove(move)) {
      // Обновление состояния игры 
      for (let unit of this.massUnits) {
        if (unit.position === move.from) {
          unit.position = move.to;
          this.gamePlay.redrawPositions(this.massUnits); // выводим на поле
        }
      }
    } else {
      console.log('Неверный ход, попробуйте снова.');
    }
  }

  // атака
  async makeAttack(attack) {
    // Проверка возможности хода  
    if (this.gameState.isValidMove(attack)) { // возможно переделать на валидность атаки, а не мува. Или сделать общую валидность, типо make, действия 

      // Обновление состояния игры 
      for (let unit of this.massUnits) {
        if (unit.position === attack.from) {
          const attacker = unit.character; // атакующий персонаж
          const target = attack.target.character; // атакованный персонаж 
          const damage = Math.max(attacker.attack - target.defence, attacker.attack * 0.1);

          target.health -= damage;
          await this.gamePlay.showDamage(attack.target.position, damage); // показать анимацию с промисом   
          this.gamePlay.redrawPositions(this.massUnits); // выводим на поле 
        }
      }
    } else {
      console.log('Неверный ход, попробуйте снова.');
    }
  }

  // действия CMP, Игрок 2
  makeCmpLogic() {
    // ход Игрока 2 (CMP)
    if (this.gameState.currentPlayer === 'Игрок 2') {
      for (let unit of this.massUnits) {
        if (this.teamCmp.includes(unit.character.type)) { // совпадение для персонажа CMP
          let closestUnitPlayer = null; // Для хранения ближайшего персонажа игрока 1  
          let minDistance = Infinity; // Начальное значение для минимального расстояния  

          // Поиск ближайшего персонажа игрока 1  
          for (let unitPlayer of this.massUnits) {
            if (this.teamPlayer.includes(unitPlayer.character.type)) { // совпадение для персонажа Игрока 1
              const distance = this.calculateDistance(unit.position, unitPlayer.position, this.gamePlay.boardSize);

              // Проверяем, является ли это ближайшим персонажем  
              if (distance < minDistance) {
                minDistance = distance;
                closestUnitPlayer = unitPlayer; // Сохраняем ближайшего персонажа  
              }
            }
          }

          // 1 вариант
          // Если ближайший персонаж найден  
          // if (closestUnitPlayer) {
          //   console.log(`Ближайший персонаж Игрока 1 для ${unit.character.type}: ${closestUnitPlayer.character.type} на расстоянии ${minDistance}`);

          //   // Расстояние, на которое может двигаться персонаж  
          //   const speedCell = unit.character.speedCell;
          //   const attackRange = unit.character.attackRange;

          //   // Если противник слишком близко, атаковать  
          //   if (minDistance <= attackRange) {
          //     this.makeAttack({
          //       from: unit.position,  // Начальная позиция  
          //       to: closestUnitPlayer.position,    // Конечная позиция   
          //       target: closestUnitPlayer // Цель атаки  
          //     });
          //   } else if (minDistance <= speedCell) {
          //     // } else if (true) {
          //     // Перемещаемся на шаг к противнику, но остаемся за одну клетку до него  
          //     //const directionToPlayer = this.calculateDirection(unit.position, closestUnitPlayer.position, this.gamePlay.boardSize);

          //     // Получаем направление к противнику  
          //     const directionToPlayer = this.calculateDirection(unit.position, closestUnitPlayer.position, this.gamePlay.boardSize);

          //     // Вычисляем расстояние до противника  
          //     const distanceToPlayer = minDistance; // уже полученное значение минимального расстояния  

          //     // Фактическое количество клеток для движения  
          //     const moveDistance = Math.min(speedCell, distanceToPlayer - 1); // Уменьшаем перемещение на 1 клетку  


          //     const targetPosition = {
          //       x: (unit.position % this.gamePlay.boardSize) + directionToPlayer.x * moveDistance,
          //       y: Math.floor(unit.position / this.gamePlay.boardSize) + directionToPlayer.y * moveDistance
          //     };
          //     // const targetPosition = {
          //     //   x: closestUnitPlayer.position % this.gamePlay.boardSize - directionToPlayer.x,
          //     //   y: Math.floor(closestUnitPlayer.position / this.gamePlay.boardSize) - directionToPlayer.y
          //     // };

          //     // Преобразуем targetPosition в единый индекс  
          //     const targetIndex = targetPosition.y * this.gamePlay.boardSize + targetPosition.x;


          //     console.log('targetIndex');
          //     console.log(targetIndex);
          //     // Проверяем, чтобы позиция была действительной в пределах игрового поля и не была занята  
          //     if (this.validatePosition(targetPosition) && !this.isCellOccupied(targetIndex)) {
          //       console.log(`${unit.character.type} делает ход`);
          //       this.makeMove({
          //         from: unit.position,  // Начальная позиция  
          //         to: targetIndex // Конечная позиция   
          //       });
          //     }
          //   } else {
          //     // Если противник вне диапазона движения, перемещаемся на максимально возможное расстояние в сторону противника  
          //     const directionToPlayer = this.calculateDirection(unit.position, closestUnitPlayer.position, this.gamePlay.boardSize);
          //     const targetPosition = {
          //       x: (unit.position % this.gamePlay.boardSize) + directionToPlayer.x * speedCell,
          //       y: Math.floor(unit.position / this.gamePlay.boardSize) + directionToPlayer.y * speedCell
          //     };

          //     // Преобразуем targetPosition в единый индекс  
          //     const targetIndex = targetPosition.y * this.gamePlay.boardSize + targetPosition.x;

          //     // Проверяем, чтобы позиция была действительной в пределах игрового поля  
          //     if (this.validatePosition(targetPosition) && !this.isCellOccupied(targetIndex)) {
          //       console.log(`${unit.character.type} делает ход 2`);
          //       this.makeMove({
          //         from: unit.position,  // Начальная позиция  
          //         to: targetIndex // Конечная позиция   
          //       });
          //     }
          //   }
          // } else {
          //   console.log('Нет доступных врагов для атаки.');
          // }



          console.log(`minDistance ${minDistance}`);
          // 2 вариант
          if (closestUnitPlayer) {
            console.log(`Ближайший персонаж Игрока 1 для ${unit.character.type}: ${closestUnitPlayer.character.type} на расстоянии ${minDistance}`);

            // Расстояние, на которое может двигаться персонаж  
            const speedCell = unit.character.speedCell;
            const attackRange = unit.character.attackRange;

            if (minDistance > speedCell) {  
              // Если противник далеко, мы можем двигаться к нему  
              const directionToPlayer = this.calculateDirection(unit.position, closestUnitPlayer.position, this.gamePlay.boardSize);  
              
              // Вычисляем целевую позицию  
              const targetPosition = {  
                  x: (unit.position % this.gamePlay.boardSize) + directionToPlayer.x * speedCell,  
                  y: Math.floor(unit.position / this.gamePlay.boardSize) + directionToPlayer.y * speedCell  
              };  
          
              // Преобразуем targetPosition в единый индекс  
              const targetIndex = targetPosition.y * this.gamePlay.boardSize + targetPosition.x;  
          
              // Проверяем, чтобы позиция была действительной в пределах игрового поля  
              if (this.validatePosition(targetPosition) && this.calculationAvailableMoves(unit.position, speedCell, targetIndex)) {  
                  console.log(`${unit.character.type} делает ход к противнику`);  
                  this.makeMove({  
                      from: unit.position,  
                      to: targetIndex  
                  });  
              } else {  
                  // Если не можем двигаться в целевую позицию, вычисляем альтернативу  
                  const alternativeIndex = this.findAlternativePosition(unit.position, closestUnitPlayer.position, speedCell);  
                  if (alternativeIndex !== null) {  
                      console.log(`${unit.character.type} движется к ближайшему доступному полю`);  
                      this.makeMove({  
                          from: unit.position,  
                          to: alternativeIndex  
                      });  
                  }  
              }  
          } else {  
              // Если дистанция меньше или равна speedCell, пробуем атаковать  
              if (minDistance <= attackRange) {  
                  console.log(`${unit.character.type} атакует`);  
                  this.makeAttack({  
                      from: unit.position,  
                      to: closestUnitPlayer.position,  
                      target: closestUnitPlayer  
                  });  
              } else {  
                  // Двигаемся к противнику, если атаковать невозможно  
                  const directionToPlayer = this.calculateDirection(unit.position, closestUnitPlayer.position, this.gamePlay.boardSize);  
                  const targetPosition = {  
                      x: (unit.position % this.gamePlay.boardSize) + directionToPlayer.x,  
                      y: Math.floor(unit.position / this.gamePlay.boardSize) + directionToPlayer.y  
                  };  
                  const targetIndex = targetPosition.y * this.gamePlay.boardSize + targetPosition.x;  
          
                  // Проверяем, можно ли переместиться  
                  if (this.validatePosition(targetPosition) && this.calculationAvailableMoves(unit.position, 1, targetIndex)) {  
                      console.log(`${unit.character.type} делает шаг к противнику`);  
                      this.makeMove({  
                          from: unit.position,  
                          to: targetIndex  
                      });  
                  }  
              }  
          }
          }
        }
      }
    }
    console.log('конец хода Игрока 2');
    this.switchPlayer(); // Смена игрока после успешного хода
  }

  // Проверка на занятость клетки
  isCellOccupied(index) {
    for (let unit of this.massUnits) {
      if (unit.position === index) {
        return true; // Ячейка занята  
      }
    }
    return false; // Ячейка свободна  
  }

  findAlternativePosition(startIndex, targetPosition, moveRange) {  
    const directions = [  
        { x: -1, y: 0 }, // влево  
        { x: 1, y: 0 },  // вправо  
        { x: 0, y: -1 }, // вверх  
        { x: 0, y: 1 },  // вниз  
        { x: -1, y: -1 }, // вверх-влево  
        { x: -1, y: 1 },  // вниз-влево  
        { x: 1, y: -1 },  // вверх-вправо  
        { x: 1, y: 1 }    // вниз-вправо  
    ];  

    for (const direction of directions) {  
        const alternativeX = (startIndex % this.gamePlay.boardSize) + direction.x;  
        const alternativeY = Math.floor(startIndex / this.gamePlay.boardSize) + direction.y;  
        const alternativeIndex = alternativeY * this.gamePlay.boardSize + alternativeX;  
        
        const alternativePosition = {  
            x: alternativeX,  
            y: alternativeY  
        };  

        // Проверяем, можно ли переместиться  
        if (this.validatePosition(alternativePosition) && this.calculationAvailableMoves(startIndex, moveRange, alternativeIndex)) {  
            return alternativeIndex; // Возвращаем первую подходящую альтернативу  
        }  
    }  

    return null; // Если нет доступных позиций  
  }  
}
