package org.example.proflow.product;

import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductRepository extends JpaRepository<Product, String> {
    boolean existsByName(String name); //제품명 포함여부 검사
}

