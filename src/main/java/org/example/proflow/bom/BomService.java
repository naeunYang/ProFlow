package org.example.proflow.bom;

import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BomService {
    @Autowired
    private BomRepository bomRepository;

    @Transactional
    public void replaceBomData(List<Bom> newBomData) {
        // 기존 BOM 데이터 전부 삭제
        bomRepository.deleteAll();

        // 새로운 BOM 데이터 삽입
        bomRepository.saveAll(newBomData);
    }
}
