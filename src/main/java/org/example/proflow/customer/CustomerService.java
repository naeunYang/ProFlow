package org.example.proflow.customer;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;
import org.example.proflow.product.Product;
import org.example.proflow.product.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CustomerService {
    private final CustomerRepository customerRepository;

    @Autowired
    public CustomerService(CustomerRepository customerRepository) {
        this.customerRepository = customerRepository;
    }

    public long getAllCnt(){
        return customerRepository.count();
    }

    @PersistenceContext
    private EntityManager entityManager;

    // 저장 프로시저 실행
    @Transactional
    public void insertCustomerList(List<Customer> customers) {
        for (Customer customer : customers) {
            entityManager.createNativeQuery("CALL USP_CUSTOMER_001(:name, :code, :no, :type, :addr, :tel)")
                    .setParameter("name", customer.getName())
                    .setParameter("code", customer.getCode())
                    .setParameter("no", customer.getNo())
                    .setParameter("type", customer.getType())
                    .setParameter("addr", customer.getAddr())
                    .setParameter("tel", customer.getTel())
                    .executeUpdate();
        }
    }
}
