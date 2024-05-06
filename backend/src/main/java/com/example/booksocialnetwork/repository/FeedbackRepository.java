package com.example.booksocialnetwork.repository;

import com.example.booksocialnetwork.domain.Feedback;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface FeedbackRepository extends JpaRepository<Feedback, Long> {
	@Query("""
		SELECT feedback
		FROM Feedback  feedback
		WHERE feedback.book.id = :bookId
		""")
	Page<Feedback> findAllByBookId(@Param("bookId") Integer bookId, Pageable pageable);
}
