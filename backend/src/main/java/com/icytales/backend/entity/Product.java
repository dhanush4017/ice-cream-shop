package com.icytales.backend.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.math.BigDecimal;

@Entity
@Table(name = "products")
public class Product {
    @Id
    private String id;
    private String name;
    private String category;
    private BigDecimal price;
    private BigDecimal oldPrice;
    private BigDecimal rating;
    private Integer reviews;
    private String badge;
    private String description;
    private String image;
    private boolean active = true;

    public Product() {}

    public Product(String id, String name, String category, BigDecimal price, BigDecimal oldPrice,
                   BigDecimal rating, Integer reviews, String badge, String description, String image) {
        this.id = id;
        this.name = name;
        this.category = category;
        this.price = price;
        this.oldPrice = oldPrice;
        this.rating = rating;
        this.reviews = reviews;
        this.badge = badge;
        this.description = description;
        this.image = image;
        this.active = true;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }
    public BigDecimal getOldPrice() { return oldPrice; }
    public void setOldPrice(BigDecimal oldPrice) { this.oldPrice = oldPrice; }
    public BigDecimal getRating() { return rating; }
    public void setRating(BigDecimal rating) { this.rating = rating; }
    public Integer getReviews() { return reviews; }
    public void setReviews(Integer reviews) { this.reviews = reviews; }
    public String getBadge() { return badge; }
    public void setBadge(String badge) { this.badge = badge; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getImage() { return image; }
    public void setImage(String image) { this.image = image; }
    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }
}
