import { TestBed } from '@angular/core/testing';
import { LocalStorageService } from './local-storage.service';
import {provideExperimentalZonelessChangeDetection} from "@angular/core";

describe('LocalStorageService', () => {
  let service: LocalStorageService;
  let localStorageMock: { [key: string]: string };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideExperimentalZonelessChangeDetection(),
        LocalStorageService
      ]
    });
    service = TestBed.inject(LocalStorageService);

    localStorageMock = {};

    spyOn(localStorage, 'setItem').and.callFake((key: string, value: string) => {
      localStorageMock[key] = value;
    });

    spyOn(localStorage, 'getItem').and.callFake((key: string) => {
      return localStorageMock[key] || null;
    });

    spyOn(localStorage, 'removeItem').and.callFake((key: string) => {
      delete localStorageMock[key];
    });

    spyOn(localStorage, 'clear').and.callFake(() => {
      localStorageMock = {};
    });
  });

  describe('saveData', () => {
    it('should save data to localStorage', () => {
      service.saveData('testKey', 'testValue');
      expect(localStorage.setItem).toHaveBeenCalledWith('testKey', 'testValue');
      expect(localStorageMock['testKey']).toBe('testValue');
    });
  });

  describe('getData', () => {
    it('should retrieve data from localStorage', () => {
      localStorageMock['testKey'] = 'testValue';
      const result = service.getData('testKey');
      expect(localStorage.getItem).toHaveBeenCalledWith('testKey');
      expect(result).toBe('testValue');
    });

    it('should return null for non-existent key', () => {
      const result = service.getData('nonExistentKey');
      expect(localStorage.getItem).toHaveBeenCalledWith('nonExistentKey');
      expect(result).toBeNull();
    });
  });

  describe('removeData', () => {
    it('should remove data from localStorage', () => {
      localStorageMock['testKey'] = 'testValue';
      service.removeData('testKey');
      expect(localStorage.removeItem).toHaveBeenCalledWith('testKey');
      expect(localStorageMock['testKey']).toBeUndefined();
    });
  });

  describe('clearData', () => {
    it('should clear all data from localStorage', () => {
      localStorageMock['key1'] = 'value1';
      localStorageMock['key2'] = 'value2';
      service.clearData();
      expect(localStorage.clear).toHaveBeenCalled();
      expect(localStorageMock).toEqual({});
    });
  });
});
