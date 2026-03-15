package com.securelens.repository;

import com.securelens.model.Scan;
import com.securelens.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * ScanRepository - Spring Data JPA interface for Scan entity.
 * Provides methods to query scan history and statistics per user.
 */
@Repository
public interface ScanRepository extends JpaRepository<Scan, Long> {

    /** Get all scans for a specific user, ordered by most recent first */
    List<Scan> findByUserOrderByScannedAtDesc(User user);

    /** Count total scans done by a user */
    long countByUser(User user);

    /** Count scans by threat level for a user */
    long countByUserAndThreatLevel(User user, String threatLevel);

    /** Get the top 10 most recent scans for a user */
    List<Scan> findTop10ByUserOrderByScannedAtDesc(User user);

    /** Count total scans across all users (admin/global stats) */
    @Query("SELECT COUNT(s) FROM Scan s WHERE s.threatLevel = :level")
    long countByThreatLevelGlobal(@Param("level") String level);
}
