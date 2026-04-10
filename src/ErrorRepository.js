/**
 * @file Централизованное хранилище ошибок приложения
 */

class ErrorRepository {
  constructor() {
    this.errors = new Map();
    this._initializeDefaultErrors();
  }

  /**
   * Инициализация базовых ошибок
   * @private
   */
  _initializeDefaultErrors() {
    const defaultErrors = [
      [400, 'Bad Request'],
      [401, 'Unauthorized'],
      [403, 'Forbidden'],
      [404, 'Not Found'],
      [408, 'Request Timeout'],
      [409, 'Conflict'],
      [422, 'Unprocessable Entity'],
      [429, 'Too Many Requests'],
      [500, 'Internal Server Error'],
      [502, 'Bad Gateway'],
      [503, 'Service Unavailable'],
      [504, 'Gateway Timeout'],
    ];

    defaultErrors.forEach(([code, description]) => {
      this.errors.set(code, description);
    });
  }

  /**
   * Добавить новую ошибку
   * @param {number} code - Код ошибки
   * @param {string} description - Описание ошибки
   * @returns {ErrorRepository} - Для chaining
   * @throws {Error} - При невалидных параметрах
   */
  addError(code, description) {
    if (typeof code !== 'number' || Number.isNaN(code)) {
      throw new Error('Code must be a valid number');
    }

    if (typeof description !== 'string' || description.trim() === '') {
      throw new Error('Description must be a non-empty string');
    }

    this.errors.set(code, description);
    return this;
  }

  /**
   * Получить описание ошибки по коду
   * @param {number} code - Код ошибки
   * @returns {string} - Описание или 'Unknown error'
   */
  translate(code) {
    if (typeof code !== 'number' || Number.isNaN(code)) {
      return 'Unknown error';
    }

    const errorDescription = this.errors.get(code);
    return errorDescription !== undefined ? errorDescription : 'Unknown error';
  }

  /**
   * Проверить наличие ошибки
   * @param {number} code - Код ошибки
   * @returns {boolean}
   */
  hasError(code) {
    return this.errors.has(code);
  }

  /**
   * Удалить ошибку
   * @param {number} code - Код ошибки
   * @returns {boolean}
   */
  removeError(code) {
    return this.errors.delete(code);
  }

  /**
   * Получить все ошибки
   * @returns {Map} - Копия Map с ошибками
   */
  getAllErrors() {
    return new Map(this.errors);
  }

  /**
   * Получить количество ошибок
   * @returns {number}
   */
  getSize() {
    return this.errors.size;
  }

  /**
   * Очистить все ошибки и восстановить стандартные
   */
  clearAllErrors() {
    this.errors.clear();
    this._initializeDefaultErrors();
  }

  /**
   * Обновить описание ошибки
   * @param {number} code - Код ошибки
   * @param {string} description - Новое описание
   * @returns {boolean}
   */
  updateError(code, description) {
    if (!this.hasError(code)) {
      return false;
    }

    this.addError(code, description);
    return true;
  }

  /**
   * Получить все коды ошибок
   * @returns {number[]}
   */
  getAllErrorCodes() {
    return Array.from(this.errors.keys());
  }

  /**
   * Проверить, пуст ли репозиторий
   * @returns {boolean}
   */
  isEmpty() {
    return this.errors.size === 0;
  }
}

export default ErrorRepository;
