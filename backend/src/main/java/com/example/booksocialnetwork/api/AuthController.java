package com.example.booksocialnetwork.api;

import com.example.booksocialnetwork.exception.EmailExistsException;
import com.example.booksocialnetwork.exception.InvalidActivationCodeException;
import com.example.booksocialnetwork.exception.RoleNotFoundException;
import com.example.booksocialnetwork.exception.UserNotFoundException;
import com.example.booksocialnetwork.service.auth.AuthRequest;
import com.example.booksocialnetwork.service.auth.AuthResponse;
import com.example.booksocialnetwork.service.auth.AuthService;
import com.example.booksocialnetwork.service.auth.RegistrationRequest;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.mail.MessagingException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.ObjectError;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
@RequestMapping("auth")
@Tag(name = "Authentication")
public class AuthController {
	
	private final AuthService authService;
	
	@PostMapping("/register")
	public ResponseEntity<?> register(
		@RequestBody @Valid RegistrationRequest request,
		BindingResult bindingResult
	) throws EmailExistsException, RoleNotFoundException, MessagingException {
		if (bindingResult.hasErrors()) {
			return ResponseEntity.badRequest()
				.body(
					bindingResult.getAllErrors()
						.stream()
						.map(ObjectError::getDefaultMessage)
						.collect(Collectors.toSet())
				);
		}
		authService.register(request);
		return ResponseEntity.accepted().build();
	}
	
	@PostMapping("/login")
	public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest request) {
		return ResponseEntity.ok(authService.login(request));
	}
	
	@GetMapping("/activate-account")
	public ResponseEntity<?> confirm(@RequestParam("code") String activationCode)
		throws UserNotFoundException, MessagingException, InvalidActivationCodeException {
		authService.activateAccount(activationCode);
		return ResponseEntity.accepted().build();
	}
	
	@PostMapping("/refresh-token")
	public ResponseEntity<?> refreshToken(HttpServletRequest request, HttpServletResponse response)
		throws IOException, UserNotFoundException {
		authService.refreshToken(request, response);
		return ResponseEntity.accepted().build();
	}
}
