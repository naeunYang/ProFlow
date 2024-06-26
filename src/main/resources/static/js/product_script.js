// 페이지 로드 시 검색창에 포커스
window.onload = function() {
    document.getElementById('searchInput').focus();
};

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
        var option1 = new Option('전체', '');
        typeCombo.id = "typeCombo";
        typeCombo.appendChild(option1);

        const url = new URL('/search/typelist', window.location.origin);
        url.searchParams.append('type', 'protype'); // 쿼리 매개변수 추가

        fetch(url,{
            method : 'GET',
        })
            .then(response => response.json())
            .then(data => {
                data.forEach(item => {
                    const option = new Option(item['sc_name'], item['sc_code']);
                    typeCombo.appendChild(option);
                });
            })
            .catch((error) => {
                console.error('Error:', error);
            });

        typeCombo.selectedIndex = 0;

        typeCombo.style.width="40%";
        typeCombo.style.height="2.3rem";
        typeCombo.style.textAlign="center";
        typeCombo.style.borderRadius="0.3rem";
        typeCombo.style.marginRight="0.8rem";

        typeCombo.onchange = function(){
            searchEvent(event);
        };

        search.innerHTML = '';
        search.appendChild(typeCombo);
    }else{
        // 이전 상태로 복원
        search.style.border = '';
        search.innerHTML = defaultContent;
    }

    var selectValue = document.querySelector('select').value;
    const url = new URL('/product/search', window.location.origin);
    url.searchParams.append('keyword', ""); // 쿼리 매개변수 추가
    url.searchParams.append('searchType', selectValue); // 쿼리 매개변수 추가

    fetch(url,{
        method : 'GET',
    })
        .then(response => response.json())
        .then(products => {
            updateTable(products);
        })
        .catch((error) => {
            console.error('Error:', error);
        });

}

// 수정 이미지 클릭
function updateMode(UpdateBtn){
    var row = UpdateBtn.parentNode.parentNode;

    // 제품명 셀
    var nameCell = row.querySelector('.name');
    var nameInput = document.createElement("input");
    nameInput.type = "text";
    nameInput.value = nameCell.textContent.trim();
    nameInput.style.width= "13.9rem";
    nameInput.style.height= "2rem";
    nameInput.style.outline = "none";
    nameInput.style.border = "1px solid #c1c1c1";

    nameCell.innerHTML = '';
    nameCell.appendChild(nameInput);
    nameInput.focus();

    // 제품코드 셀
    var codeCell = row.querySelector('.code');
    var codeInput = document.createElement("input");
    codeInput.type = "text";
    codeInput.value = codeCell.textContent.trim();
    codeInput.style.width= "100%";
    codeInput.style.height= "2rem";
    codeInput.style.outline = "none";
    codeInput.style.border = "1px solid #c1c1c1";
    codeInput.style.color = "#b9b9b9";
    codeInput.readOnly = true;

    codeCell.innerHTML = '';
    codeCell.appendChild(codeInput);

    // 제품유형 셀
    var typeCell =row.querySelector('.type');
    var typeCombo = document.createElement("select");
    var typeCellText = typeCell.textContent;
    var typeCellValue;

    // 옵션 생성 및 추가
    const url = new URL('/search/typelist', window.location.origin);
    url.searchParams.append('type', 'protype'); // 쿼리 매개변수 추가
    fetch(url,{
        method : 'GET',
    })
        .then(response => response.json())
        .then(data => {
            data.forEach(item => {
                const option = new Option(item['sc_name'], item['sc_code']);
                typeCombo.appendChild(option);
            });
            for (let i = 0; i < typeCombo.options.length; i++) {
                if (typeCombo.options[i].text === typeCellText) {
                    typeCombo.selectedIndex = i;
                    typeCellValue = typeCombo.options[i].value;
                    break;
                }
            }
        })
        .catch((error) => {
            console.error('Error:', error);
        });

    typeCombo.style.width="100%";
    typeCombo.style.height="2rem";
    typeCombo.style.textAlign="center";
    typeCombo.style.outline = "none";
    typeCombo.style.border = "1px solid #c1c1c1";

    typeCell.innerHTML = '';
    typeCell.appendChild(typeCombo);

    // 단위 셀
    var unitCell =row.querySelector('.unit');
    var unitCombo = document.createElement("select");
    var unitCellText = unitCell.textContent;
    var unitCellValue;

    // 옵션 생성 및 추가
    const url1 = new URL('/search/typelist', window.location.origin);
    url1.searchParams.append('type', 'prounit'); // 쿼리 매개변수 추가
    fetch(url1,{
        method : 'GET',
    })
        .then(response => response.json())
        .then(data => {
            data.forEach(item => {
                const option = new Option(item['sc_name'], item['sc_code']);
                unitCombo.appendChild(option);
            });
            for (let i = 0; i < unitCombo.options.length; i++) {
                if (unitCombo.options[i].text === unitCellText) {
                    unitCombo.selectedIndex = i;
                    unitCellValue = unitCombo.options[i].value;
                    break;
                }
            }
        })
        .catch((error) => {
            console.error('Error:', error);
        });

    unitCombo.style.width="100%";
    unitCombo.style.height="2rem";
    unitCombo.style.textAlign="center";
    unitCombo.style.outline = "none";
    unitCombo.style.border = "1px solid #c1c1c1";

    unitCell.innerHTML = '';
    unitCell.appendChild(unitCombo);

    // 중량 셀
    var weightCell =row.querySelector('.weight');
    var weightInput = document.createElement("input");
    weightInput.type = "text";
    var word = weightCell.textContent.split(' ');
    weightInput.value = word[0]; //숫자 추출
    weightInput.style.width= "49%";
    weightInput.style.height= "2rem";
    weightInput.style.outline = "none";
    weightInput.style.border = "1px solid #c1c1c1";
    weightInput.style.position = "absolute";
    weightInput.style.top = "0";
    weightInput.style.left = "0";
    weightInput.style.marginRight = "0.2rem";
    weightInput.oninput = function() {
        numFormat(this);
    };
    weightInput.onfocus = function() {
        removeDefault(this);
    };

    var weightCombo = document.createElement("select");
    var weightValue;
    // 옵션 생성 및 추가
    const url2 = new URL('/search/typelist', window.location.origin);
    url2.searchParams.append('type', 'weightunit');
    fetch(url2,{
        method : 'GET',
    })
        .then(response => response.json())
        .then(data => {
            data.forEach(item => {
                const option = new Option(item['sc_name'], item['sc_code']);
                weightCombo.appendChild(option);
            });
            for (let i = 0; i < weightCombo.options.length; i++) {
                if (weightCombo.options[i].text === word[1]) {
                    weightCombo.selectedIndex = i;
                    weightValue = weightCombo.options[i].value;
                    break;
                }
            }
        })
        .catch((error) => {
            console.error('Error:', error);
        });

    weightCombo.style.width="49%";
    weightCombo.style.height="2rem";
    weightCombo.style.textAlign="center";
    weightCombo.style.outline = "none";
    weightCombo.style.border = "1px solid #c1c1c1";
    weightCombo.style.position = "absolute";
    weightCombo.style.top = "0";
    weightCombo.style.right = "0";

    weightCell.innerHTML = '';
    weightCell.appendChild(weightInput);
    weightCell.appendChild(weightCombo);

    // 비고 셀
    var remarkCell =row.querySelector('.remark');
    var remarkInput = document.createElement("input");
    remarkInput.type = "text";
    remarkInput.value = remarkCell.textContent;
    remarkInput.style.width= "100%";
    remarkInput.style.height= "2rem";
    remarkInput.style.outline = "none";
    remarkInput.style.border = "1px solid #c1c1c1";

    remarkCell.innerHTML = '';
    remarkCell.appendChild(remarkInput);

    nameInput.onkeyup = function(event){
        enterEvent(event, nameInput, codeInput, typeCombo, unitCombo, weightInput, weightCombo, remarkInput);
    };
    codeInput.onkeyup = function(event){
        enterEvent(event, nameInput, codeInput, typeCombo, unitCombo, weightInput, weightCombo, remarkInput);
    };
    weightInput.onkeyup = function(event){
        enterEvent(event, nameInput, codeInput, typeCombo, unitCombo, weightInput, weightCombo, remarkInput);
    };
    remarkInput.onkeyup = function(event){
        enterEvent(event, nameInput, codeInput, typeCombo, unitCombo, weightInput, weightCombo, remarkInput);
    };

    // 수정 중일 때 다른 행들의 수정 버튼 안보이게 하기
    visibleUpBtn();
}

// 수정 중일 때 다른 행들의 수정 버튼 안보이게 하기
function visibleUpBtn(){
    var updateBtns = document.querySelectorAll('.updateBtn'); //모든 행의 수정 버튼
    var isUpdateMode = document.body.classList.contains('update-mode');

    if(!isUpdateMode){
        updateBtns.forEach(function(btn){
            btn.style.display = 'none';
        });
        document.body.classList.add('update-mode');
    } else {
        document.body.classList.remove('update-mode'); // 업데이트 모드 비활성화를 위한 클래스 제거
    }
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

var checkList = [];
// 삭제 버튼
function deleteBtn(){
    var result = confirm("삭제하시겠습니까?");
    if(result){
        console.log('삭제 버튼 : ' + checkList);
        if(checkList.length === 0) {
            alert("선택된 값이 없습니다.");
        }else{

            fetch('/products/delete',{
                method : 'POST',
                headers: {'Content-Type' : 'application/json',},
                body: JSON.stringify(checkList) //json문자열로 변환
            })
                .then(response => {
                    if (!response.ok) {
                        throw response;
                    }
                    return response.json(); // 응답을 JSON으로 변환
                }) // 응답을 JSON으로 변환
                .then(data => {
                    alert("삭제되었습니다.");
                    window.location.reload();
                })
                .catch((error) => {
                    error.json().then(errorMessage => {
                        alert(errorMessage.error || "알 수 없는 에러가 발생하였습니다.");
                    });
                });
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
    console.log('바디 체크박스 : ' + checkList);
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
            var code = checkbox.closest('tr').querySelector('.code').innerText;
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
    console.log('헤더 체크박스 : ' + checkList);
}

// 키 이벤트
function enterEvent(event, nameInput, codeInput, typeCombo, unitCombo, weightInput, weightCombo, remarkInput) {
    // 엔터키
    if (event.keyCode === 13) {
        // 1. 필수 입력 검사
        var checkCells = [
            {label: "제품명", value: nameInput.value},
            {label: "중량", value: weightInput.value}
        ];
        if(!checkField(checkCells)) return;

        // 2. 제품명 중복 검사
        var proName = nameInput.value.trim();
        var table = document.getElementById('table');
        if(!checkDuplication(proName, table)) {
            return;
        }

        var weightComboText = weightCombo.options[weightCombo.selectedIndex].text;
        var productUpdate = {
            code: codeInput.value,
            name: nameInput.value,
            type: typeCombo.value,
            unit: unitCombo.value,
            weight: (weightInput.value + " " + weightComboText),
            remark: remarkInput.value
        };
        fetch('/products/update',{
            method : 'POST',
            headers: {'Content-Type' : 'application/json',},
            body: JSON.stringify(productUpdate)
        })
            .then(response => response.json())
            .then(data => {
                console.log('Success:', data);
                keepSearching(); //검색 유지

            })
            .catch((error) => {
                console.error('Error:', error);
            });
        visibleUpBtn();
    }
    //esc 키
    else if(event.keyCode === 27){
        keepSearching(); //검색 유지
        visibleUpBtn();
    }
}

//키 입력 후 검색 유지
function keepSearching(){
    var searchInput = document.getElementById('searchInput');
    var combo = document.getElementById('typeCombo');
    var fakeEvent;

    if(combo != null){
        fakeEvent = {
            target: combo
        };
    }
    else{
        fakeEvent = {
            target: searchInput
        };
    }
    searchEvent(fakeEvent);
}

// 중복 검사
function checkDuplication(name, table){
    var rows = table.querySelectorAll('tr');

    for(var i = 1; i < rows.length; i++){
        if(rows[i].cells[0].textContent.trim() === name){
            alert("중복된 제품명입니다.");
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

// 검색 이벤트
function searchEvent(event){
    let keyword = event.target.value;
    var selectValue = document.querySelector('select').value;

    if(keyword === undefined)
        keyword = "";

    // URL에 쿼리 매개변수를 추가하여 검색 키워드를 서버로 전송
    const url = new URL('/product/search', window.location.origin);
    url.searchParams.append('keyword', keyword); // 입력값
    url.searchParams.append('searchType', selectValue); // 검색유형

    fetch(url,{
        method : 'GET',
    })
        .then(response => response.json())
        .then(products => {
            updateTable(products);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}

// 검색에 따른 테이블 데이터 변경
function updateTable(products){
    const tbody = document.querySelector('tbody');
    tbody.innerHTML = ''; // 기존 내용을 비웁니다.

    // 데이터로부터 새로운 행을 생성합니다.
    products.forEach(product => {
        const tr = document.createElement('tr');

        // 제품 정보에 따라 셀을 생성
        const tdName = document.createElement('td');
        tdName.className = 'name';
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'checkBtn';
        checkbox.setAttribute('onchange', `checkChange(this, '${product.code}')`);
        tdName.appendChild(checkbox);

        const nameDiv = document.createElement('div');
        nameDiv.textContent = product.name;
        tdName.appendChild(nameDiv);

        const updateImg = document.createElement('img');
        updateImg.src = '/image/update.png';
        updateImg.className = 'updateBtn';
        updateImg.setAttribute('onclick', 'updateMode(this)');
        tdName.appendChild(updateImg);

        tr.appendChild(tdName);

        const tdCode = document.createElement('td');
        tdCode.className = 'code';
        const codeDiv = document.createElement('div');
        codeDiv.textContent = product.code;
        tdCode.appendChild(codeDiv);
        tr.appendChild(tdCode);

        const tdType = document.createElement('td');
        tdType.className = 'type';
        tdType.textContent = product.type;
        tr.appendChild(tdType);

        const tdUnit = document.createElement('td');
        tdUnit.className = 'unit';
        tdUnit.textContent = product.unit;
        tr.appendChild(tdUnit);

        const tdWeight = document.createElement('td');
        tdWeight.className = 'weight';
        const weightDiv = document.createElement('div');
        weightDiv.textContent = product.weight;
        tdWeight.appendChild(weightDiv);
        tr.appendChild(tdWeight);

        const tdRemark = document.createElement('td');
        tdRemark.className = 'remark';
        const remarkDiv = document.createElement('div');
        remarkDiv.textContent = product.remark;
        tdRemark.appendChild(remarkDiv);
        tr.appendChild(tdRemark);

        // 완성된 행을 tbody에 추가합니다.
        tbody.appendChild(tr);
    });

    cnt();
}

// 검색창 x버튼 이벤트
function clearSearchInput(){
    document.getElementById('searchInput').value = '';
    searchEvent(event);
}

window.onload = function() {
    cnt();
};

// 제품 현황 건 수 반영
function cnt() {
    var table = document.getElementById('data_table');
    var rowCount = table.rows.length - 1;
    var span = document.getElementById('productCount');
    span.textContent = rowCount.toString();
}