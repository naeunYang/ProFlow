package org.example.proflow.category;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface SubCategoryRepository extends JpaRepository<SubCategory, String> {
    @Query("SELECT s.sc_name  FROM SubCategory s WHERE s.mc_code = 'PRO_TYPE'")
    List<String> findAllByProType();
}
