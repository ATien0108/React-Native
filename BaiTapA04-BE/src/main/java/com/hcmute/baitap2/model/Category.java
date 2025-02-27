package com.hcmute.baitap2.model;

import lombok.*;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.List;

@Document(collection = "Categories")
@Data
public class Category {

    @Id
    private String id;                       // ID duy nhất của danh mục (được MongoDB tự động tạo)
    private String name;                     // Tên danh mục
    private String description;              // Mô tả danh mục
    private String image;                    // Hình ảnh minh họa cho danh mục
    private List<String> tags;               // Các tag liên quan đến danh mục
    private boolean isDeleted;               // Trạng thái xóa mềm (soft delete)
}
