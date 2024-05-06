package com.example.booksocialnetwork.service.book;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

public record BookRequest(
	@NotNull(message = "Title must not be null")
	@NotEmpty(message = "Title must not be empty")
	String title,
	@NotNull(message = "Author must not be null")
	@NotEmpty(message = "Author must not be empty")
	String author,
	@NotNull(message = "ISBN must not be null")
	@NotEmpty(message = "ISBN must not be empty")
	String isbn,
	@NotNull(message = "Book synopsis must not be null")
	@NotEmpty(message = "Book synopsis must not be empty")
	String synopsis,
	boolean sharable
) { }
