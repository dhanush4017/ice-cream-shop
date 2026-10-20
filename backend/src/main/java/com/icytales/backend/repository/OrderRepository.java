
package com.icytales.backend.repository;

import com.icytales.backend.entity.CustomerOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

public interface OrderRepository extends JpaRepository<CustomerOrder, Long> {

    Optional<CustomerOrder> findByOrderNumber(String orderNumber);

    List<CustomerOrder> findAllByOrderByCreatedAtDesc();

    List<CustomerOrder> findAllByUserEmailIgnoreCaseOrderByCreatedAtDesc(
            String userEmail
    );

    Optional<CustomerOrder> findByOrderNumberAndUserEmailIgnoreCase(
            String orderNumber,
            String userEmail
    );

    @Query("SELECT COALESCE(SUM(o.grandTotal), 0) FROM CustomerOrder o")
    BigDecimal calculateTotalRevenue();
}
