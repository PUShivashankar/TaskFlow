package com.example.task_management.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@AllArgsConstructor
@Builder
public class AiResponse {

    private String description;

    private String priority;

    private String estimatedTime;
}