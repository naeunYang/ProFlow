package org.example.proflow.material;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Getter
@Setter
public class MaterialDTO {
    private String name;
    private String code;
    private String type;
    private String weight;
    private String remark;

    public MaterialDTO(String name, String code, String type, String weight, String remark) {
        this.name = name;
        this.code = code;
        this.type = type;
        this.weight = weight;
        this.remark = remark;
    }
}
