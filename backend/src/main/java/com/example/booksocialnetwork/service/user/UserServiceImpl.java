package com.example.booksocialnetwork.service.user;


import com.example.booksocialnetwork.domain.User;
import com.example.booksocialnetwork.exception.UserNotFoundException;
import com.example.booksocialnetwork.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.Principal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
	
	private final UserRepository userRepository;
	private final PasswordEncoder passwordEncoder;
	
	@Override
	public void changePassword(ChangePasswordRequest request, Principal connectedUser) {
		User user = (User) ((UsernamePasswordAuthenticationToken) connectedUser).getPrincipal();
		
		if (!passwordEncoder.matches(request.currentPassword(), user.getPassword())) {
			throw new IllegalStateException("Wrong Password");
		}
		
		if (!request.newPassword().equals(request.confirmationPassword())) {
			throw new IllegalStateException("Passwords do not match");
		}
		
		user.setPassword(passwordEncoder.encode(request.newPassword()));
		userRepository.save(user);
	}
	
	@Override
	public Page<UserResponse> getUsers(int pageNumber) {
		PageRequest pageRequest = PageRequest.of(pageNumber, 25);
		return userRepository.findAll(pageRequest)
			.map(UserResponse::getUserResponse);
	}
	
	@Override
	public UserResponse getUser(Long id) throws UserNotFoundException {
		return userRepository.findById(id)
			.map(UserResponse::getUserResponse)
			.orElseThrow(() -> new UserNotFoundException("User not found"));
	}
	
	@Override
	public List<UserResponse> search(String filterValue) {
		
		var results = userRepository.findAllByFirstNameContainingIgnoreCase(filterValue);
		return results.stream()
			.map(UserResponse::getUserResponse)
			.collect(Collectors.toList());
	}
	
	@Override
	public void delete(Long id) throws UserNotFoundException {
		var user = userRepository.findById(id)
			.orElseThrow(() -> new UserNotFoundException("User not found"));
		userRepository.delete(user);
	}
}

