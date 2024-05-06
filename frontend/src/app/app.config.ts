import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideStore } from '@ngrx/store';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './pages/auth/auth.interceptor';
import * as fromApp from './shared/store/reducers/app.reducer';

export const appConfig: ApplicationConfig = {
  providers: [
		provideRouter(routes),
		provideClientHydration(),
		provideAnimationsAsync(),
		provideHttpClient(withFetch(), withInterceptors([authInterceptor])),
		provideStore(fromApp.appReducer)
	]
};
