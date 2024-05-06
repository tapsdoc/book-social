import { createReducer, on } from '@ngrx/store';
import { LOGIN, LOGOUT } from '../actions/auth.actions';
import { AuthResponse } from '../../../services/models/auth-response';

export const initialState: AuthState = {
	user: null
};

export const authReducer = createReducer(
	initialState,
	on(LOGIN, (state, action) => {
		if(!state.user) {
			return {
				...state,
				user: {
					name: action.payload.name,
					accessToken: action.payload.accessToken,
					refreshToken: action.payload.refreshToken,
				}
			}
		}
		return state;
	}),
	on(LOGOUT, (state) => ({
		...state,
		user: null
	}))
);


export const getIsAuth = (state: AuthState): AuthResponse => state.user!;

export interface AuthState {
	user: AuthResponse | null;
}