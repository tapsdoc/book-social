package com.example.booksocialnetwork.domain;

import jakarta.persistence.*;
import lombok.*;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class Token {
	
	@Id
	@GeneratedValue
	private Long id;
	private String token;
	private boolean expired;
	private boolean revoked;
	@ManyToOne
	@JoinColumn(
		foreignKey = @ForeignKey(name = "user_id_fk")
	)
	private User user;
}
