import { Routes } from '@angular/router';
import { BooksComponent } from './books.component';
import { authGuard } from '../../shared/guards/auth.guard';

export const BOOK_ROUTES: Routes = [
	{
		path: '',
		component: BooksComponent,
		canActivate: [authGuard],
		children: [
			{ path: '', redirectTo: 'list', pathMatch: 'full' },
			{
				path: 'list',
				loadComponent: () => import('./book-list/book-list.component')
				.then(m => m.BookListComponent)
			},
			{
				path: 'my-books',
				loadComponent: () => import('./my-books/my-books.component')
				.then(m => m.MyBooksComponent)
			},
			{
				path: 'borrowed',
				loadComponent: () => import('./borrowed-books/borrowed-books.component')
				.then(m => m.BorrowedBooksComponent)
			},
			{
				path: 'edit/:id',
				loadComponent: () => import('./create-book/create-book.component')
				.then(m => m.CreateBookComponent)
			},
			{
				path: 'returned',
				loadComponent: () => import('./returned-books/returned-books.component')
				.then(m => m.ReturnedBooksComponent)
			},
			{
				path: 'waiting-list',
				loadComponent: () => import('./waiting-list/waiting-list.component')
				.then(m => m.WaitingListComponent)
			}
		]
	},
]