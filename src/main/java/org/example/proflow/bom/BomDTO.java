package org.example.proflow.bom;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Getter
@Setter
public class BomDTO {
    private String bomCode;
    private String proName;
    private String matName;
    private String matCode;
    private String matType;
    private int qty;

    public BomDTO(String bomCode, String proName, String matName, String matCode, String matType, int qty) {
        this.bomCode = bomCode;
        this.proName = proName;
        this.matName = matName;
        this.matCode = matCode;
        this.matType = matType;
        this.qty = qty;
    }
}
