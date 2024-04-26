package org.example.proflow.material;

import jakarta.servlet.http.HttpSession;
import org.example.proflow.category.SubCategoryRepository;
import org.example.proflow.login.Member;
import org.springframework.beans.factory.annotation.Autowired;
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
public class MaterialController {
    private final MaterialService materialService;
    private final MaterialRepository materialRepository;
    private final SubCategoryRepository subCategoryRepository;

    @Autowired
    public MaterialController(MaterialService materialService, MaterialRepository materialRepository, SubCategoryRepository subCategoryRepository){
        this.materialService = materialService;
        this.materialRepository = materialRepository;
        this.subCategoryRepository = subCategoryRepository;
    }

    // 세션을 저장할 변수
    Member user = null;
    // 조회
    @GetMapping("/material")
    public String getAllMaterials(HttpSession session, Model model) {

        // 사용자 세션
        user = (Member) session.getAttribute("user");
        if (user != null) {
            model.addAttribute("userName", user.getName());
        }

        if (user == null) {
            return "redirect:/login"; // 로그인 페이지 경로 변경
        }

        List<MaterialDTO> materials = materialRepository.findAllByMaterials(null, null, null);
        model.addAttribute("materials", materials);

        long cnt = materialService.getAllCnt();
        model.addAttribute("cnt", cnt);

        return "material";
    }

    // 검색조회
    @GetMapping("/material/search")
    @ResponseBody
    public List<MaterialDTO> getAllMaterials(@RequestParam(value = "keyword", required = false) String keyword, String searchType) {
        List<MaterialDTO> materialList = new ArrayList<>();

        // 제품명으로 조회
        if(searchType.equals("name"))
            materialList = materialRepository.findAllByMaterials(keyword, null, null);
            // 제품코드로 조회
        else if(searchType.equals("code"))
            materialList = materialRepository.findAllByMaterials(null, keyword, null);
            // 제품유형으로 조회
        else
            materialList = materialRepository.findAllByMaterials(null, null, keyword);

        return materialList;
    }

    // 삭제
    @PostMapping("/materials/delete")
    public ResponseEntity<?> deleteMaterials(@RequestBody List<String> codes){
        materialRepository.deleteAllById(codes);
        return ResponseEntity.ok().body("{\"message\":\"Deletion successful\"}");
    }

    // 수정
    @PostMapping("/material/update")
    public ResponseEntity<?> updateMaterial(@RequestBody Material updateMaterial){
        Optional<Material> materialOptional = materialRepository.findById(updateMaterial.getCode());
        if(materialOptional.isPresent()){
            Material material = materialOptional.get();

            material.setName(updateMaterial.getName());
            material.setType(updateMaterial.getType());
            material.setWeight(updateMaterial.getWeight());
            material.setRemark(updateMaterial.getRemark());

            materialRepository.save(material);

            return ResponseEntity.ok().body("{\"message\":\"Deletion successful\"}");
        }

        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("{\"message\":\"Product not found\"}");
    }

    // 자재 등록 페이지 이동
    @GetMapping("/materialInsert")
    public String materialsInsertPage(Model model, HttpSession session) {
        model.addAttribute("material_cnt", materialService.getAllCnt());

        // 사용자 세션
        if (user != null) {
            model.addAttribute("userName", user.getName());
        }else{
            return "redirect:/login"; // 로그인 페이지 경로 변경
        }

        return "materialInsert";
    }

    // db 제품명 중복 검사
    @PostMapping("/checkMatName")
    @ResponseBody
    public boolean checkName(@RequestBody Map<String, String> json) {
        String name = json.get("name");
        // 포함됨
        if(materialRepository.existsByName(name)){
            return true;
        }else{ // 포함되지 않음
            return false;
        }
    }

    // 저장
    @PostMapping("/materials/insert")
    @ResponseBody
    public ResponseEntity<?> insertProduct(@RequestBody List<Material> materials) {
        materialService.insertMaterialList(materials);
        return ResponseEntity.ok().body("{\"message\":\"Insert successful\"}");
    }

}
