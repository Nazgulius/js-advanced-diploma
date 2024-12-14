

export default class GameState {
  constructor() {
    //this.board = Array(64).fill(null); // Игровое поле (состояние)  
    this.currentPlayer = 'Игрок 1'; // Игрок 'Игрок 1' начинает первым  
  }
  static from(object) {
    // TODO: create object
    const gameState = new GameState();
    //gameState.board = object.board;
    gameState.currentPlayer = this.currentPlayer; // было object.currentPlayer

    return gameState;
  }

  // Метод для совершения хода  
  // makeMove(position) {
  //   if (this.isValidMove(position)) {
  //     this.board[position] = this.currentPlayer;
  //     if (!this.checkWinner()) {
  //       this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X'; // Переключаем игрока  
  //     }
  //   }
  // }

  // Проверка действительности хода  
  isValidMove(position) {
    //return this.board[position] === null && position >= 0 && position < 64;
    return true; // Или логика проверки   
  }

  // проверка победителя
  checkWinner() {
    const winPatterns = [
      // условия победы
      
    ];

    for (let pattern of winPatterns) {
      const [a, b, c] = pattern;
      if (this.board[a] && this.board[a] === this.board[b] && this.board[a] === this.board[c]) {
        console.log(`Winner: ${this.board[a]}`);
        return this.board[a]; // Возвращаем победителя  
      }
    }

    // Проверяем на ничью   
    if (!this.board.includes(null)) {
      console.log('It\'s a draw!');
      return 'Draw';
    }

    return null; // Игра продолжается  
  }

  // Возвращает текущее состояние игры  
  getState() {
    return {
      board: this.board,
      currentPlayer: this.currentPlayer,
    };
  }
}
