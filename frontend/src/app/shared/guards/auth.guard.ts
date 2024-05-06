import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import * as fromApp from '../../shared/store/reducers/app.reducer';
import { map, take } from 'rxjs';
import { Store } from '@ngrx/store';

export const authGuard: CanActivateFn = (route, state) => {
	
	const router = inject(Router);
	const store = inject(Store<fromApp.AppState>)
	
	return store.select('auth').pipe(
		take(1),
		map(state => {
			return state.user
		}),
		map((user) => {
			if (user) {
				return true;
			}
			return router.createUrlTree(['/login']);
		})
	);
};
