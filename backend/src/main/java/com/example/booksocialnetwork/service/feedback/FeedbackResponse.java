package com.example.booksocialnetwork.service.feedback;

import lombok.Builder;

@Builder
public record FeedbackResponse(
	Double rating,
	String comment,
	boolean ownFeedback
) { }
