package com.example.booksocialnetwork.service.book;

import lombok.Builder;

@Builder
public record BorrowedBookResponse(
	Long id,
	String title,
	String author,
	String isbn,
	double rate,
	boolean returned,
	boolean returnApproved
) {
}
