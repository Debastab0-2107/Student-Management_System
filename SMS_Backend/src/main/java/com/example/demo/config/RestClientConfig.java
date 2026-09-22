package com.example.demo.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestClient;

/*
 * RestClientConfig
 * ----------------
 * This configuration class creates the RestClient bean used
 * by the backend to communicate with external services.
 *
 * In our project, the main external service will be the
 * Python OCR microservice.
 *
 * The actual OCR service URL will be configured later through
 * application.properties / environment variables.
 */
@Configuration
public class RestClientConfig {

    /*
     * Creates a RestClient bean.
     *
     * Spring will manage this object and inject it wherever
     * RestClient is required.
     */
    @Bean
    public RestClient restClient() {

        /*
         * RestClient.builder() creates a configurable HTTP client.
         *
         * We are not setting the OCR base URL here yet because
         * OcrMicroserviceClient will handle the service-specific
         * URL configuration.
         */
        return RestClient.builder().build();
    }
}