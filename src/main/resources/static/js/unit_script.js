// 마우스 오른쪽 버튼 클릭 시 메뉴 생성
document.addEventListener('contextmenu', function(event) {
    event.preventDefault(); // 기본 컨텍스트 메뉴 비활성화
    var contextMenu = document.getElementById('customContextMenu');
    contextMenu.style.display = 'block';
    contextMenu.style.left = event.pageX + 'px';
    contextMenu.style.top = event.pageY + 'px';
}, false);

// 다른 곳을 클릭하면 사용자 정의 컨텍스트 메뉴 숨기기
window.addEventListener('click', function() {
    document.getElementById('customContextMenu').style.display = 'none';
});

// 검색 유형 변경 이벤트
function optionChange(combo){
    const url = new URL('/unit/search', window.location.origin);
    url.searchParams.append('keyword', combo.value); // 쿼리 매개변수 추가

    fetch(url,{
        method : 'GET',
    })
        .then(response => response.json())
        .then(categoryList => {
            updateTable(categoryList);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}

// 검색에 따른 테이블 데이터 변경
function updateTable(unitList){
    const tbody = document.querySelector('tbody');
    tbody.innerHTML = ''; // 기존 내용을 비웁니다.

    unitList.forEach(unit => {
        const tr = document.createElement('tr');

        // 대분류
        const tdName = document.createElement('td');
        tdName.className = 'mcname';
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'checkBtn';
        checkbox.setAttribute('onchange', `checkChange(this, '${unit.sc_code}')`);
        tdName.appendChild(checkbox);

        const nameDiv = document.createElement('div');
        nameDiv.textContent = unit.mc_name;
        tdName.appendChild(nameDiv);

        const updateImg = document.createElement('img');
        updateImg.src = '/image/update.png';
        updateImg.className = 'updateBtn';
        updateImg.setAttribute('onclick', 'updateMode(this)');
        tdName.appendChild(updateImg);

        tr.appendChild(tdName);

        //소분류 코드
        const tdCode = document.createElement('td');
        tdCode.className = 'sccode';
        const codeDiv = document.createElement('div');
        codeDiv.textContent = unit.sc_code;
        tdCode.appendChild(codeDiv);
        tr.appendChild(tdCode);

        //소분류
        const tdType = document.createElement('td');
        tdType.className = 'scname';
        tdType.textContent = unit.sc_name;
        tr.appendChild(tdType);

        // 완성된 행을 tbody에 추가합니다.
        tbody.appendChild(tr);
    });

    cnt();
}

// 수정 이미지 클릭
function updateMode(UpdateBtn){
    var row = UpdateBtn.parentNode.parentNode;

    // 대분류 셀
    var mainCell =row.querySelector('.mcname');
    var mainCombo = document.createElement("select");
    var mainCellText = mainCell.textContent;
    var mainCellValue;

    // 옵션 생성 및 추가
    const url1 = new URL('/search/mainunitlist', window.location.origin);
    fetch(url1,{
        method : 'GET',
    })
        .then(response => response.json())
        .then(data => {
            data.forEach(item => {
                const option = new Option(item['mc_name'], item['mc_code']);
                mainCombo.appendChild(option);
            });
            for (let i = 0; i < mainCombo.options.length; i++) {
                if (mainCombo.options[i].text.trim() === mainCellText.trim()) {
                    mainCombo.selectedIndex = i;
                    mainCellValue = mainCombo.options[i].value;
                    break;
                }
            }
        })
        .catch((error) => {
            console.error('Error:', error);
        });

    mainCombo.style.width="100%";
    mainCombo.style.height="2rem";
    mainCombo.style.textAlign="center";
    mainCombo.style.outline = "none";
    mainCombo.style.border = "1px solid #c1c1c1";

    mainCell.innerHTML = '';
    mainCell.appendChild(mainCombo);
    mainCombo.focus();

    // 소분류코드 셀
    var codeCell = row.querySelector('.sccode');
    var codeInput = document.createElement("input");
    codeInput.type = "text";
    codeInput.value = codeCell.textContent.trim();
    codeInput.style.width= "100%";
    codeInput.style.height= "2rem";
    codeInput.style.outline = "none";
    codeInput.style.border = "1px solid #c1c1c1";
    codeInput.style.color = "#b9b9b9";
    codeInput.style.textAlign = "center";
    codeInput.readOnly = true;
    codeCell.innerHTML = '';
    codeCell.appendChild(codeInput);

    // 소분류 셀
    var subCell = row.querySelector('.scname');
    var subInput = document.createElement("input");
    subInput.type = "text";
    subInput.value = subCell.textContent.trim();
    subInput.style.width= "100%";
    subInput.style.height= "2rem";
    subInput.style.outline = "none";
    subInput.style.border = "1px solid #c1c1c1";
    subCell.innerHTML = '';
    subCell.appendChild(subInput);

    subInput.onkeyup = function(event){
        enterEvent(event, mainCombo, codeInput, subInput);
    };
    codeInput.onkeyup = function(event){
        enterEvent(event, mainCombo, codeInput, subInput);
    };
    mainCombo.onkeyup = function(event){
        enterEvent(event, mainCombo, codeInput, subInput);
    };

    // 수정 중일 때 다른 행들의 수정 버튼 안보이게 하기
    var updateBtns = document.querySelectorAll('.updateBtn');
    var isUpdateMode = document.body.classList.contains('update-mode');

    if(!isUpdateMode){
        // 업데이트 모드가 아니라면, 모든 업데이트 버튼을 숨김
        updateBtns.forEach(function(btn){
            btn.style.display = 'none';
        });
        document.body.classList.add('update-mode');
    } else {
        // 이미 업데이트 모드라면, 모든 업데이트 버튼을 다시 보이게 함
        updateBtns.forEach(function(btn){
            btn.style.display = 'inline-block';
        });
        document.body.classList.remove('update-mode'); // 업데이트 모드 비활성화를 위한 클래스 제거
    }

}

var checkList = [];
// 삭제 버튼
function deleteBtn(){
    var result = confirm("삭제하시겠습니까?");
    if(result){
        console.log('삭제 버튼 : ' + checkList);
        if(checkList.length === 0) {
            alert("선택된 값이 없습니다.");
        }else{
            fetch('/unit/delete',{
                method : 'POST',
                headers: {'Content-Type' : 'application/json',},
                body: JSON.stringify(checkList) //json문자열로 변환
            })
                .then(response => response.json()) // 응답을 JSON으로 변환
                .then(data => {
                    console.log('Success:', data);
                    window.location.reload();
                })
                .catch((error) => {
                    console.error('Error:', error);
                });

            alert("삭제되었습니다.");
            checkList = [];

            // 헤더 체크박스 초기화
            var checkBoxHead = document.getElementById('checkBtnHead');
            checkBoxHead.checked = false;
            checkBoxHead.onchange(function(){
                checkChangeHead(this);
            });
        }

    }
}

// 바디 체크박스
function checkChange(checkBox, code){
    if(checkBox.checked){
        checkBox.style.display = "inline-block";
        checkList.push(code.toString());
    }else{
        checkBox.style.display = '';
        var index = checkList.indexOf(code);
        if (index !== -1) { //배열이 없을 경우 -1을 반환
            checkList.splice(index, 1);
        }
    }
}

// 헤더 체크박스(전체 선택 및 해제)
function checkChangeHead(checkBox){
    var checkboxes = document.querySelectorAll('.checkBtn');

    if(checkBox.checked){
        checkBox.style.display = "inline-block";

        checkboxes.forEach(function(checkbox){
            checkbox.checked = true;
            checkbox.style.display = 'inline-block';

            // 해당 체크박스의 부모 행에서 코드 값을 가져와 배열에 추가
            // closest() 메서드는 주어진 CSS 선택자에 일치하는 가장 가까운 조상 요소를 반환
            var code = checkbox.closest('tr').querySelector('.sccode').innerText;
            checkList.push(code.toString());
        });
    }else{
        checkBox.style.display = '';

        checkboxes.forEach(function(checkbox){
            checkbox.checked = false;
            checkbox.style.display = '';
            checkList = []; //삭제 리스트 초기화
        });
    }
}

// 키 이벤트
function enterEvent(event, mainCombo, codeInput, subInput) {
    // 엔터키
    if (event.keyCode === 13) {
        // 1. 필수 입력 검사
        var checkCells = [
            {label: "분류명", value: subInput.value},
        ];
        if(!checkField(checkCells)) return;

        // 2. 제품명 중복 검사
        var unitName = subInput.value.trim();
        var table = document.getElementById('table');
        if(!checkDuplication(unitName, table)) {
            return;
        }

        var unitUpdate = {
            mc_code: mainCombo.value,
            sc_code: codeInput.value,
            sc_name: subInput.value
        };
        fetch('/unit/update',{
            method : 'POST',
            headers: {'Content-Type' : 'application/json',},
            body: JSON.stringify(unitUpdate)
        })
            .then(response => response.json())
            .then(data => {
                console.log('Success:', data);
                window.location.reload();

            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }
    //esc 키
    else if(event.keyCode === 27){
        window.location.reload();
    }
}

// 중복 검사
function checkDuplication(name, table){
    var rows = table.querySelectorAll('tr');

    for(var i = 1; i < rows.length; i++){
        if(rows[i].cells[2].textContent.trim() === name){
            alert("중복된 분류명입니다.");
            return false;
        }
    }
    return true;
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

window.onload = function() {
    cnt();
};

// 제품 현황 건 수 반영
function cnt() {
    var table = document.getElementById('data_table');
    var rowCount = table.rows.length - 1;
    var span = document.getElementById('categoryCount');
    span.textContent = rowCount.toString();
}