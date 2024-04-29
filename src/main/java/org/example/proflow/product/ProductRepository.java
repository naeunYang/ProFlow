package org.example.proflow.product;

import org.example.proflow.category.SubCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, String> {
    boolean existsByName(String name); //제품명 포함여부 검사
/*    List<Product> findByNameContaining(String name); //검색 조건 name
    List<Product> findByCodeContaining(String code); //검색 조건 code
    List<Product> findByTypeContaining(String type); //검색 조건 type

    //조회 쿼리
    @Query("SELECT new org.example.proflow.product.ProductDTO(pro.name, pro.code, sub.sc_name, sub1.sc_name, pro.weight, pro.remark) FROM Product pro LEFT OUTER JOIN SubCategory sub ON pro.type = sub.sc_code LEFT OUTER JOIN SubCategory sub1 ON pro.unit = sub1.sc_code ORDER BY pro.code")
    List<ProductDTO> findAllByProducts();*/

    @Query("SELECT new org.example.proflow.product.ProductDTO(pro.name, pro.code, sub.sc_name, sub1.sc_name, pro.weight, pro.remark) " +
            "FROM Product pro " +
            "LEFT JOIN SubCategory sub ON pro.type = sub.sc_code " +
            "LEFT JOIN SubCategory sub1 ON pro.unit = sub1.sc_code " +
            "WHERE (:name IS NULL OR LOWER(pro.name) LIKE LOWER(CONCAT('%', :name, '%'))) " +
            "AND (:code IS NULL OR LOWER(pro.code) LIKE LOWER(CONCAT('%', :code, '%'))) " +
            "AND (:type IS NULL OR LOWER(pro.type) LIKE LOWER(CONCAT('%', :type, '%'))) " +
            "ORDER BY pro.name")
    List<ProductDTO> findAllByProducts(@Param("name") String name, @Param("code") String code, @Param("type") String type);

    @Query("SELECT new org.example.proflow.product.ProductDTO(pro.name, pro.code, sub.sc_name, sub1.sc_name, pro.weight, pro.remark) " +
            "FROM Product pro " +
            "LEFT JOIN SubCategory sub ON pro.type = sub.sc_code " +
            "LEFT JOIN SubCategory sub1 ON pro.unit = sub1.sc_code " +
            "WHERE (:name IS NULL OR pro.name LIKE %:name%) " +
            "ORDER BY pro.name")
    List<ProductDTO> findAllByProducts(@Param("name") String name);

}

