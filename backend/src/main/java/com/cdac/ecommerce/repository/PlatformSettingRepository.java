package com.cdac.ecommerce.repository;

import com.cdac.ecommerce.entity.PlatformSetting;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PlatformSettingRepository extends JpaRepository<PlatformSetting, Long> {


    Optional<PlatformSetting> findFirstByIdNotNullOrderByCreatedAtDesc();
}
