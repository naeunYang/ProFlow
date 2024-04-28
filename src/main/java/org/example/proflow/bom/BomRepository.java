package org.example.proflow.bom;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface BomRepository extends JpaRepository<Bom, String> {

    @Query("SELECT new org.example.proflow.bom.BomDTO(bom.bomCode, pro.name, mat.name, mat.code, sub.sc_name, bom.qty) " +
            "FROM Bom bom " +
            "LEFT OUTER JOIN Product pro on bom.proCode = pro.code " +
            "LEFT OUTER JOIN Material mat on bom.matCode = mat.code " +
            "LEFT OUTER JOIN SubCategory sub on mat.type = sub.sc_code "+
            "WHERE (:name IS NULL OR pro.name LIKE %:name%) " +
            "ORDER BY mat.name")
    List<BomDTO> findAllByBoms(@Param("name") String name);


}
