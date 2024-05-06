package com.example.booksocialnetwork.service.user;

import com.example.booksocialnetwork.exception.UserNotFoundException;
import org.springframework.data.domain.Page;

import java.security.Principal;
import java.util.List;

public interface UserService {
	
	void changePassword(ChangePasswordRequest request, Principal user);
	Page<UserResponse> getUsers(int pageNumber);
	UserResponse getUser(Long id) throws UserNotFoundException;
	List<UserResponse> search(String filterValue);
	void delete(Long id) throws UserNotFoundException;
}
