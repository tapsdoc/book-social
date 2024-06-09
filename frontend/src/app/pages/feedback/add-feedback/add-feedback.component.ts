import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { StarRatingComponent } from '../../../components/star-rating/star-rating.component';
import { BorrowedBookResponse } from '../../../services/models/borrowed-book-response';
import { BookService } from '../../../services/services/book.service';
import { FeedbackService } from '../../../services/services/feedback.service';

@Component({
	selector: 'app-add-feedback',
	standalone: true,
	imports: [
		CommonModule,
		ReactiveFormsModule,
		StarRatingComponent
	],
	templateUrl: './add-feedback.component.html',
	styleUrl: './add-feedback.component.css'
})
export class AddFeedbackComponent implements OnInit {
	
	protected form!: FormGroup;
	@Output() notify= new EventEmitter<{ type: string, message: string }>();
	
	@Input() book!: BorrowedBookResponse;
	@Input() isOpen= false;
	@Output() showModal= new EventEmitter<boolean>();
	
	constructor(
		private feedbackService: FeedbackService,
		private bookService: BookService,
	) { }
	
	ngOnInit() {
		this.form = new FormGroup({
			rating: new FormControl(0),
			comment: new FormControl('')
		});
	}
	
	onSubmit() {
		console.log(this.book.id);
		console.log(this.form.value.comment);
		console.log(this.form.value.rating);
		
		this.bookService.returnBorrowedBook({ bookId: this.book.id as number })
			.subscribe({
				next: () => {
					this.withFeedback();
				},
				error: err => {
					this.notify.emit({
						type: 'error',
						message: 'Failed to return book!'
					});
					console.log(err);
				}
		});
		this.toggle();
		this.form.reset();
		this.notify.emit({
			type: '',
			message: ''
		});
	}
	
	toggle(){
		this.showModal.emit(false);
	}
	
	onRate(rating: number) {
		this.form.get('rating')?.setValue(rating);
	}
	
	private withFeedback() {
		this.feedbackService.saveFeedback({
			body: {
				book: this.book.id as number,
				comment: this.form.value.comment,
				rating: this.form.value.rating
			}})
			.subscribe({
				next: () => {
					this.notify.emit({
						type: 'success',
						message: 'Thank you for your feedback. It\'s greatly appreciated.'
					});
				},
				error: err => {
					this.notify.emit({
						type: 'error',
						message: 'An error occurred!'
					});
					console.log(err);
				}
			});
	}
}
