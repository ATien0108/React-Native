package com.hcmute.baitap2.repository;

import com.hcmute.baitap2.model.Brand;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BrandRepository extends MongoRepository<Brand, String> {

}