package com.ssafy.five.entity;

import lombok.*;

import javax.persistence.*;
import java.io.File;
import java.time.LocalDateTime;

@Entity
@Builder
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "user")
public class User {

    // 유저 아이디
    @Id
    @Column(name = "userId", nullable = false, columnDefinition = "varchar(20)")
    private String userId;

    // 비밀번호
    @Column(name = "password", nullable = false, columnDefinition = "varchar(20)")
    private String password;

    // 생년월일
    @Column(name = "birth", nullable = false, columnDefinition = "varchar(8)")
    private String birth;

    // 이메일 아이디
    @Column(name = "emailId", nullable = false, columnDefinition = "varchar(20)")
    private String emailId;

    // 이메일 도메인
    @Column(name = "emailDomain", nullable = false, columnDefinition = "varchar(20)")
    private String emailDomain;

    // 이름
    @Column(name = "name", nullable = false, columnDefinition = "varchar(40)")
    private String name;

    // 닉네임
    @Column(name = "nickname", nullable = false, columnDefinition = "varchar(40)")
    private String nickname;

    // 자기소개
    @Column(name = "ment", columnDefinition = "varchar(255)")
    private String ment;

    // 전화번호
    @Column(name = "number", nullable = false, columnDefinition = "varchar(11)")
    private String number;

    // 성별
    @Enumerated(EnumType.STRING)
    @Column(name = "gender", nullable = false, columnDefinition = "enum")
    private Gender gender;

    // 사진
    @Column(name = "picture", nullable = false, columnDefinition = "text")
    private File picture;

    // 인기점수
    @Column(name = "point", nullable = false, columnDefinition = "float")
    private float point;

    // 사용자 상태
    @Enumerated(EnumType.STRING)
    @Column(name = "state", nullable = false, columnDefinition = "enum")
    private State state;

    // 신고 횟수
    @Column(name = "reportCount", nullable = false, columnDefinition = "int")
    private int reportCount;

    // 정지 해제일
    @Column(name = "endDate", columnDefinition = "LocalDateTime")
    private LocalDateTime endDate;

    // 역할
    @Column(name = "role", nullable = false, columnDefinition = "varchar(15)")
    private String role;

    private enum State{
        NORMAL, STOPPED
    }

    private enum Gender{
        MAN, WOMAN
    }
}
