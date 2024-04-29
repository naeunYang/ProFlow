package org.example.proflow.bom;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;
import org.example.proflow.material.Material;
import org.example.proflow.material.MaterialRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BomService {
    @Autowired
    private BomRepository bomRepository;

    @Autowired
    public BomService(final BomRepository bomRepository) {this.bomRepository = bomRepository;}

    @PersistenceContext
    private EntityManager entityManager;

    // 저장 프로시저 실행
    @Transactional
    public void insertMaterialList(List<Bom> boms) {
        for (Bom bom : boms) {
            entityManager.createNativeQuery("CALL USP_BOM_001(:bomCode, :proCode, :matCode, :qty)")
                    .setParameter("bomCode", bom.getBomCode())
                    .setParameter("proCode", bom.getProCode())
                    .setParameter("matCode", bom.getMatCode())
                    .setParameter("qty", bom.getQty())
                    .executeUpdate();
        }
    }
}
