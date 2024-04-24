package org.example.proflow.login;

import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.HashMap;
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
    @ResponseBody
    public Map<String, String> checkLogin(@RequestBody Map<String, String> userInfo, HttpSession session){
        String id = userInfo.get("username");
        String password = userInfo.get("password");
        Optional<Member> memberOptional = memberRepository.findById(id);

        Map<String, String> response = new HashMap<>();
        if (memberOptional.isPresent()) { // isPresent() : Optional 객체가 비어있지 않고 값이 존재할 때 true를 반환하고, 값이 존재하지 않을 때 false를 반환
            Member member = memberOptional.get();
            if (member.getPwd().equals(password)) {
                // 비밀번호 일치
                session.setAttribute("user", member); //세션 저장
                response.put("status", "1");
                response.put("userName", member.getName());
            } else {
                // 비밀번호 불일치
                response.put("status", "0");
            }
        } else {
            // 아이디가 존재하지 않음
            response.put("status", "-1");
        }

        return response;
    }

    // 아이디 중복 검사
    @PostMapping("/idCheck")
    @ResponseBody
    public boolean checkSignUp(@RequestBody Map<String, String> info) {
        String id = info.get("id");
        // 포함됨
        if(memberRepository.existsByid(id)){
            return true;
        }else{ // 포함되지 않음
            return false;
        }
    }

    // 회원정보 저장
    @PostMapping("/signUp/insert")
    @ResponseBody
    public ResponseEntity<?> insertUserInfo(@RequestBody Member member, HttpSession session) {
        memberRepository.save(member); //세션 저장
        session.setAttribute("user", member);

        return ResponseEntity.ok().body("{\"message\":\"Insert successful\"}");
    }

}
