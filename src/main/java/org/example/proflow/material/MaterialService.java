package org.example.proflow.material;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MaterialService {
    private final MaterialRepository materialRepository;

    @Autowired
    public MaterialService(final MaterialRepository materialRepository) {this.materialRepository = materialRepository;}

    public long getAllCnt(){
        return materialRepository.count();
    }

    @PersistenceContext
    private EntityManager entityManager;

    // 저장 프로시저 실행
    @Transactional
    public void insertMaterialList(List<Material> materials) {
        for (Material material : materials) {
            entityManager.createNativeQuery("CALL USP_MATERIAL_001(:name, :code, :type, :weight, :remark)")
                    .setParameter("name", material.getName())
                    .setParameter("code", material.getCode())
                    .setParameter("type", material.getType())
                    .setParameter("weight", material.getWeight())
                    .setParameter("remark", material.getRemark())
                    .executeUpdate();
        }
    }
}
