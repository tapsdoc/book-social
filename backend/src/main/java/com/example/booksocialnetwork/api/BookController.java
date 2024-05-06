package com.example.booksocialnetwork.api;

import com.example.booksocialnetwork.service.book.BookRequest;
import com.example.booksocialnetwork.service.book.BookResponse;
import com.example.booksocialnetwork.service.book.BookService;
import com.example.booksocialnetwork.service.book.BorrowedBookResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.validation.BindingResult;
import org.springframework.validation.ObjectError;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.stream.Collectors;

@RestController
@RequestMapping("books")
@RequiredArgsConstructor
@Tag(name = "Book")
public class BookController {
	
	private final BookService bookService;
	
	@PostMapping("/add")
	public ResponseEntity<?> addBook(
		@Valid @RequestBody BookRequest request,
		BindingResult bindingResult,
		Authentication user
	) throws Exception {
		
		if (bindingResult.hasErrors()) {
			return ResponseEntity.badRequest()
				.body(
					bindingResult.getAllErrors()
						.stream()
						.map(ObjectError::getDefaultMessage)
						.collect(Collectors.toSet())
				);
		}
		return ResponseEntity.ok(bookService.addBook(user, request));
	}
	
	@GetMapping("/list")
	public ResponseEntity<Page<BookResponse>> getAllBooks(
		Authentication connectedUser,
		@RequestParam(defaultValue = "0") int page
	) throws Exception {
		return ResponseEntity.ok(bookService.findAllBooks(connectedUser, page));
	}
	
	@GetMapping("/books-by-owner")
	public ResponseEntity<Page<BookResponse>> getAllBooksByOwner(
		Authentication connectedUser,
		@RequestParam(defaultValue = "0") int page
	) throws Exception {
		return ResponseEntity.ok(bookService.findAllBooksByOwner(connectedUser, page));
	}
	
	@GetMapping("/borrowed-books-by-owner")
	public ResponseEntity<Page<BorrowedBookResponse>> getAllBorrowedBooksByOwner(
		Authentication connectedUser,
		@RequestParam(defaultValue = "0") int page
	) {
		return ResponseEntity.ok(bookService.findAllBorrowedBooksByOwner(connectedUser, page));
	}
	
	@GetMapping("/returned-books-by-owner")
	public ResponseEntity<Page<BorrowedBookResponse>> getAllReturnedBooksByOwner(
		Authentication connectedUser,
		@RequestParam(defaultValue = "0") int page
	) {
		return ResponseEntity.ok(bookService.findAllReturnedBooksByOwner(connectedUser, page));
	}
	
	@PatchMapping("/archived/{bookId}")
	public ResponseEntity<Long> updateArchivedStatus(
		Authentication connectedUser,
		@PathVariable Long bookId
	) throws Exception {
		return ResponseEntity.ok(bookService.updateArchivedStatus(connectedUser, bookId));
	}
	
	@PatchMapping("/shareable/{bookId}")
	public ResponseEntity<Long> updateSharableStatus(
		Authentication connectedUser,
		@PathVariable Long bookId
	) throws Exception {
		return ResponseEntity.ok(bookService.updateSharableStatus(connectedUser, bookId));
	}
	
	@GetMapping("{id}")
	public ResponseEntity<BookResponse> findBook(@PathVariable Long id) {
		return ResponseEntity.ok(bookService.findBook(id));
	}
	
	@DeleteMapping("/delete/{id}")
	public ResponseEntity<?> delete(@PathVariable Long id) throws Exception {
		bookService.delete(id);
		return ResponseEntity.ok().build();
	}
	
	@PostMapping("borrow/{bookId}")
	public ResponseEntity<Long> borrow(
		Authentication connectedUser,
		@PathVariable Long bookId
	) throws Exception {
		return ResponseEntity.ok(bookService.borrow(connectedUser, bookId));
	}
	
	@PatchMapping("borrow/return/{bookId}")
	public ResponseEntity<Long> returnBorrowedBook(
		Authentication connectedUser,
		@PathVariable Long bookId
	) throws Exception {
		return ResponseEntity.ok(bookService.returnBorrowedBook(connectedUser, bookId));
	}
	
	@PatchMapping("borrow/approve-return/{bookId}")
	public ResponseEntity<Long> approveReturnBorrowedBook(
		Authentication connectedUser,
		@PathVariable Long bookId
	) throws Exception {
		return ResponseEntity.ok(bookService.approveReturnBorrowedBook(connectedUser, bookId));
	}
	
	@PostMapping(value = "/cover/{bookId}", consumes = { MediaType.MULTIPART_FORM_DATA_VALUE })
	public ResponseEntity<?> fileUpload(
		Authentication connectedUser,
		@PathVariable Long bookId,
		@RequestPart("file") MultipartFile file
	) throws Exception {
		bookService.fileUpload(connectedUser, bookId, file);
		return ResponseEntity.ok().build();
	}
}
