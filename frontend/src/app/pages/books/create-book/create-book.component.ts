import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SnackBarComponent } from '../../../components/snack-bar/snack-bar.component';
import { BookResponse } from '../../../services/models/book-response';
import { Subscription } from 'rxjs';
import { BookService } from '../../../services/services/book.service';

@Component({
	selector: 'app-create-book',
	standalone: true,
	imports: [
		ReactiveFormsModule,
		CommonModule,
		SnackBarComponent
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
	@Input() editMode = false;
	
	@Input() isOpen = false;
	@Output() showModal = new EventEmitter<boolean>();
	
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
		console.log(this.editMode);
		this.initForm();
	}
	
	onFileSelected(event: Event) {
		const inputElement = event.target as HTMLInputElement;
		if (inputElement.files && inputElement.files.length > 0) {
			this.selectedFile = inputElement.files[0];
			
			if (this.selectedFile) {
				const reader = new FileReader();
				reader.onload = () => {
					this.picture = reader.result as string;
				}
				reader.readAsDataURL(this.selectedFile);
			}
		}
	}
	
	onSubmit() {
		this.bookService.addBook({ body: this.form.value })
			.subscribe({
				next: (book) => {
					this.form.reset();
					this.editMode = false;
					this.bookService.fileUpload({
						bookId: book.id as number,
						body: {
							file: this.selectedFile
						}
					})
					.subscribe({
						next: () => {
							this.type = 'success';
							this.message = 'File uploaded successfully';
						},
						error: err => {
							this.type = 'error';
							this.message = err.error.message;
							console.log(err);
						}
					})
				},
				error: err => {
					this.editMode = false;
					this.type = 'error';
					this.message = err.error.message;
					console.log(err);
				}
			});
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
		console.log(this.editMode);
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
