package org.example.proflow.product;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "PRODUCTION")
public class Product {
    @Id
    @Column(name = "PRO_CODE", nullable = false, length = 30)
    private String code;

    @Column(name = "PRO_NAME", nullable = false, length = 30)
    private String name;

    @Column(name = "PRO_TYPE", length = 2)
    private String type;

    @Column(name = "UNIT", length = 20)
    private String unit;

    @Column(name = "WEIGHT", length = 50)
    private String weight;

    @Column(name = "REMARK", length = 500)
    private String remark;
}

