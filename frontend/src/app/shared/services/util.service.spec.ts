import { UtilService } from './util.service';

describe('UtilService', () => {
  describe('toCapitalize', () => {
    it('should capitalize a single word', () => {
      expect(UtilService.toCapitalize('hello')).toBe('Hello');
    });

    it('should capitalize multiple words separated by hyphens', () => {
      expect(UtilService.toCapitalize('hello-world')).toBe('HelloWorld');
    });

    it('should handle already capitalized words', () => {
      expect(UtilService.toCapitalize('Hello-World')).toBe('HelloWorld');
    });

    it('should handle mixed case words', () => {
      expect(UtilService.toCapitalize('hElLo-wOrLd')).toBe('HelloWorld');
    });

    it('should handle words with numbers', () => {
      expect(UtilService.toCapitalize('hello-world-123')).toBe('HelloWorld123');
    });

    it('should handle words with special characters', () => {
      expect(UtilService.toCapitalize('hello-world!')).toBe('HelloWorld!');
    });

    it('should handle empty string', () => {
      expect(UtilService.toCapitalize('')).toBe('');
    });

    it('should handle single character', () => {
      expect(UtilService.toCapitalize('a')).toBe('A');
    });

    it('should handle multiple hyphens', () => {
      expect(UtilService.toCapitalize('hello--world')).toBe('HelloWorld');
    });

    it('should handle leading hyphen', () => {
      expect(UtilService.toCapitalize('-hello-world')).toBe('HelloWorld');
    });

    it('should handle trailing hyphen', () => {
      expect(UtilService.toCapitalize('hello-world-')).toBe('HelloWorld');
    });

    it('should handle all uppercase input', () => {
      expect(UtilService.toCapitalize('HELLO-WORLD')).toBe('HelloWorld');
    });

    it('should handle long hyphenated string', () => {
      expect(UtilService.toCapitalize('this-is-a-long-hyphenated-string')).toBe('ThisIsALongHyphenatedString');
    });
  });
});
