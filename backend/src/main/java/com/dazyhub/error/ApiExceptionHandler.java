package com.dazyhub.error;

import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.server.ResponseStatusException;

@RestControllerAdvice
public class ApiExceptionHandler {
  @ExceptionHandler(ResponseStatusException.class)
  public ResponseEntity<Map<String, String>> handleResponseStatus(ResponseStatusException exception) {
    return ResponseEntity.status(exception.getStatusCode())
        .body(Map.of("message", exception.getReason() == null ? "请求失败" : exception.getReason()));
  }

  @ExceptionHandler(BadCredentialsException.class)
  public ResponseEntity<Map<String, String>> handleBadCredentials() {
    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "用户名或密码错误"));
  }

  @ExceptionHandler(MethodArgumentNotValidException.class)
  public ResponseEntity<Map<String, String>> handleValidation() {
    return ResponseEntity.badRequest().body(Map.of("message", "请检查输入内容"));
  }
}
