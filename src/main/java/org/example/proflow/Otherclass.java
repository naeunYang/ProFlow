package org.example.proflow;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

@Controller
public class Otherclass {
    @RequestMapping("/board")
    @ResponseBody
    public BoardVO getboard(){
        BoardVO board = new BoardVO();
        board.setTitle("건의사항");
        board.setContent("밥 많이 주세요");

        return board;
    }

/*    @RequestMapping("/yuhan")
    @ResponseBody*/
    @GetMapping("/yuhan")
    public String yuhan(){
        return "hihi";
    }
}
