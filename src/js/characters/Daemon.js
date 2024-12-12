import Character from "../Character";

export default class Daemon extends Character {
  constructor(level) {
    super(level, 'daemon');
    this.attack = 10;
    this.defence = 10;
    this.speedCell = 1;
    this.attackRange = 4;

    if (level > 0 && level < 5) { 
      this.level = level; 
    } else { 
      throw new Error ("Level 1 – 4 only"); 
    } 
  }
}