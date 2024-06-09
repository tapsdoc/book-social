import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { LoadingSpinnerComponent } from '../../../components/loading-spinner/loading-spinner.component';
import { SnackBarComponent } from '../../../components/snack-bar/snack-bar.component';
import { AuthenticationService } from '../../../services/services/authentication.service';
import { RegistrationRequest } from '../../../services/models/registration-request';

@Component({
	selector: 'app-signup',
	standalone: true,
	imports: [
		CommonModule,
		ReactiveFormsModule,
		RouterLink,
		LoadingSpinnerComponent,
		SnackBarComponent
	],
	templateUrl: './signup.component.html',
	styleUrl: './signup.component.css'
})
export class SignupComponent implements OnInit {
	
	protected form!: FormGroup;
	protected loading = false;
	protected message!: string;
	protected type!: string;
   
   constructor(
      private authService: AuthenticationService,
      private router: Router,
   ) {  }
	
	ngOnInit(): void {
		this.form = new FormGroup<any>({
			firstName: new FormControl('', [Validators.required]),
			lastName: new FormControl('', [Validators.required]),
			email: new FormControl('', [Validators.required, Validators.email]),
			password: new FormControl('', [
				Validators.required,
				Validators.minLength(8),
				Validators.pattern(/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/)
			]),
			confirmPassword: new FormControl('', [Validators.required]),
			confirm: new FormControl(false, [Validators.requiredTrue])
		}, { validators: this.passwordMatchValidator as ValidatorFn });
	}
	
	passwordMatchValidator(form: FormGroup) {
		const password = form.get('password') as AbstractControl;
		const confirmPassword = form.get('confirmPassword') as AbstractControl;
		
		if (password && confirmPassword && password.value !== confirmPassword.value) {
			confirmPassword.setErrors({ mismatch: true });
		} else {
			confirmPassword.setErrors(null);
		}
	}
	
	onSubmit() {
		this.loading = true;
		const request: RegistrationRequest = {
			firstName: this.form.value.firstName,
			lastName: this.form.value.lastName,
			email: this.form.value.email,
			password: this.form.value.password
		};
		
      this.authService.register({ body: request }).subscribe({
			next: () => {
				this.form.reset();
				this.router.navigate(['/activate-account']).then();
			},
	      error: (err) => {
		      this.type = 'error'
		      if (err.error.message == 'Failed to fetch')
			      this.message = 'An error occurred. Please try again';
		      else
			      this.message = err.error.message;
				console.log(err)
	      },
	      complete: () => {
		      this.loading = false;
	      }
		});
		this.type = '';
		this.message = '';
		this.loading = false
	}
}
