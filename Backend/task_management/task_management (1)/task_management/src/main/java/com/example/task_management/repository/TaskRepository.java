package com.example.task_management.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.task_management.entity.Task;
import com.example.task_management.entity.User;

public interface TaskRepository extends JpaRepository<Task, Long> {

    List<Task> findByUser(User user);
}