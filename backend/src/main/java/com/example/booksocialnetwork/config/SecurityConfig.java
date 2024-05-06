package com.example.booksocialnetwork.config;

import com.example.booksocialnetwork.security.JwtAuthFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.authentication.logout.LogoutHandler;

@Configuration
@RequiredArgsConstructor
@EnableWebSecurity
@EnableMethodSecurity(securedEnabled = true)
public class SecurityConfig {
	
	
	private final AuthenticationProvider authProvider;
	private final JwtAuthFilter jwtAuthFilter;
	private final LogoutHandler logoutHandler;
	
	@Bean
	public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
		return http.csrf(AbstractHttpConfigurer::disable)
			.cors(Customizer.withDefaults())
			.authorizeHttpRequests(
				req -> req.requestMatchers(
						"/auth/**",
						"/v2/api-docs",
						"/v3/api-docs",
						"/v3/api-docs/**",
						"/swagger-resources",
						"/swagger-resources/**",
						"/configuration/ui",
						"/configuration/security",
						"/swagger-ui/**",
						"/webjars/**",
						"/swagger-ui.html"
					)
					.permitAll()
					.anyRequest().permitAll())
			.sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
			.authenticationProvider(authProvider)
			.addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)
			.logout(logoutConfigurer -> {
				logoutConfigurer.logoutUrl("/auth/logout");
				logoutConfigurer.addLogoutHandler(logoutHandler);
				logoutConfigurer.logoutSuccessHandler(((request, response, authentication) ->
					SecurityContextHolder.clearContext()));
			})
			.build();
	}
}
