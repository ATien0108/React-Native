package com.hcmute.baitap2;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class BaiTap2BeApplication {

    public static void main(String[] args) {
        SpringApplication.run(BaiTap2BeApplication.class, args);
    }

}
