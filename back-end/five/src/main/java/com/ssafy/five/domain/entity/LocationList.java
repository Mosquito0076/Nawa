package com.ssafy.five.domain.entity;

import com.sun.istack.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import javax.persistence.*;

@Builder
@Getter
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "location_list")
public class LocationList {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "locId", columnDefinition = "int")
    private Long locId;

    @ManyToOne(fetch = FetchType.LAZY)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "userId")
    @NotNull
    private Users user;

    @Column(name = "locName", nullable = false, columnDefinition = "varchar(255)")
    private String locName;
    @Column(name = "locAddres", nullable = false, columnDefinition = "varchar(255)")
    private String locAddress;

    @Column(name = "locLat", nullable = false, columnDefinition = "double")
    private double locLat;

    @Column(name = "locLng", nullable = false, columnDefinition = "double")
    private double locLng;

}
