import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../../services/services/authentication.service';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CodeInputModule } from 'angular-code-input';

@Component({
	selector: 'app-activate-account',
	standalone: true,
	imports: [
		CommonModule,
		ReactiveFormsModule,
		CodeInputModule
	],
	templateUrl: './activate-account.component.html',
	styleUrl: './activate-account.component.css'
})
export class ActivateAccountComponent implements OnInit {
	
	message = '';
	isOkay = true;
	submitted = false;
	
	constructor(
		private authService: AuthenticationService,
		private router: Router,
	) { }
	
	ngOnInit() {
		this.authService.logout();
	}
	
	onCodeCompleted(code: string) {
		this.confirmAccount(code);
	}
	
	redirectToLogin() {
		this.router.navigate(['/login']).then();
	}
	
	private confirmAccount(code: string) {
		this.authService.confirm({ code })
			.subscribe({
				next: () => {
					this.message = "Your account has been successfully. Proceed to login.";
					this.submitted = true;
					this.isOkay = true;
				},
				error: () => {
					this.message = "The activation code has expired."
					this.submitted = true;
					this.isOkay = false;
				}
			});
	}
}
