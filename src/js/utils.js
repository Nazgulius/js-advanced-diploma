/**
 * @todo
 * @param index - индекс поля
 * @param boardSize - размер квадратного поля (в длину или ширину)
 * @returns строка - тип ячейки на поле:
 *
 * top-left
 * top-right
 * top
 * bottom-left
 * bottom-right
 * bottom
 * right
 * left
 * center
 *
 * @example
 * ```js
 * calcTileType(0, 8); // 'top-left'
 * calcTileType(1, 8); // 'top'
 * calcTileType(63, 8); // 'bottom-right'
 * calcTileType(7, 7); // 'left'
 * ```
 * */
export function calcTileType(index, boardSize) {
  // TODO: ваш код будет тут
  const topEdge = index < boardSize;
  const bottomEdge = index >= (boardSize * (boardSize - 1));
  const leftEdge = index % boardSize === 0;
  const rightEdge = index % boardSize === boardSize - 1;

  if (topEdge) {
    if (leftEdge) return 'top-left';
    if (rightEdge) return 'top-right';
    return 'top';
  }

  if (bottomEdge) {
    if (leftEdge) return 'bottom-left';
    if (rightEdge) return 'bottom-right';
    return 'bottom';
  }

  if (leftEdge) return 'left'; 
  if (rightEdge) return 'right';

  return 'center';
}

export function calcHealthLevel(health) {
  if (health < 15) {
    return 'critical';
  }

  if (health < 50) {
    return 'normal';
  }

  return 'high';
}
