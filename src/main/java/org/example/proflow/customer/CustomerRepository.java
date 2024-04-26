package org.example.proflow.customer;

import org.example.proflow.product.ProductDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface CustomerRepository extends JpaRepository<Customer, String> {
    boolean existsByName(String name); //거래처명 포함여부 검사

    @Query("SELECT new org.example.proflow.customer.CustomerDTO(cust.name, cust.code, cust.no, sub.sc_name, cust.addr, cust.tel) " +
            "FROM Customer cust " +
            "LEFT JOIN SubCategory sub ON cust.type = sub.sc_code " +
            "WHERE (:name IS NULL OR cust.name LIKE %:name%) " +
            "AND (:code IS NULL OR cust.code LIKE %:code%) " +
            "AND (:type IS NULL OR cust.type LIKE %:type%) " +
            "ORDER BY cust.code")
    List<CustomerDTO> findAllByCustomers(@Param("name") String name, @Param("code") String code, @Param("type") String type);
}
