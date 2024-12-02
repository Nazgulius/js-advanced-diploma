import Character from "../Character";

export default class Bowman extends Character {
  constructor(level, type = 'Bowman') {
    super(level, type);
    this.attack = 25;
    this.defence = 25;
    
    if (level > 0 && level < 5) { 
      this.level = level; 
    } else { 
      throw "Level 1 – 4 only"; 
    } 
  }
  
}