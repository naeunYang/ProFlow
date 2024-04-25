package org.example.proflow.product;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Getter
@Setter
public class ProductDTO {
    private String name;
    private String code;
    private String type;
    private String unit;
    private String weight;
    private String remark;

    public ProductDTO(String name, String code, String type, String unit, String weight, String remark) {
        this.name = name;
        this.code = code;
        this.type = type;
        this.unit = unit;
        this.weight = weight;
        this.remark = remark;
    }
}
