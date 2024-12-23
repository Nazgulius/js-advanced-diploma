import Character from "../Character";

export default class Swordsman extends Character {
  constructor(level) {
    super(level, 'swordsman');
    this.attack = 4000;
    this.defence = 10;
    this.speedCell = 4;
    this.attackRange = 1;

    if (level > 0 && level < 5) { 
      this.level = level; 
    } else { 
      throw new Error ("Level 1 – 4 only"); 
    } 
  }
}