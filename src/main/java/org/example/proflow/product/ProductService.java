package org.example.proflow.product;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
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
            System.out.println("Inserted product " + product.getName() + " " + product.getCode() + " " + product.getType());
        }
    }
}