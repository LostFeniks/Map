import ErrorRepository from '../src/ErrorRepository.js';

describe('ErrorRepository', () => {
  let errorRepo;

  beforeEach(() => {
    errorRepo = new ErrorRepository();
  });

  describe('Constructor and initialization', () => {
    test('should initialize with default errors', () => {
      const errors = errorRepo.getAllErrors();
      expect(errors.size).toBe(12);
      expect(errors.get(400)).toBe('Bad Request');
      expect(errors.get(401)).toBe('Unauthorized');
      expect(errors.get(403)).toBe('Forbidden');
      expect(errors.get(404)).toBe('Not Found');
      expect(errors.get(500)).toBe('Internal Server Error');
    });

    test('should have correct default error codes', () => {
      const codes = errorRepo.getAllErrorCodes();
      expect(codes).toContain(400);
      expect(codes).toContain(401);
      expect(codes).toContain(403);
      expect(codes).toContain(404);
      expect(codes).toContain(408);
      expect(codes).toContain(409);
      expect(codes).toContain(422);
      expect(codes).toContain(429);
      expect(codes).toContain(500);
      expect(codes).toContain(502);
      expect(codes).toContain(503);
      expect(codes).toContain(504);
      expect(codes).toHaveLength(12);
    });
  });

  describe('translate method', () => {
    test('should return correct description for existing error code', () => {
      expect(errorRepo.translate(400)).toBe('Bad Request');
      expect(errorRepo.translate(401)).toBe('Unauthorized');
      expect(errorRepo.translate(403)).toBe('Forbidden');
      expect(errorRepo.translate(404)).toBe('Not Found');
      expect(errorRepo.translate(500)).toBe('Internal Server Error');
    });

    test('should return "Unknown error" for non-existing error code', () => {
      expect(errorRepo.translate(999)).toBe('Unknown error');
      expect(errorRepo.translate(100)).toBe('Unknown error');
      expect(errorRepo.translate(0)).toBe('Unknown error');
      expect(errorRepo.translate(-999)).toBe('Unknown error');
    });

    test('should return "Unknown error" for invalid code types', () => {
      expect(errorRepo.translate(null)).toBe('Unknown error');
      expect(errorRepo.translate(undefined)).toBe('Unknown error');
      expect(errorRepo.translate('400')).toBe('Unknown error');
      expect(errorRepo.translate({})).toBe('Unknown error');
      expect(errorRepo.translate([])).toBe('Unknown error');
      expect(errorRepo.translate(NaN)).toBe('Unknown error');
      expect(errorRepo.translate(true)).toBe('Unknown error');
      expect(errorRepo.translate(false)).toBe('Unknown error');
    });

    test('should return description for dynamically added errors', () => {
      errorRepo.addError(418, "I'm a teapot");
      expect(errorRepo.translate(418)).toBe("I'm a teapot");
    });
  });

  describe('addError method', () => {
    test('should add new error successfully', () => {
      errorRepo.addError(418, "I'm a teapot");
      expect(errorRepo.hasError(418)).toBe(true);
      expect(errorRepo.translate(418)).toBe("I'm a teapot");
    });

    test('should support method chaining', () => {
      const result = errorRepo.addError(418, "I'm a teapot");
      expect(result).toBe(errorRepo);
    });

    test('should overwrite existing error', () => {
      errorRepo.addError(400, 'Custom Bad Request');
      expect(errorRepo.translate(400)).toBe('Custom Bad Request');
    });

    test('should throw error when code is invalid', () => {
      expect(() => errorRepo.addError(null, 'Description')).toThrow('Code must be a valid number');
      expect(() => errorRepo.addError(undefined, 'Description')).toThrow(
        'Code must be a valid number'
      );
      expect(() => errorRepo.addError('400', 'Description')).toThrow('Code must be a valid number');
      expect(() => errorRepo.addError(NaN, 'Description')).toThrow('Code must be a valid number');
      expect(() => errorRepo.addError({}, 'Description')).toThrow('Code must be a valid number');
      expect(() => errorRepo.addError([], 'Description')).toThrow('Code must be a valid number');
    });

    test('should throw error when description is invalid', () => {
      expect(() => errorRepo.addError(418, null)).toThrow('Description must be a non-empty string');
      expect(() => errorRepo.addError(418, undefined)).toThrow(
        'Description must be a non-empty string'
      );
      expect(() => errorRepo.addError(418, '')).toThrow('Description must be a non-empty string');
      expect(() => errorRepo.addError(418, '   ')).toThrow(
        'Description must be a non-empty string'
      );
      expect(() => errorRepo.addError(418, 123)).toThrow('Description must be a non-empty string');
      expect(() => errorRepo.addError(418, {})).toThrow('Description must be a non-empty string');
    });
  });

  describe('hasError method', () => {
    test('should return true for existing error', () => {
      expect(errorRepo.hasError(400)).toBe(true);
      expect(errorRepo.hasError(404)).toBe(true);
    });

    test('should return false for non-existing error', () => {
      expect(errorRepo.hasError(999)).toBe(false);
      expect(errorRepo.hasError(100)).toBe(false);
    });

    test('should return false for invalid code types', () => {
      expect(errorRepo.hasError(null)).toBe(false);
      expect(errorRepo.hasError(undefined)).toBe(false);
      expect(errorRepo.hasError('400')).toBe(false);
    });
  });

  describe('removeError method', () => {
    test('should remove existing error and return true', () => {
      expect(errorRepo.removeError(400)).toBe(true);
      expect(errorRepo.hasError(400)).toBe(false);
      expect(errorRepo.translate(400)).toBe('Unknown error');
    });

    test('should return false when removing non-existing error', () => {
      expect(errorRepo.removeError(999)).toBe(false);
    });

    test('should return false for invalid code types', () => {
      expect(errorRepo.removeError(null)).toBe(false);
      expect(errorRepo.removeError('400')).toBe(false);
    });
  });

  describe('getAllErrors method', () => {
    test('should return a copy of all errors', () => {
      const errors = errorRepo.getAllErrors();
      expect(errors).toBeInstanceOf(Map);
      expect(errors.size).toBe(12);

      errors.set(999, 'Test');
      expect(errorRepo.hasError(999)).toBe(false);
    });

    test('should include added errors', () => {
      errorRepo.addError(418, "I'm a teapot");
      const errors = errorRepo.getAllErrors();
      expect(errors.get(418)).toBe("I'm a teapot");
    });
  });

  describe('getSize method', () => {
    test('should return correct number of errors', () => {
      expect(errorRepo.getSize()).toBe(12);
      errorRepo.addError(418, "I'm a teapot");
      expect(errorRepo.getSize()).toBe(13);
      errorRepo.removeError(400);
      expect(errorRepo.getSize()).toBe(12);
    });
  });

  describe('clearAllErrors method', () => {
    test('should reset to default errors', () => {
      errorRepo.addError(418, "I'm a teapot");
      errorRepo.addError(420, 'Enhance Your Calm');
      expect(errorRepo.getSize()).toBe(14);

      errorRepo.clearAllErrors();
      expect(errorRepo.getSize()).toBe(12);
      expect(errorRepo.hasError(418)).toBe(false);
      expect(errorRepo.hasError(420)).toBe(false);
      expect(errorRepo.hasError(400)).toBe(true);
    });
  });

  describe('updateError method', () => {
    test('should update existing error and return true', () => {
      const result = errorRepo.updateError(400, 'Custom Bad Request');
      expect(result).toBe(true);
      expect(errorRepo.translate(400)).toBe('Custom Bad Request');
    });

    test('should return false when updating non-existing error', () => {
      const result = errorRepo.updateError(999, 'New Error');
      expect(result).toBe(false);
      expect(errorRepo.translate(999)).toBe('Unknown error');
    });

    test('should validate new description', () => {
      expect(() => errorRepo.updateError(400, '')).toThrow();
      expect(() => errorRepo.updateError(400, null)).toThrow();
    });
  });

  describe('getAllErrorCodes method', () => {
    test('should return array of all error codes', () => {
      const codes = errorRepo.getAllErrorCodes();
      expect(Array.isArray(codes)).toBe(true);
      expect(codes).toHaveLength(12);
      expect(codes).toContain(400);
      expect(codes).toContain(404);
      expect(codes).toContain(500);
    });

    test('should return updated codes after adding errors', () => {
      errorRepo.addError(418, "I'm a teapot");
      const codes = errorRepo.getAllErrorCodes();
      expect(codes).toContain(418);
      expect(codes).toHaveLength(13);
    });
  });

  describe('isEmpty method', () => {
    test('should return false when errors exist', () => {
      expect(errorRepo.isEmpty()).toBe(false);
    });

    test('should return true after clearing all errors', () => {
      errorRepo.errors.clear();
      expect(errorRepo.isEmpty()).toBe(true);
    });
  });

  describe('Integration tests', () => {
    test('should handle multiple operations correctly', () => {
      errorRepo.addError(418, "I'm a teapot");
      errorRepo.addError(429, 'Too Many Requests');

      expect(errorRepo.translate(418)).toBe("I'm a teapot");
      expect(errorRepo.translate(429)).toBe('Too Many Requests');
      expect(errorRepo.translate(400)).toBe('Bad Request');

      errorRepo.removeError(418);
      expect(errorRepo.hasError(418)).toBe(false);
      expect(errorRepo.translate(418)).toBe('Unknown error');

      const allErrors = errorRepo.getAllErrors();
      console.log('Actual size:', allErrors.size);
      console.log('All error codes:', Array.from(allErrors.keys()));
      expect(allErrors.size).toBe(12);
    });

    test('should handle edge cases with zero and negative codes', () => {
      errorRepo.addError(0, 'Zero Error');
      errorRepo.addError(-1, 'Negative Error');

      expect(errorRepo.translate(0)).toBe('Zero Error');
      expect(errorRepo.translate(-1)).toBe('Negative Error');
    });

    test('should handle large number of errors', () => {
      for (let i = 0; i < 1000; i++) {
        errorRepo.addError(1000 + i, `Error ${i}`);
      }
      expect(errorRepo.getSize()).toBe(1012);
      expect(errorRepo.translate(1500)).toBe('Error 500');
    });

    test('should be resilient to frequent add/remove operations', () => {
      for (let i = 0; i < 100; i++) {
        errorRepo.addError(1000 + i, `Error ${i}`);
        expect(errorRepo.translate(1000 + i)).toBe(`Error ${i}`);
        errorRepo.removeError(1000 + i);
        expect(errorRepo.translate(1000 + i)).toBe('Unknown error');
      }
    });
  });
});
