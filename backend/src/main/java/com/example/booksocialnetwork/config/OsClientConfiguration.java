package com.example.booksocialnetwork.config;

import java.io.IOException;
import org.springframework.context.annotation.Configuration;
import com.oracle.bmc.ConfigFileReader;
import com.oracle.bmc.auth.ConfigFileAuthenticationDetailsProvider;
import com.oracle.bmc.objectstorage.ObjectStorage;
import com.oracle.bmc.objectstorage.ObjectStorageClient;

@Configuration
public class OsClientConfiguration {
	
	String configurationFilePath = "config";
	String profile = "DEFAULT";
	
	
	public ObjectStorage getObjectStorage() throws IOException {
		
		final ConfigFileReader.ConfigFile
			configFile = ConfigFileReader
			.parse(configurationFilePath, profile);
		
		final ConfigFileAuthenticationDetailsProvider provider =
			new ConfigFileAuthenticationDetailsProvider(configFile);
		
		return ObjectStorageClient.builder()
			.build(provider);
	}
}
