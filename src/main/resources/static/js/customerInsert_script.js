// 저장 버튼
function saveComplete(){
    var tbody = document.getElementById('tbody');

    // 행이 1개 남았을 때만 검사
    if(tbody.rows.length <= 1){
        var custName = tbody.rows[0].cells[0].textContent;
        if(custName === ""){
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
    var customers = [];

    for(var i = 0; i < tbody.rows.length; i++){
        var row = tbody.rows[i];
        var customer = {
            name: row.cells[0].textContent,
            code: row.cells[1].textContent,
            no: row.cells[2].textContent,
            type: row.cells[3].getAttribute("value"),
            tel: row.cells[4].textContent,
            addr: row.cells[5].textContent
        };
        customers.push(customer); // 리스트에 product 객체 추가
    }

    fetch('/customers/insert',{
        method : 'POST',
        headers: {'Content-Type' : 'application/json',},
        body: JSON.stringify(customers)
    })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
            window.location.href = '/customer';
        })
        .catch((error) => {
            console.error('Error:', error);
        });

    return customers;
}

// 추가 버튼
async function addData() {
    await typeChange();

    //거래처명
    var divNameInput = document.getElementById('input_name');
    var name = document.getElementById('input_name').value;

    //거래처코드
    var code = "";

    //사업자등록번호
    var divNoInput = document.getElementById('input_no');
    var no = document.getElementById('input_no').value;

    //거래처유형
    var typeSelect = document.getElementById('select_type');
    var type = typeSelect.value;
    var typeValue = typeSelect.options[typeSelect.selectedIndex].text;

    //연락처
    var divTelInput = document.getElementById('input_tel');
    var tel = document.getElementById('input_tel').value;

    //주소
    var divAddrInput = document.getElementById('input_addr');
    var addr = document.getElementById('input_addr').value;
    divAddrInput.style.fontSize = "1rem";

    var table = document.getElementById('data_table'); //테이블

    // 1. 필수 입력 검사
    var checkCells = [
        {label: "거래처명", value: name},
        {label: "거래처유형", value: type},
    ];
    if (!checkField(checkCells)) return;

    // 2. 중복 데이터 검사
    // 행 검사
    if (!checkDuplication(name, table, divNameInput)) return;
    // DB 검사 -await : 비동기 함수 기다림
    if (!await checkDuplication_db(name, divNameInput)) return;

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
    cell0.style.fontSize = "1rem";
    cell0.innerHTML = `<div>${name}</div>`;

    var cell1 = newRow.insertCell(-1);
    cell1.className = "code";
    cell1.innerHTML = code;

    var cell2 = newRow.insertCell(-1);
    cell2.className = "no";
    cell2.innerHTML = no;

    var cell3 = newRow.insertCell(-1);
    cell3.className = "type";
    cell3.innerHTML = typeValue;
    cell3.setAttribute("value", type);

    var cell4 = newRow.insertCell(-1);
    cell4.className = "tel";
    cell4.innerHTML = tel;

    var cell5 = newRow.insertCell(-1);
    cell5.className = "addr"; // 클래스 적용
    cell5.style.fontSize = "1rem";

    var addrDiv = document.createElement("div");
    addrDiv.innerHTML = addr;

    var addrImg = document.createElement("img");
    addrImg.src = "image/xBtn.png";
    addrImg.className = "remove";
    addrImg.onclick = function () {
        deleteRow(event, this);
    };

    cell5.appendChild(addrImg);
    cell5.appendChild(addrDiv);

    document.getElementById("input_name").value = "";
    document.getElementById("input_no").value = "";
    document.getElementById("select_type").selectedIndex = 0;
    document.getElementById("input_tel").value = "";
    document.getElementById("input_addr").value = "";

    divNameInput.focus();
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
    var no = row.cells[2].textContent;
    var type = row.cells[3].getAttribute("value");
    var tel = row.cells[4].textContent;
    var addr = row.cells[5].textContent;

    document.getElementById('input_name').value = name;
    document.getElementById('input_no').value = no;
    document.getElementById('select_type').value = type;
    document.getElementById('input_tel').value = tel;
    document.getElementById('input_addr').value = addr;

    var tbody = row.parentNode;
    // 행 한개씩 클릭
    var rows = tbody.querySelectorAll('tr');
    var previousRow = null;

    selectedRowIndex = Array.from(tbody.children).indexOf(row);

    rows.forEach(function(row) {

        row.addEventListener('click', function(){
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
function checkDuplication(name, table, divNameInput){
    var rows = table.querySelectorAll('tr');
    for(var i = 0; i < rows.length; i++){
        if(rows[i].cells[0].textContent === name){
            alert("중복된 거래처명입니다.");
            divNameInput.focus();
            return false;
        }
    }
    return true;
}

// db 중복 검사
async function checkDuplication_db(name, divNameInput){
    try {
        const response = await fetch('/checkCustName', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name: name })
        });
        const data = await response.json();
        if(data) {
            alert("중복된 거래처명입니다.");
            divNameInput.focus();
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
        updateBtn.tabIndex = "7";
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
    var no = document.getElementById('input_no').value; //사업자등록번호
    //거래처유형
    var typeSelect = document.getElementById('select_type');
    var typeValue = typeSelect.options[typeSelect.selectedIndex].text;

    var tel = document.getElementById('input_tel').value; //연락처
    var addr = document.getElementById('input_addr').value; //주소

    var table = document.getElementById('data_table'); //테이블
    var rows = table.getElementsByTagName('tr');

    // 1. 필수 입력 검사
    var checkCells = [
        {label: "거래처명", value: name},
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
        upRow.cells[2].textContent = no; // 사업자등록번호
        upRow.cells[3].textContent = typeValue; // 거래처유형
        upRow.cells[3].setAttribute("value", typeSelect.value);
        upRow.cells[4].textContent = tel; // 연락처
        upRow.cells[5].className = "addr"; //주소
        upRow.cells[5].innerHTML = `<div>${addr}</div>`;

        var removeImg = document.createElement("img");
        removeImg.src = "image/xBtn.png";
        removeImg.className = "remove";
        removeImg.onclick = function () {
            deleteRow(event, this);
        };

        upRow.cells[5].appendChild(removeImg);

    }

    document.getElementById('input_name').value = "";
    document.getElementById('input_no').value = "";
    document.getElementById('select_type').selectedIndex = 0;
    document.getElementById('input_tel').value = "";
    document.getElementById('input_addr').value = "";

    revertToOriginalState();
}

function searchClick(){
    window.location="/customer";
}

var dataLoad1 = false;
function typeChange(){
    var typeCombo = document.getElementById("select_type");

    if(dataLoad1) return;

    if (!dataLoad1) {
        const initialOption = new Option("", "", true, true);
        initialOption.disabled = true;
        typeCombo.appendChild(initialOption);
    }

    const url = new URL('/search/typelist', window.location.origin);
    url.searchParams.append('type', 'custtype');
    fetch(url,{
        method : 'GET',
    })
        .then(response => response.json())
        .then(data => {
            data.forEach(item => {
                const option = new Option(item['sc_name'], item['sc_code']);
                typeCombo.appendChild(option);
            });
            dataLoad1 = true;
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}

// 글자 수 제한
function limitInputLength(input){
    if (input.value.length > 11) {
        input.value = input.value.slice(0, 11);
    }
}
