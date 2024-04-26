package org.example.proflow.material;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "MATERIAL")
public class Material {
    @Id
    @Column(name = "MAT_CODE", nullable = false, length = 30)
    private String code;

    @Column(name = "MAT_NAME", nullable = false, length = 30)
    private String name;

    @Column(name = "MAT_TYPE", length = 20)
    private String type;

    @Column(name = "WEIGHT", length = 50)
    private String weight;

    @Column(name = "REMARK", length = 500)
    private String remark;
}
