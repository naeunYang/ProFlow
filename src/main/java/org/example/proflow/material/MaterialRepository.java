package org.example.proflow.material;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface MaterialRepository extends JpaRepository<Material, String> {
    boolean existsByName(String name);

    @Query("SELECT new org.example.proflow.material.MaterialDTO(mat.name, mat.code, sub.sc_name, mat.weight, mat.remark) " +
            "FROM Material mat " +
            "LEFT JOIN SubCategory sub ON mat.type = sub.sc_code " +
            "WHERE (:name IS NULL OR mat.name LIKE %:name%) " +
            "AND (:code IS NULL OR mat.code LIKE %:code%) " +
            "AND (:type IS NULL OR mat.type LIKE %:type%) " +
            "ORDER BY mat.name")
    List<MaterialDTO> findAllByMaterials(@Param("name") String name, @Param("code") String code, @Param("type") String type);

    @Query("SELECT new org.example.proflow.material.MaterialDTO(mat.name, mat.code, sub.sc_name, mat.weight, mat.remark) " +
            "FROM Material mat " +
            "LEFT JOIN SubCategory sub ON mat.type = sub.sc_code " +
            "WHERE (:name IS NULL OR mat.name LIKE %:name%) " +
            "ORDER BY mat.name")
    List<MaterialDTO> findAllByMaterials(@Param("name") String name);
}
