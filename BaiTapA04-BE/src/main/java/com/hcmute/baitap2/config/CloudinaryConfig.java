package com.hcmute.baitap2.config;

import com.cloudinary.Cloudinary;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.HashMap;
import java.util.Map;

@Configuration
public class CloudinaryConfig {

    @Bean
    public Cloudinary cloudinary() {
        Map<String, String> config = new HashMap<>();
        config.put("cloud_name", "dlop7a2bw");
        config.put("api_key", "712194776841939");
        config.put("api_secret", "gnn0BxbifrQy8WpT9gRIaIFfGyI");

        return new Cloudinary(config);
    }
}