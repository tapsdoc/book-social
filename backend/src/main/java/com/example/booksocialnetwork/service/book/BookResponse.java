package com.example.booksocialnetwork.service.book;

import lombok.Builder;

@Builder
public record BookResponse(
	Long id,
	String title,
	String author,
	String isbn,
	String owner,
	String synopsis,
	String cover,
	double rate,
	boolean sharable,
	boolean archived
) { }
