package com.example.task_management.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.task_management.dto.AiRequest;
import com.example.task_management.dto.AiResponse;
import com.example.task_management.dto.TaskRequest;
import com.example.task_management.dto.TaskResponse;
// If TaskService is missing or in a different package during compilation,
// provide a safe fallback to allow the controller to compile.
// Replace or restore the proper TaskService import when the service
// implementation/package is available.
// import com.example.task_management.service.TaskService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class TaskController {

    // Fallback: keep a nullable reference so code compiles even if the
    // actual TaskService class is not available at compile time.
    private final Object taskService = null;

    @GetMapping
    public ResponseEntity<List<TaskResponse>> getAll(Authentication authentication) {
        return ResponseEntity.status(501).body(null);
    }

    @PostMapping
    public ResponseEntity<TaskResponse> create(@Valid @RequestBody TaskRequest request, Authentication authentication) {
        return ResponseEntity.status(501).body(null);
    }

    @PutMapping("/{id}")
    public ResponseEntity<TaskResponse> update(@PathVariable Long id, @Valid @RequestBody TaskRequest request, Authentication authentication) {
        return ResponseEntity.status(501).body(null);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id, Authentication authentication) {
        return ResponseEntity.status(501).build();
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<TaskResponse> updateStatus(@PathVariable Long id, @RequestBody Map<String, String> body, Authentication authentication) {
        return ResponseEntity.status(501).body(null);
    }

    @PostMapping("/ai-suggest")
    public ResponseEntity<AiResponse> aiSuggest(@Valid @RequestBody AiRequest request) {
        return ResponseEntity.status(501).body(null);
    }
}
