package com.example.booksocialnetwork.service.auth;

import com.example.booksocialnetwork.exception.EmailExistsException;
import com.example.booksocialnetwork.exception.InvalidActivationCodeException;
import com.example.booksocialnetwork.exception.RoleNotFoundException;
import com.example.booksocialnetwork.exception.UserNotFoundException;
import jakarta.mail.MessagingException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;

public interface AuthService {
	
	void register(RegistrationRequest request) throws EmailExistsException, RoleNotFoundException, MessagingException;
	AuthResponse login(AuthRequest request);
	void refreshToken(HttpServletRequest request, HttpServletResponse response) throws IOException, UserNotFoundException;
	void activateAccount(String activationCode) throws InvalidActivationCodeException, MessagingException, UserNotFoundException;
}
