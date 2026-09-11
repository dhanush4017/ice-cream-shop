package com.icytales.backend.config;

import com.icytales.backend.entity.Product;
import com.icytales.backend.repository.ProductRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.math.BigDecimal;

@Configuration
public class DataInitializer {
    @Bean
    CommandLineRunner seedProducts(ProductRepository repository) {
        return args -> {
            if (repository.count() > 0) {
                updateProductPrices(repository);
                return;
            }
            repository.save(new Product("classic-vanilla", "Classic Vanilla Ice Cream", "ice-cream-cones", new BigDecimal("55.00"), null, new BigDecimal("4.9"), 128, "Best Seller", "Creamy vanilla ice cream topped with a cherry, served in a crisp waffle cone. Made with real Madagascar vanilla for a rich, classic flavor everyone loves.", "/product-images/product-01.jpg"));
            repository.save(new Product("chocolate-brownie-sundae", "Chocolate Brownie Sundae", "sundaes", new BigDecimal("58.00"), null, new BigDecimal("4.8"), 96, null, "Rich chocolate ice cream loaded with chunks of fudgy brownie, drizzled with warm chocolate sauce. A decadent treat for true chocolate lovers.", "/product-images/product-02.jpg"));
            repository.save(new Product("strawberry-shortcake", "Strawberry Shortcake", "ice-cream-cakes", new BigDecimal("52.00"), null, new BigDecimal("4.9"), 74, null, "Layers of strawberry ice cream and moist shortcake, topped with fresh strawberries and a light cream glaze.", "/product-images/product-03.jpg"));
            repository.save(new Product("mint-chocolate-chip-cone", "Mint Chocolate Chip Cone", "ice-cream-cones", new BigDecimal("50.00"), null, new BigDecimal("4.9"), 112, null, "Refreshing mint ice cream studded with chocolate chips, served in a crunchy waffle cone. Cool, sweet, and endlessly refreshing.", "/product-images/product-04.jpg"));
            repository.save(new Product("strawberry-sundae", "Strawberry Sundae", "sundaes", new BigDecimal("60.00"), new BigDecimal("70.00"), new BigDecimal("4.9"), 88, "Sale", "Strawberry ice cream topped with fresh strawberries and a delicate swirl of whipped cream.", "/product-images/product-05.jpg"));
            repository.save(new Product("chocolate-chip-cookie-cone", "Chocolate Chip Cookie Cone", "ice-cream-cones", new BigDecimal("54.00"), new BigDecimal("68.00"), new BigDecimal("4.9"), 65, "Sale", "Chocolate chip cookie dough ice cream packed into a crisp cone - a favorite among cookie dough fans.", "/product-images/product-06.jpg"));
            repository.save(new Product("rocky-road-sundae", "Rocky Road Sundae", "sundaes", new BigDecimal("57.00"), new BigDecimal("69.00"), new BigDecimal("4.9"), 59, "Sale", "Marshmallow and nutty rocky road ice cream piled high in a glass, finished with a chocolate drizzle.", "/product-images/product-07.jpg"));
            repository.save(new Product("peach-melba-sundae", "Peach Melba Sundae", "sundaes", new BigDecimal("53.00"), new BigDecimal("72.00"), new BigDecimal("4.9"), 41, "Sale", "Peach ice cream topped with raspberry sauce and fresh fruit for a bright, fruity finish.", "/product-images/product-08.jpg"));
            repository.save(new Product("classic-pistachio-gelato", "Classic Pistachio Gelato", "gelato", new BigDecimal("59.00"), null, new BigDecimal("4.9"), 54, null, "Neque porro ruisquam est aui dolorem ipsum ruia do sit amet consectetur, adipiscit velit, sed quia non num quod modi tempoa incidunt ut labore et dolore magna. Quia voluptas sit aspernatur aut odit aut fugit.", "/product-images/product-09.jpg"));
            repository.save(new Product("strawberry-balsamic-gelato", "Strawberry Balsamic Gelato", "gelato", new BigDecimal("56.00"), null, new BigDecimal("4.9"), 47, null, "A sweet-and-tangy gelato swirling ripe strawberries with a hint of aged balsamic for a sophisticated twist.", "/product-images/product-10.jpg"));
            repository.save(new Product("chocolate-hazelnut-gelato", "Chocolate Hazelnut Gelato", "gelato", new BigDecimal("58.00"), null, new BigDecimal("4.9"), 63, null, "Silky chocolate gelato blended with roasted hazelnuts for a nutty, indulgent bite.", "/product-images/product-11.jpg"));
            repository.save(new Product("tiramisu-gelato", "Tiramisu Gelato", "gelato", new BigDecimal("55.00"), null, new BigDecimal("4.9"), 39, null, "Coffee-soaked ladyfingers and mascarpone come together in this classic Italian dessert, reimagined as gelato.", "/product-images/product-12.jpg"));
            repository.save(new Product("coconut-milk-chocolate-chip", "Coconut Milk Chocolate Chip", "ice-cream-cones", new BigDecimal("52.00"), null, new BigDecimal("4.9"), 82, null, "Dairy-free coconut milk ice cream studded with chocolate chips - creamy, tropical, and completely plant-based.", "/product-images/product-13.jpg"));
            repository.save(new Product("almond-joy-sundae", "Almond Joy Sundae", "sundaes", new BigDecimal("60.00"), null, new BigDecimal("4.9"), 44, null, "Toasted almonds and coconut flakes over creamy vanilla ice cream, finished with a chocolate ribbon.", "/product-images/product-14.jpg"));
            repository.save(new Product("berry-sorbet", "Berry Sorbet", "popsicles", new BigDecimal("51.00"), null, new BigDecimal("4.9"), 57, null, "A refreshing dairy-free sorbet bursting with mixed berries - light, fruity, and naturally sweet.", "/product-images/product-15.jpg"));
            repository.save(new Product("chocolate-fudge", "Chocolate Fudge", "ice-cream-cones", new BigDecimal("57.00"), null, new BigDecimal("4.9"), 91, null, "Dense, fudgy chocolate ice cream for the deepest chocolate cravings.", "/product-images/product-16.jpg"));
            repository.save(new Product("dairy-free-classic", "Dairy Free Classic", "milkshakes", new BigDecimal("54.00"), null, new BigDecimal("4.9"), 36, null, "A smooth, dairy-free classic vanilla shake made with oat milk - creamy without the cream.", "/product-images/product-17.jpg"));
            repository.save(new Product("dairy-free-almond", "Dairy Free Almond", "milkshakes", new BigDecimal("59.00"), null, new BigDecimal("4.9"), 28, null, "Toasted almond flavor blended into a rich, dairy-free milkshake base.", "/product-images/product-18.jpg"));
            repository.save(new Product("mint-chocolate", "Mint Chocolate", "popsicles", new BigDecimal("50.00"), null, new BigDecimal("4.8"), 33, null, "A refreshing mint ice cream pop with chunks of dark chocolate chips.", "/product-images/product-19.jpg"));
            repository.save(new Product("stawberry-cake", "Strawberry Cake", "ice-cream-cakes", new BigDecimal("56.00"), null, new BigDecimal("4.9"), 22, null, "Strawberry ice cream layered with shortcake and fresh berries.", "/product-images/product-20.jpg"));
        };
    }
    private void updateProductPrices(ProductRepository repository) {
        updatePrice(repository, "classic-vanilla", "55.00", null);
        updatePrice(repository, "chocolate-brownie-sundae", "58.00", null);
        updatePrice(repository, "strawberry-shortcake", "52.00", null);
        updatePrice(repository, "mint-chocolate-chip-cone", "50.00", null);
        updatePrice(repository, "strawberry-sundae", "60.00", "70.00");
        updatePrice(repository, "chocolate-chip-cookie-cone", "54.00", "68.00");
        updatePrice(repository, "rocky-road-sundae", "57.00", "69.00");
        updatePrice(repository, "peach-melba-sundae", "53.00", "72.00");
        updatePrice(repository, "classic-pistachio-gelato", "59.00", null);
        updatePrice(repository, "strawberry-balsamic-gelato", "56.00", null);
        updatePrice(repository, "chocolate-hazelnut-gelato", "58.00", null);
        updatePrice(repository, "tiramisu-gelato", "55.00", null);
        updatePrice(repository, "coconut-milk-chocolate-chip", "52.00", null);
        updatePrice(repository, "almond-joy-sundae", "60.00", null);
        updatePrice(repository, "berry-sorbet", "51.00", null);
        updatePrice(repository, "chocolate-fudge", "57.00", null);
        updatePrice(repository, "dairy-free-classic", "54.00", null);
        updatePrice(repository, "dairy-free-almond", "59.00", null);
        updatePrice(repository, "mint-chocolate", "50.00", null);
        updatePrice(repository, "stawberry-cake", "56.00", null);
    }

    private void updatePrice(ProductRepository repository, String id, String price, String oldPrice) {
        repository.findById(id).ifPresent(product -> {
            product.setPrice(new BigDecimal(price));
            product.setOldPrice(oldPrice == null ? null : new BigDecimal(oldPrice));
            repository.save(product);
        });
    }

}
