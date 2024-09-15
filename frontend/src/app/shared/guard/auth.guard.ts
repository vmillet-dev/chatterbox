import {CanActivateFn, Router} from '@angular/router';
import {inject} from "@angular/core";
import {AuthService} from "../services/auth.service";

export const authGuard: CanActivateFn = (): boolean => {
  const authService = inject(AuthService);
  if (authService.isLoggedIn()) {
    return true;
  } else {
    const router = inject(Router);
    void router.navigate(['/auth/login']);
    return false;
  }
};
