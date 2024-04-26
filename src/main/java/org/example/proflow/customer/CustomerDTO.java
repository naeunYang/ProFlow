package org.example.proflow.customer;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Getter
@Setter
public class CustomerDTO {
    private String name;
    private String code;
    private String no;
    private String type;
    private String addr;
    private String tel;

    public CustomerDTO(String name, String code, String no, String type, String addr, String tel) {
        this.name = name;
        this.code = code;
        this.no = no;
        this.type = type;
        this.addr = addr;
        this.tel = tel;
    }
}
