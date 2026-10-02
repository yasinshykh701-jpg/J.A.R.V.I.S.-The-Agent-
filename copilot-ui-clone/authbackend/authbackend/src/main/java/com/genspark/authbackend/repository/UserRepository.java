package com.genspark.authbackend.repository;

import com.genspark.authbackend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    // Find User
    Optional<User> findByEmail(String email);

    Optional<User> findByMobile(String mobile);

    Optional<User> findByUsername(String username);

    // Check Existing User
    boolean existsByEmail(String email);

    boolean existsByMobile(String mobile);

    boolean existsByUsername(String username);

}