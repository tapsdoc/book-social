import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { Subscription } from 'rxjs';
import { AddFeedbackComponent } from '../../feedback/add-feedback/add-feedback.component';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LoadingSpinnerComponent } from '../../../components/loading-spinner/loading-spinner.component';
import { SnackBarComponent } from '../../../components/snack-bar/snack-bar.component';
import { StarRatingComponent } from '../../../components/star-rating/star-rating.component';
import { BorrowedBookResponse } from '../../../services/models/borrowed-book-response';
import { BookService } from '../../../services/services/book.service';

@Component({
	selector: 'app-borrowed-books',
	standalone: true,
	imports: [
		MatPaginatorModule,
		CommonModule,
		LoadingSpinnerComponent,
		SnackBarComponent,
		StarRatingComponent,
		AddFeedbackComponent,
		RouterLink
	],
	templateUrl: './borrowed-books.component.html',
	styleUrl: './borrowed-books.component.css'
})
export class BorrowedBooksComponent implements OnInit, OnDestroy {
	
	protected books: BorrowedBookResponse[] = [];
	
	protected message!: string;
	protected type!: string;
	protected loading = false;
	protected showModal = false;
	
	protected pageIndex = 0;
	pageSize = 0;
	protected totalPages = 0;
	protected totalElements = 0;
	
	@ViewChild(MatPaginator) paginator!: MatPaginator;
	private subs!: Subscription;
	book!: BorrowedBookResponse;
	
	constructor(private bookService: BookService) {
	}
	
	ngOnInit() {
		this.getBorrowedBooks()
	}
	
	handlePageEvent(e: PageEvent) {
		this.pageIndex = e.pageIndex;
		this.pageSize = e.pageSize;
		this.getBorrowedBooks();
	}
	
	private getBorrowedBooks() {
		this.loading = true;
		this.subs = this.bookService.getAllBorrowedBooksByOwner({ page: this.pageIndex })
		.subscribe({
			next: res => {
				this.books = res.content as BorrowedBookResponse[];
				this.totalPages = res.totalPages as number;
				this.totalElements = res.totalElements as number;
				this.pageSize = res.size as number;
				this.type = 'success';
				this.message = 'Books loaded successfully.'
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
	
	onReturn(book: BorrowedBookResponse) {
		this.book = book;
		this.toggle(true)
	}
	
	toggle(isOpen: boolean) {
		this.showModal = isOpen;
	}
	
	ngOnDestroy() {
		this.subs.unsubscribe();
	}
	
	notify(notify: { type: string; message: string }) {
		this.type = notify.type;
		this.message = notify.message;
	}
}
