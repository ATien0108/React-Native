package com.hcmute.baitap2.service;

import com.hcmute.baitap2.model.Product;
import com.hcmute.baitap2.repository.ProductRepository;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    // Lấy tất cả sản phẩm chưa bị xóa
    public List<Product> getAllProducts() {
        return productRepository.findByIsDeletedFalse(); // Trả về danh sách sản phẩm chưa bị xóa
    }

    public Product getProductById(String id) {
        return productRepository.findById(id).orElse(null); // Tìm sản phẩm theo id, nếu không tìm thấy trả về null
    }

    // Tìm kiếm sản phẩm theo từ khóa
    public List<Product> searchProducts(String keyword) {
        return productRepository.findByNameContainingIgnoreCaseAndIsDeletedFalse(keyword);
    }

    // Lấy sản phẩm theo thương hiệu và sắp xếp theo giá hoặc thời gian
    public List<Product> getProductsByBrand(ObjectId brandId, int page, int size, String sortBy, boolean ascending) {
        Sort sort;
        if ("price".equalsIgnoreCase(sortBy)) {
            sort = ascending ? Sort.by("discountedPrice").ascending() : Sort.by("discountedPrice").descending();
        } else if ("date".equalsIgnoreCase(sortBy)) {
            sort = ascending ? Sort.by("createdAt").ascending() : Sort.by("createdAt").descending();
        } else {
            sort = ascending ? Sort.by("createdAt").ascending() : Sort.by("createdAt").descending(); // mặc định sắp xếp theo ngày
        }
        PageRequest pageRequest = PageRequest.of(page, size, sort);
        return productRepository.findByBrandIdAndIsDeletedFalse(brandId, pageRequest);
    }

    // Lấy sản phẩm theo danh mục và sắp xếp theo giá hoặc thời gian
    public List<Product> getProductsByCategory(ObjectId categoryId, int page, int size, String sortBy, boolean ascending) {
        Sort sort;
        if ("price".equalsIgnoreCase(sortBy)) {
            sort = ascending ? Sort.by("discountedPrice").ascending() : Sort.by("discountedPrice").descending();
        } else if ("date".equalsIgnoreCase(sortBy)) {
            sort = ascending ? Sort.by("createdAt").ascending() : Sort.by("createdAt").descending();
        } else {
            sort = ascending ? Sort.by("createdAt").ascending() : Sort.by("createdAt").descending(); // mặc định sắp xếp theo ngày
        }
        PageRequest pageRequest = PageRequest.of(page, size, sort);
        return productRepository.findByCategoryIdAndIsDeletedFalse(categoryId, pageRequest);
    }

    // Lấy tất cả sản phẩm sắp xếp theo giá
    public List<Product> getProductsSortedByPrice(int page, int size, boolean ascending) {
        Sort sort = ascending ? Sort.by("discountedPrice").ascending() : Sort.by("discountedPrice").descending();
        PageRequest pageRequest = PageRequest.of(page, size, sort);
        return productRepository.findByIsDeletedFalse(pageRequest);
    }

    // Lấy 10 sản phẩm bán chạy nhất
    public List<Product> getTopSellingProducts(int topCount) {
        // Sắp xếp theo số lượng đã bán (totalSold) giảm dần và lấy 10 sản phẩm đầu tiên
        PageRequest pageRequest = PageRequest.of(0, topCount, Sort.by(Sort.Order.desc("totalSold")));
        return productRepository.findByIsDeletedFalse(pageRequest);
    }
}
