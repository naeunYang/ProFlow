package org.example.proflow.login;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@Controller
public class MemberController {
    private final MemberService memberService;
    private final MemberRepository memberRepository;

    @Autowired
    public MemberController(MemberService memberService, MemberRepository memberRepository) {
        this.memberService = memberService;
        this.memberRepository = memberRepository;
    }

    // 로그인 페이지
    @GetMapping("/login")
    public String login() {
        return "login";
    }

    // 회원가입 페이지
    @GetMapping("/signUp")
    public String signUp() {
        return "signUp";
    }

    // 로그인 검사
    @PostMapping("/loginCheck")
    public String checkLogin(@RequestBody Map<String, String> userInfo){
        String id = userInfo.get("username");
        String password = userInfo.get("password");
        System.out.println("아이디 : " + id + " 비밀번호 : " + password);
        Optional<Member> memberOptional = memberRepository.findById(id);
        if (memberOptional.isPresent()) { // isPresent() : Optional 객체가 비어있지 않고 값이 존재할 때 true를 반환하고, 값이 존재하지 않을 때 false를 반환
            Member member = memberOptional.get();
            if (member.getPwd().equals(password)) {
                // 비밀번호 일치
                return "1";
            } else {
                // 비밀번호 불일치
                return "0";
            }
        } else {
            // 아이디가 존재하지 않음
            return "-1";
        }
    }
}
