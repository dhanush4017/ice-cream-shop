package com.icytales.backend.controller;

import com.icytales.backend.dto.CreateOrderRequest;
import com.icytales.backend.entity.CustomerOrder;
import com.icytales.backend.security.AuthGuard;
import com.icytales.backend.service.OrderService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
public class OrderController {
    private final OrderService service; private final AuthGuard guard;
    public OrderController(OrderService service, AuthGuard guard) { this.service=service; this.guard=guard; }

    @PostMapping @ResponseStatus(HttpStatus.CREATED)
    public CustomerOrder create(@Valid @RequestBody CreateOrderRequest request, HttpServletRequest http) {
        var s=guard.requireUser(http);
        CustomerOrder order=service.create(request);
        order.setUserEmail(s.email());
        // Persist the ownership association without changing checkout/customer display email.
        return service.save(order);
    }

    @GetMapping("/mine")
    public List<CustomerOrder> mine(HttpServletRequest http) { return service.findMine(guard.requireUser(http).email()); }

    @GetMapping("/mine/{orderNumber}")
    public CustomerOrder mineOne(@PathVariable String orderNumber, HttpServletRequest http) {
        return service.findMineByOrderNumber(orderNumber, guard.requireUser(http).email());
    }

    @GetMapping
    public List<CustomerOrder> getAll(HttpServletRequest http) { guard.requireAdmin(http); return service.findAll(); }

    @GetMapping("/{orderNumber}")
    public CustomerOrder get(@PathVariable String orderNumber, HttpServletRequest http) { guard.requireAdmin(http); return service.findByOrderNumber(orderNumber); }

    @PutMapping("/{orderNumber}/status")
    public CustomerOrder updateStatus(@PathVariable String orderNumber, @RequestBody Map<String,String> body, HttpServletRequest http) {
        guard.requireAdmin(http);
        String status=body.get("status");
        if(status==null || status.isBlank()) throw new IllegalArgumentException("status is required");
        return service.updateStatus(orderNumber,status);
    }
}
