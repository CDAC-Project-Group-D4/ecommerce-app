package com.cdac.ecommerce.service.impl;

import com.cdac.ecommerce.service.FileStorageService;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.UUID;

@Service
public class FileStorageServiceImpl implements FileStorageService {

    private final String UPLOAD_DIR = "uploads/";

    @Override
    public String uploadFile(MultipartFile file, String folderName) {
        try{
            String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
            Path path = Paths.get(UPLOAD_DIR + folderName + "/" + fileName);
            Files.createDirectories(path.getParent());
            Files.copy(file.getInputStream(), path, StandardCopyOption.REPLACE_EXISTING);
            return "/static/" + folderName + "/" + fileName;
        } catch (IOException e) {
            throw new RuntimeException("Failed to store file", e);
        }
    }

    @Override
    public List<String> uploadMultipleFiles(List<MultipartFile> files, String folderName) {
        if (files == null || files.isEmpty()) return Collections.emptyList();
        List<String> urls = new ArrayList<>();
        for (MultipartFile file: files){
            urls.add(uploadFile(file, folderName));
        }
        return urls;
    }
}
