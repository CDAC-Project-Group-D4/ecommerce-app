package com.cdac.ecommerce.service;

import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface FileStorageService {
    String uploadFile(MultipartFile file, String folderName);
    List<String> uploadMultipleFiles(List<MultipartFile> files, String folderName);
}
