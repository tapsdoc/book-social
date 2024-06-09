import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SnackBarComponent } from '../../../components/snack-bar/snack-bar.component';
import { BookResponse } from '../../../services/models/book-response';
import { Subscription } from 'rxjs';
import { BookService } from '../../../services/services/book.service';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
	selector: 'app-create-book',
	standalone: true,
	imports: [
		ReactiveFormsModule,
		CommonModule,
		SnackBarComponent,
		MatFormFieldModule
	],
	templateUrl: './create-book.component.html',
	styleUrl: './create-book.component.css'
})
export class CreateBookComponent implements OnInit, OnDestroy {
	
	protected message!: string;
	protected type!: string;
	protected picture!: string;
	protected selectedFile: any;
	protected form!: FormGroup;
	@Input() editMode= false;
	
	@Input() isOpen= false;
	@Output() showModal= new EventEmitter<boolean>();
	
	book!: BookResponse;
	private subs!: Subscription;
	
	constructor(
		private bookService: BookService,
		private fb: FormBuilder
	) { }
	
	ngOnInit(): void {
		this.subs = this.bookService.edit
			.subscribe({
				next: (book: BookResponse) => {
					this.book = book;
					this.editMode = this.book != null;
					this.initForm();
					
					if (book.cover != null)
						this.picture = book.cover;
				}
			});
		this.initForm();
	}
	
	onFileSelected(event: Event) {
		const inputElement= event.target as HTMLInputElement;
		if (inputElement.files && inputElement.files.length > 0) {
			this.selectedFile = inputElement.files[0];
			
			if (this.selectedFile) {
				const reader= new FileReader();
				reader.onload = ()=> {
					this.picture = reader.result as string;
				}
				reader.readAsDataURL(this.selectedFile);
			}
		}
	}
	
	onSubmit() {
		
		if (this.editMode) {
			this.bookService.updateSharableStatus({ bookId: this.book.id as number })
				.subscribe({
					next: () => {
						this.book.sharable = !this.book.sharable;
						if (this.selectedFile) {
							this.bookService.fileUpload({
								bookId: this.book.id as number,
								body: {
									file: this.selectedFile
								}
							}).subscribe();
						}
					},
				error: err => {
					this.type = 'error'
					this.message = err.error.message;
					console.log(err);
				}
			});
		} else {
			this.bookService.addBook({ body: this.form.value })
				.subscribe({
					next: (book) => {
						this.form.reset();
						this.editMode = false;
						this.type = 'success';
						this.message = 'Book added successfully';
						
						if (this.selectedFile) {
							this.bookService.fileUpload({
								bookId: book.id as number,
								body: {
									file: this.selectedFile
								}
							}).subscribe();
						}
					},
					error: err => {
						this.editMode = false;
						this.type = 'error';
						this.message = "An error occurred!";
						console.log(err);
					}
				});
		}
		
		this.type = '';
		this.message = '';
		this.toggle();
	}
	
	private initForm() {
		if (!this.editMode) {
			this.form = this.fb.group({
				title: new FormControl('', Validators.required),
				author: new FormControl('', Validators.required),
				isbn: new FormControl('', Validators.required),
				synopsis: new FormControl('', Validators.required),
				sharable: new FormControl(false, Validators.required)
			});
		} else {
			this.form = this.fb.group({
				title: new FormControl(this.book.title, Validators.required),
				author: new FormControl(this.book.author, Validators.required),
				isbn: new FormControl(this.book.isbn, Validators.required),
				synopsis: new FormControl(this.book.synopsis, Validators.required),
				sharable: new FormControl(this.book.sharable)
			});
		}
	}
	
	onClose() {
		this.editMode = false;
		this.toggle();
		this.form.reset();
	}
	
	toggle(){
		this.showModal.emit(false);
	}
	
	ngOnDestroy(){
		this.subs.unsubscribe();
	}
}
