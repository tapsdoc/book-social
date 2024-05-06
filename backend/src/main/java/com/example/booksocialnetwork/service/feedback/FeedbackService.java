package com.example.booksocialnetwork.service.feedback;

import com.example.booksocialnetwork.exception.OperationNotPermittedException;
import org.springframework.data.domain.Page;
import org.springframework.security.core.Authentication;

public interface FeedbackService {
	Long saveFeedback(Authentication connectedUser, FeedbackRequest request) throws OperationNotPermittedException;
	
	Page<FeedbackResponse> findAllFeedbacksByBook(Integer bookId, int page, Authentication connectedUser);
}
