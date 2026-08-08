package com.cdac.ecommerce.controller;

import com.cdac.ecommerce.dto.request.AIChatRequestDTO;
import com.cdac.ecommerce.dto.response.AIChatResponseDTO;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
public class AIChatController {

    private final RestTemplate restTemplate = new RestTemplate();
    private static final String PYTHON_AI_SERVICE_URL = "http://localhost:8000/ai/chat";

    @PostMapping("/chat")
    public ResponseEntity<AIChatResponseDTO> chatWithAI(@Valid @RequestBody AIChatRequestDTO requestDTO) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<Map<String, String>> requestEntity = new HttpEntity<>(
                    Map.of("query", requestDTO.getQuery()), headers
            );

            ResponseEntity<Map> pythonResponse = restTemplate.postForEntity(
                    PYTHON_AI_SERVICE_URL, requestEntity, Map.class
            );

            Map<?, ?> body = pythonResponse.getBody();
            String reply = body != null && body.containsKey("reply") ? body.get("reply").toString() : "No response from AI.";
            Integer count = body != null && body.containsKey("catalog_count") ? (Integer) body.get("catalog_count") : 0;

            return ResponseEntity.ok(new AIChatResponseDTO(reply, count));
        } catch (Exception e) {
            return ResponseEntity.ok(new AIChatResponseDTO(
                    "🤖 AI Assistant is offline. Please make sure the Python AI microservice (main.py on port 8000) is running.", 0
            ));
        }
    }
}
