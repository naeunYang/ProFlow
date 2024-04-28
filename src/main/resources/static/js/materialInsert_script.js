// 저장 버튼
function saveComplete(){
    var tbody = document.getElementById('tbody');

    // 행이 1개 남았을 때만 검사
    if(tbody.rows.length <= 1){
        var matName = tbody.rows[0].cells[0].textContent;
        if(matName === ""){
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
    var materials = [];

    for(var i = 0; i < tbody.rows.length; i++){
        var row = tbody.rows[i];
        var material = {
            name: row.cells[0].textContent,
            code: row.cells[1].textContent,
            type: row.cells[2].getAttribute("value"),
            weight: row.cells[3].textContent,
            remark: row.cells[4].textContent
        };
        materials.push(material); // 리스트에 product 객체 추가
    }

    fetch('/materials/insert',{
        method : 'POST',
        headers: {'Content-Type' : 'application/json',},
        body: JSON.stringify(materials)
    })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
            window.location.href = '/material';
        })
        .catch((error) => {
            console.error('Error:', error);
        });

    return materials;
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
    await typeChange();
    await wunitChange();

    //자재명
    var divNameInput = document.getElementById('input_name');
    var name = document.getElementById('input_name').value;
    divNameInput.style.fontSize = "1rem";

    //자재유형
    var typeSelect = document.getElementById('select_type');
    var type = typeSelect.value;
    var typeValue = typeSelect.options[typeSelect.selectedIndex].text;

    //코드
    var code = "";

    //중량
    var weight = document.getElementById('input_weight').value;

    //중량 단위
    var weight_unit_select = document.getElementById('select_weight_unit');
    var weight_unit = weight_unit_select.value;
    var weight_unit_value = weight_unit_select.options[weight_unit_select.selectedIndex].text;

    //비고
    var remark = document.getElementById('remark_content').value; //비고

    var table = document.getElementById('data_table'); //테이블

    // 1. 필수 입력 검사
    var checkCells = [
        {label: "자재명", value: name},
        {label: "중량", value: weight},
        {label: "중량 단위", value: weight_unit},
        {label: "자재유형", value: type},
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
    cell0.innerHTML = `<div>${name}</div>`;

    var cell1 = newRow.insertCell(-1);
    cell1.className = "code";
    cell1.innerHTML = code;

    var cell2 = newRow.insertCell(-1);
    cell2.className = "type";
    cell2.style.fontSize = "1rem";
    cell2.innerHTML = typeValue;
    cell2.setAttribute("value", type);

    var cell3 = newRow.insertCell(-1);
    cell3.className = "weight";
    cell3.innerHTML = weight + " " + weight_unit_value;
    cell3.setAttribute("value", weight_unit);

    var cell4 = newRow.insertCell(-1);
    cell4.className = "remark"; // 클래스 적용

    var remarkDiv = document.createElement("div");
    remarkDiv.innerHTML = remark;

    var removeImg = document.createElement("img");
    removeImg.src = "image/xBtn.png";
    removeImg.className = "remove";
    removeImg.onclick = function () {
        deleteRow(event, this);
    };

    cell4.appendChild(removeImg);
    cell4.appendChild(remarkDiv);

    document.getElementById("input_name").value = "";
    document.getElementById("select_type").selectedIndex = 0;
    document.getElementById("input_weight").value = "0";
    document.getElementById("select_weight_unit").selectedIndex = 0;
    document.getElementById("remark_content").value = "";

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
    var type = row.cells[2].getAttribute("value");
    var weight = row.cells[3].textContent;
    var word = weight.split(' ');
    var remark = row.cells[4].textContent;

    document.getElementById('input_name').value = name;
    document.getElementById('select_type').value = type;
    document.getElementById('input_weight').value = word[0];
    document.getElementById('select_weight_unit').value = row.cells[3].getAttribute("value");
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
function checkDuplication(name, table, divNameInput){
    var rows = table.querySelectorAll('tr');
    for(var i = 0; i < rows.length; i++){
        if(rows[i].cells[0].textContent === name){
            alert("중복된 자재명입니다.");
            divNameInput.focus();
            return false;
        }
    }
    return true;
}

// db 중복 검사
async function checkDuplication_db(name, divNameInput){
    try {
        const response = await fetch('/checkMatName', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name: name })
        });
        const data = await response.json();
        if(data) {
            alert("중복된 자재명입니다.");
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

    //자재명
    var name = document.getElementById('input_name').value;
    var code = ""; //코드

    //자재유형
    var typeSelect = document.getElementById('select_type');
    var typeValue = typeSelect.options[typeSelect.selectedIndex].text;

    //중량
    var weight = document.getElementById('input_weight').value;

    //중량 단위
    var weight_unit_select = document.getElementById('select_weight_unit');
    var weight_unit_value = weight_unit_select.options[weight_unit_select.selectedIndex].text;

    var remark = document.getElementById('remark_content').value; //비고

    var table = document.getElementById('data_table'); //테이블
    var rows = table.getElementsByTagName('tr');

    // 1. 필수 입력 검사
    var checkCells = [
        {label: "자재명", value: name},
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
        upRow.cells[2].textContent = typeValue; // 제품유형
        upRow.cells[2].setAttribute("value", typeSelect.value);
        upRow.cells[3].textContent = weight + " " + weight_unit_value; // 중량 및 중량 단위
        upRow.cells[3].setAttribute("value", weight_unit_select.value);
        upRow.cells[4].className = "remark";
        upRow.cells[4].innerHTML = `<div>${remark}</div>`;

        var removeImg = document.createElement("img");
        removeImg.src = "image/xBtn.png";
        removeImg.className = "remove";
        removeImg.onclick = function () {
            deleteRow(event, this);
        };

        upRow.cells[4].appendChild(removeImg);

    }

    document.getElementById("input_name").value = "";
    document.getElementById("select_type").selectedIndex = 0;
    document.getElementById("input_weight").value = "0";
    document.getElementById("select_weight_unit").selectedIndex = 0;
    document.getElementById("remark_content").value = "";

    revertToOriginalState();
}

function searchClick(){
    window.location="/material";
}

var dataLoad1 = false;
function typeChange(){
    var typeCombo = document.getElementById("select_type");

    if(dataLoad1) return;

    if (!dataLoad1) {
        const initialOption = new Option("", "", true, true);
        initialOption.disabled = true; // 이 옵션을 선택할 수 없게 만듭니다.
        typeCombo.appendChild(initialOption);
    }

    const url = new URL('/search/typelist', window.location.origin);
    url.searchParams.append('type', 'mattype');
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

var dataLoad3 = false;
function wunitChange(){
    var wunitCombo = document.getElementById("select_weight_unit");

    if(dataLoad3) return;

    if (!dataLoad3) {
        const initialOption = new Option("", "", true, true);
        initialOption.disabled = true; // 이 옵션을 선택할 수 없게 만듭니다.
        wunitCombo.appendChild(initialOption);
    }

    const url2 = new URL('/search/typelist', window.location.origin);
    url2.searchParams.append('type', 'weightunit');
    fetch(url2,{
        method : 'GET',
    })
        .then(response => response.json())
        .then(data => {
            data.forEach(item => {
                const option = new Option(item['sc_name'], item['sc_code']);
                wunitCombo.appendChild(option);
            });
            dataLoad3 = true;
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}
