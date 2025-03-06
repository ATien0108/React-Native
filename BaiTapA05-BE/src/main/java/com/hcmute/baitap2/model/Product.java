package com.hcmute.baitap2.model;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;
import lombok.*;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;
import java.util.List;
import java.util.Map;

@Document(collection = "Products")
@Data
public class Product {

    @Id
    private String id;                       // ID duy nhất của sản phẩm.

    private String name;                     // Tên sản phẩm.

    @JsonSerialize(using = ToStringSerializer.class)
    private ObjectId brandId;                // ID tham chiếu đến document 'brands' (ObjectId).

    @JsonSerialize(using = ToStringSerializer.class)
    private ObjectId categoryId;             // ID tham chiếu đến document 'categories' (ObjectId).

    private double originalPrice;            // Giá gốc của sản phẩm.
    private double discountedPrice;          // Giá giảm của sản phẩm (nếu có).

    private String description;              // Mô tả chi tiết về sản phẩm.
    private Map<String, String> specifications; // Các thông số kỹ thuật của sản phẩm.
    private List<String> tags;               // Danh sách các tag sản phẩm.
    private List<String> images;             // Danh sách hình ảnh của sản phẩm.
    private List<String> videos;             // Các video liên quan đến sản phẩm.
    private Ratings ratings;                 // Đánh giá sản phẩm.
    private int totalSold;                   // Tổng số lượng sản phẩm đã bán.
    private boolean isDeleted;               // Trạng thái xóa mềm.

    @CreatedDate
    private Date createdAt;                  // Ngày tạo sản phẩm.

    @LastModifiedDate
    private Date updatedAt;                  // Ngày cập nhật sản phẩm.

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Ratings {
        private double average;              // Điểm trung bình của các đánh giá.
        private int totalReviews;            // Tổng số lượt đánh giá.
    }
}
