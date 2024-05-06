package com.example.booksocialnetwork.api;

import com.example.booksocialnetwork.service.files.FileUploadService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("file-upload")
@Tag(name = "File Upload")
public class FileUploadController {
	
	private final FileUploadService fileUploadService;
	
	@GetMapping(path = "file", produces = MediaType.ALL_VALUE)
	public ResponseEntity<Object> getURl(String objectName) {
		try {
			return ResponseEntity.ok().body(fileUploadService.getFileObject(objectName));
		} catch (Exception e) {
			return ResponseEntity.internalServerError().build();
		}
	}
}