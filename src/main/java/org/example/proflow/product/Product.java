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
    @Column(name = "CODE", nullable = false, length = 30)
    private String code;

    @Column(name = "NAME", nullable = false, length = 30)
    private String name;

    @Column(name = "TYPE", length = 30)
    private String type;

    @Column(name = "UNIT", length = 30)
    private String unit;

    @Column(name = "WEIGHT", length = 30)
    private float weight;

    @Column(name = "REMARK", length = 30)
    private String remark;
}
