package org.example.proflow.product;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@Controller
public class ProductController {
    private final ProductService productService;
    private final ProductRepository productRepository;

    @Autowired
    public ProductController(ProductService productService, ProductRepository productRepository) {
        this.productService = productService;
        this.productRepository = productRepository;
    }

    // 조회
    @GetMapping("/product")
    public String getAllProducts(Model model) {
        List<Product> products =  productService.getAllProducts();
        model.addAttribute("products", products);

        long cnt = productService.getAllCnt();
        model.addAttribute("cnt", cnt);
        return "product";
    }

    // 검색조회
    @GetMapping("/product/search")
    @ResponseBody //@ResponseBody가 없을 때는 보통 해당 문자열에 해당하는 뷰 템플릿을 찾아서 반환, 있을 때는 메서드가 반환하는 객체나 리스트가 클라이언트에게 JSON형태로 직접 전송된다.
    public List<Product> getAllProducts(@RequestParam(value = "keyword", required = false) String keyword, String searchType) {
        List<Product> productList;

        if (keyword != null && !keyword.isEmpty()) {
            // 제품명으로 조회
            if(searchType.equals("name"))
                productList = productService.getProductsByName(keyword);
            // 제품코드로 조회
            else if(searchType.equals("code"))
                productList = productService.getProductsByCode(keyword);
            // 제품유형으로 조회
            else
                productList = productService.getProductsByType(keyword);
        } else {
            productList = productService.getAllProducts();
        }

        return productList;
    }

    // 삭제
    @PostMapping("/products/delete")
    public ResponseEntity<?> deleteProducts(@RequestBody List<String> codes){
        productRepository.deleteAllById(codes);
        return ResponseEntity.ok().body("{\"message\":\"Deletion successful\"}");
    }

    // 수정
    @PostMapping("/products/update")
    public ResponseEntity<?> updateProduct(@RequestBody Product updateProduct){
        Optional<Product> productOptional = productRepository.findById(updateProduct.getCode()); //Optional<Product> -> 반환된 값이 Product를 담고 있거나 담고있지 않을 수 있을 때 유용, findByById의 반환형식
        if(productOptional.isPresent()){ //isPresent() : 객체가 값을 포함하고 있는지 확인
            Product product = productOptional.get(); // Optional에서 Product 객체를 가져옴

            product.setName(updateProduct.getName());
            product.setType(updateProduct.getType());
            product.setUnit(updateProduct.getUnit());
            product.setWeight(updateProduct.getWeight());
            product.setRemark(updateProduct.getRemark());

            productRepository.save(product);

            return ResponseEntity.ok().body("{\"message\":\"Deletion successful\"}");
        }

        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("{\"message\":\"Product not found\"}");
    }

    // 제품 등록페이지로 이동 시 제품 현황 CNT값 가져가기
    @GetMapping("/productInsert")
    public String productInsertPage(Model model) {
        model.addAttribute("product_cnt", productService.getAllCnt());
        return "productInsert";
    }

    // 로그아웃 버튼 클릭 시 로그인 페이지로 이동
    @GetMapping("/productLogout")
    public String productLogoutPage() {
        return "login";
    }

    // db 제품명 중복 검사
    @PostMapping("/checkName")
    @ResponseBody
    public boolean checkName(@RequestBody Map<String, String> json) {
        String name = json.get("name");
        // 포함됨
        if(productRepository.existsByName(name)){
            return true;
        }else{ // 포함되지 않음
            return false;
        }
    }

    // 저장
    @PostMapping("/products/insert")
    @ResponseBody
    public ResponseEntity<?> insertProduct(@RequestBody List<Product> products) {
        productService.insertProductList(products);
        return ResponseEntity.ok().body("{\"message\":\"Insert successful\"}");
    }

}