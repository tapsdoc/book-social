package com.example.booksocialnetwork.service.files;

import com.example.booksocialnetwork.config.OsClientConfiguration;
import com.oracle.bmc.objectstorage.model.CreatePreauthenticatedRequestDetails;
import com.oracle.bmc.objectstorage.model.PreauthenticatedRequest;
import com.oracle.bmc.objectstorage.requests.CreatePreauthenticatedRequestRequest;
import com.oracle.bmc.objectstorage.requests.PutObjectRequest;
import com.oracle.bmc.objectstorage.responses.CreatePreauthenticatedRequestResponse;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.time.Instant;
import java.util.Date;
import java.util.Objects;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class FileUploadServiceImpl implements FileUploadService {
	
	@Value("${oci.bucket}")
	private String bucketName;
	@Value("${oci.namespace}")
	private String namespace;
	private final OsClientConfiguration configuration;
	@Value("${oci.region}")
	private String region;
	
	@Override
	public String upload (
		Long userId,
		Long book,
		@NotNull MultipartFile file
	) throws Exception {
		String objectName = generateObjectName(Objects.requireNonNull(file.getOriginalFilename()));
		InputStream inputStream = file.getInputStream();
		
		PutObjectRequest putObjectRequest =
			PutObjectRequest.builder()
				.namespaceName(namespace)
				.bucketName(bucketName)
				.objectName(objectName)
				.contentLength(file.getSize())
				.putObjectBody(inputStream)
				.build();
		
		try {
			configuration.getObjectStorage().putObject(putObjectRequest);
			return objectName;
		} catch (Exception e) {
			e.fillInStackTrace();
			throw e;
		}finally {
			configuration.getObjectStorage().close();
		}
	}
	
	@Override
	public String getFileObject (@NotNull String objectName) throws Exception {
		CreatePreauthenticatedRequestDetails requestDetails =
			CreatePreauthenticatedRequestDetails.builder()
				.name(objectName)
				.bucketListingAction(PreauthenticatedRequest.BucketListingAction.Deny)
				.objectName(objectName)
				.accessType(CreatePreauthenticatedRequestDetails.AccessType.ObjectRead)
				.timeExpires(Date.from(Instant.now().plusSeconds(3600))).build();
		
		CreatePreauthenticatedRequestRequest request =
			CreatePreauthenticatedRequestRequest.builder()
				.namespaceName(namespace)
				.bucketName(bucketName)
				.createPreauthenticatedRequestDetails(requestDetails)
				.opcClientRequestId(UUID.randomUUID().toString()).build();
		
		CreatePreauthenticatedRequestResponse response = configuration
			.getObjectStorage()
			.createPreauthenticatedRequest(request);
		configuration.getObjectStorage().close();
		
		return region + response
			.getPreauthenticatedRequest()
			.getAccessUri();
	}
	
	private String generateObjectName(String originalFilename) {
		String extension = originalFilename.substring(originalFilename.lastIndexOf('.'));
		return UUID.randomUUID() + extension;
	}
}
