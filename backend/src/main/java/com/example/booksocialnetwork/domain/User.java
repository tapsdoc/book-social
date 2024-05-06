package com.example.booksocialnetwork.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.security.Principal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;

@Entity
@Table(
	name = "users",
	uniqueConstraints = {
		@UniqueConstraint(name = "email_ux", columnNames = "email")
	}
)
@Builder
@AllArgsConstructor
@NoArgsConstructor
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
public class User implements UserDetails, Principal {
	
	@Id
	@GeneratedValue(
		generator = "user_id_seq",
		strategy = GenerationType.SEQUENCE
	)
	@SequenceGenerator(
		name = "user_id_seq",
		sequenceName = "user_id_seq",
		allocationSize = 1
	)
	private Long id;
	private String firstName;
	private String lastName;
	@Column(nullable = false, unique = true)
	private String email;
	private String password;
	private LocalDate dateOfBirth;
	private boolean accountLocked;
	private boolean enabled;
	
	@OneToMany(
		mappedBy = "user"
	)
	@JsonIgnore
	private List<Book> books = new ArrayList<>();
	@OneToMany(
		mappedBy = "user"
	)
	private List<BookTransactionHistory> bookTransactionHistories = new ArrayList<>();
	@ManyToMany(
		fetch = FetchType.EAGER
	)
	private List<Role> roles = new ArrayList<>();
	
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
	
	public String getFullName() {
		return firstName + " " + lastName;
	}
	
	@Override
	public String getName() {
		return email;
	}
	
	@Override
	public Collection<? extends GrantedAuthority> getAuthorities() {
		return roles.stream()
			.map(role -> new SimpleGrantedAuthority(role.getName()))
			.collect(Collectors.toList());
	}
	
	@Override
	public String getPassword() {
		return password;
	}
	
	@Override
	public String getUsername() {
		return email;
	}
	
	@Override
	public boolean isAccountNonExpired() {
		return true;
	}
	
	@Override
	public boolean isAccountNonLocked() {
		return !accountLocked;
	}
	
	@Override
	public boolean isCredentialsNonExpired() {
		return true;
	}
	
	@Override
	public boolean isEnabled() {
		return enabled;
	}
}
