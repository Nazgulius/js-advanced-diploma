import Character from "../Character";

export default class Bowman extends Character {
  constructor(level) {
    super(level, 'bowman');
    this.attack = 25;
    this.defence = 25;
    this.speedCell = 2;
    this.attackRange = 2;
    
    if (level > 0 && level < 5) { 
      this.level = level; 
    } else { 
      throw new Error ("Level 1 – 4 only"); 
    } 
  }
}