package com.example.booksocialnetwork.domain;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ActivationCode {
	
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Long id;
	private String token;
	private LocalDateTime createdAt;
	private LocalDateTime expiresAt;
	private LocalDateTime validatedAt;
	@ManyToOne
	@JoinColumn(
		foreignKey = @ForeignKey(name = "user_id_fk"),
		nullable = false
	)
	private User user;
}