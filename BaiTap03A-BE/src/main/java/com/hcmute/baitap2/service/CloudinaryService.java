package com.hcmute.baitap2.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.hcmute.baitap2.model.User;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;


@Service
public class CloudinaryService {


    private final Cloudinary cloudinary;

    public CloudinaryService(@Value("${cloudinary.api.key}") String apiKey,
                             @Value("${cloudinary.api.secret}") String apiSecret,
                             @Value("${cloudinary.cloud.name}") String cloudName) {
        this.cloudinary = new Cloudinary(ObjectUtils.asMap(
                "cloud_name", cloudName,
                "api_key", apiKey,
                "api_secret", apiSecret));
    }

    public String uploadImageForUser(MultipartFile file, User user) throws IOException {
        Map<String, Object> uploadResult = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.asMap("resource_type", "auto"));

        String imageUrl = (String) uploadResult.get("secure_url");
        String publicId = (String) uploadResult.get("public_id");

        user.setAvatar(imageUrl);
        user.setUserImagePublicId(publicId);


        return imageUrl;
    }


    public void deleteImage(String publicId) throws IOException {
        cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
    }


}