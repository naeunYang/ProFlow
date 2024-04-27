package org.example.proflow.category;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "MAIN_CATEGORY")
public class MainCategory {
    @Id
    @Column(name = "MC_CODE", nullable = false, length = 30)
    private String mc_code;

    @Column(name = "MC_NAME", nullable = false, length = 30)
    private String mc_name;
}
