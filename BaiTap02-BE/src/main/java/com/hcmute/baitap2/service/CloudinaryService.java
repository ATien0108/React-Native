package com.hcmute.baitap2.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;


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
}