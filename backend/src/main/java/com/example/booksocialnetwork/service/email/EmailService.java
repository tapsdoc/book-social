package com.example.booksocialnetwork.service.email;

import jakarta.mail.MessagingException;

public interface EmailService {
	void sendEmail(EmailRequest request) throws MessagingException;
}
