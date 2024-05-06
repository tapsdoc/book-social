package com.example.booksocialnetwork.service.auth;

import com.example.booksocialnetwork.domain.ActivationCode;
import com.example.booksocialnetwork.domain.Token;
import com.example.booksocialnetwork.domain.User;
import com.example.booksocialnetwork.exception.EmailExistsException;
import com.example.booksocialnetwork.exception.InvalidActivationCodeException;
import com.example.booksocialnetwork.exception.RoleNotFoundException;
import com.example.booksocialnetwork.exception.UserNotFoundException;
import com.example.booksocialnetwork.repository.ActivationCodeRepository;
import com.example.booksocialnetwork.repository.RoleRepository;
import com.example.booksocialnetwork.repository.TokenRepository;
import com.example.booksocialnetwork.repository.UserRepository;
import com.example.booksocialnetwork.security.JwtService;
import com.example.booksocialnetwork.service.email.EmailRequest;
import com.example.booksocialnetwork.service.email.EmailService;
import com.example.booksocialnetwork.service.email.EmailTemplateName;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.mail.MessagingException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {
	
	private final UserRepository userRepository;
	private final PasswordEncoder passwordEncoder;
	private final JwtService jwtService;
	private final AuthenticationManager authManager;
	private final TokenRepository tokenRepository;
	private final ActivationCodeRepository codeRepository;
	private final RoleRepository roleRepository;
	private final EmailService emailService;
	@Value("${application.mailing.frontend.activation-url}")
	private String activationUrl;
	
	@Override
	public void register(RegistrationRequest request) throws EmailExistsException, MessagingException, RoleNotFoundException {
		
		var userByEmail = userRepository.findByEmail(request.email());
		if (userByEmail.isPresent()) {
			throw new EmailExistsException("This email is already registered with an account!");
		}
		
		var role = roleRepository.findByName("USER")
			.orElseThrow(() -> new RoleNotFoundException("Role not found in database"));
		
		User user = User.builder()
			.firstName(request.firstName())
			.lastName(request.lastName())
			.email(request.email())
			.password(passwordEncoder.encode(request.password()))
			.enabled(false)
			.accountLocked(false)
			.roles(List.of(role))
			.build();
		
		userRepository.save(user);
		sendValidationEmail(user);
	}
	
	@Override
	public AuthResponse login(AuthRequest request) {
		Authentication authenticatedUser = authManager.authenticate(
			new UsernamePasswordAuthenticationToken(
				request.email(),
				request.password()
			)
		);
		
		var user = (User) authenticatedUser.getPrincipal();
		var jwtToken = jwtService.generateToken(user);
		var refreshToken = jwtService.generateRefreshToken(user);
		revokeAllTokens(user);
		
		var token = Token.builder()
			.user(user)
			.token(jwtToken)
			.expired(false)
			.revoked(false)
			.build();
		
		tokenRepository.save(token);
		
		return AuthResponse.builder()
			.name(user.getFullName())
			.accessToken(jwtToken)
			.refreshToken(refreshToken)
			.build();
	}
	
	@Override
	public void refreshToken(HttpServletRequest request, HttpServletResponse response) throws IOException, UserNotFoundException {
		final String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);
		final String refreshToken;
		final String username;
		
		if (authHeader == null || !authHeader.startsWith("Bearer ")) return;
		
		refreshToken = authHeader.substring(7);
		username = jwtService.extractUsername(refreshToken);
		
		if (username != null) {
			User user = this.userRepository.findByEmail(username)
				.orElseThrow(() -> new UserNotFoundException("User not found!"));
			
			if (jwtService.isTokenValid(refreshToken, user)) {
				
				var accessToken = jwtService.generateToken(user);
				revokeAllTokens(user);
				
				var token = Token.builder()
					.user(user)
					.token(accessToken)
					.expired(false)
					.revoked(false)
					.build();
				tokenRepository.save(token);
				
				var authResponse = AuthResponse.builder()
					.name(user.getFullName())
					.accessToken(accessToken)
					.refreshToken(refreshToken)
					.build();
				
				new ObjectMapper().writeValue(
					response.getOutputStream(),
					authResponse
				);
			}
			
		}
	}
	
	@Transactional
	@Override
	public void activateAccount(String activationCode) throws InvalidActivationCodeException, MessagingException, UserNotFoundException {
		
		var token = codeRepository.findByToken(activationCode)
			.orElseThrow(() -> new InvalidActivationCodeException("Invalid token"));
		if (LocalDateTime.now().isAfter(token.getExpiresAt())) {
			sendValidationEmail(token.getUser());
			throw new InvalidActivationCodeException("Activation token has expired. A new token has been sent.");
		}
		
		var user = userRepository.findById(token.getUser().getId())
			.orElseThrow(() -> new UserNotFoundException("User not found."));
		user.setEnabled(true);
		userRepository.save(user);
		token.setValidatedAt(LocalDateTime.now());
		codeRepository.save(token);
	}
	
	private void sendValidationEmail(User user) throws MessagingException {
		var activationCode = generateAndSaveActivationCode(user);
		
		EmailRequest request = EmailRequest.builder()
			.to(user.getEmail())
			.username(user.getFullName())
			.activationCode(activationCode)
			.confirmationUrl(activationUrl)
			.templateName(EmailTemplateName.ACTIVATE_ACCOUNT)
			.subject("Account Activation")
			.build();
		emailService.sendEmail(request);
	}
	
	private String generateAndSaveActivationCode(User user) {
		
		String generateActivationCode = generateActivationCode();
		var code = ActivationCode.builder()
			.token(generateActivationCode)
			.createdAt(LocalDateTime.now())
			.expiresAt(LocalDateTime.now().plusHours(1))
			.user(user)
			.build();
		
		codeRepository.save(code);
		return generateActivationCode;
	}
	
	private String generateActivationCode() {
		String chars = "0123456789";
		StringBuilder builder = new StringBuilder();
		SecureRandom secureRandom = new SecureRandom();
		
		for (int i = 0; i < 6; i++) {
			int randomIndex = secureRandom.nextInt(chars.length());
			builder.append(chars.charAt(randomIndex));
		}
		return builder.toString();
	}
	
	private void revokeAllTokens(User user) {
		var validTokens = tokenRepository.findAllValidTokensByUser(user.getId());
		if (validTokens.isEmpty()) {
			return;
		}
		validTokens.forEach(token -> {
			token.setExpired(true);
			token.setRevoked(true);
		});
		tokenRepository.saveAll(validTokens);
	}
}
