package com.icytales.backend.service;

import com.icytales.backend.entity.Subscriber;
import com.icytales.backend.repository.SubscriberRepository;
import org.springframework.stereotype.Service;

@Service
public class SubscriberService {
    private final SubscriberRepository repository;
    public SubscriberService(SubscriberRepository repository) { this.repository = repository; }
    public boolean subscribe(String email) {
        String normalized = email.trim().toLowerCase();
        if (repository.findByEmailIgnoreCase(normalized).isPresent()) return false;
        repository.save(new Subscriber(normalized));
        return true;
    }
}
