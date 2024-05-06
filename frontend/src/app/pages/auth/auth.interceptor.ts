import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { exhaustMap, map, take } from 'rxjs';
import * as fromApp from '../../shared/store/reducers/app.reducer';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
	
	const store = inject(Store<fromApp.AppState>);
	return store.select('auth').pipe(
		take(1),
		map((state) => {
			return state.user
		}),
		exhaustMap(user => {
			if (!user) {
				return next(req);
			}
			const request = req.clone({ setHeaders: { Authorization: `Bearer ${user.accessToken}` } });
			return next(request);
		})
	);
};
