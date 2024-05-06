package com.example.booksocialnetwork.service.book;

import com.example.booksocialnetwork.domain.Book;
import com.example.booksocialnetwork.exception.OperationNotPermittedException;
import org.springframework.data.domain.Page;
import org.springframework.security.core.Authentication;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface BookService {
	
	BookResponse addBook(Authentication connectedUser, BookRequest request) throws Exception;
	BookResponse findBook(Long id);
	List<Book> findAllBooks(Authentication connectedUser);
	Page<BookResponse> findAllBooks(Authentication connectedUser, int page) throws Exception;
	Page<BookResponse> findAllBooksByOwner(Authentication connectedUser, int page) throws Exception;
	Page<BorrowedBookResponse> findAllBorrowedBooksByOwner(Authentication connectedUser, int page);
	Page<BorrowedBookResponse> findAllReturnedBooksByOwner(Authentication connectedUser, int page);
	void delete(Long id) throws Exception;
	void fileUpload(Authentication connectedUser, Long id, MultipartFile file) throws Exception;
	Long updateSharableStatus(Authentication connectedUser, Long bookId) throws Exception;
	Long updateArchivedStatus(Authentication connectedUser, Long bookId) throws Exception;
	Long borrow(Authentication connectedUser, Long bookId) throws Exception;
	Long returnBorrowedBook(Authentication connectedUser, Long bookId) throws Exception;
	Long approveReturnBorrowedBook(Authentication connectedUser, Long bookId) throws Exception;
}
