// 저장 버튼
function saveComplete(){
    var tbody = document.getElementById('tbody');

    // 행이 1개 남았을 때만 검사
    if(tbody.rows.length <= 1){
        var unitName = tbody.rows[0].cells[0].textContent;
        if(unitName === ""){
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
    var units = [];

    for(var i = 0; i < tbody.rows.length; i++){
        var row = tbody.rows[i];
        var unit = {
            mc_code: row.cells[0].getAttribute("value"),
            sc_code: row.cells[1].textContent,
            sc_name: row.cells[2].textContent
        };
        units.push(unit);

    }

    fetch('/unit/insert',{
        method : 'POST',
        headers: {'Content-Type' : 'application/json',},
        body: JSON.stringify(units)
    })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
            window.location.href = '/unit';
        })
        .catch((error) => {
            console.error('Error:', error);
        });

    return units;
}

// 추가 버튼
async function addData() {

    //대분류
    var mainSelect = document.getElementById('select_type');
    var main = mainSelect.value;
    var mainValue = mainSelect.options[mainSelect.selectedIndex].text;

    //소분류코드
    var subCode = "";

    //소분류 명
    var subNameInput = document.getElementById('input_name');
    var name = document.getElementById('input_name').value;

    var table = document.getElementById('data_table'); //테이블

    // 1. 필수 입력 검사
    var checkCells = [
        {label: "소분류명", value: name},
    ];
    if (!checkField(checkCells)) return;

    // 2. 중복 데이터 검사
    // 행 검사
    if (!checkDuplication(name, table, subNameInput)) return;
    // DB 검사 -await : 비동기 함수 기다림
    if (!await checkDuplication_db(name, subNameInput)) return;


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

    var cell0 = newRow.insertCell(0);
    cell0.className = "mcname";
    cell0.style.fontSize = "1rem";
    cell0.innerHTML = mainValue;
    cell0.setAttribute("value", main);

    var cell1 = newRow.insertCell(-1);
    cell1.className = "sccode";
    cell1.innerHTML = subCode;

    var cell2 = newRow.insertCell(-1);
    cell2.className = "scname"; // 클래스 적용

    var subNameDiv = document.createElement("div");
    subNameDiv.innerHTML = name;

    var subNameImg = document.createElement("img");
    subNameImg.src = "image/xBtn.png";
    subNameImg.className = "remove";
    subNameImg.onclick = function () {
        deleteRow(event, this);
    };

    cell2.appendChild(subNameImg);
    cell2.appendChild(subNameDiv);

    document.getElementById("input_name").value = "";
    document.getElementById("select_type").selectedIndex = 0;

    mainSelect.focus();
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
    var mcname = row.cells[0].getAttribute("value");
    var scname = row.cells[2].textContent;

    document.getElementById('select_type').value = mcname;
    document.getElementById('input_name').value = scname;

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
function checkDuplication(name, table, divNameInput){
    var rows = table.querySelectorAll('tr');
    for(var i = 0; i < rows.length; i++){
        if(rows[i].cells[2].textContent === name){
            alert("중복된 분류명입니다.");
            divNameInput.focus();
            return false;
        }
    }
    return true;
}

// db 중복 검사
async function checkDuplication_db(name, divNameInput){
    try {
        const response = await fetch('/checkUnitName', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name: name })
        });
        const data = await response.json();
        if(data) {
            alert("중복된 분류명입니다.");
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

    //대분류
    var mcNameSelect = document.getElementById('select_type');
    var mcNameValue = mcNameSelect.options[mcNameSelect.selectedIndex].text;

    // 소분류 코드
    var code = "";

    //소분류명
    var scname = document.getElementById('input_name').value;

    var table = document.getElementById('data_table'); //테이블
    var rows = table.getElementsByTagName('tr');

    // 1. 필수 입력 검사
    var checkCells = [
        {label: "소분류명", value: scname},
    ];
    if(!checkField(checkCells)) return;

    // 2. 중복 데이터 검사
    // DB 검사 -await : 비동기 함수 기다림
    if (!await checkDuplication_db(scname)) return;

    if(selectedRowIndex > -1){
        var upRow = rows[selectedRowIndex + 1];
        upRow.onclick = function() {
            rowClick(this);
        };
    }

    if(upRow != null){
        upRow.cells[0].textContent = mcNameValue;
        upRow.cells[0].setAttribute("value", mcNameSelect.value);

        upRow.cells[1].textContent = code; // 코드
        upRow.cells[2].className = "scname";
        upRow.cells[2].innerHTML = `<div>${scname}</div>`;
        var removeImg = document.createElement("img");
        removeImg.src = "image/xBtn.png";
        removeImg.className = "remove";
        removeImg.onclick = function () {
            deleteRow(event, this);
        };
        upRow.cells[2].appendChild(removeImg);
    }

    document.getElementById("input_name").value = "";
    document.getElementById("select_type").selectedIndex = 0;

    revertToOriginalState();
}

function searchClick(){
    window.location="/unit";
}

