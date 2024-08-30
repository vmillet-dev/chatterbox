import {ComponentFixture, TestBed} from '@angular/core/testing';

import { RegisterComponent } from './register.component';
import {TestHelper} from "../../shared/testing/test-helper";
import {AuthService} from "../../shared/services/auth.service";
import {of} from "rxjs";
import {anything, deepEqual, instance, mock, verify, when} from "@johanblumenberg/ts-mockito";
import {provideExperimentalZonelessChangeDetection} from "@angular/core";
import {getTranslocoModule} from "../../shared/testing/transloco-testing.module";

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let authService: AuthService;

  beforeEach(async () => {
    authService = mock(AuthService);

    await TestBed.configureTestingModule({
      imports: [
        RegisterComponent,
        getTranslocoModule()
      ],
      providers: [
        provideExperimentalZonelessChangeDetection(),
        { provide: AuthService, useValue: instance(authService) }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    await fixture.whenStable();

    component = fixture.componentInstance;
  });

  describe('Typescript', () => {
    it('should initialize form with empty fields', () => {
      expect(component.registerForm.get('email')?.value).toBe('');
      expect(component.registerForm.get('username')?.value).toBe('');
      expect(component.registerForm.get('password')?.value).toBe('');
      expect(component.registerForm.get('confirmPassword')?.value).toBe('');

      expect(component.registerForm.valid).toBeFalsy();
    });

    it('should mark form as valid when all fields are filled correctly', () => {
      // WHEN
      component.registerForm.patchValue({
        email: 'test@example.com',
        username: 'testuser',
        password: 'password123',
        confirmPassword: 'password123'
      });

      // THEN
      expect(component.registerForm.valid).toBeTrue();
    });

    it('should mark form as invalid when passwords are different', () => {
      // WHEN
      component.registerForm.patchValue({
        email: 'test@example.com',
        username: 'testuser',
        password: 'password123',
        confirmPassword: 'toto'
      });

      // THEN
      expect(component.registerForm.valid).toBeFalsy();
    });

    it('should call authService.registerUser when form is valid and submitted', () => {
      // GIVEN
      when(authService.registerUser(anything())).thenReturn(of({}));
      component.registerForm.patchValue({
        email: 'test@example.com',
        username: 'testuser',
        password: 'password123',
        confirmPassword: 'password123'
      });

      // WHEN
      component.onSubmit();

      // THEN
      verify(authService.registerUser(deepEqual({
        email: 'test@example.com',
        username: 'testuser',
        password: 'password123'
      }))).once();
    });

    it('should not call authService.registerUser when form is invalid', () => {
      // WHEN
      component.onSubmit();

      //THEN
      verify(authService.registerUser(anything())).never();
    });
  });

  describe('Template', () => {
    it('should have the correct title', () => {
      // WHEN
      const title = TestHelper.getTextContentByDataTest(fixture, 'register-title');

      // THEN
      expect(title).toBe('User Registration');
    });

    it('should have email input field', () => {
      // WHEN
      const emailInput = TestHelper.getElementByDataTest(fixture, 'email-input') as HTMLInputElement;
      const usernameInput = TestHelper.getElementByDataTest(fixture, 'username-input') as HTMLInputElement;
      const passwordInput = TestHelper.getElementByDataTest(fixture, 'password-input') as HTMLInputElement;
      const confirmPasswordInput = TestHelper.getElementByDataTest(fixture, 'confirm-password-input') as HTMLInputElement;

      // THEN
      expect(emailInput.type).toBe('email');
      expect(emailInput.required).toBeTrue();
      expect(usernameInput.type).toBe('text');
      expect(usernameInput.required).toBeTrue();
      expect(passwordInput.type).toBe('password');
      expect(passwordInput.required).toBeTrue();
      expect(confirmPasswordInput.type).toBe('password');
      expect(confirmPasswordInput.required).toBeTrue();
    });

    it('should have submit button', () => {
      // WHEN
      const submitButton = TestHelper.getElementByDataTest(fixture, 'submit-button') as HTMLButtonElement;

      // THEN
      expect(submitButton.textContent).toContain('Register');
    });

    it('should disable submit button when form is invalid', () => {
      // WHEN
      const submitButton = TestHelper.getElementByDataTest(fixture, 'submit-button') as HTMLButtonElement;

      // THEN
      expect(submitButton.disabled).toBeTrue();
    });

    it('should be invalid if password are not equals', () => {
      // GIVEN
      TestHelper.setInputValueByDataTest(fixture, 'email-input', 'test@example.com');
      TestHelper.setInputValueByDataTest(fixture, 'username-input', 'testuser');
      TestHelper.setInputValueByDataTest(fixture, 'password-input', 'password123');
      TestHelper.setInputValueByDataTest(fixture, 'confirm-password-input', 'toto');

      // WHEN
      fixture.detectChanges();

      // THEN
      const submitButton = TestHelper.getElementByDataTest(fixture, 'submit-button') as HTMLButtonElement;
      expect(submitButton.disabled).toBeTrue();
    });

    it('should call onSubmit method when form is submitted', () => {
      // GIVEN
      spyOn(component, 'onSubmit');

      TestHelper.setInputValueByDataTest(fixture, 'email-input', 'test@example.com');
      TestHelper.setInputValueByDataTest(fixture, 'username-input', 'testuser');
      TestHelper.setInputValueByDataTest(fixture, 'password-input', 'password123');
      TestHelper.setInputValueByDataTest(fixture, 'confirm-password-input', 'password123');
      fixture.detectChanges();

      // WHEN
      TestHelper.clickOnElementByDataTest(fixture, 'submit-button');

      // THEN
      expect(component.onSubmit).toHaveBeenCalled();
    });
  });
});
