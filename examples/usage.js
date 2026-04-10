import ErrorRepository from '../src/ErrorRepository.js';

// Пример 1: Базовое использование
console.log('=== Пример 1: Базовое использование ===');
const errorRepo = new ErrorRepository();

console.log(errorRepo.translate(404)); // 'Not Found'
console.log(errorRepo.translate(500)); // 'Internal Server Error'
console.log(errorRepo.translate(999)); // 'Unknown error'

// Пример 2: Добавление пользовательских ошибок
console.log('\n=== Пример 2: Добавление пользовательских ошибок ===');
errorRepo.addError(1001, 'Database connection failed');
errorRepo.addError(1002, 'Invalid user input');
errorRepo.addError(1003, 'Timeout exceeded');

console.log(errorRepo.translate(1001)); // 'Database connection failed'
console.log(errorRepo.translate(1002)); // 'Invalid user input'

// Пример 3: Использование в приложении
console.log('\n=== Пример 3: Использование в приложении ===');

class ApplicationError extends Error {
  constructor(code, customMessage = null) {
    const errorRepo = ApplicationError.errorRepository;
    const message = customMessage || errorRepo.translate(code);
    super(message);
    this.code = code;
    this.name = 'ApplicationError';
  }

  static setErrorRepository(repo) {
    ApplicationError.errorRepository = repo;
  }
}

ApplicationError.setErrorRepository(errorRepo);

function validateUserData(data) {
  if (!data) {
    throw new ApplicationError(1002);
  }
  if (!data.email) {
    throw new ApplicationError(1002, 'Email is required');
  }
  return true;
}

try {
  validateUserData(null);
} catch (error) {
  console.log(`${error.name} (${error.code}): ${error.message}`);
}

// Пример 4: Работа с API
console.log('\n=== Пример 4: Работа с API ===');

class ApiClient {
  constructor(errorRepo) {
    this.errorRepo = errorRepo;
  }

  async fetchData(url) {
    try {
      const response = await fetch(url);

      if (!response.ok) {
        const errorMessage = this.errorRepo.translate(response.status);
        throw new Error(`API Error ${response.status}: ${errorMessage}`);
      }

      return await response.json();
    } catch (error) {
      if (error.message.includes('fetch')) {
        throw new Error(this.errorRepo.translate(1003));
      }
      throw error;
    }
  }
}

const apiClient = new ApiClient(errorRepo);
console.log('API клиент готов к работе');

// Пример 5: Управление ошибками
console.log('\n=== Пример 5: Управление ошибками ===');

console.log(`Всего ошибок в репозитории: ${errorRepo.getSize()}`);
console.log(`Существует ли ошибка 1001? ${errorRepo.hasError(1001)}`);

console.log('Все коды ошибок:', errorRepo.getAllErrorCodes().slice(0, 10));

// Пример 6: Обновление существующей ошибки
console.log('\n=== Пример 6: Обновление ошибки ===');
errorRepo.updateError(1002, 'Invalid or missing user input');
console.log(errorRepo.translate(1002)); // 'Invalid or missing user input'

// Пример 7: Экспорт/Импорт конфигурации ошибок
console.log('\n=== Пример 7: Экспорт конфигурации ===');

function exportErrorConfig(errorRepo) {
  const errors = errorRepo.getAllErrors();
  const config = {};
  for (const [code, description] of errors) {
    config[code] = description;
  }
  return config;
}

function importErrorConfig(errorRepo, config) {
  errorRepo.clearAllErrors();
  for (const [code, description] of Object.entries(config)) {
    errorRepo.addError(parseInt(code), description);
  }
}

const exportedConfig = exportErrorConfig(errorRepo);
console.log('Экспортировано ошибок:', Object.keys(exportedConfig).length);

// Пример 8: Создание специфичных репозиториев
console.log('\n=== Пример 8: Специфичные репозитории ===');

class DatabaseErrorRepository extends ErrorRepository {
  _initializeDefaultErrors() {
    this.addError(2001, 'Connection pool exhausted');
    this.addError(2002, 'Query syntax error');
    this.addError(2003, 'Transaction deadlock detected');
    this.addError(2004, 'Constraint violation');
  }
}

const dbErrors = new DatabaseErrorRepository();
console.log(dbErrors.translate(2001)); // 'Connection pool exhausted'
console.log(dbErrors.translate(2002)); // 'Query syntax error'

// Пример 9: Middleware для Express.js
console.log('\n=== Пример 9: Express middleware пример ===');

function errorMiddleware(errorRepo) {
  return (err, req, res, next) => {
    const code = err.code || 500;
    const message = errorRepo.translate(code);

    res.status(code >= 400 && code < 600 ? code : 500).json({
      error: {
        code: code,
        message: message,
        timestamp: new Date().toISOString(),
      },
    });
  };
}

const middleware = errorMiddleware(errorRepo);
console.log('Error middleware создан');

console.log('\n=== Все примеры выполнены успешно ===');
