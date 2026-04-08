// src/ErrorRepository.js
class ErrorRepository {
  constructor() {
    this.errors = new Map();
    this._initializeDefaultErrors();
  }

  _initializeDefaultErrors() {
    // 12 стандартных ошибок
    this.errors.set(400, 'Bad Request');
    this.errors.set(401, 'Unauthorized');
    this.errors.set(403, 'Forbidden');
    this.errors.set(404, 'Not Found');
    this.errors.set(408, 'Request Timeout');
    this.errors.set(409, 'Conflict');
    this.errors.set(422, 'Unprocessable Entity');
    this.errors.set(429, 'Too Many Requests');
    this.errors.set(500, 'Internal Server Error');
    this.errors.set(502, 'Bad Gateway');
    this.errors.set(503, 'Service Unavailable');
    this.errors.set(504, 'Gateway Timeout');
  }

  addError(code, description) {
    if (typeof code !== 'number' || isNaN(code)) {
      throw new Error('Code must be a valid number');
    }
    if (typeof description !== 'string' || description.trim() === '') {
      throw new Error('Description must be a non-empty string');
    }
    this.errors.set(code, description);
    return this;
  }

  translate(code) {
    if (typeof code !== 'number' || isNaN(code)) {
      return 'Unknown error';
    }
    const errorDescription = this.errors.get(code);
    return errorDescription !== undefined ? errorDescription : 'Unknown error';
  }

  hasError(code) {
    return this.errors.has(code);
  }

  removeError(code) {
    return this.errors.delete(code);
  }

  getAllErrors() {
    return new Map(this.errors);
  }

  getSize() {
    return this.errors.size;
  }

  clearAllErrors() {
    this.errors.clear();
    this._initializeDefaultErrors();
  }

  updateError(code, description) {
    if (!this.hasError(code)) {
      return false;
    }
    this.addError(code, description);
    return true;
  }

  getAllErrorCodes() {
    return Array.from(this.errors.keys());
  }

  isEmpty() {
    return this.errors.size === 0;
  }
}

export default ErrorRepository;