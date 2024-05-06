import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookService } from '../../../services/services/book.service';

@Component({
	selector: 'app-returned-books',
	standalone: true,
	imports: [
		CommonModule
	],
	templateUrl: './returned-books.component.html',
	styleUrl: './returned-books.component.css'
})
export class ReturnedBooksComponent implements OnInit, OnDestroy {
	
	constructor(private bookService: BookService) {}
	
	ngOnInit() {
	}
	
	ngOnDestroy() {
	}
}
