import {ApplicationConfig, provideExperimentalZonelessChangeDetection, isDevMode} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import {provideHttpClient, withInterceptors} from "@angular/common/http";
import { TranslocoHttpLoader } from './transloco-loader';
import {getBrowserLang, provideTransloco} from '@jsverse/transloco';
import {authInterceptor} from "./shared/interceptor/auth.interceptor";

export const appConfig: ApplicationConfig = {
  providers: [
    provideExperimentalZonelessChangeDetection(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideTransloco({
        config: {
          availableLangs: ['en', 'fr'],
          defaultLang: getBrowserLang() ?? 'en',
          reRenderOnLangChange: true,
          prodMode: !isDevMode(),
        },
        loader: TranslocoHttpLoader
      })
  ]
};
