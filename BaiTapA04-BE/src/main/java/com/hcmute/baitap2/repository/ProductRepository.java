package com.hcmute.baitap2.repository;

import com.hcmute.baitap2.model.Product;
import org.bson.types.ObjectId;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends MongoRepository<Product, String> {
    List<Product> findByIsDeletedFalse();  // Truy vấn các sản phẩm chưa bị xóa

    // Truy vấn sản phẩm với phân trang và sắp xếp theo giá
    List<Product> findByIsDeletedFalse(PageRequest pageRequest);

    // Truy vấn sản phẩm theo danh mục với phân trang
    List<Product> findByCategoryIdAndIsDeletedFalse(ObjectId categoryId, PageRequest pageRequest);
}
