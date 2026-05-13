package com.dazyhub.user;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface UserRepository extends JpaRepository<User, Long> {
  Optional<User> findByEmail(String email);

  boolean existsByEmail(String email);

  @Query("SELECT u FROM User u WHERE LOWER(u.email) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(u.displayName) LIKE LOWER(CONCAT('%', :keyword, '%')) ORDER BY u.createdAt DESC")
  List<User> searchByKeyword(@Param("keyword") String keyword);
}
