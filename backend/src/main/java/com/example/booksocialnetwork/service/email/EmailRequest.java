package com.example.booksocialnetwork.service.email;

import lombok.Builder;

@Builder
public record EmailRequest(
	String to,
	String username,
	String subject,
	EmailTemplateName templateName,
	String confirmationUrl,
	String activationCode
) { }
