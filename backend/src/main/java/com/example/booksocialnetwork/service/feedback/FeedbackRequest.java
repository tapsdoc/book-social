package com.example.booksocialnetwork.service.feedback;

import jakarta.validation.constraints.*;

public record FeedbackRequest(
	@Min(value = 0)
	@Max(value = 5)
	Double rating,
	@NotNull(message = "Comment must not be null")
	@NotEmpty(message = "Comment must not be empty")
	@NotBlank(message = "Comment should not be blank")
	String comment,
	@NotNull(message = "Book should not be null")
	Long book
) { }
