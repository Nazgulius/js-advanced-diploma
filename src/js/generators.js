import Team from "./Team.js";

/**
 * Формирует экземпляр персонажа из массива allowedTypes со
 * случайным уровнем от 1 до maxLevel
 *
 * @param allowedTypes массив классов
 * @param maxLevel максимальный возможный уровень персонажа
 * @returns генератор, который при каждом вызове
 * возвращает новый экземпляр класса персонажа
 *
 */
export function* characterGenerator(allowedTypes, maxLevel) {
  // TODO: write logic here
  if (!allowedTypes.length) {
    throw new Error('allowedTypes cannot be empty');
  }

  while (true) {
    const randomTypes = Math.floor(Math.random() * allowedTypes.length);
    const min = 1;
    const randomLevel = Math.floor(Math.random() * maxLevel) + 1;
    // const randomLevel = Math.floor(Math.random() * (maxLevel  - min + 1) + min); - старый вариант 

    yield new allowedTypes[randomTypes](randomLevel);
  }
}

/**
 * Формирует массив персонажей на основе characterGenerator
 * @param allowedTypes массив классов
 * @param maxLevel максимальный возможный уровень персонажа
 * @param characterCount количество персонажей, которое нужно сформировать
 * @returns экземпляр Team, хранящий экземпляры персонажей. Количество персонажей в команде - characterCount
 * */
export function generateTeam(allowedTypes, maxLevel, characterCount) {
  // TODO: write logic here
  let team = [];
  const generator = characterGenerator(allowedTypes, maxLevel);
  for (let i = 0; i < characterCount; i++) {
    team.push(generator.next().value);
  }

  return new Team(team);
}
