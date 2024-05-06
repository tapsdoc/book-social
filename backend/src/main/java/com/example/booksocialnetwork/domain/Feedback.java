package com.example.booksocialnetwork.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.ForeignKey;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.*;
import lombok.Builder;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class Feedback extends BaseEntity {
	
	private double rating;
	private String comment;
	@ManyToOne
	@JoinColumn(
		foreignKey = @ForeignKey(name = "book_id_fk")
	)
	private Book book;
}
