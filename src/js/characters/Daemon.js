import Character from "../Character";

export default class Daemon extends Character {
  constructor(level, type = 'Daemon') {
    super(level, type);
    this.attack = 10;
    this.defence = 10;

    if (level > 0 && level < 5) { 
      this.level = level; 
    } else { 
      throw "Level 1 – 4 only"; 
    } 
  }
}