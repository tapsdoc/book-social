import { ActionReducerMap, createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromAuth from './auth.reducer'

export interface AppState {
	auth: fromAuth.AuthState;
}

export const appReducer: ActionReducerMap<AppState> = {
	auth: fromAuth.authReducer
}

export const getAuthState = createFeatureSelector<fromAuth.AuthState>('auth');
export const getIsAuth = createSelector(getAuthState, fromAuth.getIsAuth);