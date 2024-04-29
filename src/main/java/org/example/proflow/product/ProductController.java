package org.example.proflow.product;

import jakarta.servlet.http.HttpSession;
import org.example.proflow.category.SubCategory;
import org.example.proflow.category.SubCategoryRepository;
import org.example.proflow.login.Member;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Controller
public class ProductController {
    private final ProductService productService;
    private final ProductRepository productRepository;
    private final SubCategoryRepository subCategoryRepository;

    @Autowired
    public ProductController(ProductService productService, ProductRepository productRepository, SubCategoryRepository subCategoryRepository) {
        this.productService = productService;
        this.productRepository = productRepository;
        this.subCategoryRepository = subCategoryRepository;
    }

    // 세션을 저장할 변수
    Member user = null;
    // 조회
    @GetMapping("/product")
    public String getAllProducts(HttpSession session, Model model) {
        
        // 사용자 세션
        user = (Member) session.getAttribute("user");
        if (user != null) {
            model.addAttribute("userName", user.getName());
        }

        if (user == null) {
            return "redirect:/login"; // 로그인 페이지 경로 변경
        }

        List<ProductDTO> products = productRepository.findAllByProducts(null, null, null);
        model.addAttribute("products", products);

        long cnt = productService.getAllCnt();
        model.addAttribute("cnt", cnt);
        
        return "product";
    }

    // 검색조회
    @GetMapping("/product/search")
    @ResponseBody //@ResponseBody가 없을 때는 보통 해당 문자열에 해당하는 뷰 템플릿을 찾아서 반환, 있을 때는 메서드가 반환하는 객체나 리스트가 클라이언트에게 JSON형태로 직접 전송된다.
    public List<ProductDTO> getAllProducts(@RequestParam(value = "keyword", required = false) String keyword, String searchType) {
        List<ProductDTO> productList = new ArrayList<>();

        // 제품명으로 조회
        if(searchType.equals("name"))
            productList = productRepository.findAllByProducts(keyword, null, null);
        // 제품코드로 조회
        else if(searchType.equals("code"))
            productList = productRepository.findAllByProducts(null, keyword, null);
        // 제품유형으로 조회
        else
            productList = productRepository.findAllByProducts(null, null, keyword);

        return productList;
    }

    // 삭제
    @PostMapping("/products/delete")
    public ResponseEntity<?> deleteProducts(@RequestBody List<String> codes){
        try {
            productRepository.deleteAllById(codes);
            return ResponseEntity.ok().body("{\"message\":\"Deletion successful\"}");
        } catch (DataIntegrityViolationException e) {
            // 무결성 제약조건 위배 처리
            return ResponseEntity.badRequest().body("{\"error\":\"Bom이 등록된 제품은 삭제할 수 없습니다.\"}");
        } catch (Exception e) {
            // 기타 예외 처리
            return ResponseEntity.internalServerError().body("{\"error\":\"An unexpected error occurred.\"}");
        }
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

            System.out.println("저장할 값 : " + product);

            productRepository.save(product);

            return ResponseEntity.ok().body("{\"message\":\"Deletion successful\"}");
        }

        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("{\"message\":\"Product not found\"}");
    }

    // 제품 등록페이지로 이동 시 제품 현황 CNT값 가져가기
    @GetMapping("/productInsert")
    public String productInsertPage(Model model, HttpSession session) {
        model.addAttribute("product_cnt", productService.getAllCnt());

        // 사용자 세션
        if (user != null) {
            model.addAttribute("userName", user.getName());
        }else{
            return "redirect:/login"; // 로그인 페이지 경로 변경
        }

        return "productInsert";
    }

    // 로그아웃 버튼 클릭 시 로그인 페이지로 이동
    @GetMapping("/productLogout")
    public String productLogoutPage(HttpSession session) {
        session.invalidate(); //세션 종료
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

    // 유형 및 단위 조회
    @GetMapping("/search/typelist")
    @ResponseBody
    public  List<SubCategory> getAllProtypeList(String type) {
        List<SubCategory> categoryList = null;

        if("protype".equals(type)){
            categoryList =  subCategoryRepository.findAllByProType();
        }
        else if("prounit".equals(type)){
            categoryList =  subCategoryRepository.findAllByProUnit();
        }
        else if("weightunit".equals(type)){
            categoryList =  subCategoryRepository.findAllByWeightUnit();
        }
        else if("custtype".equals(type)){
            categoryList =  subCategoryRepository.findAllByCustType();
        }
        else if("mattype".equals(type)){
            categoryList = subCategoryRepository.findAllByMatType();
        }

        return categoryList;
    }

}