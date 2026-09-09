package com.icytales.backend.repository;

import com.icytales.backend.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ProductRepository extends JpaRepository<Product, String> {
    List<Product> findByActiveTrueOrderByNameAsc();
    List<Product> findByCategoryAndActiveTrueOrderByNameAsc(String category);
}
