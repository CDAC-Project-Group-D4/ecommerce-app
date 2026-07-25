# Project Q&A Documentation

---

## Question 1: Store APIs Specification and Implementation Guide

> **Question:** According to my Spring Boot e-commerce project, which essential APIs should I create for the Store module? What should be in request and response for each API, what are all the steps for each API, and what extra things do I need to do?

---

### Store APIs (Seller)

#### 1. Create Store

* **API**: `POST /api/store/create-store`
* **Request (from frontend)**:
```json
{
  "storeName": "Minal Fashion Store",
  "description": "Trendy clothes for women",
  "bannerUrl": "https://image-url/banner.jpg",
  "profilePhotoUrl": "https://image-url/logo.jpg"
}
```

* **Response**:
```json
{
  "id": 1,
  "storeName": "Minal Fashion Store",
  "description": "Trendy clothes for women",
  "bannerUrl": "https://image-url/banner.jpg",
  "profilePhotoUrl": "https://image-url/logo.jpg",
  "onHoliday": false,
  "active": true,
  "userId": 5,
  "message": "Store created successfully"
}
```

* **Logic and Steps**:
1. Get user from SecurityContextHolder using JWT Token.
2. Check user role - Only SELLER can create a store.
3. Check one seller to one store rule (user.getStore() == null).
4. Map StoreRequestDTO to Store entity and set store.setUser(user).
5. Save store entity in database and return StoreResponseDTO.

---

#### 2. Get My Store

* **API**: `GET /api/store/get-store`
* **Request**:
  * No body needed.
  * Automatically get logged-in user from token.

* **Response**:
```json
{
  "id": 1,
  "storeName": "Minal Fashion Store",
  "description": "Trendy clothes for women",
  "bannerUrl": "https://image-url/banner.jpg",
  "profilePhotoUrl": "https://image-url/logo.jpg",
  "onHoliday": false,
  "active": true,
  "userId": 5
}
```

* **Logic and Steps**:
1. Get logged-in user email from SecurityContextHolder.
2. Fetch Store entity associated with this seller from DB.
3. If no store found, throw exception ("Store not found for this user").
4. Return mapped StoreResponseDTO.

---

#### 3. Update Store

* **API**: `PUT /api/store/update-store`
* **Request**:
```json
{
  "storeName": "Minal Fashion Hub",
  "description": "Updated description for fashion store",
  "bannerUrl": "https://new-banner.jpg",
  "profilePhotoUrl": "https://new-logo.jpg"
}
```

* **Response**:
```json
{
  "id": 1,
  "storeName": "Minal Fashion Hub",
  "description": "Updated description for fashion store",
  "bannerUrl": "https://new-banner.jpg",
  "profilePhotoUrl": "https://new-logo.jpg",
  "onHoliday": false,
  "active": true,
  "userId": 5,
  "message": "Store updated successfully"
}
```

* **Logic and Steps**:
1. Get logged-in seller from SecurityContextHolder.
2. Fetch seller's existing store entity from DB.
3. Update fields (storeName, description, bannerUrl, profilePhotoUrl).
4. Save updated store entity using storeRepository.save(store).
5. Return updated StoreResponseDTO.

---

#### 4. Delete Store (Optional)

* **API**: `DELETE /api/store/delete-store`
* **Request**:
  * No body needed.

* **Response**:
```json
{
  "message": "Store deleted successfully"
}
```

* **Logic and Steps**:
1. Get logged-in seller from SecurityContextHolder.
2. Find store belonging to seller.
3. Delete or deactivate store in DB.
4. Return success message response.

---

#### 5. Upload Store Images (Banner and Profile Photo)

* **API**: `POST /api/store/upload-media`
* **Request (Multipart / Form-Data)**:
  * banner: image file
  * profilePhoto: image file

* **Response**:
```json
{
  "bannerUrl": "https://cloud-storage/banner.jpg",
  "profilePhotoUrl": "https://cloud-storage/logo.jpg"
}
```

* **Logic and Steps**:
1. Accept multipart files in controller.
2. Upload images to Cloudinary / S3 / Local storage.
3. Return image URLs so frontend can use them in Create/Update API.

---

### Anything Extra You Need To Do:

1. Update StoreRequestDTO: Add bannerUrl and profilePhotoUrl fields so frontend can pass image URLs when creating or updating a store.
2. DTO Validations (jakarta.validation): Add @NotBlank(message = "Store name is required") on storeName. Use @Valid @RequestBody in controller methods.
3. ModelMapper Configuration: Ensure ModelMapper correctly maps user.id to userId in StoreResponseDTO.
4. Security Context: Secure /api/store/** for SELLER role.
5. Exception Handling: Return clear ApiErrorResponse for duplicate store, store not found, or unauthorized role.

---

## Question 2: How Media/File Uploading Works in Spring Boot (Store Module)

> **Question:** I didn't understand how media/file uploading works in `uploadMedia` inside `StoreServiceImpl.java`. How does Spring Boot receive, process, save files, and serve them to the browser? Please explain with simple code examples and steps.

---

### 🎨 1. The Big Picture (Upload Workflow)

When a seller uploads a banner or profile photo from the frontend, the following process takes place:

```
[Frontend / Postman]
       │
       │  1. Sends image file via HTTP POST (multipart/form-data)
       ▼
[StoreController.java]
       │
       │  2. Passes MultipartFile(s) to StoreService
       ▼
[StoreServiceImpl.java]
       │
       │  3. Creates a unique filename (e.g. UUID_filename.jpg)
       │  4. Saves file to "uploads/" folder on disk
       │  5. Returns relative URL string "/uploads/UUID_filename.jpg"
       ▼
[Database / Store Entity]
       │  6. Store entity saves bannerUrl / profilePhotoUrl string
       ▼
[Browser / Frontend]
       │  7. Browser requests "http://localhost:8080/uploads/UUID_filename.jpg"
       ▼
[CorsConfig & SecurityConfig]
       │  8. Spring Boot serves static file from "uploads/" folder back to browser!
```

---

### 🧱 2. Step-by-Step Implementation Breakdown

#### **Step 1: Accepting `MultipartFile` in Controller**
Spring Boot uses `MultipartFile` to handle binary file data sent via `multipart/form-data`.

* **File:** `com.cdac.ecommerce.controller.StoreController`
```java
@PostMapping("/upload-media")
public ResponseEntity<Map<String, String>> uploadMedia(
        @RequestParam(value = "banner", required = false) MultipartFile banner, 
        @RequestParam(value = "profilePhoto", required = false) MultipartFile profilePhoto) {
    return ResponseEntity.ok(storeService.uploadMedia(banner, profilePhoto));
}
```
* `@RequestParam(value = "...", required = false)` allows optional uploads so sellers can update either one or both images without errors.

---

#### **Step 2: Processing and Saving Files in Service Layer**
The service layer checks for valid files, creates the `uploads/` directory if missing, generates unique filenames using `UUID`, and copies byte streams using Java NIO (`Paths` and `Files`).

* **File:** `com.cdac.ecommerce.service.impl.StoreServiceImpl`
```java
@Override
public Map<String, String> uploadMedia(MultipartFile banner, MultipartFile profilePhoto) {
    Map<String, String> response = new HashMap<>();

    try {
        if (banner != null && !banner.isEmpty()) {
            String bannerUrl = saveFile(banner);
            response.put("bannerUrl", bannerUrl);
        }

        if (profilePhoto != null && !profilePhoto.isEmpty()) {
            String profilePhotoUrl = saveFile(profilePhoto);
            response.put("profilePhotoUrl", profilePhotoUrl);
        }
    } catch (IOException e) {
        throw new RuntimeException("File upload failed: " + e.getMessage());
    }

    return response;
}

// Helper method to save files cleanly
private String saveFile(MultipartFile file) throws IOException {
    String uploadDir = "uploads/";
    Path uploadPath = Paths.get(uploadDir);

    if (!Files.exists(uploadPath)) {
        Files.createDirectories(uploadPath);
    }

    String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
    Path filePath = uploadPath.resolve(fileName);

    Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

    return "/uploads/" + fileName;
}
```

---

#### **Step 3: Exposing Uploaded Files as Static Web Resources**
By default, Spring Boot does not serve files stored on local disk. We add a resource handler so URLs starting with `/uploads/**` serve files from the local `uploads/` folder.

* **File:** `com.cdac.ecommerce.config.CorsConfig`
```java
@Override
public void addResourceHandlers(ResourceHandlerRegistry registry) {
    registry.addResourceHandler("/uploads/**")
            .addResourceLocations("file:uploads/");
}
```

---

#### **Step 4: Granting Public Access in Spring Security**
Image URLs like `/uploads/abc.jpg` need to be loaded by browser `<img>` tags without authentication tokens.

* **File:** `com.cdac.ecommerce.security.SecurityConfig`
```java
.authorizeHttpRequests(auth -> auth
        .requestMatchers(
                "/",
                "/api/auth/**",
                "/uploads/**", // <-- Public access for uploaded images
                "/v3/api-docs/**",
                "/swagger-ui/**",
                "/swagger-ui.html"
        ).permitAll()
        .anyRequest().authenticated()
);
```

---

### 📋 3. Summary Component Map

| Component | Responsibility | Key Class/Method |
| :--- | :--- | :--- |
| **Controller** | Accepts HTTP `multipart/form-data` | `StoreController.uploadMedia(...)` |
| **Service** | Saves files to disk with `UUID` names | `StoreServiceImpl.saveFile(...)` |
| **Web Resource Handler** | Maps `/uploads/**` URL route to disk folder | `CorsConfig.addResourceHandlers(...)` |
| **Security Config** | Permits unauthenticated access to image URLs | `SecurityConfig.securityFilterChain(...)` |
