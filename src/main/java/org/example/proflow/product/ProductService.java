package org.example.proflow.product;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.jdbc.repository.query.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductService {
    private final ProductRepository productRepository;

    @Autowired
    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public List<Product> getAllProducts() {
        Sort sort = Sort.by(Sort.Direction.ASC, "code"); //code값으로 정렬
        return productRepository.findAll(sort);
    }

    public long getAllCnt(){
        return productRepository.count();
    }

    @PersistenceContext
    private EntityManager entityManager;

    // 저장 프로시저 실행
    @Transactional
    public void insertProductList(List<Product> products) {
        for (Product product : products) {
            entityManager.createNativeQuery("CALL USP_PRODUCT_001(:name, :code, :type, :unit, :weight, :remark)")
                    .setParameter("name", product.getName())
                    .setParameter("code", product.getCode())
                    .setParameter("type", product.getType())
                    .setParameter("unit", product.getUnit())
                    .setParameter("weight", product.getWeight())
                    .setParameter("remark", product.getRemark())
                    .executeUpdate();
        }
    }

    // 검색조건 : name
    public List<Product> getProductsByName(String name) {
        return productRepository.findByNameContaining(name);
    }

    // 검색조건 : code
    public List<Product> getProductsByCode(String code) {
        return productRepository.findByCodeContaining(code);
    }

    // 검색조건 : type
    public List<Product> getProductsByType(String type) {
        return productRepository.findByTypeContaining(type);
    }
}