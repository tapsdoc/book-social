package com.example.booksocialnetwork.repository;

import com.example.booksocialnetwork.domain.BookTransactionHistory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface BookTransactionHistoryRepository extends JpaRepository<BookTransactionHistory, Long> {
	
	@Query("""
		SELECT history
		FROM BookTransactionHistory history
		WHERE history.user.id = :userId
		""")
	Page<BookTransactionHistory> findAllBorrowedBooks(Pageable pageable, Long userId);
	
	@Query("""
		SELECT history
		FROM BookTransactionHistory history
		WHERE history.book.user.id = :userId
		AND history.returned = true
		""")
	Page<BookTransactionHistory> findAllReturnedBooks(Pageable pageable, Long userId);
	
	@Query("""
		SELECT (COUNT(*) > 0) AS isborrowed
		FROM BookTransactionHistory history
		WHERE history.user.id = :userId
		AND history.book.id = :bookId
		AND history.returnApproved = false
		""")
	boolean isAlreadyBorrowed(Long bookId, Long userId);
	
	@Query("""
		SELECT transaction
		FROM BookTransactionHistory transaction
		WHERE transaction.user.id = :userId
		AND transaction.book.id = :bookId
		AND transaction.returned = false
		AND transaction.returnApproved = false
		""")
	Optional<BookTransactionHistory> findByBookAndUser(Long bookId, Long userId);
	
	@Query("""
		SELECT transaction
		FROM BookTransactionHistory transaction
		WHERE  transaction.book.user.id = :owner
		AND transaction.book.id = :bookId
		AND transaction.returned = true
		AND transaction.returnApproved = false
		""")
	Optional<BookTransactionHistory> findByBookAndOwner(Long bookId, Long owner);
}
