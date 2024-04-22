class TableRow{
    constructor(name, code, type, unit, weight, weight_unit, remark) {
        this.name = name;
        this.code = code;
        this.type = type;
        this.unit = unit;
        this.weight = weight;
        this.weight_unit = weight_unit;
        this.remark = remark;
    }
}

// 저장 버튼
function saveComplete(){
    var tbody = document.getElementById('tbody');

    // 행이 1개 남았을 때만 검사
    if(tbody.rows.length <= 1){
        var proName = tbody.rows[0].cells[0].textContent;
        if(proName === ""){
            alert("저장할 내용이 없습니다.");
        }else{
            alert("저장이 완료되었습니다.");
            save(tbody);
        }
    }
    else{
        alert("저장이 완료되었습니다.");
        save(tbody);
    }
}

function save(tbody){
    var products = [];

    for(var i = 0; i < tbody.rows.length; i++){
        var row = tbody.rows[i];
        var product = {
            name: row.cells[0].textContent,
            code: row.cells[1].textContent,
            type: row.cells[2].textContent,
            unit: row.cells[3].textContent,
            weight: row.cells[4].textContent,
            remark: row.cells[5].textContent
        };
        console.log(product.name + product.code + product.type + product.unit + product.weight + product.remark + "");
        products.push(product); // 리스트에 product 객체 추가
    }

    fetch('/products/insert',{
        method : 'POST',
        headers: {'Content-Type' : 'application/json',},
        body: JSON.stringify(products)
    })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
            window.location.reload();
        })
        .catch((error) => {
            console.error('Error:', error);
        });

    return products;
}

// 검색 옵션 변경 이벤트
function optionChange(select){
    window.location = "product";
}

// 중량 input의 oninput이벤트(사용자가 입력 필드에 값을 입력할 때마다 발생)
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

// 중량 input의 onfocus이벤트(포커스를 받았을 때 발생)
function removeDefault(input){
    // 디폴트 값인 0으로 설정되어 있을 시 공백으로 보여주기
    if(input.value === "0"){
        input.value = "";
    }
}

// 추가 버튼
async function addData() {
    var name = document.getElementById('input_name').value; //제품명
    var type = document.getElementById('select_type').value; //제품유형
    var code = ""; //코드
    var unit = document.getElementById('select_unit').value; //단위
    var weight = document.getElementById('input_weight').value; //중량
    var weight_unit = document.getElementById('select_weight_unit').value; //중량 단위
    var remark = document.getElementById('remark_content').value; //비고
    var table = document.getElementById('data_table'); //테이블
    var receiveRow = new TableRow(name, code, type, unit, weight, weight_unit, remark);

    // 1. 필수 입력 검사
    var checkCells = [
        {label: "제품명", value: receiveRow.name},
        {label: "중량", value: receiveRow.weight}
    ];
    if (!checkField(checkCells)) return;

    // 2. 중복 데이터 검사
    // 행 검사
    if (!checkDuplication(name, table)) return;
    // DB 검사 -await : 비동기 함수 기다림
    if (!await checkDuplication_db(name)) return;


    var newRow = table.insertRow(-1); // insertRow : 테이블에 새로운 행 삽입(삽입될 행의 인덱스 번호 -> 0:첫번째, -1: 마지막 행)
    // 로우 클릭 이벤트
    newRow.onclick = function () {
        rowClick(this);
    };

    // 4. 첫번째 행의 제품명이 공백이면 해당 행 삭제
    if (table.rows.length <= 3) {
        var firstRowName = table.rows[1].cells[0].textContent;

        if (firstRowName === "") {
            table.deleteRow(1);
        }
    }

    var cell0 = newRow.insertCell(0); // -> 0인덱스에 셀 추가, 이 셀에 대한 참조를 cell1에 저장
    cell0.className = "name"; // 클래스 적용
    cell0.innerHTML = `<div>${name}</div>`;

    var cell1 = newRow.insertCell(-1);
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

    var removeImg = document.createElement("img");
    removeImg.src = "image/xBtn.png";
    removeImg.className = "remove";
    removeImg.onclick = function () {
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
function deleteRow(event, removeBtn){
    // img에 대한 이벤트만 실행가능하도록 이벤트 버블링 막음
    // 이벤트 버블링:  한 요소에 이벤트가 발생되면, 그 요소의 부모 요소의 이벤트도 같이 발생되는 이벤트 전파
    event.stopPropagation();

    var row = removeBtn.parentNode.parentNode; //tr
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
    }
}

// 행 인덱스
var selectedRowIndex = -1;

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
    document.getElementById('remark_content').value = remark.trim();

    var tbody = row.parentNode;
    // 행 한개씩 클릭
    var rows = tbody.querySelectorAll('tr');
    var previousRow = null;

    selectedRowIndex = Array.from(tbody.children).indexOf(row);

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

    updateBtn();
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

// 행 중복 검사
function checkDuplication(name, table){
    var rows = table.querySelectorAll('tr');
    for(var i = 0; i < rows.length; i++){
        if(rows[i].cells[0].textContent === name){
            alert("중복된 제품명입니다.");
            return false;
        }
    }
    return true;
}

// db 중복 검사
async function checkDuplication_db(name){
    try {
        const response = await fetch('/checkName', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name: name })
        });
        const data = await response.json();
        if(data) {
            alert("중복된 제품명입니다.");
            return false;
        } else {
            return true;
        }
    } catch (error) {
        console.error('Error:', error);
        return false;
    }
}


// 수정 버튼 <-> 추가 버튼
var updateBtnExists = false;
function updateBtn(){
    var addBtn = document.getElementById('add_btn');
    if (!updateBtnExists) {
        // 수정 버튼 생성
        var updateBtn = document.createElement('button');
        updateBtn.type = "button";
        updateBtn.className = 'upBtn';
        updateBtn.style.width = "5.5rem";
        updateBtn.style.height = "2rem";
        updateBtn.style.background = "#428BCA";
        updateBtn.style.color = "white";
        updateBtn.style.border = "none";
        updateBtn.style.borderRadius = "0.3rem";
        updateBtn.style.fontSize = "0.9rem";
        updateBtn.style.fontWeight = "600";
        updateBtn.style.marginRight = "1rem";
        updateBtn.style.cursor = "pointer";
        updateBtn.innerHTML = '수정';

        updateBtn.onclick = function() {
            clickUpBtn();
        };

        addBtn.parentNode.insertBefore(updateBtn, addBtn);
        addBtn.style.display = "none";
        updateBtnExists = true;
    }
}

// 원상복구 함수
function revertToOriginalState() {
    var addBtn = document.getElementById('add_btn');
    var updateBtn = document.querySelector('.upBtn'); // 'updateBtn' 찾기
    if (updateBtn) {
        updateBtn.remove(); // 'updateBtn' 제거
        updateBtnExists = false; // 'updateBtn' 존재 여부 업데이트
    }
    addBtn.style.display = ""; // 'addBtn'을 다시 보이게 함
}

// 초기화 버튼 클릭 이벤트
function clickReset(){
    revertToOriginalState();
}

// 수정 버튼 클릭 이벤트
async function clickUpBtn(){

    var name = document.getElementById('input_name').value; //제품명
    var code = ""; //코드
    var type = document.getElementById('select_type').value; //제품유형
    var unit = document.getElementById('select_unit').value; //단위
    var weight = document.getElementById('input_weight').value; //중량
    var weight_unit = document.getElementById('select_weight_unit').value; //중량 단위
    var remark = document.getElementById('remark_content').value; //비고

    var table = document.getElementById('data_table'); //테이블
    var rows = table.getElementsByTagName('tr');

    // 1. 필수 입력 검사
    var checkCells = [
        {label: "제품명", value: name},
        {label: "중량", value: weight}
    ];
    if(!checkField(checkCells)) return;

    // 2. 중복 데이터 검사
    // DB 검사 -await : 비동기 함수 기다림
    if (!await checkDuplication_db(name)) return;

    if(selectedRowIndex > -1){
        var upRow = rows[selectedRowIndex + 1];
        upRow.onclick = function() {
            rowClick(this);
        };
    }

    if(upRow != null){
        upRow.cells[0].style.fontWeight = "550";
        upRow.cells[0].className = "name";
        upRow.cells[0].innerHTML = `<div>${name}</div>`;
        upRow.cells[1].textContent = code; // 코드
        upRow.cells[2].textContent = type; // 제품유형
        upRow.cells[3].textContent = unit; // 단위
        upRow.cells[4].textContent = weight + " " + weight_unit; // 중량 및 중량 단위
        upRow.cells[5].className = "remark";
        upRow.cells[5].innerHTML = `<div>${remark}</div>`;

        var removeImg = document.createElement("img");
        removeImg.src = "image/xBtn.png";
        removeImg.className = "remove";
        removeImg.onclick = function () {
            deleteRow(event, this);
        };

        upRow.cells[5].appendChild(removeImg);

/*        var remarkDiv = document.createElement("div");
        remarkDiv.innerHTML = remark;
        remarkDiv.style.fontSize = "1rem";

        var removeImg = document.createElement("img");
        removeImg.src = "image/xBtn.png";
        removeImg.className = "remove";
        removeImg.onclick = function () {
            deleteRow(event, this);
        };

        upRow.cells[5].appendChild(remarkDiv);
        upRow.cells[5].appendChild(removeImg);*/

    }

    document.getElementById("input_name").value = "";
    document.getElementById("select_type").selectedIndex = 0;
    document.getElementById("select_unit").selectedIndex = 0;
    document.getElementById("input_weight").value = "0";
    document.getElementById("select_weight_unit").selectedIndex = 0;
    document.getElementById("remark_content").value = "";

    revertToOriginalState();
}

function searchInput(){
    window.location = "product";
}
