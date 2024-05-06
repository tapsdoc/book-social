package com.example.booksocialnetwork.service.book;

import com.example.booksocialnetwork.domain.Book;
import org.springframework.data.jpa.domain.Specification;

public class BookSpecification {
	
	public static Specification<Book> withOwner(Long userId) {
		return (root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("user").get("id"), userId);
	}
}
