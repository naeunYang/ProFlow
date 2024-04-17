package org.example.proflow;

import lombok.Data;
import java.util.Date;

@Data
public class BoardVO {
    private int no;
    private String title;
    private String content;
    private String writer;
    private Date date;
    private int cnt;
}
