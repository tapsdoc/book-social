import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons'

@Component({
	selector: 'app-star-rating',
	standalone: true,
	imports: [
		CommonModule,
		FontAwesomeModule
	],
	templateUrl: './star-rating.component.html',
	styleUrl: './star-rating.component.css'
})
export class StarRatingComponent {
	
	faStar = faStar;
	@Input() rating!: number;
	@Output() rate = new EventEmitter<number>();
	@Input() readonly: boolean = false;
	
	setRating(rating: number) {
		if (this.readonly)
			return;
		this.rating = rating;
		this.rate.emit(rating);
	}
}
