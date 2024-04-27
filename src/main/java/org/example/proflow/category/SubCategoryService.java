package org.example.proflow.category;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;
import org.example.proflow.material.Material;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SubCategoryService {

    private final SubCategoryRepository subCategoryRepository;

    @Autowired
    public SubCategoryService(final SubCategoryRepository subCategoryRepository) {
        this.subCategoryRepository = subCategoryRepository;
    }

    public long getAllCnt(){
        return subCategoryRepository.count();
    }

    @PersistenceContext
    private EntityManager entityManager;

    // 저장 프로시저 실행
    @Transactional
    public void insertCategoryList(List<SubCategory> categorys) {
        for (SubCategory category : categorys) {
            entityManager.createNativeQuery("CALL USP_CATEGORY_001(:mc_code, :sc_code, :sc_name)")
                    .setParameter("mc_code", category.getMc_code())
                    .setParameter("sc_code", category.getSc_code())
                    .setParameter("sc_name", category.getSc_name())
                    .executeUpdate();
        }
    }

}
