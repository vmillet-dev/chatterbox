import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginComponent } from './login.component';
import {provideExperimentalZonelessChangeDetection} from "@angular/core";
import {getTranslocoModule} from "../../shared/testing/transloco-testing.module";

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        LoginComponent,
        getTranslocoModule()
      ],
      providers:[
        provideExperimentalZonelessChangeDetection(),
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    await fixture.whenStable();

    component = fixture.componentInstance;
  });

  describe('Typescript', () => {
    it('should submit form successfully', () => {
      // GIVEN
      component .loginForm.patchValue({
        usernameOrEmail: 'email@toto.fr',
        password: 'toto123456789'
      });

      // WHEN
      component.onSubmit();

      // THEN
      expect(component.formValidation).toBeTrue();
    });
  })
});
