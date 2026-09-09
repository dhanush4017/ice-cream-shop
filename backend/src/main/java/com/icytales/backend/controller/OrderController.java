package com.icytales.backend.controller;

import com.icytales.backend.dto.CreateOrderRequest;
import com.icytales.backend.entity.CustomerOrder;
import com.icytales.backend.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
public class OrderController {
    private final OrderService service;
    public OrderController(OrderService service) { this.service = service; }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public CustomerOrder create(@Valid @RequestBody CreateOrderRequest request) {
        return service.create(request);
    }

    @GetMapping
    public List<CustomerOrder> getAll() { return service.findAll(); }

    @GetMapping("/{orderNumber}")
    public CustomerOrder get(@PathVariable String orderNumber) { return service.findByOrderNumber(orderNumber); }

    @PutMapping("/{orderNumber}/status")
    public CustomerOrder updateStatus(@PathVariable String orderNumber, @RequestBody Map<String, String> body) {
        String status = body.get("status");
        if (status == null || status.isBlank()) throw new IllegalArgumentException("status is required");
        return service.updateStatus(orderNumber, status);
    }
}
