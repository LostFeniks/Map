export default {
  // Использование ESM
  transform: {
    '^.+\\.jsx?$': 'babel-jest',
  },
  
  // Тестовое окружение
  testEnvironment: 'node',
  
  // Покрытие кода
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/**/*.test.js',
    '!src/**/*.spec.js',
    '!**/node_modules/**',
  ],
  
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
  
  coverageReporters: ['text', 'lcov', 'html', 'json'],
  
  // Пути для тестов
  testMatch: [
    '**/tests/**/*.test.js',
    '**/__tests__/**/*.js',
  ],
  
  // Настройки для ESM
  moduleFileExtensions: ['js', 'json'],
  
  // Очистка моков между тестами
  clearMocks: true,
  
  // Показывать verbose вывод
  verbose: true,
  
  // Таймаут для тестов (в миллисекундах)
  testTimeout: 10000,
};