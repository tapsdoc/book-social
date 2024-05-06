package com.example.booksocialnetwork.repository;

import com.example.booksocialnetwork.domain.ActivationCode;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ActivationCodeRepository extends JpaRepository<ActivationCode, Long> {
	
	Optional<ActivationCode> findByToken(String token);
}
