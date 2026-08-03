package com.cdac.ecommerce.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.media.MediaType;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springdoc.core.customizers.OpenApiCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI customOpenAPI(){
        final String securitySchemeName = "bearerAuth";
        return new OpenAPI()
                .addSecurityItem(new SecurityRequirement().addList(securitySchemeName))
                .components(new Components()
                        .addSecuritySchemes(securitySchemeName,
                                new SecurityScheme()
                                        .name(securitySchemeName)
                                        .type(SecurityScheme.Type.HTTP)
                                        .scheme("bearer")
                                        .bearerFormat("JWT")));
    }

    @Bean
    public OpenApiCustomizer multipartJsonCustomizer() {
        return openApi -> openApi.getPaths().values().forEach(pathItem ->
                pathItem.readOperations().forEach(operation -> {
                    if (operation.getRequestBody() != null) {
                        MediaType mediaType = operation.getRequestBody().getContent().get("multipart/form-data");
                        if (mediaType != null && mediaType.getSchema() != null) {
                            // Forces Swagger UI to send the 'data' or 'requestDTO' part as application/json
                            mediaType.addEncoding("data",
                                    new io.swagger.v3.oas.models.media.Encoding().contentType("application/json"));
                            mediaType.addEncoding("requestDTO",
                                    new io.swagger.v3.oas.models.media.Encoding().contentType("application/json"));
                        }
                    }
                })
        );
    }
}
