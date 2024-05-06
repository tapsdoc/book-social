package com.example.booksocialnetwork.service.files;

import org.springframework.web.multipart.MultipartFile;

public interface FileUploadService {
	
	String upload(Long userId, Long book, MultipartFile file) throws Exception;
	String getFileObject(String objectName) throws Exception;
}
