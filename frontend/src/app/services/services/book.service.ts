/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { BaseService } from '../base-service';
import { ApiConfiguration } from '../api-configuration';
import { StrictHttpResponse } from '../strict-http-response';

import { addBook } from '../fn/book/add-book';
import { AddBook$Params } from '../fn/book/add-book';
import { approveReturnBorrowedBook } from '../fn/book/approve-return-borrowed-book';
import { ApproveReturnBorrowedBook$Params } from '../fn/book/approve-return-borrowed-book';
import { BookResponse } from '../models/book-response';
import { borrow } from '../fn/book/borrow';
import { Borrow$Params } from '../fn/book/borrow';
import { delete1 } from '../fn/book/delete-1';
import { Delete1$Params } from '../fn/book/delete-1';
import { fileUpload } from '../fn/book/file-upload';
import { FileUpload$Params } from '../fn/book/file-upload';
import { findBook } from '../fn/book/find-book';
import { FindBook$Params } from '../fn/book/find-book';
import { getAllBooks } from '../fn/book/get-all-books';
import { GetAllBooks$Params } from '../fn/book/get-all-books';
import { getAllBooksByOwner } from '../fn/book/get-all-books-by-owner';
import { GetAllBooksByOwner$Params } from '../fn/book/get-all-books-by-owner';
import { getAllBorrowedBooksByOwner } from '../fn/book/get-all-borrowed-books-by-owner';
import { GetAllBorrowedBooksByOwner$Params } from '../fn/book/get-all-borrowed-books-by-owner';
import { getAllReturnedBooksByOwner } from '../fn/book/get-all-returned-books-by-owner';
import { GetAllReturnedBooksByOwner$Params } from '../fn/book/get-all-returned-books-by-owner';
import { PageBookResponse } from '../models/page-book-response';
import { PageBorrowedBookResponse } from '../models/page-borrowed-book-response';
import { returnBorrowedBook } from '../fn/book/return-borrowed-book';
import { ReturnBorrowedBook$Params } from '../fn/book/return-borrowed-book';
import { updateArchivedStatus } from '../fn/book/update-archived-status';
import { UpdateArchivedStatus$Params } from '../fn/book/update-archived-status';
import { updateSharableStatus } from '../fn/book/update-sharable-status';
import { UpdateSharableStatus$Params } from '../fn/book/update-sharable-status';

@Injectable({ providedIn: 'root' })
export class BookService extends BaseService {
	
	edit  = new EventEmitter<BookResponse>();
	
	constructor(config: ApiConfiguration, http: HttpClient) {
		super(config, http);
	}
	
	/** Path part for operation `fileUpload()` */
	static readonly FileUploadPath = '/books/cover/{bookId}';
	
	/**
	 * This method provides access to the full `HttpResponse`, allowing access to response headers.
	 * To access only the response body, use `fileUpload()` instead.
	 *
	 * This method sends `multipart/form-data` and handles request body of type `multipart/form-data`.
	 */
	fileUpload$Response(params: FileUpload$Params, context?: HttpContext): Observable<StrictHttpResponse<{}>> {
		return fileUpload(this.http, this.rootUrl, params, context);
	}
	
	/**
	 * This method provides access only to the response body.
	 * To access the full response (for headers, for example), `fileUpload$Response()` instead.
	 *
	 * This method sends `multipart/form-data` and handles request body of type `multipart/form-data`.
	 */
	fileUpload(params: FileUpload$Params, context?: HttpContext): Observable<{}> {
		return this.fileUpload$Response(params, context).pipe(
			map((r: StrictHttpResponse<{}>): {} => r.body)
		);
	}
	
	/** Path part for operation `borrow()` */
	static readonly BorrowPath = '/books/borrow/{bookId}';
	
	/**
	 * This method provides access to the full `HttpResponse`, allowing access to response headers.
	 * To access only the response body, use `borrow()` instead.
	 *
	 * This method doesn't expect any request body.
	 */
	borrow$Response(params: Borrow$Params, context?: HttpContext): Observable<StrictHttpResponse<number>> {
		return borrow(this.http, this.rootUrl, params, context);
	}
	
	/**
	 * This method provides access only to the response body.
	 * To access the full response (for headers, for example), `borrow$Response()` instead.
	 *
	 * This method doesn't expect any request body.
	 */
	borrow(params: Borrow$Params, context?: HttpContext): Observable<number> {
		return this.borrow$Response(params, context).pipe(
			map((r: StrictHttpResponse<number>): number => r.body)
		);
	}
	
	/** Path part for operation `addBook()` */
	static readonly AddBookPath = '/books/add';
	
	/**
	 * This method provides access to the full `HttpResponse`, allowing access to response headers.
	 * To access only the response body, use `addBook()` instead.
	 *
	 * This method sends `application/json` and handles request body of type `application/json`.
	 */
	addBook$Response(params: AddBook$Params, context?: HttpContext): Observable<StrictHttpResponse<{}>> {
		return addBook(this.http, this.rootUrl, params, context);
	}
	
	/**
	 * This method provides access only to the response body.
	 * To access the full response (for headers, for example), `addBook$Response()` instead.
	 *
	 * This method sends `application/json` and handles request body of type `application/json`.
	 */
	addBook(params: AddBook$Params, context?: HttpContext): Observable<any> {
		return this.addBook$Response(params, context).pipe(
			map((r: StrictHttpResponse<{}>): {} => r.body)
		);
	}
	
	/** Path part for operation `updateSharableStatus()` */
	static readonly UpdateSharableStatusPath = '/books/shareable/{bookId}';
	
	/**
	 * This method provides access to the full `HttpResponse`, allowing access to response headers.
	 * To access only the response body, use `updateSharableStatus()` instead.
	 *
	 * This method doesn't expect any request body.
	 */
	updateSharableStatus$Response(params: UpdateSharableStatus$Params, context?: HttpContext): Observable<StrictHttpResponse<number>> {
		return updateSharableStatus(this.http, this.rootUrl, params, context);
	}
	
	/**
	 * This method provides access only to the response body.
	 * To access the full response (for headers, for example), `updateSharableStatus$Response()` instead.
	 *
	 * This method doesn't expect any request body.
	 */
	updateSharableStatus(params: UpdateSharableStatus$Params, context?: HttpContext): Observable<number> {
		return this.updateSharableStatus$Response(params, context).pipe(
			map((r: StrictHttpResponse<number>): number => r.body)
		);
	}
	
	/** Path part for operation `returnBorrowedBook()` */
	static readonly ReturnBorrowedBookPath = '/books/borrow/return/{bookId}';
	
	/**
	 * This method provides access to the full `HttpResponse`, allowing access to response headers.
	 * To access only the response body, use `returnBorrowedBook()` instead.
	 *
	 * This method doesn't expect any request body.
	 */
	returnBorrowedBook$Response(params: ReturnBorrowedBook$Params, context?: HttpContext): Observable<StrictHttpResponse<number>> {
		return returnBorrowedBook(this.http, this.rootUrl, params, context);
	}
	
	/**
	 * This method provides access only to the response body.
	 * To access the full response (for headers, for example), `returnBorrowedBook$Response()` instead.
	 *
	 * This method doesn't expect any request body.
	 */
	returnBorrowedBook(params: ReturnBorrowedBook$Params, context?: HttpContext): Observable<number> {
		return this.returnBorrowedBook$Response(params, context).pipe(
			map((r: StrictHttpResponse<number>): number => r.body)
		);
	}
	
	/** Path part for operation `approveReturnBorrowedBook()` */
	static readonly ApproveReturnBorrowedBookPath = '/books/borrow/approve-return/{bookId}';
	
	/**
	 * This method provides access to the full `HttpResponse`, allowing access to response headers.
	 * To access only the response body, use `approveReturnBorrowedBook()` instead.
	 *
	 * This method doesn't expect any request body.
	 */
	approveReturnBorrowedBook$Response(params: ApproveReturnBorrowedBook$Params, context?: HttpContext): Observable<StrictHttpResponse<number>> {
		return approveReturnBorrowedBook(this.http, this.rootUrl, params, context);
	}
	
	/**
	 * This method provides access only to the response body.
	 * To access the full response (for headers, for example), `approveReturnBorrowedBook$Response()` instead.
	 *
	 * This method doesn't expect any request body.
	 */
	approveReturnBorrowedBook(params: ApproveReturnBorrowedBook$Params, context?: HttpContext): Observable<number> {
		return this.approveReturnBorrowedBook$Response(params, context).pipe(
			map((r: StrictHttpResponse<number>): number => r.body)
		);
	}
	
	/** Path part for operation `updateArchivedStatus()` */
	static readonly UpdateArchivedStatusPath = '/books/archived/{bookId}';
	
	/**
	 * This method provides access to the full `HttpResponse`, allowing access to response headers.
	 * To access only the response body, use `updateArchivedStatus()` instead.
	 *
	 * This method doesn't expect any request body.
	 */
	updateArchivedStatus$Response(params: UpdateArchivedStatus$Params, context?: HttpContext): Observable<StrictHttpResponse<number>> {
		return updateArchivedStatus(this.http, this.rootUrl, params, context);
	}
	
	/**
	 * This method provides access only to the response body.
	 * To access the full response (for headers, for example), `updateArchivedStatus$Response()` instead.
	 *
	 * This method doesn't expect any request body.
	 */
	updateArchivedStatus(params: UpdateArchivedStatus$Params, context?: HttpContext): Observable<number> {
		return this.updateArchivedStatus$Response(params, context).pipe(
			map((r: StrictHttpResponse<number>): number => r.body)
		);
	}
	
	/** Path part for operation `findBook()` */
	static readonly FindBookPath = '/books/{id}';
	
	/**
	 * This method provides access to the full `HttpResponse`, allowing access to response headers.
	 * To access only the response body, use `findBook()` instead.
	 *
	 * This method doesn't expect any request body.
	 */
	findBook$Response(params: FindBook$Params, context?: HttpContext): Observable<StrictHttpResponse<BookResponse>> {
		return findBook(this.http, this.rootUrl, params, context);
	}
	
	/**
	 * This method provides access only to the response body.
	 * To access the full response (for headers, for example), `findBook$Response()` instead.
	 *
	 * This method doesn't expect any request body.
	 */
	findBook(params: FindBook$Params, context?: HttpContext): Observable<BookResponse> {
		return this.findBook$Response(params, context).pipe(
			map((r: StrictHttpResponse<BookResponse>): BookResponse => r.body)
		);
	}
	
	/** Path part for operation `getAllReturnedBooksByOwner()` */
	static readonly GetAllReturnedBooksByOwnerPath = '/books/returned-books-by-owner';
	
	/**
	 * This method provides access to the full `HttpResponse`, allowing access to response headers.
	 * To access only the response body, use `getAllReturnedBooksByOwner()` instead.
	 *
	 * This method doesn't expect any request body.
	 */
	getAllReturnedBooksByOwner$Response(params?: GetAllReturnedBooksByOwner$Params, context?: HttpContext): Observable<StrictHttpResponse<PageBorrowedBookResponse>> {
		return getAllReturnedBooksByOwner(this.http, this.rootUrl, params, context);
	}
	
	/**
	 * This method provides access only to the response body.
	 * To access the full response (for headers, for example), `getAllReturnedBooksByOwner$Response()` instead.
	 *
	 * This method doesn't expect any request body.
	 */
	getAllReturnedBooksByOwner(params?: GetAllReturnedBooksByOwner$Params, context?: HttpContext): Observable<PageBorrowedBookResponse> {
		return this.getAllReturnedBooksByOwner$Response(params, context).pipe(
			map((r: StrictHttpResponse<PageBorrowedBookResponse>): PageBorrowedBookResponse => r.body)
		);
	}
	
	/** Path part for operation `getAllBooks()` */
	static readonly GetAllBooksPath = '/books/list';
	
	/**
	 * This method provides access to the full `HttpResponse`, allowing access to response headers.
	 * To access only the response body, use `getAllBooks()` instead.
	 *
	 * This method doesn't expect any request body.
	 */
	getAllBooks$Response(params?: GetAllBooks$Params, context?: HttpContext): Observable<StrictHttpResponse<PageBookResponse>> {
		return getAllBooks(this.http, this.rootUrl, params, context);
	}
	
	/**
	 * This method provides access only to the response body.
	 * To access the full response (for headers, for example), `getAllBooks$Response()` instead.
	 *
	 * This method doesn't expect any request body.
	 */
	getAllBooks(params?: GetAllBooks$Params, context?: HttpContext): Observable<PageBookResponse> {
		return this.getAllBooks$Response(params, context).pipe(
			map((r: StrictHttpResponse<PageBookResponse>): PageBookResponse => r.body)
		);
	}
	
	/** Path part for operation `getAllBorrowedBooksByOwner()` */
	static readonly GetAllBorrowedBooksByOwnerPath = '/books/borrowed-books-by-owner';
	
	/**
	 * This method provides access to the full `HttpResponse`, allowing access to response headers.
	 * To access only the response body, use `getAllBorrowedBooksByOwner()` instead.
	 *
	 * This method doesn't expect any request body.
	 */
	getAllBorrowedBooksByOwner$Response(params?: GetAllBorrowedBooksByOwner$Params, context?: HttpContext): Observable<StrictHttpResponse<PageBorrowedBookResponse>> {
		return getAllBorrowedBooksByOwner(this.http, this.rootUrl, params, context);
	}
	
	/**
	 * This method provides access only to the response body.
	 * To access the full response (for headers, for example), `getAllBorrowedBooksByOwner$Response()` instead.
	 *
	 * This method doesn't expect any request body.
	 */
	getAllBorrowedBooksByOwner(params?: GetAllBorrowedBooksByOwner$Params, context?: HttpContext): Observable<PageBorrowedBookResponse> {
		return this.getAllBorrowedBooksByOwner$Response(params, context).pipe(
			map((r: StrictHttpResponse<PageBorrowedBookResponse>): PageBorrowedBookResponse => r.body)
		);
	}
	
	/** Path part for operation `getAllBooksByOwner()` */
	static readonly GetAllBooksByOwnerPath = '/books/books-by-owner';
	
	/**
	 * This method provides access to the full `HttpResponse`, allowing access to response headers.
	 * To access only the response body, use `getAllBooksByOwner()` instead.
	 *
	 * This method doesn't expect any request body.
	 */
	getAllBooksByOwner$Response(params?: GetAllBooksByOwner$Params, context?: HttpContext): Observable<StrictHttpResponse<PageBookResponse>> {
		return getAllBooksByOwner(this.http, this.rootUrl, params, context);
	}
	
	/**
	 * This method provides access only to the response body.
	 * To access the full response (for headers, for example), `getAllBooksByOwner$Response()` instead.
	 *
	 * This method doesn't expect any request body.
	 */
	getAllBooksByOwner(params?: GetAllBooksByOwner$Params, context?: HttpContext): Observable<PageBookResponse> {
		return this.getAllBooksByOwner$Response(params, context).pipe(
			map((r: StrictHttpResponse<PageBookResponse>): PageBookResponse => r.body)
		);
	}
	
	/** Path part for operation `delete1()` */
	static readonly Delete1Path = '/books/delete/{id}';
	
	/**
	 * This method provides access to the full `HttpResponse`, allowing access to response headers.
	 * To access only the response body, use `delete1()` instead.
	 *
	 * This method doesn't expect any request body.
	 */
	delete1$Response(params: Delete1$Params, context?: HttpContext): Observable<StrictHttpResponse<{}>> {
		return delete1(this.http, this.rootUrl, params, context);
	}
	
	/**
	 * This method provides access only to the response body.
	 * To access the full response (for headers, for example), `delete1$Response()` instead.
	 *
	 * This method doesn't expect any request body.
	 */
	delete1(params: Delete1$Params, context?: HttpContext): Observable<{}> {
		return this.delete1$Response(params, context).pipe(
			map((r: StrictHttpResponse<{}>): {} => r.body)
		);
	}
	
}
