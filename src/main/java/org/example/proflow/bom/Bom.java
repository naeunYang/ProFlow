package org.example.proflow.bom;

import jakarta.persistence.*;
import lombok.Data;
import org.example.proflow.material.Material;
import org.example.proflow.product.Product;

@Data
@Entity
@Table(name = "BOM")
public class Bom {

    @Id
    @Column(name = "BOM_CODE")
    private String bomCode;

    @Column(name = "PRO_CODE")
    private String proCode;

    @Column(name = "MAT_CODE")
    private String matCode;

    @Column(name = "QTY")
    private int qty;

}
