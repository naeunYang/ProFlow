package org.example.proflow.category;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Map;

public interface SubCategoryRepository extends JpaRepository<SubCategory, String> {
    //제품 유형 리스트
    @Query("SELECT s FROM SubCategory s WHERE s.mc_code = 'PRO_TYPE'")
    List<SubCategory> findAllByProType();

    //제품 단위 리스트
    @Query("SELECT s FROM SubCategory s WHERE s.mc_code = 'PRO_UNIT'")
    List<SubCategory> findAllByProUnit();

    //중량 단위 리스트
    @Query("SELECT s FROM SubCategory s WHERE s.mc_code = 'WEIGHT_UNIT'")
    List<SubCategory> findAllByWeightUnit();

    //거래처 유형 리스트
    @Query("SELECT s FROM SubCategory s WHERE s.mc_code = 'CUST_TYPE'")
    List<SubCategory> findAllByCustType();
}
