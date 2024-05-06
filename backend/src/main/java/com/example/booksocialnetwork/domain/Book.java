package com.example.booksocialnetwork.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.Builder;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(
	name = "book",
	uniqueConstraints = {
		@UniqueConstraint(name = "isbn_ux", columnNames = "isbn")
	}
)
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class Book extends BaseEntity {
	
	@Column(nullable = false, unique = true)
	private String isbn;
	private String title;
	private String author;
	private String synopsis;
	private String imageUrl;
	private boolean archived;
	private boolean shareable;
	@ManyToOne
	@JoinColumn(
		foreignKey = @ForeignKey(name = "user_id_fk")
	)
	private User user;
	@OneToMany(
		mappedBy = "book"
	)
	private List<Feedback> feedbacks = new ArrayList<>();
	@OneToMany(
		mappedBy = "book"
	)
	private List<BookTransactionHistory> bookTransactionHistories = new ArrayList<>();
	
	@Transient
	public double getRate() {
		if (feedbacks.isEmpty())
			return 0.0;
		
		var rate = feedbacks.stream()
			.mapToDouble(Feedback::getRating)
			.average()
			.orElse(0.0);
		
		return Math.round(rate * 10.0) / 10.0;
	}
}
