import Character from "../Character";

export default class Undead extends Character {
  constructor(level, type = 'undead') {
    super(level, type);
    this.attack = 40;
    this.defence = 10;

    if (level > 0 && level < 5) { 
      this.level = level; 
    } else { 
      throw "Level 1 – 4 only"; 
    } 
  }
}