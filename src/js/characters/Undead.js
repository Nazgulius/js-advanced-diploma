import Character from "../Character";

export default class Undead extends Character {
  constructor(level) {
    super(level, 'undead');
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