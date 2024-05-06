import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { BookCardComponent } from '../../../components/book-card/book-card.component';
import { LoadingSpinnerComponent } from '../../../components/loading-spinner/loading-spinner.component';
import { SnackBarComponent } from '../../../components/snack-bar/snack-bar.component';
import { BookResponse } from '../../../services/models/book-response';
import { BookService } from '../../../services/services/book.service';

@Component({
	selector: 'app-book-list',
	standalone: true,
	imports: [
		CommonModule,
		MatPaginatorModule,
		BookCardComponent,
		LoadingSpinnerComponent,
		SnackBarComponent
	],
	templateUrl: './book-list.component.html',
	styleUrl: './book-list.component.css'
})
export class BookListComponent implements OnInit, OnDestroy {
	
	protected books: BookResponse[] = [];
	
	protected message!: string;
	protected type!: string;
	protected loading = false;
	
	protected pageIndex = 0;
	pageSize = 0;
	protected totalPages = 0;
	protected totalElements = 0;
	
	@ViewChild(MatPaginator) paginator!: MatPaginator;
	private subs!: Subscription;
	
	constructor(private bookService: BookService) { }
	
	ngOnInit() {
		this.getBooks()
	}
	
	handlePageEvent(e: PageEvent) {
		this.pageIndex = e.pageIndex;
		this.pageSize = e.pageSize;
		this.getBooks();
	}
	
	private getBooks() {
		this.loading = true;
		this.subs = this.bookService.getAllBooks({ page: this.pageIndex })
			.subscribe({
				next: res => {
					this.books = res.content as BookResponse[];
					this.totalPages = res.totalPages as number;
					this.totalElements = res.totalElements as number;
					this.pageSize = res.size as number;
					this.type = 'success';
					this.message = 'Books loaded successfully.'
				},
				error: err => {
					this.type = 'error';
					this.message = err.error.message;
					
				},
				complete: () => {
					this.loading = false;
				}
			});
		this.type = '';
		this.message = '';
	}
	
	onBorrow(book: BookResponse) {
		this.bookService.borrow({ bookId: book.id as number })
			.subscribe({
				next: () => {
					this.type = 'success';
					this.message = "Book successfully added to your list."
				},
				error: err => {
					this.type = 'error';
					this.message = err.error.message;
				}
			});
		this.type = '';
		this.message = '';
	}
	
	ngOnDestroy() {
		this.subs.unsubscribe();
	}
}
