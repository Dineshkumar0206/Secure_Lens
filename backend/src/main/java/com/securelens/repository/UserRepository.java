package com.securelens.repository;

import com.securelens.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * UserRepository - Spring Data JPA interface for User entity.
 * Provides CRUD operations and custom finders automatically.
 */
@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    /** Find a user by their username */
    Optional<User> findByUsername(String username);

    /** Find a user by their email address */
    Optional<User> findByEmail(String email);

    /** Find a user by their password reset token */
    Optional<User> findByResetToken(String resetToken);

    /** Check if a username is already taken */
    Boolean existsByUsername(String username);

    /** Check if an email is already registered */
    Boolean existsByEmail(String email);
}
