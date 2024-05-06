package com.example.booksocialnetwork.service.auth;

import lombok.Builder;

@Builder
public record AuthResponse(
	String name,
	String accessToken,
	String refreshToken
) {
}
