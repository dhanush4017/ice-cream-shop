package com.icytales.backend.controller;

import com.icytales.backend.entity.Product;
import com.icytales.backend.security.AuthGuard;
import com.icytales.backend.service.ProductService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductController {
    private final ProductService service; private final AuthGuard guard;
    public ProductController(ProductService service, AuthGuard guard) { this.service=service; this.guard=guard; }

    @GetMapping public List<Product> getProducts(@RequestParam(required=false) String category){ return service.findAll(category); }
    @GetMapping("/{id}") public Product getProduct(@PathVariable String id){ return service.findById(id); }

    @PostMapping public Product create(@RequestBody Product product,HttpServletRequest r){ guard.requireAdmin(r); return service.save(product); }
    @PutMapping("/{id}") public Product update(@PathVariable String id,@RequestBody Product product,HttpServletRequest r){ guard.requireAdmin(r); service.findById(id); product.setId(id); return service.save(product); }
    @DeleteMapping("/{id}") public ResponseEntity<Void> delete(@PathVariable String id,HttpServletRequest r){ guard.requireAdmin(r); service.delete(id); return ResponseEntity.noContent().build(); }
}
