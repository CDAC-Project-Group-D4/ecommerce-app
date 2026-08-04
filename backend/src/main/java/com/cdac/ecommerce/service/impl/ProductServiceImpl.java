package com.cdac.ecommerce.service.impl;

import com.cdac.ecommerce.dto.request.ProductRequestDTO;
import com.cdac.ecommerce.dto.request.UpdateProductRequestDTO;
import com.cdac.ecommerce.dto.response.ProductResponseDTO;
import com.cdac.ecommerce.entity.Category;
import com.cdac.ecommerce.entity.Product;
import com.cdac.ecommerce.entity.Store;
import com.cdac.ecommerce.entity.User;
import com.cdac.ecommerce.exception.ResourceNotFoundException;
import com.cdac.ecommerce.exception.UserNotFoundException;
import com.cdac.ecommerce.repository.CategoryRepository;
import com.cdac.ecommerce.repository.ProductRepository;
import com.cdac.ecommerce.repository.UserRepo;
import com.cdac.ecommerce.security.UserDetailsImpl;
import com.cdac.ecommerce.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;


@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final UserRepo userRepository;
    private final ModelMapper modelMapper;

    @Override
    public ProductResponseDTO createProduct(ProductRequestDTO productRequestDTO) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        String email = userDetails.getUsername();
        User user = userRepository.findByEmail(email).orElseThrow(() -> new UserNotFoundException("User not found"));

        Store store = user.getStore();
        if (store == null) {
            throw new ResourceNotFoundException("Cannot create product: Store not found for this user. Please create a store first.");
        }

        Category category= categoryRepository.findById(productRequestDTO.getCategory_id()).orElseThrow(()-> new ResourceNotFoundException("Category not found with given id"));
        Product product= modelMapper.map(productRequestDTO, Product.class);
        product.setStore(store);
        product.setCategory(category);
        if (productRequestDTO.getImageUrl() != null && !productRequestDTO.getImageUrl().isBlank()) {
            product.setImageUrl(productRequestDTO.getImageUrl());
        }

        Product newProduct= productRepository.save(product);
        ProductResponseDTO productResponseDTO= modelMapper.map(newProduct, ProductResponseDTO.class);
        productResponseDTO.setMessage("product created successfully");
        return productResponseDTO;
    }

    @Override
    public ProductResponseDTO updateProduct(Long productId, UpdateProductRequestDTO updateProductRequestDTO) {

        //getting logged-in user
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        String email = userDetails.getUsername();
        User user = userRepository.findByEmail(email).orElseThrow(() -> new UserNotFoundException("User not found"));

        //get the sellers store
        Store store = user.getStore();
        if (store == null) {
            throw new ResourceNotFoundException("Store not found for this user");
        }

        //finding the product
        Product product = productRepository.findById(productId).orElseThrow(()-> new ResourceNotFoundException("product not found"));

        //verifying product belongs to logged in seller store
        if(!product.getStore().getId().equals(store.getId())){
            throw new RuntimeException("unauthorized!! cannot delete product");
        }

        //updating the name, price and stock of the product
        if (updateProductRequestDTO.getName() != null && !updateProductRequestDTO.getName().isBlank()) {
            product.setName(updateProductRequestDTO.getName());
        }

        if (updateProductRequestDTO.getPrice() != null) {
            product.setPrice(updateProductRequestDTO.getPrice());
        }

        if (updateProductRequestDTO.getStock() != null) {
            product.setStock(updateProductRequestDTO.getStock());
        }

        if (updateProductRequestDTO.getImageUrl() != null && !updateProductRequestDTO.getImageUrl().isBlank()) {
            product.setImageUrl(updateProductRequestDTO.getImageUrl());
        }

        Product updateProduct=productRepository.save(product);
        ProductResponseDTO productResponseDTO= modelMapper.map(updateProduct, ProductResponseDTO.class);
        productResponseDTO.setMessage("product updated successfully");
        return  productResponseDTO;
    }

    @Override
    public ProductResponseDTO deleteProduct(Long productId) {

        //get the logged-in user
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        String email = userDetails.getUsername();
        User user = userRepository.findByEmail(email).orElseThrow(() -> new UserNotFoundException("User not found"));

        //get the sellers store
        Store store = user.getStore();
        if (store == null) {
            throw new ResourceNotFoundException("Store not found for this user");
        }

        //finding the product
        Product product = productRepository.findById(productId).orElseThrow(()-> new ResourceNotFoundException("product not found"));

        //verifying product belongs to logged in seller store
        if(!product.getStore().getId().equals(store.getId())){
            throw new RuntimeException("unauthorized!! cannot delete product");
        }

        //soft deleting the product
        product.set_active(false);
        Product deleteProduct= productRepository.save(product);
        ProductResponseDTO productResponseDTO= modelMapper.map(deleteProduct, ProductResponseDTO.class);
        productResponseDTO.setMessage("product deleted successfully");
        return productResponseDTO;
    }

    @Override
    public List<ProductResponseDTO> getProduct() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        String email = userDetails.getUsername();
        User user = userRepository.findByEmail(email).orElseThrow(() -> new UserNotFoundException("User not found"));

        //get the sellers store
        Store store = user.getStore();
        if (store == null) {
            return java.util.Collections.emptyList();
        }

        //fetching all products belongs to the given store
        List<Product> products= productRepository.findByStore_Id(store.getId());

        return products.stream().map(product -> modelMapper.map(product, ProductResponseDTO.class)).toList();
    }

    @Override
    public List<ProductResponseDTO> getLowStockProducts() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        String email = userDetails.getUsername();
        User user = userRepository.findByEmail(email).orElseThrow(() -> new UserNotFoundException("User not found"));

        //get the sellers store
        Store store = user.getStore();
        if (store == null) {
            return java.util.Collections.emptyList();
        }

        List<Product> lowStockProducts = productRepository.findLowStockProductsByStoreId(store.getId());
        return lowStockProducts.stream().map(product -> modelMapper.map(product, ProductResponseDTO.class)).collect(Collectors.toList());
    }
}
