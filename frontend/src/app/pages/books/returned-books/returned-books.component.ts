import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookService } from '../../../services/services/book.service';
import { AddFeedbackComponent } from '../../feedback/add-feedback/add-feedback.component';
import { LoadingSpinnerComponent } from '../../../components/loading-spinner/loading-spinner.component';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { SnackBarComponent } from '../../../components/snack-bar/snack-bar.component';
import { StarRatingComponent } from '../../../components/star-rating/star-rating.component';
import { BorrowedBookResponse } from '../../../services/models/borrowed-book-response';
import { Subscription } from 'rxjs';

@Component({
	selector: 'app-returned-books',
	standalone: true,
	imports: [
		CommonModule,
		AddFeedbackComponent,
		LoadingSpinnerComponent,
		MatPaginator,
		SnackBarComponent,
		StarRatingComponent
	],
	templateUrl: './returned-books.component.html',
	styleUrl: './returned-books.component.css'
})
export class ReturnedBooksComponent implements OnInit, OnDestroy {
	
	protected books: BorrowedBookResponse[] = [];
	
	protected message!: string;
	protected type!: string;
	protected loading = false;
	
	protected pageIndex = 0;
	pageSize = 0;
	protected totalPages = 0;
	protected totalElements = 0;
	
	@ViewChild(MatPaginator) paginator!: MatPaginator;
	private subs!: Subscription;
	book!: BorrowedBookResponse;
	
	constructor(private bookService: BookService) { }
	
	ngOnInit() {
		this.getReturnedBooks()
	}
	
	handlePageEvent(e: PageEvent) {
		this.pageIndex = e.pageIndex;
		this.pageSize = e.pageSize;
		this.getReturnedBooks();
	}
	
	private getReturnedBooks() {
		this.loading = true;
		this.subs = this.bookService.getAllReturnedBooksByOwner({ page: this.pageIndex })
			.subscribe({
				next: res => {
					this.books = res.content as BorrowedBookResponse[];
					this.totalPages = res.totalPages as number;
					this.totalElements = res.totalElements as number;
					this.pageSize = res.size as number;
					this.type = 'success';
					this.message = 'Books loaded successfully.'
					console.log(this.books);
				},
				error: err => {
					this.type = 'error';
					this.message = err.error.message;
				}
			});
		this.type = '';
		this.message = '';
		this.loading = false;
	}
	
	ngOnDestroy() {
		this.subs.unsubscribe();
	}
	
	approveReturn(book: BorrowedBookResponse) {
		this.bookService.approveReturnBorrowedBook({ bookId: book.id as number })
			.subscribe({
				next: () => {
				
				},
				error: (err) => {
					console.log(err);
				}
			})
	}
}
