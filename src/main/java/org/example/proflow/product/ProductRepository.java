package org.example.proflow.product;

import org.springframework.data.jdbc.repository.query.Query;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, String> {
    boolean existsByName(String name); //제품명 포함여부 검사
    List<Product> findByNameContaining(String name); //검색 조건 name
    List<Product> findByCodeContaining(String code); //검색 조건 code
    List<Product> findByTypeContaining(String type); //검색 조건 type
}

