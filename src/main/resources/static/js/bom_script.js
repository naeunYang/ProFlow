// 페이지 로드
window.addEventListener("load", async function () {
    // 제품 검색 창에 포커스
    document.getElementById('searchPro').focus();

    // 제품명 클릭 리스너
    var li = document.getElementById('li');
    await proNameClick(li);

    // 자재리스트에 이미 포함된 자재는 배경색 변경 및 리스너 x
    var table1 = document.getElementById('table1');
    var table2 = document.getElementById('table2');
    duplicationRow(table1, table2);
});

function duplicationRow(){
    var table1Names = table1.querySelectorAll('td.name'); //t1의 name리스트
    var table2Rows = table2.querySelectorAll('#table2_tbody tr'); //t2의 행리스트

    // table1에서 모든 이름을 추출하여 배열에 저장
    var namesInTable1 = [];
    table1Names.forEach(function (td) {
        namesInTable1.push(td.innerText.trim());
    });

    table2Rows.forEach(function (row) {
        var nameInRow = row.querySelector('td.name div').innerText.trim();
        row.style.pointerEvents = "all";
        row.style.cursor = "pointer";

        // table1에 같은 이름이 있으면 배경색 변경
        if (namesInTable1.includes(nameInRow)) {
            row.classList.add('no-click');
        }else{
            row.classList.remove('no-click');
        }
    });
}

function noDuplication(){
    var table2Rows = table2.querySelectorAll('#table2_tbody tr');
    table2Rows.forEach(function (row) {
        row.classList.remove('no-click');
        row.style.pointerEvents = "none";
        row.style.cursor = "default";
    });
}

// 검색창 x버튼 이벤트(제품)
function clearSearchProInput(){
    document.getElementById('searchPro').value = '';
    searchEventPro(event);
}

// 검색창 x버튼 이벤트(자재)
function clearSearchMatInput(){
    document.getElementById('searchMat').value = '';
    searchEventMat(event);
}

// 제품 검색 이벤트
function searchEventPro(event){
    let keyword = event.target.value;

    if(keyword === undefined)
        keyword = "";

    var table = document.getElementById('table1'); //테이블
    var rows = table.rows;

    // 검색 시 그리드 셀 clear
    for (var i = 1; i < rows.length; i++) {
        var cells = rows[i].cells;
        for (var j = 0; j < cells.length; j++) {
            cells[j].innerHTML = '';
        }
    }

    // URL에 쿼리 매개변수를 추가하여 검색 키워드를 서버로 전송
    const url = new URL('/bompro/search', window.location.origin);
    url.searchParams.append('keyword', keyword); // 입력값

    fetch(url,{
        method : 'GET',
    })
        .then(response => response.json())
        .then(products => {
            updateProTable(products);
        })
        .catch((error) => {
            console.error('Error:', error);
        });

    noDuplication();
}

// 자재 검색 이벤트
function searchEventMat(event){
    let keyword = event.target.value;

    if(keyword === undefined)
        keyword = "";

    // URL에 쿼리 매개변수를 추가하여 검색 키워드를 서버로 전송
    const url = new URL('/bommat/search', window.location.origin);
    url.searchParams.append('keyword', keyword); // 입력값

    fetch(url,{
        method : 'GET',
    })
        .then(response => response.json())
        .then(materials => {
            updateMatTable(materials);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}

// 검색에 따른 테이블 데이터 변경
function updateMatTable(materials){
    const tbody = document.getElementById('table2_tbody');
    tbody.innerHTML = ''; // 기존 내용을 비웁니다.

    // 데이터로부터 새로운 행을 생성합니다.
    materials.forEach(material => {
        const tr = document.createElement('tr');

        // 자재 정보에 따라 셀을 생성
        const tdName = document.createElement('td');
        tdName.className = 'name';
        const nameDiv = document.createElement('div');
        nameDiv.textContent = material.name;
        tdName.appendChild(nameDiv);
        tr.appendChild(tdName);

        const tdCode = document.createElement('td');
        tdCode.className = 'code';
        const codeDiv = document.createElement('div');
        codeDiv.textContent = material.code;
        tdCode.appendChild(codeDiv);
        tr.appendChild(tdCode);

        const tdType = document.createElement('td');
        tdType.className = 'type';
        tdType.textContent = material.type;
        tr.appendChild(tdType);

        const tdWeight = document.createElement('td');
        tdWeight.className = 'weight';
        const weightDiv = document.createElement('div');
        weightDiv.textContent = material.weight;
        tdWeight.appendChild(weightDiv);
        tr.appendChild(tdWeight);

        // 완성된 행을 tbody에 추가합니다.
        tbody.appendChild(tr);

        tr.style.cursor = "pointer";
        tr.onclick = function () {
            rowClick(tr);
        }
    });

    cnt();

    // 자재리스트에 이미 포함된 자재는 배경색 변경 및 리스너 x
    var table1 = document.getElementById('table1');
    var table2 = document.getElementById('table2');
    duplicationRow(table1, table2);
}

// 검색에 따른 제품 리스트 데이터 변경
function updateProTable(products){
    const pro_list = document.getElementById('pro_list');
    pro_list.innerHTML = ''; // 기존 내용을 비웁니다.

    products.forEach(product => {
        const li = document.createElement('li');
        li.addEventListener("click", function() {
            proNameClick(this);
        });

        // 이미지 추가
        const img = document.createElement('img');
        img.src = "/image/plus.png";
        img.addEventListener("click", function(){
            proImgClick(event);
        });
        li.appendChild(img);

        // 제품 이름 추가
        const span = document.createElement('span');
        span.textContent = product.name;
        li.appendChild(span);

        // 완성된 리스트 아이템(li)을 ul에 추가합니다.
        pro_list.appendChild(li);
    });

    cnt();
}

window.onload = function() {
    cnt();
};

function cnt() {
    var table = document.getElementById('table2');
    var rowCount = table.rows.length - 1;
    var span = document.getElementById('materialCnt');
    span.textContent = rowCount.toString();
}

// 제품명 클릭 이벤트
var proName = "";
var proCode = "";
async function proNameClick(clickedLi){
    // 선택된 제품명, 제품코드
    proName = clickedLi.textContent.trim().split("∟")[0].trim();
    proCode = clickedLi.getAttribute('data-product-code');

    // 선택된 제품명 span
    var pro = clickedLi.querySelector("span");

    const url1 = new URL('/search/bomlist', window.location.origin);
    url1.searchParams.append('keyword', proName); // 입력값

    try {
        const response = await fetch(url1, { method: 'GET' });
        const boms = await response.json();
        // 그리드 세팅
        updateTable(boms, pro);
    } catch (error) {
        console.error('Error:', error);
    }

    // 중복 자재
    var table1 = document.getElementById('table1');
    var table2 = document.getElementById('table2');
    duplicationRow(table1, table2);
}

// 클릭된 제품의 그리드 세팅
var matCodeList
var lastClickedProduct = null; // 마지막으로 클릭된 제품을 추적하기 위한 전역 변수
function updateTable(bomList, pro){
    matCodeList = [];

    if (lastClickedProduct !== null) {
        // 이전에 클릭된 제품이 있으면, 그 제품의 font-weight를 400으로 설정
        lastClickedProduct.style.fontWeight = "400";
    }

    pro.style.fontWeight = "550";
    lastClickedProduct = pro;

    var table = document.getElementById('table1'); //테이블
    var rows = table.rows;

    // 그리드 셀 clear
    for (var i = 1; i < rows.length; i++) {
        var cells = rows[i].cells;
        for (var j = 0; j < cells.length; j++) {
            cells[j].innerHTML = '';
        }
    }

    // 그리드에 데이터 세팅
    for (let i = 0; i < bomList.length; i++) {
        matCodeList.push(bomList[i].matCode);

        var newRow;
        if (i + 1 >= rows.length) { // 현재 행의 개수보다 데이터가 더 많은 경우
            newRow = table.insertRow(); // 새로운 행 추가
            // 새로운 셀 생성 및 클래스 설정
            for (let j = 0; j < 4; j++) {
                let newCell = newRow.insertCell(j);
                switch (j) {
                    case 0: newCell.className = "name"; break;
                    case 1: newCell.className = "code"; break;
                    case 2: newCell.className = "type"; break;
                    case 3: newCell.className = "qty"; break;
                }
            }
        } else {
            newRow = rows[i + 1]; // 기존의 행 사용
        }

        newRow.cells[0].className = "name";
        newRow.cells[0].innerHTML = bomList[i].matName;
        newRow.cells[1].className = "code";
        newRow.cells[1].innerHTML = bomList[i].matCode;
        newRow.cells[2].className = "type";
        newRow.cells[2].innerHTML = bomList[i].matType;
        newRow.cells[3].className = "qty";

        newRow.addEventListener('mouseover', function() {
            var removeBtns = this.querySelectorAll('.remove');
            removeBtns.forEach(function(btn) {
                btn.style.display = 'inline-block';
            });
        });

        newRow.addEventListener('mouseout', function() {
            var removeBtns = this.querySelectorAll('.remove');
            removeBtns.forEach(function(btn) {
                btn.style.display = 'none';
            });
        });

        var div = document.createElement("div");
        div.innerHTML = bomList[i].qty;
        div.style.overflow = "hidden";
        div.style.textOverflow = "ellipsis";
        div.style.whiteSpace = "nowrap";
        div.style.position = "absolute";
        div.style.right = "3rem";
        div.style.top = "0.2rem";
        div.style.marginRight = "0.5rem";
        newRow.cells[3].appendChild(div);

        var img = document.createElement("img");
        img.className = "remove";
        img.src = "/image/xBtn.png";
        img.style.width = "1.5rem";
        img.style.cursor = "pointer";
        img.style.position = "absolute";
        img.style.right = "0";
        img.style.top = "0.2rem";
        img.style.marginRight = "0.3rem";
        img.style.display = "none";
        img.onclick = function () {
            deleteRow(this);
        };
        newRow.cells[3].appendChild(img);

    }
}

// 행 삭제 버튼 이벤트(x)
function deleteRow(removeBtn){
    var row = removeBtn.parentNode.parentNode; //tr
    var table = row.parentNode; //tbody
    var rowIndex = row.rowIndex - 1; //이벤트 발생한 행 인덱스

    table.deleteRow(rowIndex);

    // 새로운 비어있는 행 추가
    var newRow = table.insertRow(-1); // 맨 끝에 새 행 추가
    var cellCount = row.cells.length; // 삭제된 행의 셀 개수를 기준으로 함

    // 새로운 행에 셀 추가
    for(var i = 0; i < cellCount; i++) {
        var newCell = newRow.insertCell(i);
        newCell.innerHTML = ""; // 새 셀은 비어 있음
    }

    // 자재리스트에 이미 포함된 자재는 배경색 변경 및 리스너 x
    var table1 = document.getElementById('table1');
    var table2 = document.getElementById('table2');
    duplicationRow(table1, table2);
}

// +버튼 클릭
function proImgClick(event){
    event.stopPropagation();

    // 이벤트가 발생한 <img> 요소의 부모 요소 (<li>) 찾기
    var clickedLi = event.target.parentNode;

    // 선택된 제품명
    var proName = clickedLi.textContent.trim();
    // 선택된 제품의 헤더 이미지
    var img = clickedLi.querySelector("img");

    const url = new URL('/search/bomlist', window.location.origin);
    url.searchParams.append('keyword', proName); // 입력값

    fetch(url,{
        method : 'GET',
    })
        .then(response => response.json())
        .then(boms => {
            // 하위 요소 세팅
            updateLi(boms, clickedLi, img);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}

// 검색된 하위요소 세팅
function updateLi(bomList, clickedLi, img){

    // 이미 하위 요소가 존재하는지 확인
    if (clickedLi.querySelectorAll("ul").length === 0) {
        const subUl = document.createElement("ul");
        subUl.className = 'pro_mat_list';

        for (let i = 0; i < bomList.length; i++) {
            const subLi = document.createElement("li");
            subLi.style.padding = "0";
            subLi.style.pointerEvents = "none";

            const span1 = document.createElement("span");
            span1.textContent = "∟ ";
            span1.style.marginRight = "0.2rem";
            span1.style.verticalAlign = "0.2rem";
            span1.style.color = "#9b9b9b";
            span1.style.pointerEvents = "none";

            const span = document.createElement("span");
            span.style.fontSize = "1rem";
            span.style.color = "#9b9b9b";
            span.textContent = bomList[i].matName;
            span.style.pointerEvents = "none";

            subUl.appendChild(span1);
            subUl.appendChild(span);
            subUl.appendChild(subLi);
        }
        clickedLi.appendChild(subUl);
        img.src="/image/minus-button.png";
        img.style.width = "1.15rem";

    } else {
        // 하위 요소가 이미 존재하면 제거
        const existingUl = clickedLi.querySelector("ul");
        clickedLi.removeChild(existingUl);
        img.src="/image/plus.png";
        img.style.width = "1.2rem";
    }
}

function rowClick(row){
    // 존재하는 행이면 실행X
    if (row.classList.contains('no-click')) {
        return;
    }

    var cells = row.querySelectorAll('td');
    var cellValues = [];

    cells.forEach(function(cell) {
        var cellText = cell.querySelector('div') ? cell.querySelector('div').textContent : cell.textContent;
        cellValues.push(cellText.trim()); // 공백 제거 후 배열에 추가
    });

    appendTable(cellValues);
}

// 클릭한 자재 추가
function appendTable(cellValues){
    // 자재 추가
    var table = document.getElementById('table1'); //테이블
    var rows = table.rows;

    let lastRowWithDataIndex = -1;
    let rowLength = 0;

    // 모든 행을 순회하면서 데이터가 있는 마지막 행을 찾습니다.
    for (let i = 0; i < rows.length; i++) {
        // 셀에 데이터가 있는지 확인
        if (rows[i].cells[0].innerHTML.trim() !== "") {
            lastRowWithDataIndex = i; // 데이터가 있는 마지막 행의 인덱스를 업데이트
            rowLength++;
        }
    }

    var newRow;
    if (23 >= rowLength) {
        newRow = rows[lastRowWithDataIndex + 1];
    } else {
        newRow = table.insertRow(); // 새로운 행 추가
        // 새로운 셀 생성 및 클래스 설정
        for (let j = 0; j < 4; j++) {
            let newCell = newRow.insertCell(j);
            switch (j) {
                case 0: newCell.className = "name"; break;
                case 1: newCell.className = "code"; break;
                case 2: newCell.className = "type"; break;
                case 3: newCell.className = "qty"; break;
            }
        }
    }

    newRow.cells[0].innerHTML = cellValues[0];
    newRow.cells[1].innerHTML = cellValues[1];
    newRow.cells[2].innerHTML = cellValues[2];

    newRow.addEventListener('mouseover', function() {
        var removeBtns = this.querySelectorAll('.remove');
        removeBtns.forEach(function(btn) {
            btn.style.display = 'inline-block';
        });
    });

    newRow.addEventListener('mouseout', function() {
        var removeBtns = this.querySelectorAll('.remove');
        removeBtns.forEach(function(btn) {
            btn.style.display = 'none';
        });
    });

    var input = document.createElement("input");
    input.type = "number";
    input.style.width = "6rem";
    input.style.height = "1.8rem";
    input.placeholder = "0";
    input.onkeyup = function(){
        enterRow(event, newRow.cells[3], input.value);
    };
    newRow.cells[3].appendChild(input);

    var img = document.createElement("img");
    img.className = "remove";
    img.src = "/image/xBtn.png";
    img.style.width = "1.5rem";
    img.style.cursor = "pointer";
    img.style.position = "absolute";
    img.style.right = "0";
    img.style.top = "0.2rem";
    img.style.marginRight = "0.3rem";
    img.style.display = "none";
    img.onclick = function () {
        deleteRow(this);
    };
    newRow.cells[3].appendChild(img);

    // 자재리스트에 이미 포함된 자재는 배경색 변경 및 리스너 x
    var table1 = document.getElementById('table1');
    var table2 = document.getElementById('table2');
    duplicationRow(table1, table2);

}

function enterRow(event, cell, value){
    if (event.keyCode === 13) {
        cell.innerHTML = '';

        var div = document.createElement("div");
        if(value == '') div.innerHTML = "0";
        else div.innerHTML = value;
        div.style.overflow = "hidden";
        div.style.textOverflow = "ellipsis";
        div.style.whiteSpace = "nowrap";
        div.style.position = "absolute";
        div.style.right = "3rem";
        div.style.top = "0.2rem";
        div.style.marginRight = "0.5rem";
        cell.appendChild(div);

        var img = document.createElement("img");
        img.className = "remove";
        img.src = "/image/xBtn.png";
        img.style.width = "1.5rem";
        img.style.cursor = "pointer";
        img.style.position = "absolute";
        img.style.right = "0";
        img.style.top = "0.2rem";
        img.style.marginRight = "0.3rem";
        img.style.display = "none";
        img.onclick = function () {
            deleteRow(this);
        };
        cell.appendChild(img);
    }
}

//수량 셀 더블클릭
function qtyClick(qtyCell){
    qtyCell.focus();
    var value = qtyCell.textContent.trim();
    qtyCell.innerHTML = '';

    var input = document.createElement("input");
    input.type = "number";
    input.value = value;
    input.style.width = "6rem";
    input.style.height = "1.8rem";
    input.placeholder = "0";
    input.onkeyup = function(){
        enterRow(event, qtyCell, input.value);
    };
    qtyCell.appendChild(input);

    var img = document.createElement("img");
    img.className = "remove";
    img.src = "/image/xBtn.png";
    img.style.width = "1.5rem";
    img.style.cursor = "pointer";
    img.style.position = "absolute";
    img.style.right = "0";
    img.style.top = "0.2rem";
    img.style.marginRight = "0.3rem";
    img.style.display = "none";
    img.onclick = function () {
        deleteRow(this);
    };
    qtyCell.appendChild(img);
}

//저장 버튼 이벤트
function save(){
    var table = document.getElementById("table1");
    var rows = table.getElementsByTagName("tr");
    var boms = [];

    for(var i=1; i <rows.length; i++){
        if(rows[i].cells[0].textContent != ""){
            var firstChild = rows[i].cells[3].firstChild;

            // 첫 번째 자식 요소가 input 태그인 경우 반복문 종료
            if(firstChild.nodeName === 'INPUT'){
                alert("수량 입력을 완료해주세요");
                return;
            }

            // 첫 번째 자식 요소가 div 태그인 경우, 계속 실행
            else if(firstChild.nodeName === 'DIV') {
                var bom = {
                    bomCode: '',
                    proCode: proCode,
                    matCode: rows[i].cells[1].textContent,
                    qty: rows[i].cells[3].textContent,
                };
                boms.push(bom);
            }
        }
    }

    if(boms.length === 0){
        var bom = {
            proCode: proCode
        };
        boms.push(bom);
    }

    fetch('/bom/save',{
        method : 'POST',
        headers: {'Content-Type' : 'application/json',},
        body: JSON.stringify(boms)
    })
        .then(response => response.json())
        .then(data => {
            alert("저장이 완료되었습니다.");
            console.log('Success:', data);
        })
        .catch((error) => {
            console.error('Error:', error);
        });

}



