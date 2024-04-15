
function saveComplete(){
    var table = document.getElementById('data_table');
    if(table.rows.length <= 1)
        alert("저장할 내용이 없습니다.");
    else
        alert("저장이 완료되었습니다.");
}

var defaultContent = null;
function optionChange(combo){
    var selectedValue = combo.value;
    var option = combo.parentNode;
    var search = option.querySelector('#search');

    if(defaultContent == null){
        defaultContent = search.innerHTML;
    }

    if(selectedValue === "type"){
        search.style.border = "none";
        var typeCombo = document.createElement("select");
        // 옵션 생성 및 추가
        var option1 = new Option("유형A", "A");
        var option2 = new Option("유형B", "B");
        var option3 = new Option("유형C", "C");

        typeCombo.appendChild(option1);
        typeCombo.appendChild(option2);
        typeCombo.appendChild(option3);

        typeCombo.style.width="40%";
        typeCombo.style.height="2.3rem";
        typeCombo.style.textAlign="center";
        typeCombo.style.borderRadius="0.3rem";
        typeCombo.style.marginRight="0.8rem";

        search.innerHTML = '';
        search.appendChild(typeCombo);
    }else{
        // 이전 상태로 복원
        search.style.border = '';
        search.innerHTML = defaultContent;
    }
}

function numFormat(input){
    input.value = comma(uncomma(input.value));
}

function comma(str) {
    // 소수점 이하를 분리하여 처리
    var parts = str.split('.');
    // 정수 부분에만 콤마 추가
    parts[0] = parts[0].replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,');
    // 정수 부분과 소수점 이하를 다시 합침
    return parts.join('.');
}

function uncomma(str) {
    // 숫자와 소수점만 남김 (소수점 포함)
    return str.replace(/[^\d.]+/g, '');
}

function removeDefault(input){
    if(input.value === "0"){
        input.value = "";
    }
}

// 추가 버튼
function addData(){
    var name = document.getElementById('input_name').value; //제품명
    var code = "CT(P)-E000001"; //코드
    var type = document.getElementById('select_type').value; //제품유형
    var unit = document.getElementById('select_unit').value; //단위
    var weight = document.getElementById('input_weight').value; //중량
    var weight_unit = document.getElementById('select_weight_unit').value; //중량 단위
    var remark = document.getElementById('remark_content').value; //비고

    var table = document.getElementById('data_table'); //테이블

    // 필수 입력 검사
    var checkCells = [
        {label: "제품명", value: name},
        {label: "중량", value: weight}
    ];
    if(!checkField(checkCells)) return;

    // 중복 데이터 검사
/*    if(!checkDuplication(name, table)) return;*/

    var newRow = table.insertRow(-1); // insertRow : 테이블에 새로운 행 삽입(삽입될 행의 인덱스 번호 -> 0:첫번째, -1: 마지막 행)

    // 첫번째 행의 제품명이 공백이면 해당 행 삭제(데이터를 추가할 때)
    if(table.rows.length <= 3){
        var firstRow = table.rows[1];
        var firstRowName = firstRow.cells[0].textContent;
        console.log("첫번째 행 정보 : " + firstRowName);
        if(firstRowName === ""){
            table.deleteRow(1);
        }
    }

    // 로우 클릭 이벤트
    newRow.onclick = function() {
        rowClick(this);
    };

    var cell0 = newRow.insertCell(0); // -> 0인텍스에 셀 추가, 이 셀에 대한 참조를 cell1에 저장
    cell0.className = "name"; // 클래스 적용
    cell0.innerHTML = `<div>${name}</div>`;

    var cell1 = newRow.insertCell(-1); // -> 0인텍스에 셀 추가, 이 셀에 대한 참조를 cell1에 저장
    cell1.className = "code";
    cell1.innerHTML = code;

    var cell2 = newRow.insertCell(-1);
    cell2.className = "type";
    cell2.innerHTML = type;

    var cell3 = newRow.insertCell(-1);
    cell3.style.textAlign = "center";
    cell3.innerHTML = unit;

    var cell4 = newRow.insertCell(-1);
    cell4.className = "weight";
    cell4.innerHTML = weight + " " + weight_unit;

    var cell5 = newRow.insertCell(-1);
    cell5.className = "remark"; // 클래스 적용

    var remarkDiv = document.createElement("div");
    remarkDiv.innerHTML = remark;
    remarkDiv.style.fontSize = "1rem";

    var removeImg = document.createElement("img");
    removeImg.src = "image/xBtn.png";
    removeImg.className = "remove";
    removeImg.onclick = function() {
        deleteRow(event, this);
    };

    cell5.appendChild(removeImg);
    cell5.appendChild(remarkDiv);

    document.getElementById("input_name").value = "";
    document.getElementById("select_type").selectedIndex = 0;
    document.getElementById("select_unit").selectedIndex = 0;
    document.getElementById("input_weight").value = "0";
    document.getElementById("select_weight_unit").selectedIndex = 0;
    document.getElementById("remark_content").value = "";
}

// 행 삭제 버튼 이벤트(x)
function deleteRow(event, btn){
    // img에 대한 이벤트만 실행가능하도록 이벤트 버블링 막음
    // 이벤트 버블링:  한 요소에 이벤트가 발생되면, 그 요소의 부모 요소의 이벤트도 같이 발생되는 이벤트 전파
    event.stopPropagation();

    var row = btn.parentNode.parentNode; //tr
    var table = row.parentNode; //tbody
    var rowIndex = row.rowIndex - 1; //이벤트 발생한 행 인덱스

    if(table.rows.length <= 1){
        // 테이블게 행이 없을 경우 기본 테이블 설정
        for(var i = 0; i < row.cells.length; i++) {
            row.cells[i].innerHTML = '';
            row.style.height = "2rem";
        }
    }else{
        table.deleteRow(rowIndex);
        console.log("현재 삭제된 행은 제품명이 " + row.cells[0].textContent + "입니다.");
    }
}

// 행 클릭 이벤트
function rowClick(row){
    var name = row.cells[0].textContent;
    var type = row.cells[2].textContent;
    var unit = row.cells[3].textContent;
    var weight = row.cells[4].textContent;
    var word = weight.split(' ');
    var remark = row.cells[5].textContent;

    document.getElementById('input_name').value = name;
    document.getElementById('select_type').value = type;
    document.getElementById('select_unit').value = unit;
    document.getElementById('input_weight').value = word[0];
    document.getElementById('select_weight_unit').value = word[1];
    document.getElementById('remark_content').value = remark;

    var tbody = row.parentNode;
    // 행 한개씩 클릭
    var rows = tbody.querySelectorAll('tr');
    var previousRow = null;

    rows.forEach(function(row) {

        row.addEventListener('click', function(){
            // 이 경우, 단순 클릭입니다.
            if(previousRow != null){
                previousRow.style.backgroundColor = "";
            }
            row.style.backgroundColor = "#becbd4";
            previousRow = row;

        })

    });


    // 테이블 바깥부분 클릭 씨 활성화 해제
    document.addEventListener('click', function(event) {
        var target = event.target; //이벤트가 발생한 요소 저장

        // 테이블 요소 이외의 요소를 클릭한 경우
        if (!target.closest('tbody')) {
            if (previousRow != null) {
                previousRow.style.backgroundColor = "";
                previousRow = null;
            }
        }
    });

}

// 필수 입력 검사
function checkField(cells){
    for(var i = 0; i < cells.length; i++){
        var cell = cells[i];

        if(cell.value === "" || cell.value === "0"){
            alert(cell.label + "을(를) 입력하세요"); // 객체의 'label' 속성을 사용합니다.
            return false;
        }
    }
    return true;
}

/*
// 중복 검사
function checkDuplication(name, table){
    var rows = table.querySelectorAll('tr');
    for(var i = 0; i < rows.length; i++){
        if(rows[i].cells[0].textContent === name){
            alert("중복된 제품입니다.");
            return false;
        }
    }
    return true;
}*/
