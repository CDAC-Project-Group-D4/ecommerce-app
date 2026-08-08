package com.cdac.ecommerce.specification;
import com.cdac.ecommerce.entity.Product;
import com.cdac.ecommerce.entity.ProductAttribute;
import com.cdac.ecommerce.entity.ProductAttributeValue;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class ProductSpecification {

    public static Specification<Product> filter(
            Long categoryId,
            String search,
            BigDecimal minPrice,
            BigDecimal maxPrice,
            Map<String, String> dynamicAttributes) {

        return (root, query, cb) -> {

            List<Predicate> predicates = new ArrayList<>();

            predicates.add(cb.equal(root.get("isActive"), true));

            if (categoryId != null) {
                predicates.add(
                        cb.equal(root.get("category").get("id"), categoryId)
                );
            }

            if (search != null && !search.isBlank()) {
                predicates.add(
                        cb.like(
                                cb.lower(root.get("name")),
                                "%" + search.toLowerCase() + "%"
                        )
                );
            }

            if (minPrice != null) {
                predicates.add(
                        cb.greaterThanOrEqualTo(root.get("price"), minPrice)
                );
            }

            if (maxPrice != null) {
                predicates.add(
                        cb.lessThanOrEqualTo(root.get("price"), maxPrice)
                );
            }

            if(dynamicAttributes != null && !dynamicAttributes.isEmpty()){
                for(Map.Entry<String, String> entry: dynamicAttributes.entrySet()){
                    String attrName = entry.getKey();
                    String attrValue = entry.getValue();

                    if(attrValue != null && !attrValue.isBlank()){

                        Join<Product, ProductAttributeValue> valueJoin = root.join("attributeValues");
                        Join<ProductAttributeValue, ProductAttribute> keyJoin = valueJoin.join("attribute");

                        Predicate matchKey = cb.equal(cb.lower(keyJoin.get("name")), attrName.toLowerCase());
                        Predicate matchVal = cb.equal(cb.lower(valueJoin.get("value")), attrValue.toLowerCase());

                        predicates.add(cb.and(matchKey, matchVal));
                    }
                }
            }

            if(query != null){
                query.distinct(true);
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}