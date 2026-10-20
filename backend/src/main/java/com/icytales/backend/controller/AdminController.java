
package com.icytales.backend.controller;

import com.icytales.backend.dto.AdminStatsResponse;
import com.icytales.backend.entity.Product;
import com.icytales.backend.entity.User;
import com.icytales.backend.repository.OrderRepository;
import com.icytales.backend.repository.ProductRepository;
import com.icytales.backend.repository.UserRepository;
import com.icytales.backend.security.AuthGuard;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final AuthGuard guard;
    private final UserRepository users;
    private final ProductRepository products;
    private final OrderRepository orders;

    public AdminController(
            AuthGuard guard,
            UserRepository users,
            ProductRepository products,
            OrderRepository orders
    ) {
        this.guard = guard;
        this.users = users;
        this.products = products;
        this.orders = orders;
    }

    @GetMapping("/stats")
    public AdminStatsResponse stats(HttpServletRequest request) {
        guard.requireAdmin(request);

        BigDecimal revenue = orders.calculateTotalRevenue();

        if (revenue == null) {
            revenue = BigDecimal.ZERO;
        }

        return new AdminStatsResponse(
                users.count(),
                orders.count(),
                products.count(),
                revenue.doubleValue()
        );
    }

    @GetMapping("/users")
    public List<User> getUsers(HttpServletRequest request) {
        guard.requireAdmin(request);
        return users.findAll();
    }

    @GetMapping("/products")
    public List<Product> getProducts(HttpServletRequest request) {
        guard.requireAdmin(request);
        return products.findAll();
    }

    @PostMapping("/products")
    public Product createProduct(
            @RequestBody Product product,
            HttpServletRequest request
    ) {
        guard.requireAdmin(request);
        return products.save(product);
    }

    @PutMapping("/products/{id}")
    public Product updateProduct(
            @PathVariable String id,
            @RequestBody Product product,
            HttpServletRequest request
    ) {
        guard.requireAdmin(request);
        product.setId(id);
        return products.save(product);
    }

    @DeleteMapping("/products/{id}")
    public ResponseEntity<Void> deleteProduct(
            @PathVariable String id,
            HttpServletRequest request
    ) {
        guard.requireAdmin(request);
        products.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
