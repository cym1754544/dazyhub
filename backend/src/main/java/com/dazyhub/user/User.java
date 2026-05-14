package com.dazyhub.user;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import java.time.Instant;

@Entity
@Table(name = "users", uniqueConstraints = @UniqueConstraint(name = "uk_users_email", columnNames = "email"))
public class User {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false, unique = true, length = 128)
  private String email;

  @Column(name = "password_hash", nullable = false)
  private String passwordHash;

  @Column(name = "display_name", nullable = false, length = 80)
  private String displayName;

  @Column(nullable = false, length = 16)
  private String role = "user";

  @Column(length = 120)
  private String signature;

  @Column(name = "avatar_url")
  private String avatarUrl;

  @Column(name = "tag_size", length = 16)
  private String tagSize = "short";

  @Column(length = 24)
  private String theme = "warm";

  @Column(name = "search_engine", length = 24)
  private String searchEngine = "google";

  @Column(name = "sites_json", columnDefinition = "text")
  private String sitesJson;

  @Column(name = "site_groups_json", columnDefinition = "text")
  private String siteGroupsJson;

  @Column(name = "ungrouped_name", length = 40)
  private String ungroupedName = "未分组";

  @Column(name = "active_group", length = 80)
  private String activeGroup = "all";

  @Column(name = "confirm_delete")
  private Boolean confirmDelete = true;

  @Column(name = "created_at", nullable = false, updatable = false)
  private Instant createdAt;

  @Column(name = "updated_at", nullable = false)
  private Instant updatedAt;

  @PrePersist
  void prePersist() {
    Instant now = Instant.now();
    createdAt = now;
    updatedAt = now;
  }

  @PreUpdate
  void preUpdate() {
    updatedAt = Instant.now();
  }

  public boolean isAdmin() {
    return "admin".equals(role);
  }

  public Long getId() { return id; }

  public String getEmail() { return email; }
  public void setEmail(String email) { this.email = email; }

  public String getPasswordHash() { return passwordHash; }
  public void setPasswordHash(String passwordHash) { this.passwordHash = passwordHash; }

  public String getDisplayName() { return displayName; }
  public void setDisplayName(String displayName) { this.displayName = displayName; }

  public String getRole() { return role; }
  public void setRole(String role) { this.role = role; }

  public String getSignature() { return signature; }
  public void setSignature(String signature) { this.signature = signature; }

  public String getAvatarUrl() { return avatarUrl; }
  public void setAvatarUrl(String avatarUrl) { this.avatarUrl = avatarUrl; }

  public String getTagSize() { return tagSize == null ? "short" : tagSize; }
  public void setTagSize(String tagSize) { this.tagSize = tagSize; }

  public String getTheme() { return theme == null ? "warm" : theme; }
  public void setTheme(String theme) { this.theme = theme; }

  public String getSearchEngine() { return searchEngine == null ? "google" : searchEngine; }
  public void setSearchEngine(String searchEngine) { this.searchEngine = searchEngine; }

  public String getSitesJson() { return sitesJson; }
  public void setSitesJson(String sitesJson) { this.sitesJson = sitesJson; }

  public String getSiteGroupsJson() { return siteGroupsJson; }
  public void setSiteGroupsJson(String siteGroupsJson) { this.siteGroupsJson = siteGroupsJson; }

  public String getUngroupedName() { return ungroupedName == null ? "未分组" : ungroupedName; }
  public void setUngroupedName(String ungroupedName) { this.ungroupedName = ungroupedName; }

  public String getActiveGroup() { return activeGroup == null ? "all" : activeGroup; }
  public void setActiveGroup(String activeGroup) { this.activeGroup = activeGroup; }

  public Boolean getConfirmDelete() { return confirmDelete == null ? true : confirmDelete; }
  public void setConfirmDelete(Boolean confirmDelete) { this.confirmDelete = confirmDelete; }
}
