package com.example.booksocialnetwork.api;

import com.example.booksocialnetwork.exception.UserNotFoundException;
import com.example.booksocialnetwork.service.user.ChangePasswordRequest;
import com.example.booksocialnetwork.service.user.UserResponse;
import com.example.booksocialnetwork.service.user.UserService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("users")
@RequiredArgsConstructor
@Tag(name = "User")
public class UserController {
	
	private final UserService userService;
	
	@PatchMapping("/change-password")
	public ResponseEntity<?> changePassword(@RequestBody ChangePasswordRequest request, Principal user) {
		userService.changePassword(request, user);
		return ResponseEntity.ok("Password changed.");
	}
	
	@PreAuthorize("hasRole('ADMIN')")
	@GetMapping("/list")
	public ResponseEntity<Page<UserResponse>> getUsers(@RequestParam int page) {
		return ResponseEntity.ok(userService.getUsers(page));
	}
	
	@PreAuthorize("hasRole('ADMIN')")
	@GetMapping("/{id}")
	public ResponseEntity<UserResponse> getUser(@PathVariable Long id) throws UserNotFoundException {
		return ResponseEntity.ok(userService.getUser(id));
	}
	
	@PreAuthorize("hasRole('ADMIN')")
	@DeleteMapping("/delete/{id}")
	public ResponseEntity<?> delete(@PathVariable Long id) throws UserNotFoundException {
		userService.delete(id);
		return ResponseEntity.ok().build();
	}
	
	@PreAuthorize("hasRole('ADMIN')")
	@GetMapping("/search")
	public ResponseEntity<List<UserResponse>> search(@RequestParam String searchValue) {
		return ResponseEntity.ok(userService.search(searchValue));
	}
}
