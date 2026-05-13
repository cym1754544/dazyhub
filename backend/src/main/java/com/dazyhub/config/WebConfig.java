package com.dazyhub.config;

import java.nio.file.Path;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {
  private final String uploadDir;

  public WebConfig(@Value("${dazyhub.upload-dir}") String uploadDir) {
    this.uploadDir = uploadDir;
  }

  @Override
  public void addResourceHandlers(ResourceHandlerRegistry registry) {
    Path location = Path.of(uploadDir).toAbsolutePath().normalize();
    registry.addResourceHandler("/uploads/avatars/**")
        .addResourceLocations(location.toUri().toString() + "/");
  }
}
