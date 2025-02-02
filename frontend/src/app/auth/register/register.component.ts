import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators
} from "@angular/forms";
import {RegisterDto} from "../../shared/dto/register.dto";
import {AuthService} from "../../shared/services/auth.service";
import {TranslocoPipe} from "@jsverse/transloco";
import {passwordMatchValidator} from "./register.validator";

@Component({
    selector: 'app-register',
    imports: [
        FormsModule,
        ReactiveFormsModule,
        TranslocoPipe
    ],
    templateUrl: './register.component.html',
    styleUrl: './register.component.scss'
})
export class RegisterComponent {
  registerForm: FormGroup<{
    email: FormControl<string | null>;
    username: FormControl<string | null>;
    password: FormControl<string | null>;
    confirmPassword: FormControl<string | null>;
  }>;

  constructor(private authService: AuthService) {
    this.registerForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      username: new FormControl('', [Validators.required, Validators.minLength(3)]),
      password: new FormControl('', [Validators.required, Validators.minLength(8)]),
      confirmPassword: new FormControl('', Validators.required)
    }, { validators: passwordMatchValidator });
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      const dto: RegisterDto = {
        email: this.registerForm.controls.email.value!,
        username: this.registerForm.controls.username.value!,
        password:  this.registerForm.controls.password.value!
      };

      this.authService.registerUser(dto).subscribe({
        next: (v) => console.log(v),
        error: (e) => console.error(e),
        complete: () => console.info('complete')
      });
    }
  };
}
