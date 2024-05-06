package com.example.booksocialnetwork.service.email;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;

import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class EmailServiceImpl implements EmailService {
	
	private final JavaMailSender mailSender;
	private final SpringTemplateEngine templateEngine;
	
	@Async
	@Override
	public void sendEmail(EmailRequest request) throws MessagingException {
		
		String templateName;
		
		if (request.templateName() == null) {
			templateName = "confirm-email";
		} else {
			templateName = request.templateName().getName();
		}
		
		MimeMessage mimeMessage = mailSender.createMimeMessage();
		MimeMessageHelper helper = new MimeMessageHelper(
			mimeMessage,
			MimeMessageHelper.MULTIPART_MODE_MIXED,
			StandardCharsets.UTF_8.name()
		);
		
		Map<String, Object> properties = new HashMap<>();
		properties.put("username", request.username());
		properties.put("confirmation_url", request.confirmationUrl());
		properties.put("activation_code", request.activationCode());
		
		Context context = new Context();
		context.setVariables(properties);
		
		helper.setFrom("tapsdoc23@gmail.com");
		helper.setTo(request.to());
		helper.setSubject(request.subject());
		
		String template = templateEngine.process(templateName, context);
		helper.setText(template, true);
		
		mailSender.send(mimeMessage);
	}
}
