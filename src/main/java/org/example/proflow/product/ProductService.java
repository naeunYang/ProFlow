package org.example.proflow.product;

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
}