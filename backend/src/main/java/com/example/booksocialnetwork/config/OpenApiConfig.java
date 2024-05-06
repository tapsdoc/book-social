package com.example.booksocialnetwork.config;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeIn;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.info.Contact;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.info.License;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.security.SecurityScheme;
import io.swagger.v3.oas.annotations.servers.Server;

@OpenAPIDefinition(
	info = @Info(
		contact = @Contact(
			name = "Tapiwa Chiremba",
			email = "chirembatapiwa17@gmail.com",
			url = "https://tapsdoc.co.zw"
		),
		description = "OpenApi documentation for Book Social Network App",
		title = "OpenApi specification - Tapiwa Chiremba",
		version = "1.0",
		license = @License(
			name = "Licence name",
			url = "https://tapsdoc.co.zw"
		),
		termsOfService = "Terms of service"
	),
	servers = {
		@Server(
			description = "Local ENV",
			url = "http://localhost:8090/api/v1"
		),
		@Server(
			description = "PROD ENV",
			url = "https://tapsdoc.co.zw"
		)
	},
	security = {
		@SecurityRequirement(
			name = "bearerAuth"
		)
	}
)
@SecurityScheme(
	name = "bearerAuth",
	description = "JWT auth description",
	scheme = "bearer",
	type = SecuritySchemeType.HTTP,
	bearerFormat = "JWT",
	in = SecuritySchemeIn.HEADER
)
public class OpenApiConfig {
}