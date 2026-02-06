import './styles/style.css';
import goblinImage from './assets/goblin.png';

// ============================================
// ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ И СОСТОЯНИЕ
// ============================================
const GameState = {
  intervalId: null,
  currentPosition: null,
  isRunning: false,
  moveInterval: 2000, // 2 секунды
  movesCount: 0,
};

// ============================================
// ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
// ============================================

/**
 * Генерирует случайное число от min до max (включительно)
 * @param {number} min - минимальное значение
 * @param {number} max - максимальное значение
 * @returns {number} случайное число
 */
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Получает случайную позицию на поле, исключая текущую
 * @param {number|null} excludePosition - позиция для исключения
 * @returns {number} новая позиция (0-15)
 */
function getRandomPosition(excludePosition = null) {
  let newPosition;
  const totalCells = 16;

  // Если это первое перемещение или нужно исключить позицию
  if (excludePosition === null) {
    newPosition = getRandomInt(0, totalCells - 1);
  } else {
    // Генерируем новую позицию, пока она не станет отличной от текущей
    do {
      newPosition = getRandomInt(0, totalCells - 1);
    } while (newPosition === excludePosition);
  }

  return newPosition;
}

/**
 * Создает игровое поле 4x4
 * @returns {NodeList} список всех ячеек
 */
function createGameBoard() {
  const gameBoard = document.getElementById('gameBoard');

  // Очищаем поле (на случай рестарта)
  gameBoard.innerHTML = '';

  // Создаем 16 ячеек (4x4)
  for (let i = 0; i < 16; i++) {
    const cell = document.createElement('div');
    cell.className = 'cell';
    cell.dataset.index = i;
    cell.dataset.row = Math.floor(i / 4) + 1;
    cell.dataset.col = (i % 4) + 1;

    // Добавляем номер ячейки (для отладки)
    const cellNumber = document.createElement('span');
    cellNumber.className = 'cell-number';
    cellNumber.textContent = i + 1;
    cellNumber.style.cssText = `
      position: absolute;
      top: 5px;
      left: 5px;
      font-size: 12px;
      color: #999;
      font-weight: bold;
    `;
    cell.appendChild(cellNumber);

    gameBoard.appendChild(cell);
  }

  return document.querySelectorAll('.cell');
}

/**
 * Создает элемент гоблина (картинку)
 * @returns {HTMLImageElement} элемент img с гоблином
 */
function createGoblin() {
  const goblin = document.createElement('img');
  goblin.src = goblinImage;
  goblin.className = 'goblin';
  goblin.alt = 'Mischievous goblin';
  goblin.title = 'Click me if you can!';

  // Добавляем обработчик клика (для будущего функционала)
  goblin.addEventListener('click', () => {
    // Используем console.log с явным вызовом
    const logMessage = 'Goblin clicked! Score functionality coming soon...';
    // eslint-disable-next-line no-console
    console.log(logMessage);
    // Здесь будет логика подсчета очков
  });

  return goblin;
}

/**
 * Перемещает гоблина в новую ячейку
 * @param {HTMLImageElement} goblin - элемент гоблина
 * @param {NodeList} cells - все ячейки поля
 * @param {number} currentPosition - текущая позиция гоблина
 * @returns {number} новая позиция гоблина
 */
function moveGoblin(goblin, cells, currentPosition) {
  // Удаляем класс активности с текущей ячейки
  if (currentPosition !== null && cells[currentPosition]) {
    cells[currentPosition].classList.remove('active');
  }

  // Получаем новую позицию (не ту же самую)
  const newPosition = getRandomPosition(currentPosition);

  // ВАЖНО: не используем removeChild!
  // Просто добавляем гоблина в новую ячейку
  // Если гоблин уже где-то есть, он автоматически переместится
  cells[newPosition].appendChild(goblin);

  // Добавляем анимацию к новой ячейке
  cells[newPosition].classList.add('active');

  // Увеличиваем счетчик ходов
  GameState.movesCount += 1;
  updateMovesCount();

  // Логируем перемещение (для отладки)
  const fromCell = currentPosition !== null ? currentPosition + 1 : 'start';
  const toCell = newPosition + 1;
  // eslint-disable-next-line no-console
  console.log(`Goblin moved from cell ${fromCell} to cell ${toCell}`);

  return newPosition;
}

/**
 * Обновляет счетчик ходов в интерфейсе
 */
function updateMovesCount() {
  const movesElement = document.getElementById('movesCount');
  if (movesElement) {
    movesElement.textContent = GameState.movesCount;

    // Анимация обновления
    movesElement.style.transform = 'scale(1.2)';
    setTimeout(() => {
      movesElement.style.transform = 'scale(1)';
    }, 300);
  }
}

/**
 * Запускает игру (перемещение гоблина)
 */
function startGame() {
  if (GameState.isRunning) return;

  // eslint-disable-next-line no-console
  console.log('Starting game...');
  GameState.isRunning = true;

  const cells = document.querySelectorAll('.cell');
  const goblin = document.querySelector('.goblin') || createGoblin();

  // Если гоблин еще нигде не стоит, ставим его в случайную позицию
  if (GameState.currentPosition === null) {
    GameState.currentPosition = getRandomPosition();
    cells[GameState.currentPosition].appendChild(goblin);
    cells[GameState.currentPosition].classList.add('active');
  }

  // Запускаем интервал для перемещения
  // Используем явное присваивание, чтобы избежать no-unused-expressions
  GameState.intervalId = setInterval(() => {
    GameState.currentPosition = moveGoblin(goblin, cells, GameState.currentPosition);
  }, GameState.moveInterval);

  // Обновляем состояние кнопок
  updateButtonStates();
}

/**
 * Приостанавливает игру
 */
function pauseGame() {
  if (!GameState.isRunning) return;

  // eslint-disable-next-line no-console
  console.log('Pausing game...');
  GameState.isRunning = false;

  if (GameState.intervalId) {
    clearInterval(GameState.intervalId);
    GameState.intervalId = null;
  }

  updateButtonStates();
}

/**
 * Сбрасывает игру в начальное состояние
 */
function resetGame() {
  // eslint-disable-next-line no-console
  console.log('Resetting game...');

  // Останавливаем интервал
  if (GameState.intervalId) {
    clearInterval(GameState.intervalId);
    GameState.intervalId = null;
  }

  // Сбрасываем состояние
  GameState.currentPosition = null;
  GameState.isRunning = false;
  GameState.movesCount = 0;

  // Обновляем счетчик
  updateMovesCount();

  // Пересоздаем поле
  const cells = createGameBoard();
  const goblin = createGoblin();

  // Ставим гоблина в случайную позицию
  GameState.currentPosition = getRandomPosition();
  cells[GameState.currentPosition].appendChild(goblin);
  cells[GameState.currentPosition].classList.add('active');

  updateButtonStates();
}

/**
 * Обновляет скорость игры
 * @param {number} factor - множитель скорости (0.5 = вдвое медленнее, 2 = вдвое быстрее)
 */
function changeSpeed(factor) {
  const newInterval = Math.max(500, Math.min(5000, GameState.moveInterval * factor));

  // Если игра запущена, перезапускаем с новой скоростью
  if (GameState.isRunning) {
    pauseGame();
    GameState.moveInterval = newInterval;
    startGame();
  } else {
    GameState.moveInterval = newInterval;
  }

  // eslint-disable-next-line no-console
  console.log(`Speed changed to ${GameState.moveInterval}ms`);
}

/**
 * Обновляет состояние кнопок управления
 */
function updateButtonStates() {
  const startBtn = document.getElementById('startBtn');
  const pauseBtn = document.getElementById('pauseBtn');

  if (GameState.isRunning) {
    startBtn.disabled = true;
    pauseBtn.disabled = false;
    startBtn.innerHTML = '<i class="fas fa-play"></i> Game Running';
    pauseBtn.innerHTML = '<i class="fas fa-pause"></i> Pause';
  } else {
    startBtn.disabled = false;
    pauseBtn.disabled = GameState.currentPosition === null;
    startBtn.innerHTML = '<i class="fas fa-play"></i> Start Game';
    pauseBtn.innerHTML = '<i class="fas fa-pause"></i> Pause';
  }
}

// ============================================
// ИНИЦИАЛИЗАЦИЯ ИГРЫ И НАСТРОЙКА СОБЫТИЙ
// ============================================

/**
 * Инициализация игры - основной запуск
 */
function initGame() {
  // eslint-disable-next-line no-console
  console.log('Initializing game...');

  // Создаем игровое поле
  const cells = createGameBoard();

  // Создаем гоблина
  const goblin = createGoblin();

  // Ставим гоблина в случайную позицию
  GameState.currentPosition = getRandomPosition();
  cells[GameState.currentPosition].appendChild(goblin);
  cells[GameState.currentPosition].classList.add('active');

  // Настраиваем обработчики событий
  setupEventListeners();

  // Обновляем состояние кнопок
  updateButtonStates();

  // eslint-disable-next-line no-console
  console.log('Game initialized! Goblin is in cell', GameState.currentPosition + 1);
}

/**
 * Настройка всех обработчиков событий
 */
function setupEventListeners() {
  // Кнопка старта
  const startBtn = document.getElementById('startBtn');
  if (startBtn) {
    startBtn.addEventListener('click', startGame);
  }

  // Кнопка паузы
  const pauseBtn = document.getElementById('pauseBtn');
  if (pauseBtn) {
    pauseBtn.addEventListener('click', pauseGame);
  }

  // Кнопка сброса
  const resetBtn = document.getElementById('resetBtn');
  if (resetBtn) {
    resetBtn.addEventListener('click', resetGame);
  }

  // Ускорение
  const speedUpBtn = document.getElementById('speedUp');
  if (speedUpBtn) {
    speedUpBtn.addEventListener('click', (e) => {
      e.preventDefault();
      changeSpeed(0.7); // Ускоряем на 30%
    });
  }

  // Замедление
  const speedDownBtn = document.getElementById('speedDown');
  if (speedDownBtn) {
    speedDownBtn.addEventListener('click', (e) => {
      e.preventDefault();
      changeSpeed(1.3); // Замедляем на 30%
    });
  }

  // Звук (заглушка)
  const toggleSoundBtn = document.getElementById('toggleSound');
  if (toggleSoundBtn) {
    toggleSoundBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const soundBtn = e.target.closest('a');
      const isOn = soundBtn.innerHTML.includes('On');
      soundBtn.innerHTML = isOn
        ? '<i class="fas fa-volume-mute"></i> Sound Off'
        : '<i class="fas fa-volume-up"></i> Sound On';
      // eslint-disable-next-line no-console
      console.log(`Sound turned ${isOn ? 'off' : 'on'}`);
    });
  }

  // Горячие клавиши
  document.addEventListener('keydown', (e) => {
    // Используем if вместо switch для избежания default-case
    const key = e.key.toLowerCase();

    if (key === ' ' || key === 'spacebar') {
      e.preventDefault();
      if (GameState.isRunning) {
        pauseGame();
      } else {
        startGame();
      }
    } else if (key === 'r' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      resetGame();
    } else if (key === '+' || key === '=') {
      e.preventDefault();
      changeSpeed(0.7);
    } else if (key === '-' || key === '_') {
      e.preventDefault();
      changeSpeed(1.3);
    }
    // Не добавляем default case
  });
}

// ============================================
// ЭКСПОРТ ФУНКЦИЙ ДЛЯ ТЕСТОВ
// ============================================

export {
  getRandomPosition,
  createGameBoard,
  createGoblin,
  moveGoblin,
  startGame,
  pauseGame,
  resetGame,
  initGame,
};

// ============================================
// ЗАПУСК ИГРЫ ПРИ ЗАГРУЗКЕ СТРАНИЦЫ
// ============================================

// Запускаем игру только если мы не в тестовом окружении
// и если DOM уже загружен или загружается
if (typeof jest === 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGame);
  } else {
    initGame();
  }
}
