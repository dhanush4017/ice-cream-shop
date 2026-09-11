package com.icytales.backend.repository;

import com.icytales.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmailIgnoreCaseOrUserIdIgnoreCase(String email, String userId);
    boolean existsByEmailIgnoreCase(String email);
    boolean existsByUserIdIgnoreCase(String userId);
}
