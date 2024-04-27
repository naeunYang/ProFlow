package org.example.proflow.category;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Getter
@Setter
public class SubCategoryDTO {
    private String mc_name;
    private String sc_code;
    private String sc_name;

    public SubCategoryDTO(String mc_name, String sc_code, String sc_name) {
        this.mc_name = mc_name;
        this.sc_code = sc_code;
        this.sc_name = sc_name;
    }
}
