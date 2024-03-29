package com.ssafy.five.controller.dto.req;

import com.ssafy.five.domain.entity.Board;
import com.ssafy.five.domain.entity.Comment;
import com.ssafy.five.domain.entity.Users;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.Date;

@Getter
@Setter
@ToString
public class RegistCmtReqDto {

    private Long boardId;

    private String userId;

    private String cmtContent;

    public Comment toEntity(Board boardEntity, Users usersEntity) {
        return Comment.builder()
                .user(usersEntity)
                .cmtContent(this.cmtContent)
                .board(boardEntity)
                .cmtDate(new Date())
                .cmtUpdate(new Date())
                .build();
    }

}
