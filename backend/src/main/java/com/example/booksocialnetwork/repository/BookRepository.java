package com.example.booksocialnetwork.repository;

import com.example.booksocialnetwork.domain.Book;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface BookRepository extends JpaRepository<Book, Long>, JpaSpecificationExecutor<Book> {
	
	Optional<Book> findByIsbn(String isbn);
	
	@Query("""
			SELECT book
			FROM Book book
			WHERE book.archived = false
			AND book.shareable = true
			AND book.user.id != :userId
		""")
	Page<Book> findAllDisplayableBooks(Pageable pageable, Long userId);
}
