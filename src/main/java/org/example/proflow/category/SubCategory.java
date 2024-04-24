package org.example.proflow.category;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "SUB_CATEGORY")
public class SubCategory{
    @Id
    @Column(name = "SC_CODE", nullable = false, length = 30)
    private String sc_code;

    @Column(name = "MC_CODE", nullable = false, length = 30)
    private String mc_code;

    @Column(name = "SC_NAME", nullable = false, length = 30)
    private String sc_name;
}
