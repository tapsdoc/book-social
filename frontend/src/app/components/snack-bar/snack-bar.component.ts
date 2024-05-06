import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, inject, Inject, Input, NgZone, OnInit, PLATFORM_ID } from '@angular/core';
import { Dismiss, DismissInterface, DismissOptions, InstanceOptions } from 'flowbite';

@Component({
	selector: 'app-snack-bar',
	standalone: true,
	imports: [
		CommonModule
	],
	templateUrl: './snack-bar.component.html',
	styleUrl: './snack-bar.component.css'
})
export class SnackBarComponent implements OnInit {
	
	@Input() type = '';
	@Input() message = '';
	private ngZone = inject(NgZone);
	protected snackbarTypes: SnackbarType[] = [];
	
	constructor(
		@Inject(PLATFORM_ID) private platformId: Object
	) {
		this.snackbarTypes = snackbarTypes;
	}
	
	ngOnInit() {
		
		this.ngZone.runOutsideAngular(() => {
			if (isPlatformBrowser(this.platformId)) {
				this.toggle();
			}
		});
	}
	
	toggle() {
		setTimeout(() => {
			const elementId = this.type;
			const targetElement: HTMLElement | null = document.getElementById(elementId);
			
			if (targetElement) {
				const options: DismissOptions = {
					transition: 'transition-opacity',
					duration: 1000,
					timing: 'ease-out'
				};
				
				const instanceOptions: InstanceOptions = {
					id: elementId,
					override: true
				};
				
				const dismiss: DismissInterface = new Dismiss(targetElement, null, options, instanceOptions);
				dismiss.hide();
			}
		}, 2500);
	}
}

export interface SnackbarType {
	name: string;
	classes: string;
}

export const snackbarTypes: SnackbarType[] = [
	{
		name: 'info',
		classes: 'flex items-center p-4 mb-4 text-sm text-blue-800 border border-blue-300 rounded-lg bg-blue-50 dark:bg-gray-800 dark:text-blue-400 dark:border-blue-800'
	},
	{
		name: 'error',
		classes: 'flex items-center p-4 mb-4 text-sm text-red-800 border border-red-300 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400 dark:border-red-800'
	},
	{
		name: 'success',
		classes: 'flex items-center p-4 mb-4 text-sm text-green-800 border border-green-300 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400 dark:border-green-800'
	},
	{
		name: 'warn',
		classes: 'flex items-center p-4 mb-4 text-sm text-yellow-800 border border-yellow-300 rounded-lg bg-yellow-50 dark:bg-gray-800 dark:text-yellow-300 dark:border-yellow-800'
	}
];
