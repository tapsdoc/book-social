import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BookResponse } from '../../services/models/book-response';
import { StarRatingComponent } from '../star-rating/star-rating.component';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { BookService } from '../../services/services/book.service';
import { CreateBookComponent } from '../../pages/books/create-book/create-book.component';

@Component({
	selector: 'app-book-card',
	standalone: true,
	imports: [
		StarRatingComponent,
		CommonModule,
		CreateBookComponent,
		NgOptimizedImage
	],
	templateUrl: './book-card.component.html',
	styleUrl: './book-card.component.css'
})
export class BookCardComponent implements OnInit {
	
	@Input() book!: BookResponse;
	@Input() manage = false;
	@Output() borrow = new EventEmitter<BookResponse>();
	@Output() archive = new EventEmitter<BookResponse>();
	@Output() share = new EventEmitter<BookResponse>();
	protected showModal = false;
	
	constructor(private bookService: BookService) { }
	
	ngOnInit() {
	}
	
	get bookCover(): string {
		if (this.book.cover) {
			return this.book.cover;
		} else
			return 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';
	}
	
	onShowDetails() {
		console.log("Show Details!");
	}
	
	onBorrow() {
		this.borrow.emit(this.book);
	}
	
	onAddToWaitingList() {
		console.log("Waiting list!");
	}
	
	onEdit() {
		this.showModal = !this.showModal;
		this.bookService.edit.emit(this.book);
		this.toggle(this.showModal);
	}
	
	onArchive() {
		this.archive.emit(this.book);
	}
	
	onShare() {
		this.share.emit(this.book);
	}
	
	toggle(isOpen: boolean) {
		this.showModal = isOpen;
	}
}
