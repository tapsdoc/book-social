package com.example.booksocialnetwork.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
public class Role {
	
	@Id
	@GeneratedValue
	private Long id;
	@Column(unique = true)
	private String name;
	
	@ManyToMany(
		mappedBy = "roles"
	)
	@JsonIgnore
	private List<User> users = new ArrayList<>();
	
	@CreatedDate
	@Column(
		nullable = false,
		updatable = false
	)
	private LocalDateTime createdAt;
	@LastModifiedDate
	@Column(
		insertable = false
	)
	private LocalDateTime lastModifiedAt;
}
