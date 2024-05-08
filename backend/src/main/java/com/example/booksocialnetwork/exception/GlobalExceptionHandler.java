package com.example.booksocialnetwork.exception;

import com.example.booksocialnetwork.commons.HttpResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.LockedException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {
	
	@ExceptionHandler(BadCredentialsException.class)
	public ResponseEntity<?> badCredentialsException() {
		return createHttpResponse(HttpStatus.FORBIDDEN, "Incorrect username or password");
	}
	
	@ExceptionHandler(DisabledException.class)
	public ResponseEntity<?> disabledException() {
		return createHttpResponse(HttpStatus.UNAUTHORIZED, "Account is disabled.");
	}
	
	@ExceptionHandler(LockedException.class)
	public ResponseEntity<?> lockedException() {
		return createHttpResponse(HttpStatus.UNAUTHORIZED, "Account is locked.");
	}
	
	@ExceptionHandler(InvalidActivationCodeException.class)
	public ResponseEntity<?> invalidActivationCodeException(InvalidActivationCodeException exception) {
		return createHttpResponse(HttpStatus.BAD_REQUEST, exception.getMessage());
	}
	
	@ExceptionHandler(RoleNotFoundException.class)
	public ResponseEntity<?> roleNotFoundException(RoleNotFoundException exception) {
		return createHttpResponse(HttpStatus.NOT_FOUND, exception.getMessage());
	}
	
	@ExceptionHandler(AccessDeniedException.class)
	public ResponseEntity<?> accessDeniedException(AccessDeniedException exception) {
		return createHttpResponse(HttpStatus.UNAUTHORIZED, exception.getMessage());
	}
	
	@ExceptionHandler(OperationNotPermittedException.class)
	public ResponseEntity<?> operationDeniedException(OperationNotPermittedException exception) {
		return createHttpResponse(HttpStatus.UNAUTHORIZED, exception.getMessage());
	}
	
	@ExceptionHandler(UserNotFoundException.class)
	public ResponseEntity<?> userNotFoundException(UserNotFoundException exception) {
		return createHttpResponse(HttpStatus.NOT_FOUND, exception.getMessage());
	}
	
	@ExceptionHandler(EmailExistsException.class)
	public ResponseEntity<?> emailExistsException(EmailExistsException exception) {
		return createHttpResponse(HttpStatus.BAD_REQUEST, exception.getMessage());
	}
	
	private ResponseEntity<HttpResponse> createHttpResponse(HttpStatus httpStatus, String message) {
		return new ResponseEntity<>(
			new HttpResponse(
				httpStatus.value(),
				httpStatus,
				message
			), httpStatus
		);
	}
}
