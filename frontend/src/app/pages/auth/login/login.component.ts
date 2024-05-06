import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthenticationService } from '../../../services/services/authentication.service';
import { AuthRequest } from '../../../services/models/auth-request';
import { MatInputModule } from '@angular/material/input';
import { SnackBarComponent } from '../../../components/snack-bar/snack-bar.component';
import { LoadingSpinnerComponent } from '../../../components/loading-spinner/loading-spinner.component';

@Component({
	selector: 'app-login',
	standalone: true,
	imports: [
		ReactiveFormsModule,
		CommonModule,
		RouterLink,
		LoadingSpinnerComponent,
		MatInputModule,
		SnackBarComponent
	],
	templateUrl: './login.component.html',
	styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
	
   protected form!: FormGroup;
	protected loading = false;
	protected type!: string;
	protected message!: string
	
	constructor(
		private authService: AuthenticationService,
		private router: Router,
	) { }
	
   ngOnInit(): void {
		this.form = new FormGroup<any>({
			email: new FormControl('', Validators.required),
			password: new FormControl('', Validators.required)
		})
	}
	
	onSubmit() {
		this.loading = true;
		const request: AuthRequest = this.form.value;
		
		this.authService.login({ body: request })
			.subscribe({
				next: () => {
					this.form.reset();
					this.router.navigate(['/books']).then();
					
				},
				error: (err) => {
					this.type = 'error'
					this.message = err.error.message;
				}
			});
		this.type = '';
		this.message = '';
		this.loading = false;
	}
}
