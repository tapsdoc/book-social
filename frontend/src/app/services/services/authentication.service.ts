/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { map } from 'rxjs/operators';

import { BaseService } from '../base-service';
import { ApiConfiguration } from '../api-configuration';
import { StrictHttpResponse } from '../strict-http-response';

import { AuthResponse } from '../models/auth-response';
import { confirm } from '../fn/authentication/confirm';
import { Confirm$Params } from '../fn/authentication/confirm';
import { login } from '../fn/authentication/login';
import { Login$Params } from '../fn/authentication/login';
import { refreshToken } from '../fn/authentication/refresh-token';
import { RefreshToken$Params } from '../fn/authentication/refresh-token';
import { register } from '../fn/authentication/register';
import { Register$Params } from '../fn/authentication/register';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../shared/store/reducers/app.reducer';
import * as Auth from '../../shared/store/actions/auth.actions'

@Injectable({ providedIn: 'root' })
export class AuthenticationService extends BaseService {
	
	private timer: any;
	private isLocalStorageAvailable = typeof localStorage !== 'undefined';
	
	constructor(
		config: ApiConfiguration,
		http: HttpClient,
		private store: Store<fromRoot.AppState>,
		private router: Router
	) {
		super(config, http);
	}
	
	/** Path part for operation `register()` */
	static readonly RegisterPath = '/auth/register';
	
	/**
	 * This method provides access to the full `HttpResponse`, allowing access to response headers.
	 * To access only the response body, use `register()` instead.
	 *
	 * This method sends `application/json` and handles request body of type `application/json`.
	 */
	register$Response(params: Register$Params, context?: HttpContext): Observable<StrictHttpResponse<{}>> {
		return register(this.http, this.rootUrl, params, context);
	}
	
	/**
	 * This method provides access only to the response body.
	 * To access the full response (for headers, for example), `register$Response()` instead.
	 *
	 * This method sends `application/json` and handles request body of type `application/json`.
	 */
	register(params: Register$Params, context?: HttpContext): Observable<{}> {
		return this.register$Response(params, context).pipe(
			map((r: StrictHttpResponse<{}>): {} => r.body)
		);
	}
	
	/** Path part for operation `refreshToken()` */
	static readonly RefreshTokenPath = '/auth/refresh-token';
	
	/**
	 * This method provides access to the full `HttpResponse`, allowing access to response headers.
	 * To access only the response body, use `refreshToken()` instead.
	 *
	 * This method doesn't expect any request body.
	 */
	refreshToken$Response(params?: RefreshToken$Params, context?: HttpContext): Observable<StrictHttpResponse<{}>> {
		return refreshToken(this.http, this.rootUrl, params, context);
	}
	
	/**
	 * This method provides access only to the response body.
	 * To access the full response (for headers, for example), `refreshToken$Response()` instead.
	 *
	 * This method doesn't expect any request body.
	 */
	refreshToken(params?: RefreshToken$Params, context?: HttpContext): Observable<{}> {
		return this.refreshToken$Response(params, context).pipe(
			map((r: StrictHttpResponse<{}>): {} => r.body)
		);
	}
	
	/** Path part for operation `login()` */
	static readonly LoginPath = '/auth/login';
	
	/**
	 * This method provides access to the full `HttpResponse`, allowing access to response headers.
	 * To access only the response body, use `login()` instead.
	 *
	 * This method sends `application/json` and handles request body of type `application/json`.
	 */
	login$Response(params: Login$Params, context?: HttpContext): Observable<StrictHttpResponse<AuthResponse>> {
		return login(this.http, this.rootUrl, params, context);
	}
	
	/**
	 * This method provides access only to the response body.
	 * To access the full response (for headers, for example), `login$Response()` instead.
	 *
	 * This method sends `application/json` and handles request body of type `application/json`.
	 */
	login(params: Login$Params, context?: HttpContext): Observable<AuthResponse> {
		return this.login$Response(params, context).pipe(
			tap(res => {
				this.handleAuth(res);
			}),
			map((r: StrictHttpResponse<AuthResponse>): AuthResponse => r.body)
		);
	}
	
	/** Path part for operation `confirm()` */
	static readonly ConfirmPath = '/auth/activate-account';
	
	/**
	 * This method provides access to the full `HttpResponse`, allowing access to response headers.
	 * To access only the response body, use `confirm()` instead.
	 *
	 * This method doesn't expect any request body.
	 */
	confirm$Response(params: Confirm$Params, context?: HttpContext): Observable<StrictHttpResponse<{}>> {
		return confirm(this.http, this.rootUrl, params, context);
	}
	
	/**
	 * This method provides access only to the response body.
	 * To access the full response (for headers, for example), `confirm$Response()` instead.
	 *
	 * This method doesn't expect any request body.
	 */
	confirm(params: Confirm$Params, context?: HttpContext): Observable<{}> {
		return this.confirm$Response(params, context).pipe(
			map((r: StrictHttpResponse<{}>): {} => r.body)
		);
	}
	
	autoLogin() {
		if (this.isLocalStorageAvailable) {
			const user: AuthResponse = JSON.parse(localStorage.getItem("user")!);
			if (!user) {
				return;
			}
			if (user.accessToken) {
				this.store.dispatch(Auth.LOGIN({ payload: user }))
				this.autoLogout(1800000);
			}
		}
	}
	
	logout() {
		if (this.isLocalStorageAvailable)
			localStorage.removeItem('user');
		
		if (this.timer)
			clearInterval(this.timer);
		
		this.store.dispatch(Auth.LOGOUT());
		this.timer = null;
	}
	
	autoLogout(expiresIn: number) {
		this.timer = setTimeout(() => {
			this.logout();
			this.router.navigate(['login']).then();
		}, expiresIn)
	}
	
	private handleAuth(res: HttpResponse<AuthResponse> & { readonly body: AuthResponse }) {
		if (this.isLocalStorageAvailable)
			localStorage.setItem("user", JSON.stringify(res.body));
		this.store.dispatch(Auth.LOGIN({ payload: res.body }));
		this.autoLogout(1800000)
	}
}
