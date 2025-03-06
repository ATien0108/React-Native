package com.hcmute.baitap2.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "Brands")
@Data
public class Brand {

    @Id
    private String id;                       // ID duy nhất của thương hiệu (được MongoDB tự động tạo)
    private String name;                     // Tên thương hiệu
    private String description;              // Mô tả chi tiết về thương hiệu
    private String logo;                     // Logo thương hiệu
    private boolean isDeleted;               // Trạng thái xóa mềm (soft delete)
}
