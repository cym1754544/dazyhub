package com.dazyhub.auth;

import java.time.Instant;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class VerificationCodeStore {
  private final Map<String, CodeEntry> store = new ConcurrentHashMap<>();

  private record CodeEntry(String code, Instant expiresAt) {}

  public void put(String email, String code) {
    store.put(email, new CodeEntry(code, Instant.now().plusSeconds(300)));
  }

  public boolean verify(String email, String code) {
    CodeEntry entry = store.get(email);
    if (entry == null || Instant.now().isAfter(entry.expiresAt)) {
      store.remove(email);
      return false;
    }
    if (entry.code.equals(code)) {
      store.remove(email);
      return true;
    }
    return false;
  }

  @Scheduled(fixedRate = 60000)
  void cleanExpired() {
    Instant now = Instant.now();
    store.entrySet().removeIf(e -> now.isAfter(e.getValue().expiresAt));
  }
}
