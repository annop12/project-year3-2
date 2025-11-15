package com.example.doctoralia.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.sql.DataSource;
import java.sql.Connection;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/health")
public class HealthController {

    @Autowired
    private DataSource dataSource;

    @GetMapping
    public ResponseEntity<Map<String, Object>> healthCheck() {
        Map<String, Object> health = new HashMap<>();

        health.put("status", "UP");
        health.put("timestamp", LocalDateTime.now().toString());
        health.put("service", "Doctora Backend API");
        health.put("version", "1.0.0");

        // Check database connection
        try (Connection conn = dataSource.getConnection()) {
            health.put("database", "UP");
        } catch (Exception e) {
            health.put("database", "DOWN");
            health.put("error", e.getMessage());
            return ResponseEntity.status(503).body(health);
        }

        return ResponseEntity.ok(health);
    }

    @GetMapping("/ping")
    public ResponseEntity<Map<String, String>> ping() {
        Map<String, String> response = new HashMap<>();
        response.put("status", "pong");
        response.put("timestamp", LocalDateTime.now().toString());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/ready")
    public ResponseEntity<Map<String, Object>> readiness() {
        Map<String, Object> readiness = new HashMap<>();

        // Check if application is ready to serve traffic
        try (Connection conn = dataSource.getConnection()) {
            boolean isValid = conn.isValid(2);
            readiness.put("database", isValid ? "READY" : "NOT_READY");
            readiness.put("status", isValid ? "READY" : "NOT_READY");

            if (isValid) {
                return ResponseEntity.ok(readiness);
            } else {
                return ResponseEntity.status(503).body(readiness);
            }
        } catch (Exception e) {
            readiness.put("status", "NOT_READY");
            readiness.put("error", e.getMessage());
            return ResponseEntity.status(503).body(readiness);
        }
    }

    @GetMapping("/live")
    public ResponseEntity<Map<String, String>> liveness() {
        // Simple liveness check - just return if app is running
        Map<String, String> liveness = new HashMap<>();
        liveness.put("status", "ALIVE");
        liveness.put("timestamp", LocalDateTime.now().toString());
        return ResponseEntity.ok(liveness);
    }
}
