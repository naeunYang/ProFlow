package org.example.proflow.login;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "MEMBER")
public class Member {
    @Id
    @Column(name = "ID", nullable = false, length = 30)
    private String id;

    @Column(name = "PWD", nullable = false, length = 50)
    private String pwd;

    @Column(name = "NAME", nullable = false, length = 20)
    private String name;

    @Column(name = "TEL", length = 20)
    private String tel;

    @Column(name = "EMAIL", length = 30)
    private String email;

}