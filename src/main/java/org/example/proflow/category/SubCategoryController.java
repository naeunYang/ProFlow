package org.example.proflow.category;

import jakarta.servlet.http.HttpSession;
import org.example.proflow.customer.Customer;
import org.example.proflow.customer.CustomerDTO;
import org.example.proflow.customer.CustomerRepository;
import org.example.proflow.customer.CustomerService;
import org.example.proflow.login.Member;
import org.example.proflow.material.Material;
import org.example.proflow.product.Product;
import org.example.proflow.product.ProductDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.*;


@Controller
public class SubCategoryController {
    private final SubCategoryService subCategoryService;
    private final SubCategoryRepository subCategoryRepository;

    @Autowired
    public SubCategoryController(SubCategoryService subCategoryService, SubCategoryRepository subCategoryRepository) {
        this.subCategoryService = subCategoryService;
        this.subCategoryRepository = subCategoryRepository;
    }

    Member user = null;
    // 조회
    @GetMapping("/unit")
    public String getAllUnits(HttpSession session, Model model) {

        // 사용자 세션
        user = (Member) session.getAttribute("user");
        if (user != null) {
            model.addAttribute("userName", user.getName());
        }

        if (user == null) {
            return "redirect:/login"; // 로그인 페이지 경로 변경
        }

        List<SubCategoryDTO> categorys = subCategoryRepository.findAllByCategorys(null);
        model.addAttribute("categorys", categorys);

        List<MainCategory> categoryList = subCategoryRepository.findAllByUnitType();
        model.addAttribute("categoryList", categoryList);

        long cnt = subCategoryService.getAllCnt();
        model.addAttribute("cnt", cnt);

        return "unit";
    }

    // 검색조회
    @GetMapping("/unit/search")
    @ResponseBody
    public List<SubCategoryDTO> getAllProducts(String keyword) {
        List<SubCategoryDTO> unitList = subCategoryRepository.findAllByCategorys(keyword);
        return unitList;
    }

    // 대분류 리스트 조회
    @GetMapping("/search/mainunitlist")
    @ResponseBody
    public  List<MainCategory> getAllMainUnitList() {
        List<MainCategory> categoryList1 = subCategoryRepository.findAllByUnitType();
        return categoryList1;
    }

    // 소분류 리스트 조회
    @GetMapping("/search/subunitlist")
    @ResponseBody
    public  List<SubCategory> getAllSubUnitList() {
        List<SubCategory> categoryList2 = subCategoryRepository.findAllBySubUnitType();
        return categoryList2;
    }

    // 수정
    @PostMapping("/unit/update")
    public ResponseEntity<?> updateUnit(@RequestBody SubCategory updateUnit){
        Optional<SubCategory> unitOptional = subCategoryRepository.findById(updateUnit.getSc_code()); //Optional<Product> -> 반환된 값이 Product를 담고 있거나 담고있지 않을 수 있을 때 유용, findByById의 반환형식
        if(unitOptional.isPresent()){ //isPresent() : 객체가 값을 포함하고 있는지 확인
            SubCategory unit = unitOptional.get(); // Optional에서 Product 객체를 가져옴

            unit.setMc_code(updateUnit.getMc_code());
            unit.setSc_name(updateUnit.getSc_name());

            subCategoryRepository.save(unit);

            return ResponseEntity.ok().body("{\"message\":\"Deletion successful\"}");
        }

        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("{\"message\":\"Product not found\"}");
    }

    // 삭제
    @PostMapping("/unit/delete")
    public ResponseEntity<?> deleteUnit(@RequestBody List<String> codes){
        subCategoryRepository.deleteAllById(codes);
        return ResponseEntity.ok().body("{\"message\":\"Deletion successful\"}");
    }

    // 단위 등록 페이지 이동
    @GetMapping("/unitInsert")
    public String unitInsertPage(Model model, HttpSession session) {
        model.addAttribute("unit_cnt", subCategoryService.getAllCnt());

        // 사용자 세션
        if (user != null) {
            model.addAttribute("userName", user.getName());
        }else{
            return "redirect:/login"; // 로그인 페이지 경로 변경
        }

        List<MainCategory> categoryList = subCategoryRepository.findAllByUnitType();
        model.addAttribute("categoryList", categoryList);

        return "unitInsert";
    }

    // 저장
    @PostMapping("/unit/insert")
    @ResponseBody
    public ResponseEntity<?> insertUnit(@RequestBody List<SubCategory> subCategories) {
        for (SubCategory subCategory : subCategories) {
            if(Objects.equals(subCategory.getMc_code(), "MAT_TYPE")){
                subCategory.setSc_code("MT");
            }else if(Objects.equals(subCategory.getMc_code(), "PRO_TYPE")){
                subCategory.setSc_code("T");
            }else if(Objects.equals(subCategory.getMc_code(), "PRO_UNIT")){
                subCategory.setSc_code("U");
            }else if(Objects.equals(subCategory.getMc_code(), "WEIGHT_UNIT")){
                subCategory.setSc_code("WU");
            }else if(Objects.equals(subCategory.getMc_code(), "CUST_TYPE")){
                subCategory.setSc_code("CT");
            }
        }

        subCategoryService.insertCategoryList(subCategories);
        return ResponseEntity.ok().body("{\"message\":\"Insert successful\"}");
    }

    // db 제품명 중복 검사
    @PostMapping("/checkUnitName")
    @ResponseBody
    public boolean checkName(@RequestBody Map<String, String> json) {
        String name = json.get("name");
        // 포함됨
        if(subCategoryRepository.existsByScName(name)){
            return true;
        }else{ // 포함되지 않음
            return false;
        }
    }

}
