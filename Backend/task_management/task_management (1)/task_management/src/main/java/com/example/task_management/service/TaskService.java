package com.example.task_management.service;

import java.util.List;
import java.util.Map;

import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import com.example.task_management.dto.AiRequest;
import com.example.task_management.dto.AiResponse;
import com.example.task_management.dto.TaskRequest;
import com.example.task_management.dto.TaskResponse;
import com.example.task_management.entity.Task;
import com.example.task_management.entity.TaskStatus;
import com.example.task_management.entity.User;
import com.example.task_management.repository.TaskRepository;
import com.example.task_management.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TaskService {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;

    private User getUser(Authentication authentication) {
        String email = authentication.getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    private TaskResponse toResponse(Task task) {
        return TaskResponse.builder()
                .id(task.getId())
                .title(task.getTitle())
                .description(task.getDescription())
                .priority(task.getPriority())
                .estimatedTime(task.getEstimatedTime())
                .dueDate(task.getDueDate())
                .status(task.getStatus())
                .createdAt(task.getCreatedAt())
                .updatedAt(task.getUpdatedAt())
                .build();
    }

    public List<TaskResponse> getAllTasks(Authentication authentication) {
        User user = getUser(authentication);
        return taskRepository.findByUser(user)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public TaskResponse createTask(TaskRequest request, Authentication authentication) {
        User user = getUser(authentication);

        Task task = Task.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .priority(request.getPriority())
                .estimatedTime(request.getEstimatedTime())
                .dueDate(request.getDueDate())
                .status(request.getStatus() != null ? request.getStatus() : TaskStatus.TODO)
                .user(user)
                .build();

        taskRepository.save(task);
        return toResponse(task);
    }

    public TaskResponse updateTask(Long id, TaskRequest request, Authentication authentication) {
        User user = getUser(authentication);

        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        if (!task.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Not authorized to modify this task");
        }

        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setPriority(request.getPriority());
        task.setEstimatedTime(request.getEstimatedTime());
        task.setDueDate(request.getDueDate());
        if (request.getStatus() != null) {
            task.setStatus(request.getStatus());
        }

        taskRepository.save(task);
        return toResponse(task);
    }

    public void deleteTask(Long id, Authentication authentication) {
        User user = getUser(authentication);

        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        if (!task.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Not authorized to delete this task");
        }

        taskRepository.delete(task);
    }

    public TaskResponse updateStatus(Long id, Map<String, String> body, Authentication authentication) {
        User user = getUser(authentication);

        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        if (!task.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Not authorized to modify this task");
        }

        String status = body.get("status");
        if (status != null) {
            task.setStatus(TaskStatus.valueOf(status));
        }

        taskRepository.save(task);
        return toResponse(task);
    }

    public AiResponse aiSuggest(AiRequest request) {
        String title = request.getTitle().toLowerCase();

        String priority;
        String estimatedTime;
        String description;

        if (title.contains("urgent") || title.contains("bug") || title.contains("fix") || title.contains("critical")) {
            priority = "HIGH";
            estimatedTime = "2 hours";
        } else if (title.contains("research") || title.contains("plan") || title.contains("explore")) {
            priority = "LOW";
            estimatedTime = "1 day";
        } else {
            priority = "MEDIUM";
            estimatedTime = "4 hours";
        }

        description = "Complete the task: \"" + request.getTitle() + "\". "
                + "Break it down into smaller steps, identify any blockers, "
                + "and update the status as you make progress.";

        return AiResponse.builder()
                .description(description)
                .priority(priority)
                .estimatedTime(estimatedTime)
                .build();
    }
}
