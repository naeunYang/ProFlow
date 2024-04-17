package org.example.proflow;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Controller
public class BoardController {
    @RequestMapping("/")
    @ResponseBody
    public BoardVO showmain(){
        BoardVO board = new BoardVO();
        board.setNo(1);
        board.setTitle("건의사항");
        board.setWriter("김말자씨");
        board.setContent("밥 많이 주세요");
        board.setDate(new Date());
        board.setCnt(0);

        return board;
    }

    @RequestMapping("/boardlist")
    @ResponseBody
    public List<BoardVO> showlist(){
        List<BoardVO> board = new ArrayList<BoardVO>();
        for (int i = 0; i < 5; i++) {
            BoardVO board1 = new BoardVO();
            board1.setNo(i);
            board1.setTitle("건의사항");
            board1.setWriter("김말자씨");
            board1.setContent("밥 많이 주세요");
            board1.setDate(new Date());
            board1.setCnt(i);

            board.add(board1);
        }
        return board;
    }

}
