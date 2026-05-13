package com.dazyhub.auth;

import com.dazyhub.admin.EmailConfig;
import com.dazyhub.admin.EmailConfigRepository;
import jakarta.mail.internet.MimeMessage;
import java.security.SecureRandom;
import java.util.Properties;
import java.util.random.RandomGenerator;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class EmailService {
  private final JavaMailSender defaultMailSender;
  private final EmailConfigRepository emailConfigRepository;
  private final VerificationCodeStore codeStore;

  private static final RandomGenerator RNG = new SecureRandom();

  public EmailService(JavaMailSender defaultMailSender,
                      EmailConfigRepository emailConfigRepository,
                      VerificationCodeStore codeStore) {
    this.defaultMailSender = defaultMailSender;
    this.emailConfigRepository = emailConfigRepository;
    this.codeStore = codeStore;
  }

  private JavaMailSender resolveMailSender() {
    EmailConfig config = emailConfigRepository.findById(1L).orElse(null);
    if (config == null || config.getSmtpUsername().isEmpty()) {
      return defaultMailSender;
    }
    JavaMailSenderImpl sender = new JavaMailSenderImpl();
    sender.setHost(config.getSmtpHost());
    sender.setPort(config.getSmtpPort());
    sender.setUsername(config.getSmtpUsername());
    sender.setPassword(config.getSmtpPassword());
    Properties props = sender.getJavaMailProperties();
    props.put("mail.smtp.auth", "true");
    props.put("mail.smtp.starttls.enable", config.getSmtpPort() == 587 ? "true" : "false");
    props.put("mail.smtp.ssl.enable", config.getSmtpPort() == 465 ? "true" : "false");
    return sender;
  }

  public void sendVerificationCode(String to) {
    String code = String.format("%06d", RNG.nextInt(1_000_000));
    codeStore.put(to, code);

    EmailConfig config = emailConfigRepository.findById(1L).orElse(null);
    String from = config != null && !config.getMailFrom().isEmpty()
        ? config.getMailFrom()
        : "noreply@dazyhub.com";

    JavaMailSender mailSender = resolveMailSender();

    try {
      MimeMessage message = mailSender.createMimeMessage();
      MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
      helper.setFrom(from);
      helper.setTo(to);
      helper.setSubject("DazyHub 邮箱验证码");
      helper.setText(buildHtml(code), true);
      mailSender.send(message);
    } catch (Exception e) {
      throw new RuntimeException("邮件发送失败，请稍后重试", e);
    }
  }

  private String buildHtml(String code) {
    return """
        <!DOCTYPE html>
        <html lang="zh-CN">
        <head>
        <meta charset="utf-8">
        </head>
        <body style="margin:0;padding:0;background-color:#f7f4ea;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f7f4ea;padding:40px 0;">
          <tr>
            <td align="center">
              <table width="480" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 8px 32px rgba(47,33,24,.08);">
                <tr>
                  <td style="padding:36px 40px 0;text-align:center;">
                    <div style="display:inline-block;width:52px;height:52px;border-radius:12px;background:linear-gradient(135deg,#17283a,#2f7890 60%,#5fa87b);color:#fff8e8;font-size:26px;font-weight:900;line-height:52px;">D</div>
                  </td>
                </tr>
                <tr>
                  <td style="padding:20px 40px 8px;text-align:center;">
                    <h1 style="margin:0;font-family:-apple-system,BlinkMacSystemFont,'PingFang SC','Microsoft YaHei',sans-serif;font-size:22px;font-weight:700;color:#2f2118;">DazyHub 邮箱验证</h1>
                  </td>
                </tr>
                <tr>
                  <td style="padding:0 40px 28px;text-align:center;">
                    <p style="margin:0;font-family:-apple-system,BlinkMacSystemFont,'PingFang SC','Microsoft YaHei',sans-serif;font-size:14px;color:#7b6d5f;line-height:1.6;">请使用以下验证码完成注册</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:0 40px 32px;text-align:center;">
                    <div style="display:inline-block;padding:16px 48px;background:#f7f4ea;border-radius:10px;border:2px dashed #e3d8c6;">
                      <span style="font-family:'SF Mono','Menlo','Consolas',monospace;font-size:34px;font-weight:800;letter-spacing:8px;color:#2f7890;">{code}</span>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td style="padding:0 40px 36px;text-align:center;">
                    <p style="margin:0;font-family:-apple-system,BlinkMacSystemFont,'PingFang SC','Microsoft YaHei',sans-serif;font-size:12px;color:#b5a792;">验证码 5 分钟内有效，请勿泄露给他人</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:0;height:1px;background:linear-gradient(to right,transparent,#e3d8c6,transparent);"></td>
                </tr>
                <tr>
                  <td style="padding:20px 40px;text-align:center;">
                    <p style="margin:0;font-family:-apple-system,BlinkMacSystemFont,'PingFang SC','Microsoft YaHei',sans-serif;font-size:11px;color:#c4b99f;">DazyHub · 你的个人导航页</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
        </body>
        </html>
        """.replace("{code}", code);
  }
}
