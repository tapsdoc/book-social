package com.example.booksocialnetwork.service.feedback;

import com.example.booksocialnetwork.domain.Feedback;
import com.example.booksocialnetwork.domain.User;
import com.example.booksocialnetwork.exception.OperationNotPermittedException;
import com.example.booksocialnetwork.repository.BookRepository;
import com.example.booksocialnetwork.repository.FeedbackRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.Objects;

@Service
@RequiredArgsConstructor
public class FeedbackServiceImpl implements FeedbackService {
	
	private final FeedbackRepository feedbackRepository;
	private final BookRepository bookRepository;
	
	@Override
	public Long saveFeedback(Authentication connectedUser, FeedbackRequest request) throws OperationNotPermittedException {
		
		var book = bookRepository.findById(request.book())
			.orElseThrow(() -> new EntityNotFoundException("Book not found"));
		
		if (book.isArchived() || !book.isShareable())
			throw new OperationNotPermittedException("You cannot give feedback to an archived book");
		
		User user = ((User) connectedUser.getPrincipal());
		if (Objects.equals(book.getUser().getId(), user.getId()))
			throw new OperationNotPermittedException("You cannot give feedback to own book");
		
		Feedback feedback = Feedback.builder()
			.rating(request.rating())
			.comment(request.comment())
			.book(book)
			.build();
		
		return feedbackRepository.save(feedback).getId();
	}
	
	@Override
	public Page<FeedbackResponse> findAllFeedbacksByBook(Integer bookId, int page, Authentication connectedUser) {
		Pageable pageable = PageRequest.of(page, 20);
		User user = ((User) connectedUser.getPrincipal());
		Page<Feedback> feedbacks = feedbackRepository.findAllByBookId(bookId, pageable);
		return feedbacks.map(feedback -> feedbackResponse(feedback, user.getEmail()));
	}
	
	private FeedbackResponse feedbackResponse(Feedback feedback, String  user) {
		return FeedbackResponse.builder()
			.rating(feedback.getRating())
			.comment(feedback.getComment())
			.ownFeedback(Objects.equals(feedback.getCreatedBy(), user))
			.build();
	}
}
