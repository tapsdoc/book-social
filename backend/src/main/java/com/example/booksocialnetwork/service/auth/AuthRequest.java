package com.example.booksocialnetwork.service.auth;

public record AuthRequest (
	String email,
	String password
) { }
