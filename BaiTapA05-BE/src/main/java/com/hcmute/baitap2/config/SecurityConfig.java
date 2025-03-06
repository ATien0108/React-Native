package com.hcmute.baitap2.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.servlet.config.annotation.CorsRegistry;

import static org.springframework.security.config.Customizer.withDefaults;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(authorize -> authorize
                        .requestMatchers(HttpMethod.GET, "/api/**")
                        .permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/**")
                        .permitAll()
                        .requestMatchers(HttpMethod.PUT, "/api/**")
                        .permitAll()
                        .requestMatchers(HttpMethod.DELETE, "/api/**")
                        .permitAll()
                )
                .cors(cors -> cors.configurationSource(request -> {
                    org.springframework.web.cors.CorsConfiguration config = new org.springframework.web.cors.CorsConfiguration();
                    config.addAllowedOrigin("*"); // Cho phép tất cả các nguồn (origins)
                    config.addAllowedMethod("*"); // Cho phép tất cả các phương thức HTTP (GET, POST, PUT, DELETE...)
                    config.addAllowedHeader("*"); // Cho phép tất cả các headers
                    return config;
                }))
                .httpBasic(withDefaults());

        return http.build();
    }
}