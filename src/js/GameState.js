import GameController from './GameController.js';

export default class GameState {
  constructor() {
    this.currentPlayer = 'Игрок 1'; // Игрок 'Игрок 1' начинает первым  
    this.scoreGame = 0; // счёт игра
    this.massUnits = []; // масси юнитов
    this.levelGame = 0; // уровень игры
    this.countTeamPlayer = 1; // количество юнитов игрока
    this.countTeamCmp = 1; // количество юнитов противника
  }

  // былл from(object) {}
  static from() {
    // TODO: create object
    const gameState = new GameState();
    //gameState.board = object.board;
    gameState.currentPlayer = this.currentPlayer; // было object.currentPlayer
    GameController.onSaveGame();

    return gameState;
    
  }
  
}
