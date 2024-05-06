package com.example.booksocialnetwork.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.ForeignKey;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class BookTransactionHistory extends BaseEntity {

	@ManyToOne
	@JoinColumn(
		foreignKey = @ForeignKey(name = "user_id_fk")
	)
	private User user;
	@ManyToOne
	@JoinColumn(
		foreignKey = @ForeignKey(name = "book_id_fk")
	)
	private Book book;
	
	private boolean returned;
	private boolean returnApproved;
}
