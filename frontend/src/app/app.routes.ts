import { Routes } from '@angular/router';
import { NotFoundComponent } from './components/not-found/not-found.component';

export const routes: Routes = [
	{
		path: '',
		loadChildren: () => import('./pages/auth/auth.routes')
		.then(m => m.AUTH_ROUTES)
	},
	{
		path: 'books',
		loadChildren: () => import('./pages/books/book.routes')
		.then(m => m.BOOK_ROUTES)
	},
	{ path: '**', component: NotFoundComponent },
];