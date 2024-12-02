import Character from "../Character";

export default class Magician extends Character {
  constructor(level, type = 'Magician') {
    super(level, type);
    this.attack = 10;
    this.defence = 40;

    if (level > 0 && level < 5) { 
      this.level = level; 
    } else { 
      throw "Level 1 – 4 only"; 
    } 
  }
}