package org.example.proflow.login;

import org.springframework.data.jpa.repository.JpaRepository;

public interface MemberRepository extends JpaRepository<Member, String> {
    boolean existsByid(String id); // 아이디 포함 여부 확인
}
