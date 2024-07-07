import { ComponentFixture } from '@angular/core/testing';

type SelectorType = 'id' | 'selector' | 'data-test';

export class TestHelper {
  private static getElement<T>(fixture: ComponentFixture<T>, selectorType: SelectorType, value: string): HTMLElement | null {
    switch (selectorType) {
      case 'id':
        return fixture.nativeElement.querySelector(`#${value}`);
      case 'selector':
        return fixture.nativeElement.querySelector(value);
      case 'data-test':
        return fixture.nativeElement.querySelector(`[data-test="${value}"]`);
    }
  }

  private static throwElementNotFoundError(selectorType: SelectorType, value: string): never {
    throw new Error(`Element with ${selectorType} '${value}' not found`);
  }

  static getElementById<T>(fixture: ComponentFixture<T>, id: string): HTMLElement {
    return this.getElement(fixture, 'id', id) ?? this.throwElementNotFoundError('id', id);
  }

  static getElementBySelector<T>(fixture: ComponentFixture<T>, selector: string): HTMLElement {
    return this.getElement(fixture, 'selector', selector) ?? this.throwElementNotFoundError('selector', selector);
  }

  static getElementByDataTest<T>(fixture: ComponentFixture<T>, dataTest: string): HTMLElement {
    return this.getElement(fixture, 'data-test', dataTest) ?? this.throwElementNotFoundError('data-test', dataTest);
  }

  private static clickOnElement<T>(fixture: ComponentFixture<T>, selectorType: SelectorType, value: string): void {
    const element = this.getElement(fixture, selectorType, value);
    if (element) {
      element.click();
      fixture.detectChanges();
    } else {
      this.throwElementNotFoundError(selectorType, value);
    }
  }

  static clickOnElementById<T>(fixture: ComponentFixture<T>, id: string): void {
    this.clickOnElement(fixture, 'id', id);
  }

  static clickOnElementByDataTest<T>(fixture: ComponentFixture<T>, dataTest: string): void {
    this.clickOnElement(fixture, 'data-test', dataTest);
  }

  private static setInputValue<T>(fixture: ComponentFixture<T>, selectorType: SelectorType, value: string, inputValue: string): void {
    const input = this.getElement(fixture, selectorType, value) as HTMLInputElement;
    if (input) {
      input.value = inputValue;
      input.dispatchEvent(new Event('input'));
      fixture.detectChanges();
    } else {
      this.throwElementNotFoundError(selectorType, value);
    }
  }

  static setInputValueById<T>(fixture: ComponentFixture<T>, id: string, value: string): void {
    this.setInputValue(fixture, 'id', id, value);
  }

  static setInputValueBySelector<T>(fixture: ComponentFixture<T>, selector: string, value: string): void {
    this.setInputValue(fixture, 'selector', selector, value);
  }

  static setInputValueByDataTest<T>(fixture: ComponentFixture<T>, dataTest: string, value: string): void {
    this.setInputValue(fixture, 'data-test', dataTest, value);
  }

  private static getTextContent<T>(fixture: ComponentFixture<T>, selectorType: SelectorType, value: string): string {
    const element = this.getElement(fixture, selectorType, value);
    if (element) {
      return element.textContent?.trim() ?? '';
    } else {
      return this.throwElementNotFoundError(selectorType, value);
    }
  }

  static getTextContentById<T>(fixture: ComponentFixture<T>, id: string): string {
    return this.getTextContent(fixture, 'id', id);
  }

  static getTextContentBySelector<T>(fixture: ComponentFixture<T>, selector: string): string {
    return this.getTextContent(fixture, 'selector', selector);
  }

  static getTextContentByDataTest<T>(fixture: ComponentFixture<T>, dataTest: string): string {
    return this.getTextContent(fixture, 'data-test', dataTest);
  }

  static getElementsBySelector<T>(fixture: ComponentFixture<T>, selector: string): HTMLElement[] {
    return Array.from(fixture.nativeElement.querySelectorAll(selector));
  }

  static getTextContentsBySelector<T>(fixture: ComponentFixture<T>, selector: string): string[] {
    return this.getElementsBySelector(fixture, selector).map(element => element.textContent?.trim() ?? '');
  }

  static getAttributesBySelector<T>(fixture: ComponentFixture<T>, selector: string): NamedNodeMap[] {
    return this.getElementsBySelector(fixture, selector).map(element => element.attributes);
  }
}
