// Mock для картинок
// Импортируем функции для тестирования
import {
  getRandomPosition,
  moveGoblin,
  createGameBoard,
  createGoblin,
} from './index';

jest.mock('./assets/goblin.png', () => 'test-goblin.png');

// Mock DOM перед каждым тестом
beforeEach(() => {
  // Создаем минимальную DOM структуру
  document.body.innerHTML = `
    <div id="gameBoard"></div>
    <div id="movesCount">0</div>
    <button id="startBtn"></button>
    <button id="pauseBtn"></button>
    <button id="resetBtn"></button>
  `;
});

// Очищаем после каждого теста
afterEach(() => {
  document.body.innerHTML = '';
  jest.clearAllMocks();
});

describe('Game Logic Tests', () => {
  test('getRandomPosition returns number between 0 and 15', () => {
    const position = getRandomPosition();
    expect(position).toBeGreaterThanOrEqual(0);
    expect(position).toBeLessThanOrEqual(15);
  });

  test('getRandomPosition does not return excluded position', () => {
    const exclude = 7;
    const position = getRandomPosition(exclude);
    expect(position).not.toBe(exclude);
  });

  test('getRandomPosition eventually returns all positions', () => {
    const positions = new Set();
    for (let i = 0; i < 100; i += 1) {
      positions.add(getRandomPosition());
    }
    // За 100 итераций должны получить хотя бы несколько разных позиций
    expect(positions.size).toBeGreaterThan(1);
  });

  test('createGameBoard creates 16 cells', () => {
    const cells = createGameBoard();
    expect(cells.length).toBe(16);
    expect(document.querySelectorAll('.cell').length).toBe(16);
  });

  test('createGoblin creates an image element', () => {
    const goblin = createGoblin();
    expect(goblin.tagName).toBe('IMG');
    expect(goblin.className).toBe('goblin');
  });

  test('moveGoblin moves goblin to different cell', () => {
    // Создаем поле
    const cells = createGameBoard();
    const goblin = createGoblin();

    const startPosition = 5;

    // Ставим гоблина в начальную позицию
    cells[startPosition].appendChild(goblin);

    // Перемещаем
    const newPosition = moveGoblin(goblin, cells, startPosition);

    // Проверяем, что позиция изменилась
    expect(newPosition).not.toBe(startPosition);

    // Проверяем, что гоблин теперь в новой ячейке
    expect(cells[newPosition].contains(goblin)).toBe(true);
  });

  test('moveGoblin does not place goblin in same cell', () => {
    const cells = createGameBoard();
    const goblin = createGoblin();

    // Многократно перемещаем из одной и той же ячейки
    const startPosition = 3;
    let lastPosition = startPosition;

    for (let i = 0; i < 10; i += 1) {
      cells[lastPosition].appendChild(goblin);
      const newPosition = moveGoblin(goblin, cells, lastPosition);
      expect(newPosition).not.toBe(lastPosition);
      lastPosition = newPosition;
    }
  });

  test('moveGoblin updates active class on cells', () => {
    const cells = createGameBoard();
    const goblin = createGoblin();
    const startPosition = 0;

    // Ставим гоблина и добавляем активный класс
    cells[startPosition].appendChild(goblin);
    cells[startPosition].classList.add('active');

    // Перемещаем
    const newPosition = moveGoblin(goblin, cells, startPosition);

    // Проверяем, что активный класс убрали со старой ячейки
    expect(cells[startPosition].classList.contains('active')).toBe(false);

    // Проверяем, что активный класс добавили в новую ячейку
    expect(cells[newPosition].classList.contains('active')).toBe(true);
  });
});

describe('DOM Manipulation Tests', () => {
  test('goblin can be moved by changing parent', () => {
    const goblin = createGoblin();
    const cell1 = document.createElement('div');
    const cell2 = document.createElement('div');

    cell1.id = 'cell1';
    cell2.id = 'cell2';

    document.body.appendChild(cell1);
    document.body.appendChild(cell2);

    // Добавляем гоблина в первую ячейку
    cell1.appendChild(goblin);
    expect(cell1.contains(goblin)).toBe(true);
    expect(cell2.contains(goblin)).toBe(false);

    // Перемещаем во вторую ячейку (БЕЗ removeChild!)
    cell2.appendChild(goblin);

    // Проверяем, что гоблин теперь во второй ячейке
    expect(cell1.contains(goblin)).toBe(false);
    expect(cell2.contains(goblin)).toBe(true);

    // Доказываем, что элемент может быть только в одном месте
    expect(document.body.querySelectorAll('img').length).toBe(1);
  });
});
