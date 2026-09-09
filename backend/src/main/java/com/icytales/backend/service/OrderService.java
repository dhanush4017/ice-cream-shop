package com.icytales.backend.service;

import com.icytales.backend.dto.CreateOrderRequest;
import com.icytales.backend.dto.OrderItemRequest;
import com.icytales.backend.entity.CustomerOrder;
import com.icytales.backend.entity.OrderItem;
import com.icytales.backend.entity.Product;
import com.icytales.backend.repository.OrderRepository;
import com.icytales.backend.repository.ProductRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class OrderService {
    private static final BigDecimal SHIPPING = new BigDecimal("20.00");
    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;

    public OrderService(OrderRepository orderRepository, ProductRepository productRepository) {
        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
    }

    @Transactional
    public CustomerOrder create(CreateOrderRequest request) {
        CustomerOrder order = new CustomerOrder();
        order.setOrderNumber("IT-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        order.setFirstName(request.getFirstName().trim());
        order.setLastName(request.getLastName().trim());
        order.setEmail(request.getEmail().trim().toLowerCase());
        order.setStateName(request.getState());
        order.setCity(request.getCity());
        order.setZipCode(request.getZip());
        order.setPaymentMethod(request.getPaymentMethod());
        order.setStatus("PLACED");
        order.setCreatedAt(LocalDateTime.now());

        BigDecimal subtotal = BigDecimal.ZERO;
        for (OrderItemRequest itemRequest : request.getItems()) {
            Product product = productRepository.findById(itemRequest.getProductId())
                    .orElseThrow(() -> new IllegalArgumentException("Product not found: " + itemRequest.getProductId()));
            if (!product.isActive()) throw new IllegalArgumentException("Product is unavailable: " + product.getName());

            BigDecimal lineTotal = product.getPrice().multiply(BigDecimal.valueOf(itemRequest.getQuantity()));
            subtotal = subtotal.add(lineTotal);

            OrderItem item = new OrderItem();
            item.setProductId(product.getId());
            item.setProductName(product.getName());
            item.setUnitPrice(product.getPrice());
            item.setQuantity(itemRequest.getQuantity());
            item.setSize(itemRequest.getSize());
            item.setColor(itemRequest.getColor());
            order.addItem(item);
        }

        BigDecimal discountRate = couponRate(request.getCouponCode());
        BigDecimal discount = subtotal.multiply(discountRate).setScale(2, RoundingMode.HALF_UP);
        BigDecimal grandTotal = subtotal.subtract(discount).add(SHIPPING).setScale(2, RoundingMode.HALF_UP);

        order.setSubtotal(subtotal.setScale(2, RoundingMode.HALF_UP));
        order.setShipping(SHIPPING);
        order.setDiscount(discount);
        order.setGrandTotal(grandTotal);
        return orderRepository.save(order);
    }

    private BigDecimal couponRate(String code) {
        if (code == null) return BigDecimal.ZERO;
        String normalized = code.trim().toUpperCase();
        return (normalized.equals("SUMMER50") || normalized.equals("SWEET10"))
                ? new BigDecimal("0.10") : BigDecimal.ZERO;
    }

    public List<CustomerOrder> findAll() { return orderRepository.findAllByOrderByCreatedAtDesc(); }
    public CustomerOrder findByOrderNumber(String number) {
        return orderRepository.findByOrderNumber(number)
                .orElseThrow(() -> new IllegalArgumentException("Order not found: " + number));
    }
    @Transactional
    public CustomerOrder updateStatus(String number, String status) {
        CustomerOrder order = findByOrderNumber(number);
        order.setStatus(status.toUpperCase());
        return orderRepository.save(order);
    }
}
