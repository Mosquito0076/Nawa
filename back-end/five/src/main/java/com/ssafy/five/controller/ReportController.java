package com.ssafy.five.controller;

import com.ssafy.five.controller.dto.req.ReportReqDto;
import com.ssafy.five.domain.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/report")
public class ReportController {

    private final ReportService reportService;

    @PostMapping
    public ResponseEntity<?> reported(@RequestBody ReportReqDto reportReqDto) {
        Map<String, Integer> reported = reportService.reported(reportReqDto);
        return new ResponseEntity<>(reported.get("result").equals(200), HttpStatus.valueOf(reported.get("result")));
    }
}
