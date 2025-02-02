import { TestHelper } from './test-helper';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {Component, provideExperimentalZonelessChangeDetection} from '@angular/core';

@Component({
    template: `
    <div id="test-id" data-test="test-data">Test Content</div>
    <input id="test-input" data-test="test-input" />
    <button id="test-button" data-test="test-button" (click)="onButtonClick()">Click me</button>
    <div class="test-class">Class Test 1</div>
    <div class="test-class">Class Test 2</div>
  `,
    standalone: false
})
class TestComponent {
  onButtonClick() {}
}

describe('TestHelper', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestComponent],
      providers: [
        provideExperimentalZonelessChangeDetection(),
      ]
    });
    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should return the element with the given id', () => {
    // WHEN
    const element = TestHelper.getElementById(fixture, 'test-id');

    // THEN
    expect(element.textContent).toBe('Test Content');
  });

  it('should throw an error if the element is not found', () => {
    // WHEN & THEN
    expect(() => TestHelper.getElementById(fixture, 'non-existent-id')).toThrow();
  });

  it('should return the element matching the given selector', () => {
    // WHEN
    const element = TestHelper.getElementBySelector(fixture, '.test-class');

    // THEN
    expect(element.textContent).toBe('Class Test 1');
  });

  it('should throw an error if the element is not found', () => {
    // WHEN & THEN
    expect(() => TestHelper.getElementBySelector(fixture, '.non-existent-class')).toThrow();
  });

  it('should return the element with the given data-test attribute', () => {
    // WHEN
    const element = TestHelper.getElementByDataTest(fixture, 'test-data');

    // THEN
    expect(element).toBeTruthy();
    expect(element.textContent).toBe('Test Content');
  });

  it('should throw an error if the element is not found', () => {
    // WHEN & THEN
    expect(() => TestHelper.getElementByDataTest(fixture, 'non-existent-data-test')).toThrow();
  });

  it('should click on the element with the given id and trigger the click handler', () => {
    // GIVEN
    spyOn(component, 'onButtonClick');

    // WHEN
    TestHelper.clickOnElementById(fixture, 'test-button');

    // THEN
    expect(component.onButtonClick).toHaveBeenCalled();
  });

  it('should throw an error if the element is not found', () => {
    // WHEN & THEN
    expect(() => TestHelper.clickOnElementById(fixture, 'non-existent-id')).toThrow();
  });

  it('should click on the element with the given data-test attribute and trigger the click handler', () => {
    // GIVEN
    spyOn(component, 'onButtonClick');

    // WHEN
    TestHelper.clickOnElementByDataTest(fixture, 'test-button');

    // THEN
    expect(component.onButtonClick).toHaveBeenCalled();
  });

  it('should throw an error if the element is not found', () => {
    // WHEN & THEN
    expect(() => TestHelper.clickOnElementByDataTest(fixture, 'non-existent-data-test')).toThrow();
  });

  it('should set the value of the input with the given id', () => {
    // WHEN
    TestHelper.setInputValueById(fixture, 'test-input', 'test value');

    // THEN
    const input = fixture.nativeElement.querySelector('#test-input') as HTMLInputElement;
    expect(input.value).toBe('test value');
  });

  it('should throw an error if the input is not found', () => {
    // WHEN & THEN
    expect(() => TestHelper.setInputValueById(fixture, 'non-existent-id', 'test')).toThrow();
  });

  it('should set the value of the input matching the given selector', () => {
    // WHEN
    TestHelper.setInputValueBySelector(fixture, '#test-input', 'test value');

    // THEN
    const input = fixture.nativeElement.querySelector('#test-input') as HTMLInputElement;
    expect(input.value).toBe('test value');
  });

  it('should throw an error if the input is not found', () => {
    // WHEN & THEN
    expect(() => TestHelper.setInputValueBySelector(fixture, '#non-existent-input', 'test')).toThrow();
  });

  it('should set the value of the input with the given data-test attribute', () => {
    // WHEN
    TestHelper.setInputValueByDataTest(fixture, 'test-input', 'test value');

    // THEN
    const input = fixture.nativeElement.querySelector('[data-test="test-input"]') as HTMLInputElement;
    expect(input.value).toBe('test value');
  });

  it('should throw an error if the input is not found', () => {
    // WHEN & THEN
    expect(() => TestHelper.setInputValueByDataTest(fixture, 'non-existent-data-test', 'test')).toThrow();
  });

  it('should return the text content of the element with the given id', () => {
    // WHEN
    const text = TestHelper.getTextContentById(fixture, 'test-id');

    // THEN
    expect(text).toBe('Test Content');
  });

  it('should throw an error if the element is not found', () => {
    // WHEN & THEN
    expect(() => TestHelper.getTextContentById(fixture, 'non-existent-id')).toThrow();
  });

  it('should return the text content of the element matching the given selector', () => {
    // WHEN
    const text = TestHelper.getTextContentBySelector(fixture, '.test-class');

    // THEN
    expect(text).toBe('Class Test 1');
  });

  it('should throw an error if the element is not found', () => {
    // WHEN & THEN
    expect(() => TestHelper.getTextContentBySelector(fixture, '.non-existent-class')).toThrow();
  });

  it('should return the text content of the element with the given data-test attribute', () => {
    // WHEN
    const text = TestHelper.getTextContentByDataTest(fixture, 'test-data');

    // THEN
    expect(text).toBe('Test Content');
  });

  it('should throw an error if the element is not found', () => {
    // WHEN & THEN
    expect(() => TestHelper.getTextContentByDataTest(fixture, 'non-existent-data-test')).toThrow();
  });

  it('should return all elements matching the given selector', () => {
    // WHEN
    const elements = TestHelper.getElementsBySelector(fixture, '.test-class');

    // THEN
    expect(elements.length).toBe(2);
    expect(elements[0].textContent).toBe('Class Test 1');
    expect(elements[1].textContent).toBe('Class Test 2');
  });

  it('should return an empty array if no elements are found', () => {
    // WHEN
    const elements = TestHelper.getElementsBySelector(fixture, '.non-existent-class');

    // THEN
    expect(elements.length).toBe(0);
  });

  it('should return the text contents of all elements matching the given selector', () => {
    // WHEN
    const texts = TestHelper.getTextContentsBySelector(fixture, '.test-class');

    // THEN
    expect(texts).toEqual(['Class Test 1', 'Class Test 2']);
  });

  it('should return an empty array if no elements are found', () => {
    // WHEN
    const texts = TestHelper.getTextContentsBySelector(fixture, '.non-existent-class');

    // THEN
    expect(texts.length).toBe(0);
  });

  it('should return the attributes of all elements matching the given selector', () => {
    // WHEN
    const attributes = TestHelper.getAttributesBySelector(fixture, '[data-test]');

    // THEN
    expect(attributes.length).toBe(3);
    expect(attributes[0].getNamedItem('data-test')?.value).toBe('test-data');
    expect(attributes[1].getNamedItem('data-test')?.value).toBe('test-input');
    expect(attributes[2].getNamedItem('data-test')?.value).toBe('test-button');
  });

  it('should return an empty array if no elements are found', () => {
    // WHEN
    const attributes = TestHelper.getAttributesBySelector(fixture, '.non-existent-class');

    // THEN
    expect(attributes.length).toBe(0);
  });
});
