import { ApplicationRef, Component, inject, NgZone, OnInit, ɵglobal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { initFlowbite } from 'flowbite';
import { AuthenticationService } from './services/services/authentication.service';

@Component({
	selector: 'app-root',
	standalone: true,
	imports: [RouterOutlet],
	templateUrl: './app.component.html',
	styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
	
	title = 'book-social';
	private ngZone = inject(NgZone);
	private service = inject(AuthenticationService);
	
	constructor() {
		const ngZone = ɵglobal.Zone;
		const TaskTrackingZone = ngZone.current._parent?._properties?.TaskTrackingZone;
		
		if(!TaskTrackingZone) {
			return;
		}
		
		inject(ApplicationRef).isStable.subscribe(stable => {
			this.printNgZone(TaskTrackingZone, 0);
			console.log('Is stable:', stable);
		});
		
		this.printNgZone(TaskTrackingZone, 2000);
	}
	
	ngOnInit() {
		this.service.autoLogin();
	}
	
	private printNgZone(zone: any, delay: number): void {
		this.ngZone.runOutsideAngular(() => {
			initFlowbite();
		});
	}
}
