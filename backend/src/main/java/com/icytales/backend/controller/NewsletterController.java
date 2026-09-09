package com.icytales.backend.controller;

import com.icytales.backend.dto.SubscribeRequest;
import com.icytales.backend.service.SubscriberService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/newsletter")
public class NewsletterController {
    private final SubscriberService service;
    public NewsletterController(SubscriberService service) { this.service = service; }

    @PostMapping("/subscribe")
    @ResponseStatus(HttpStatus.CREATED)
    public Map<String, Object> subscribe(@Valid @RequestBody SubscribeRequest request) {
        boolean created = service.subscribe(request.getEmail());
        return Map.of("success", true, "alreadySubscribed", !created);
    }
}
