package org.example.proflow.category;

import org.example.proflow.customer.CustomerDTO;
import org.example.proflow.material.MaterialDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Map;

public interface SubCategoryRepository extends JpaRepository<SubCategory, String> {
    @Query("select count(s) > 0 from SubCategory s where s.sc_name = :name")
    boolean existsByScName(@Param("name") String name);

    @Query("SELECT new org.example.proflow.category.SubCategoryDTO(main.mc_name, sub.sc_code, sub.sc_name) " +
            "FROM SubCategory sub " +
            "LEFT JOIN MainCategory main ON sub.mc_code = main.mc_code " +
            "WHERE (:mccode IS NULL OR main.mc_code LIKE %:mccode%) " +
            "ORDER BY sub.mc_code, sub.sc_code")
    List<SubCategoryDTO> findAllByCategorys(@Param("mccode") String mccode);

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

    //자재 유형 리스트
    @Query("SELECT s FROM SubCategory s WHERE s.mc_code = 'MAT_TYPE' ORDER BY s.sc_code")
    List<SubCategory> findAllByMatType();

    //대분류 단위 리스트
    @Query("SELECT s FROM MainCategory s ORDER BY s.mc_code")
    List<MainCategory> findAllByUnitType();

    //소분류 단위 리스트
    @Query("SELECT s FROM SubCategory s ORDER BY s.sc_code")
    List<SubCategory> findAllBySubUnitType();

}
