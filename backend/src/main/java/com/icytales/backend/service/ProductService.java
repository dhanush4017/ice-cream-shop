package com.icytales.backend.service;

import com.icytales.backend.entity.Product;
import com.icytales.backend.repository.ProductRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ProductService {
    private final ProductRepository repository;
    public ProductService(ProductRepository repository) { this.repository = repository; }
    public List<Product> findAll(String category) {
        if (category == null || category.isBlank()) return repository.findByActiveTrueOrderByNameAsc();
        return repository.findByCategoryAndActiveTrueOrderByNameAsc(category);
    }
    public Product findById(String id) {
        return repository.findById(id).orElseThrow(() -> new IllegalArgumentException("Product not found: " + id));
    }
    public Product save(Product product) { return repository.save(product); }
    public void delete(String id) { repository.deleteById(id); }
}
