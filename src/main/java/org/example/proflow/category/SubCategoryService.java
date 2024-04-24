package org.example.proflow.category;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class SubCategoryService {
    private final SubCategoryRepository subCategoryRepository;

    @Autowired
    public SubCategoryService(final SubCategoryRepository subCategoryRepository) {
        this.subCategoryRepository = subCategoryRepository;
    }
}
