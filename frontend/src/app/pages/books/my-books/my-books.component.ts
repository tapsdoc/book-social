import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { AddFeedbackComponent } from '../../feedback/add-feedback/add-feedback.component';
import { BookCardComponent } from '../../../components/book-card/book-card.component';
import { LoadingSpinnerComponent } from '../../../components/loading-spinner/loading-spinner.component';
import { CreateBookComponent } from '../create-book/create-book.component';
import { SnackBarComponent } from '../../../components/snack-bar/snack-bar.component';
import { BookResponse } from '../../../services/models/book-response';
import { Subscription } from 'rxjs';
import { BookService } from '../../../services/services/book.service';

@Component({
	selector: 'app-my-books',
	standalone: true,
	imports: [
		CommonModule,
		MatPaginatorModule,
		BookCardComponent,
		LoadingSpinnerComponent,
		CreateBookComponent,
		SnackBarComponent,
		AddFeedbackComponent
	],
	templateUrl: './my-books.component.html',
	styleUrl: './my-books.component.css'
})
export class MyBooksComponent implements OnInit, OnDestroy {
	
	protected books: BookResponse[] = [];
	protected message = '';
	protected type = '';
	protected loading = false;
	protected showModal = false;
	
	protected pageIndex = 0;
	protected pageSize = 0;
	protected totalPages = 0;
	protected totalElements = 0;
	
	@ViewChild(MatPaginator) paginator!: MatPaginator;
	private subs!: Subscription;
	
	constructor(private bookService: BookService) { }
	
	ngOnInit() {
		this.getAllBooksByOwner()
	}
	
	handlePageEvent(e: PageEvent) {
		this.pageIndex = e.pageIndex;
		this.pageSize = e.pageSize;
		this.getAllBooksByOwner();
	}
	
	toggle(isOpen: boolean) {
		this.showModal = isOpen;
	}
	
	onArchiveBook(book: BookResponse) {
		this.bookService.updateArchivedStatus({ bookId: book.id as number })
		.subscribe({
			next: () => {
				book.archived = !book.archived;
				this.type = 'success';
				this.message = 'Book archived!';
			},
			error: err => {
				this.type = 'error'
				this.message = err.error.message;
			},
		});
		this.type = '';
		this.message = '';
	}
	
	onShare(book: BookResponse) {
		this.bookService.updateSharableStatus({ bookId: book.id as number })
			.subscribe({
				next: () => {
					book.sharable = !book.sharable;
					this.message = 'Book shared!';
				},
				error: err => {
					this.type = 'error'
					this.message = err.error.message;
				}
			});
		this.type = '';
		this.message = '';
	}
	
	onReload() {
		this.getAllBooksByOwner();
	}
	
	private getAllBooksByOwner() {
		this.loading = true;
		this.subs = this.bookService.getAllBooksByOwner({ page: this.pageIndex })
			.subscribe({
				next: res => {
					this.books = res.content as BookResponse[];
					this.totalPages = res.totalPages as number;
					this.totalElements = res.totalElements as number;
					this.pageSize = res.size as number;
					this.type = 'success';
					this.message = 'Books loaded successfully!';
					
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
	
	ngOnDestroy() {
		this.subs.unsubscribe();
	}
}
