package com.dazyhub;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class DazyHubApplication {
  public static void main(String[] args) {
    SpringApplication.run(DazyHubApplication.class, args);
  }
}
