package com.ssafy.five.entity;

import com.sun.istack.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Builder
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "calendar")
public class Calendar {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "calId", nullable = false, columnDefinition = "Long")
    private Long calId;

    @ManyToOne(fetch = FetchType.LAZY)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "userId")
    @NotNull
    private Users users;

    @Column(name = "calContent", nullable = false, columnDefinition = "varchar(255)")
    private String calContent;


    // 협의 필요
    @Column(name = "calDate", nullable = false, columnDefinition = "LocalDateTime")
    private LocalDateTime calDate;
}
