package org.example.proflow.bom;

import jakarta.servlet.http.HttpSession;
import org.example.proflow.category.SubCategoryRepository;
import org.example.proflow.login.Member;
import org.example.proflow.material.MaterialDTO;
import org.example.proflow.material.MaterialRepository;
import org.example.proflow.material.MaterialService;
import org.example.proflow.product.ProductDTO;
import org.example.proflow.product.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@Controller
public class BomController {
    private final MaterialService materialService;
    private final MaterialRepository materialRepository;
    private final ProductRepository productRepository;
    private final SubCategoryRepository subCategoryRepository;
    private final BomRepository bomRepository;
    private final BomService bomService;

    @Autowired
    public BomController( MaterialService materialService, MaterialRepository materialRepository, ProductRepository productRepository, SubCategoryRepository subCategoryRepository, BomRepository bomRepository, BomService bomService){
        this.materialService = materialService;
        this.materialRepository = materialRepository;
        this.productRepository = productRepository;
        this.subCategoryRepository = subCategoryRepository;
        this.bomRepository = bomRepository;
        this.bomService = bomService;
    }

    // 세션을 저장할 변수
    Member user = null;
    // 조회
    @GetMapping("/bom")
    public String getAllMaterials(HttpSession session, Model model) {

        // 사용자 세션
        user = (Member) session.getAttribute("user");
        if (user != null) {
            model.addAttribute("userName", user.getName());
        }

        if (user == null) {
            return "redirect:/login"; // 로그인 페이지 경로 변경
        }

        // 자재 리스트
        List<MaterialDTO> materials = materialRepository.findAllByMaterials(null);
        model.addAttribute("materials", materials);

        // 제품 리스트
        List<ProductDTO> products = productRepository.findAllByProducts(null);
        model.addAttribute("products", products);

        // 자재 현황 수
        long cnt = materialService.getAllCnt();
        model.addAttribute("materialCnt", cnt);

        return "bom";
    }

    // 자재 검색조회
    @GetMapping("/bommat/search")
    @ResponseBody
    public List<MaterialDTO> getAllMaterials(String keyword) {
        List<MaterialDTO> materialList = new ArrayList<>();
        materialList = materialRepository.findAllByMaterials(keyword, null, null);

        return materialList;
    }

    // 제품 검색조회
    @GetMapping("/bompro/search")
    @ResponseBody
    public List<ProductDTO> getAllProducts(String keyword) {
        List<ProductDTO> productList = new ArrayList<>();
        productList = productRepository.findAllByProducts(keyword, null, null);

        return productList;
    }

    // bom 리스트 조회(제품명 클릭 시)
    @GetMapping("/search/bomlist")
    @ResponseBody
    public List<BomDTO> getAllBoms(String keyword) {
        List<BomDTO> bomList = bomRepository.findAllByBoms(keyword);
        return bomList;
    }

    // 데이터 저장
    @PostMapping("/bom/save")
    public ResponseEntity<?> deleteCustomers(@RequestBody List<Bom> boms){
        //기존 데이터 전부 삭제
        for (Bom bom : boms) {
            bomRepository.deleteByBom(bom.getProCode());
            System.out.println("받아온 값 : " + bom.getProCode() + ", " + bom.getMatCode() + ", " + bom.getQty());

            if(bom.getMatCode() == null) return ResponseEntity.ok().body("{\"message\":\"마지막 행 삭제\"}");
        }
        //저장 프로시저 실행
        bomService.insertMaterialList(boms);

        return ResponseEntity.ok().body("{\"message\":\"Deletion successful\"}");
    }

}
