package com.example.booksocialnetwork;

import com.example.booksocialnetwork.domain.Role;
import com.example.booksocialnetwork.repository.RoleRepository;
import com.example.booksocialnetwork.service.auth.AuthService;
import com.example.booksocialnetwork.service.auth.RegistrationRequest;
import com.github.javafaker.Faker;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
@EnableJpaAuditing(auditorAwareRef = "auditorAware")
public class BookSocialNetworkApplication {
	
	public static void main(String[] args) {
		SpringApplication.run(BookSocialNetworkApplication.class, args);
	}
	
	@Bean
	public CommandLineRunner runner(RoleRepository repository, AuthService service) {
		return args -> {
			if (repository.findByName("USER").isEmpty())
				repository.save(
					Role.builder()
						.name("USER")
						.build()
				);
			
			if (repository.findByName("ADMIN").isEmpty())
				repository.save(
					Role.builder()
						.name("ADMIN")
						.build()
				);
			
//			Faker faker = new Faker();
//			for (int i = 0; i < 200; i++) {
//				var request = new RegistrationRequest(
//					faker.name().firstName(),
//					faker.name().lastName(),
//					faker.internet().emailAddress(),
//					"taps1234!"
//				);
//				service.register(request);
//			}
		};
	}
}
