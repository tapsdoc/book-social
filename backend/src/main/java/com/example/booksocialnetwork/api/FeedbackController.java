package com.example.booksocialnetwork.api;

import com.example.booksocialnetwork.exception.OperationNotPermittedException;
import com.example.booksocialnetwork.service.feedback.FeedbackRequest;
import com.example.booksocialnetwork.service.feedback.FeedbackResponse;
import com.example.booksocialnetwork.service.feedback.FeedbackService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.validation.BindingResult;
import org.springframework.validation.ObjectError;
import org.springframework.web.bind.annotation.*;

import java.util.stream.Collectors;

@RestController
@RequestMapping("feedback")
@RequiredArgsConstructor
@Tag(name = "Feedback")
public class FeedbackController {
	
	private final FeedbackService feedbackService;
	
	@PostMapping
	public ResponseEntity<?> saveFeedback(
		Authentication connectedUser,
		@Valid @RequestBody FeedbackRequest request,
		BindingResult bindingResult
	) throws OperationNotPermittedException {
		
		if (bindingResult.hasErrors()) {
			return ResponseEntity.badRequest()
				.body(
					bindingResult.getAllErrors()
						.stream()
						.map(ObjectError::getDefaultMessage)
						.collect(Collectors.toSet())
				);
		}
		return ResponseEntity.ok(feedbackService.saveFeedback(connectedUser, request));
	}
	
	@GetMapping("/book/{book-id}")
	public ResponseEntity<Page<FeedbackResponse>> findAllFeedbacksByBook(
		@PathVariable("book-id") Integer bookId,
		@RequestParam(name = "page", defaultValue = "0", required = false) int page,
		Authentication connectedUser
	) {
		return ResponseEntity.ok(feedbackService.findAllFeedbacksByBook(bookId, page, connectedUser));
	}
}
