import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import * as fromApp from '../../shared/store/reducers/app.reducer';
import { map, Subscription } from 'rxjs';
import { SearchBarComponent } from '../search-bar/search-bar.component';
import { AuthResponse } from '../../services/models/auth-response';
import { AuthenticationService } from '../../services/services/authentication.service';

@Component({
	selector: 'app-header',
	standalone: true,
	imports: [
		CommonModule,
		RouterModule,
		SearchBarComponent,
		NgOptimizedImage,
	],
	templateUrl: './header.component.html',
	styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
	protected isAuth!: boolean;
	protected user!: AuthResponse;
	private subs!: Subscription;
	isOpen = false;
	isUserMenuOpen = false;
	
	constructor(
		private store: Store<fromApp.AppState>,
		private authService: AuthenticationService,
		private router: Router
	) { }
	
	ngOnInit() {
		this.subs = this.store.select('auth')
		.pipe(
			map(state => state.user)
		)
		.subscribe({
			next: user => {
				if (user) {
					this.isAuth = !!user;
					this.user = user;
				}
			}
		});
	}
	
	onLogout() {
		this.authService.logout();
		this.router.navigate(['login']).then();
	}
	
	toggle() {
		this.isUserMenuOpen = false;
		this.isOpen = !this.isOpen;
	}
	
	toggleUserMenu() {
		this.isOpen = false;
		this.isUserMenuOpen = !this.isUserMenuOpen;
	}
	
	ngOnDestroy() {
		this.subs.unsubscribe();
	}
}