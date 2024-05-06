import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../components/header/header.component';

@Component({
  selector: 'app-books',
  standalone: true,
	imports: [
		RouterOutlet,
		CommonModule,
		HeaderComponent
	],
  templateUrl: './books.component.html',
  styleUrl: './books.component.css'
})
export class BooksComponent implements OnInit {
	
	constructor() {
	}

	ngOnInit() {
	}
}
