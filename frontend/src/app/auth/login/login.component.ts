import { Component } from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {TranslocoPipe} from "@jsverse/transloco";
import {AuthService} from "../../shared/services/auth.service";
import {LoginDto} from "../../shared/dto/login.dto";
import {Router} from "@angular/router";

@Component({
    selector: 'app-login',
    imports: [
        ReactiveFormsModule,
        TranslocoPipe
    ],
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss'
})
export class LoginComponent {
  formValidation: boolean = false;
  loginForm: FormGroup<{
    usernameOrEmail: FormControl<string | null>;
    password: FormControl<string | null>;
  }>;

  constructor(private authService: AuthService, private router: Router) {
    this.loginForm = new FormGroup({
      usernameOrEmail: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required])
    });
  }

  onSubmit(): void {
    this.formValidation = true;
    if (this.loginForm.valid) {

      const dto = {
        usernameOrEmail: this.loginForm.controls.usernameOrEmail.value,
        password: this.loginForm.controls.password.value
      } as LoginDto

      this.authService.loginUser(dto).subscribe({
        next: () => void this.router.navigate(['/dashboard']),
        error: (e) => console.error(e)
      });
    }
  }
}
