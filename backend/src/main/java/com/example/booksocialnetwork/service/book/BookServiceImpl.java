package com.example.booksocialnetwork.service.book;

import com.example.booksocialnetwork.domain.Book;
import com.example.booksocialnetwork.domain.BookTransactionHistory;
import com.example.booksocialnetwork.domain.User;
import com.example.booksocialnetwork.exception.OperationNotPermittedException;
import com.example.booksocialnetwork.service.files.FileUploadService;
import com.example.booksocialnetwork.repository.BookRepository;
import com.example.booksocialnetwork.repository.BookTransactionHistoryRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class BookServiceImpl implements BookService {
	
	private final BookRepository bookRepository;
	private final BookTransactionHistoryRepository historyRepository;
	private final FileUploadService uploadService;
	
	@Override
	public BookResponse addBook(Authentication connectedUser, BookRequest request) {
		
		User user = ((User) connectedUser.getPrincipal());
		Book book = Book.builder()
			.title(request.title())
			.author(request.author())
			.synopsis(request.synopsis())
			.isbn(request.isbn())
			.archived(false)
			.user(user)
			.shareable(request.sharable())
			.build();
		var savedBook = bookRepository.save(book);
		return getBookResponse(savedBook);
	}
	
	@Override
	public BookResponse findBook(Long id) {
		return bookRepository.findById(id)
			.map(this::getBookResponse)
			.orElseThrow(() -> new EntityNotFoundException("Book not found"));
	}
	
	@Override
	public List<Book> findAllBooks(Authentication connectedUser) {
		return bookRepository.findAll();
	}
	
	@Override
	public Page<BookResponse> findAllBooks(Authentication connectedUser, int page) throws Exception {
		Pageable request = PageRequest.of(
			page,
			4,
			Sort.by("createdAt").descending()
		);
		
		Page<Book> books = bookRepository.findAll(request);
		return getBookResponses(books);
	}
	
	@Override
	public Page<BookResponse> findAllBooksByOwner(Authentication connectedUser, int page) throws Exception {
		
		User user = ((User) connectedUser.getPrincipal());
		Pageable pageable = PageRequest.of(
			page,
			4,
			Sort.by("createdAt").descending()
		);
		Page<Book> books = bookRepository.findAll(BookSpecification.withOwner(user.getId()), pageable);
		return getBookResponses(books);
	}
	
	@Override
	public Page<BorrowedBookResponse> findAllBorrowedBooksByOwner(Authentication connectedUser, int page) {
		
		User user = ((User) connectedUser.getPrincipal());
		Pageable pageable = PageRequest.of(
			page,
			10,
			Sort.by("createdAt").descending()
		);
		
		Page<BookTransactionHistory> allBorrowedBooks = historyRepository.findAllBorrowedBooks(pageable, user.getId());
		return allBorrowedBooks.map(this::getBorrowedBookResponse);
	}
	
	@Override
	public Page<BorrowedBookResponse> findAllReturnedBooksByOwner(Authentication connectedUser, int page) {
		
		User user = ((User) connectedUser.getPrincipal());
		Pageable pageable = PageRequest.of(
			page,
			10,
			Sort.by("createdAt").descending()
		);
		
		Page<BookTransactionHistory> allBorrowedBooks = historyRepository.findAllReturnedBooks(pageable, user.getId());
		return allBorrowedBooks.map(this::getBorrowedBookResponse);
	}
	
	@Override
	public void delete(Long id) throws Exception {
		var book = getBook(id);
		bookRepository.delete(book);
	}
	
	@Override
	public void fileUpload(Authentication connectedUser, Long bookId, MultipartFile file) throws Exception {
		
		var book = getBook(bookId);
		User user = ((User) connectedUser.getPrincipal());
		
		var bookCover = uploadService.upload(user.getId(), bookId, file);
		book.setImageUrl(bookCover);
		bookRepository.save(book);
	}
	
	@Override
	public Long updateSharableStatus(Authentication connectedUser, Long bookId) throws Exception {
		var book = getBook(bookId);
		User user = ((User) connectedUser.getPrincipal());
		if (!Objects.equals(book.getUser().getId(), user.getId())) {
			throw new OperationNotPermittedException("You cannot update others books shareable status");
		}
		book.setShareable(!book.isShareable());
		bookRepository.save(book);
		return bookId;
	}
	
	@Override
	public Long updateArchivedStatus(Authentication connectedUser, Long bookId) throws Exception {
		
		var book = getBook(bookId);
		User user = ((User) connectedUser.getPrincipal());
		
		if (!Objects.equals(book.getUser().getId(), user.getId())) {
			throw new OperationNotPermittedException("You cannot update others books archived status");
		}
		book.setArchived(!book.isArchived());
		bookRepository.save(book);
		return bookId;
	}
	
	@Override
	public Long borrow(Authentication connectedUser, Long bookId) throws Exception {
		
		var book = getBook(bookId);
		
		if (book.isArchived() || !book.isShareable())
			throw new OperationNotPermittedException("Book cannot be borrowed");
		
		User user = ((User) connectedUser.getPrincipal());
		if (Objects.equals(book.getUser().getId(), user.getId()))
			throw new OperationNotPermittedException("You cannot borrow your own book");
		
		final boolean alreadyBorrowed = historyRepository.isAlreadyBorrowed(bookId, user.getId());
		if (alreadyBorrowed) {
			throw new OperationNotPermittedException("The requested book is already borrowed");
		}
		
		var transactionHistory = BookTransactionHistory.builder()
			.user(user)
			.book(book)
			.returned(false)
			.returnApproved(false)
			.build();
		
		return historyRepository.save(transactionHistory).getId();
	}
	
	@Override
	public Long returnBorrowedBook(Authentication connectedUser, Long bookId) throws Exception {
		
		var book = getBook(bookId);
		if (book.isArchived() || !book.isShareable())
			throw new OperationNotPermittedException("Book is already returned");
		
		User user = ((User) connectedUser.getPrincipal());
		if (Objects.equals(book.getUser().getId(), user.getId()))
			throw new OperationNotPermittedException("You cannot return your own book");
		
		var transactionHistory = historyRepository.findByBookAndUser(bookId, user.getId())
			.orElseThrow(() -> new OperationNotPermittedException("You did not borrow this book"));
		transactionHistory.setReturned(true);
		return historyRepository.save(transactionHistory).getId();
	}
	
	@Override
	public Long approveReturnBorrowedBook(Authentication connectedUser, Long bookId) throws Exception {
		var book = getBook(bookId);
		
		if (book.isArchived() || !book.isShareable())
			throw new OperationNotPermittedException("Book is already returned");
		
		User user = ((User) connectedUser.getPrincipal());
		if (Objects.equals(book.getUser().getId(), user.getId()))
			throw new OperationNotPermittedException("You cannot return your own book");
		
		var transactionHistory = historyRepository.findByBookAndOwner(bookId, user.getId())
			.orElseThrow(() -> new OperationNotPermittedException("The book has not been returned"));
		transactionHistory.setReturnApproved(true);
		return historyRepository.save(transactionHistory).getId();
	}
	
	private Book getBook(Long id) throws Exception {
		var book = bookRepository.findById(id)
			.orElseThrow(() -> new EntityNotFoundException("Book not found"));
		var image = uploadService.getFileObject(book.getImageUrl());
		book.setImageUrl(image);
		return book;
	}
	
	private BookResponse getBookResponse(Book book) {
		return BookResponse.builder()
			.id(book.getId())
			.title(book.getTitle())
			.author(book.getAuthor())
			.isbn(book.getIsbn())
			.owner(book.getUser().getFullName())
			.cover(book.getImageUrl())
			.synopsis(book.getSynopsis())
			.sharable(book.isShareable())
			.archived(book.isArchived())
			.build();
	}
	
	private Page<BookResponse> getBookResponses(Page<Book> books) throws Exception {
		for (var book: books) {
			if (book.getImageUrl() != null) {
				var image = uploadService.getFileObject(book.getImageUrl());
				book.setImageUrl(image);
			} else {
				book.setImageUrl(null);
			}
		}
		return books.map(this::getBookResponse);
	}
	
	private BorrowedBookResponse getBorrowedBookResponse(BookTransactionHistory history) {
		return BorrowedBookResponse.builder()
			.id(history.getBook().getId())
			.title(history.getBook().getTitle())
			.author(history.getBook().getAuthor())
			.isbn(history.getBook().getIsbn())
			.rate(history.getBook().getRate())
			.returned(history.isReturned())
			.returnApproved(history.isReturnApproved())
			.build();
	}
}
