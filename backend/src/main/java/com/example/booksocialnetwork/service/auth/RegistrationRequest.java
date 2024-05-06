package com.example.booksocialnetwork.service.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;

public record RegistrationRequest(
	@NotEmpty(message = "Firstname cannot be empty")
	@NotBlank(message = "Firstname cannot be blank")
	String firstName,
	@NotEmpty(message = "Lastname cannot be empty")
	@NotBlank(message = "Lastname cannot be blank")
	String lastName,
	@NotEmpty(message = "Email cannot be empty")
	@NotBlank(message = "Email cannot be blank")
	@Email(message = "Not a valid email!")
	String email,
	@Size(min = 8, message = "Password should be 8 characters long!")
	String password
) { }
