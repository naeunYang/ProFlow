package org.example.proflow.customer;

import jakarta.servlet.http.HttpSession;
import org.example.proflow.category.SubCategory;
import org.example.proflow.category.SubCategoryRepository;
import org.example.proflow.login.Member;
import org.example.proflow.product.Product;
import org.example.proflow.product.ProductDTO;
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
public class CustomerController {
    private final CustomerService customerService;
    private final CustomerRepository customerRepository;
    private final SubCategoryRepository subCategoryRepository;

    @Autowired
    public CustomerController(CustomerService customerService, CustomerRepository customerRepository, SubCategoryRepository subCategoryRepository) {
        this.customerService = customerService;
        this.customerRepository = customerRepository;
        this.subCategoryRepository = subCategoryRepository;
    }

    Member user = null;
    // 조회
    @GetMapping("/customer")
    public String getAllCustomers(HttpSession session, Model model) {

        // 사용자 세션
        user = (Member) session.getAttribute("user");
        if (user != null) {
            model.addAttribute("userName", user.getName());
        }

        if (user == null) {
            return "redirect:/login"; // 로그인 페이지 경로 변경
        }

        List<CustomerDTO> customers = customerRepository.findAllByCustomers(null, null, null);
        model.addAttribute("customers", customers);

        long cnt = customerService.getAllCnt();
        model.addAttribute("cnt", cnt);

        return "customer";
    }

    // 검색조회
    @GetMapping("/customer/search")
    @ResponseBody
    //@ResponseBody가 없을 때는 보통 해당 문자열에 해당하는 뷰 템플릿을 찾아서 반환, 있을 때는 메서드가 반환하는 객체나 리스트가 클라이언트에게 JSON형태로 직접 전송된다.
    public List<CustomerDTO> getAllCustomers(@RequestParam(value = "keyword", required = false) String keyword, String searchType) {
        List<CustomerDTO> customerList = new ArrayList<>();

        // 거래처명으로 조회
        if(searchType.equals("name"))
            customerList = customerRepository.findAllByCustomers(keyword, null, null);
            // 거래처 코드로 조회
        else if(searchType.equals("code"))
            customerList = customerRepository.findAllByCustomers(null, keyword, null);
            //거래처유형으로 조회
        else
            customerList = customerRepository.findAllByCustomers(null, null, keyword);

        return customerList;
    }

    // 삭제
    @PostMapping("/customer/delete")
    public ResponseEntity<?> deleteCustomers(@RequestBody List<String> codes){
        customerRepository.deleteAllById(codes);
        return ResponseEntity.ok().body("{\"message\":\"Deletion successful\"}");
    }

    // 수정
    @PostMapping("/customer/update")
    public ResponseEntity<?> updateCustomer(@RequestBody Customer updateCustomer){
        Optional<Customer> customerOptional = customerRepository.findById(updateCustomer.getCode());
        if(customerOptional.isPresent()){ //isPresent() : 객체가 값을 포함하고 있는지 확인
            Customer customer = customerOptional.get(); // Optional에서 Product 객체를 가져옴

            customer.setName(updateCustomer.getName());
            customer.setNo(updateCustomer.getNo());
            customer.setType(updateCustomer.getType());
            customer.setAddr(updateCustomer.getAddr());
            customer.setTel(updateCustomer.getTel());

            customerRepository.save(customer);

            return ResponseEntity.ok().body("{\"message\":\"Deletion successful\"}");
        }

        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("{\"message\":\"Product not found\"}");
    }

    // 제품 등록페이지로 이동 시 제품 현황 CNT값 가져가기
    @GetMapping("/customerInsert")
    public String customerInsertPage(Model model, HttpSession session) {
        model.addAttribute("customer_cnt", customerService.getAllCnt());

        // 사용자 세션
        if (user != null) {
            model.addAttribute("userName", user.getName());
        }else{
            return "redirect:/login"; // 로그인 페이지 경로 변경
        }

        return "customerInsert";
    }

    // db 제품명 중복 검사
    @PostMapping("/checkCustName")
    @ResponseBody
    public boolean checkName(@RequestBody Map<String, String> json) {
        String name = json.get("name");
        // 포함됨
        if(customerRepository.existsByName(name)){
            return true;
        }else{ // 포함되지 않음
            return false;
        }
    }

    // 저장
    @PostMapping("/customers/insert")
    @ResponseBody
    public ResponseEntity<?> insertCustomer(@RequestBody List<Customer> customers) {
        customerService.insertCustomerList(customers);
        return ResponseEntity.ok().body("{\"message\":\"Insert successful\"}");
    }

}
