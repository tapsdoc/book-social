package com.example.booksocialnetwork.service.user;

import com.example.booksocialnetwork.domain.User;
import lombok.Builder;

import java.time.LocalDateTime;

@Builder
public record UserResponse(
	Long id,
	String name,
	String email,
	boolean accountLocked,
	boolean enabled,
	LocalDateTime joined
) {
	public static UserResponse getUserResponse(User user) {
		return UserResponse.builder()
			.id(user.getId())
			.name(user.getFullName())
			.email(user.getEmail())
			.joined(user.getCreatedAt())
			.accountLocked(user.isAccountLocked())
			.enabled(user.isEnabled())
			.build();
	}
}
