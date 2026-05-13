package com.dazyhub.admin;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "email_config")
public class EmailConfig {
  @Id
  private Long id = 1L;

  @Column(name = "smtp_host", nullable = false, length = 128)
  private String smtpHost = "smtp.qq.com";

  @Column(name = "smtp_port", nullable = false)
  private int smtpPort = 587;

  @Column(name = "smtp_username", nullable = false, length = 128)
  private String smtpUsername = "";

  @Column(name = "smtp_password", nullable = false, length = 128)
  private String smtpPassword = "";

  @Column(name = "mail_from", nullable = false, length = 128)
  private String mailFrom = "";

  public Long getId() { return id; }
  public void setId(Long id) { this.id = id; }

  public String getSmtpHost() { return smtpHost; }
  public void setSmtpHost(String smtpHost) { this.smtpHost = smtpHost; }

  public int getSmtpPort() { return smtpPort; }
  public void setSmtpPort(int smtpPort) { this.smtpPort = smtpPort; }

  public String getSmtpUsername() { return smtpUsername; }
  public void setSmtpUsername(String smtpUsername) { this.smtpUsername = smtpUsername; }

  public String getSmtpPassword() { return smtpPassword; }
  public void setSmtpPassword(String smtpPassword) { this.smtpPassword = smtpPassword; }

  public String getMailFrom() { return mailFrom; }
  public void setMailFrom(String mailFrom) { this.mailFrom = mailFrom; }
}
