package com.example.task_management.dto;

import java.time.LocalDate;

import com.example.task_management.entity.TaskStatus;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class TaskRequest {

    @NotBlank(message = "Title is required")
    private String title;

    private String description;

    private String priority;

    private String estimatedTime;

    private LocalDate dueDate;

    private TaskStatus status;
}