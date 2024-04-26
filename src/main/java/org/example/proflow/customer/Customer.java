package org.example.proflow.customer;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "CUSTOMER")
public class Customer {
    @Id
    @Column(name = "CUST_CODE", nullable = false, length = 30)
    private String code;

    @Column(name = "CUST_NAME", nullable = false, length = 30)
    private String name;

    @Column(name = "CUST_NO", length = 30)
    private String no;

    @Column(name = "CUST_TYPE", length = 20)
    private String type;

    @Column(name = "ADDR", length = 500)
    private String addr;

    @Column(name = "TEL", length = 30)
    private String tel;
}
