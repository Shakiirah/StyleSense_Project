package com.example.stylesense_backend.repository;

import com.example.stylesense_backend.model.SavedOutfit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SavedOutfitRepository extends JpaRepository<SavedOutfit, Long> {
    List<SavedOutfit> findByUserId(Long userId);
    boolean existsByUserIdAndOutfitId(Long userId, Long outfitId);
    void deleteByUserIdAndOutfitId(Long userId, Long outfitId);
}

