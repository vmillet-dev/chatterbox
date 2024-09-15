import { HttpInterceptorFn } from '@angular/common/http';
import {AuthService} from "../services/auth.service";
import {inject} from "@angular/core";
import {take} from "rxjs";

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  authService.currentUser$.pipe(take(1)).subscribe({
    next: (response) => {
      if (response) {
        req = req.clone({
          setHeaders: {
            Authorization: `Bearer ${response.token}`,
          },
        });
      }
    },
  });

  return next(req);
};
