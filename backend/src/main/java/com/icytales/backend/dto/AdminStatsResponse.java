package com.icytales.backend.dto;

public record AdminStatsResponse(long totalUsers, long totalOrders, long totalProducts, double totalRevenue) {}
