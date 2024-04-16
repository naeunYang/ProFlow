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

// 삭제 버튼
function deleteBtn(){
    var result = confirm("삭제하시겠습니까?");

    if(result){
        alert("삭제되었습니다.");
        var checkBoxHead = document.getElementById('checkBtnHead');
        checkBoxHead.checked = false;
        checkBoxHead.onchange(function(){
            checkChangeHead(this);
        });
    }
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

// 수정 이미지 클릭
function updateMode(UpdateBtn){
    var row = UpdateBtn.parentNode.parentNode;

    // 수정 버튼, 체크 박스 숨기기
    var imgCell = row.querySelector('.name img');
    var checkCell = row.querySelector('.name .checkBtn');
    imgCell.style.display = "none";
    checkCell.style.display = "none";

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
    // 옵션 생성 및 추가
    var typeOption1 = new Option("A", "A");
    var typeOption2 = new Option("B", "B");
    var typeOption3 = new Option("C", "C");

    typeCombo.appendChild(typeOption1);
    typeCombo.appendChild(typeOption2);
    typeCombo.appendChild(typeOption3);

    typeCombo.value = typeCell.textContent;
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
    // 옵션 생성 및 추가
    var unitOption1 = new Option("CAN", "CAN");
    var unitOption2 = new Option("%", "%");
    var unitOption3 = new Option("개", "개");

    unitCombo.appendChild(unitOption1);
    unitCombo.appendChild(unitOption2);
    unitCombo.appendChild(unitOption3);

    unitCombo.value = unitCell.textContent;
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
    // 옵션 생성 및 추가
    var weightOption1 = new Option("KG", "KG");
    var weightOption2 = new Option("G", "G");
    var weightOption3 = new Option("CM", "CM");

    weightCombo.appendChild(weightOption1);
    weightCombo.appendChild(weightOption2);
    weightCombo.appendChild(weightOption3);

    weightCombo.value = word[1];
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
        enterEvent(event, nameInput, nameCell, codeInput, codeCell, typeCombo, typeCell,unitCombo, unitCell, weightInput, weightCell, weightCombo, remarkInput, remarkCell, imgCell, checkCell);
    };
    codeInput.onkeyup = function(event){
        enterEvent(event, nameInput, nameCell, codeInput, codeCell, typeCombo, typeCell,unitCombo, unitCell, weightInput, weightCell, weightCombo, remarkInput, remarkCell, imgCell, checkCell);
    };
    weightInput.onkeyup = function(event){
        enterEvent(event, nameInput, nameCell, codeInput, codeCell, typeCombo, typeCell,unitCombo, unitCell, weightInput, weightCell, weightCombo, remarkInput, remarkCell, imgCell, checkCell);
    };
    remarkInput.onkeyup = function(event){
        enterEvent(event, nameInput, nameCell, codeInput, codeCell, typeCombo, typeCell,unitCombo, unitCell, weightInput, weightCell, weightCombo, remarkInput, remarkCell, imgCell, checkCell);
    };

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

// 체크박스 체크 시 화면에 보이게 설정
function checkChange(checkBox){
    if(checkBox.checked){
        checkBox.style.display = "inline-block";
    }else{
        checkBox.style.display = '';
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
        });
    }else{
        checkBox.style.display = '';

        checkboxes.forEach(function(checkbox){
            checkbox.checked = false;
            checkbox.style.display = '';
        });
    }
}

function enterEvent(event, nameInput, nameCell, codeInput, codeCell, typeCombo, typeCell,unitCombo, unitCell, weightInput, weightCell, weightCombo, remarkInput, remarkCell, imgCell, checkCell) {
    // keyCode 13은 엔터 키를 의미합니다.
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

        var nameDiv = document.createElement('div');
        nameDiv.textContent = nameInput.value;
        nameCell.innerHTML = '';
        nameCell.appendChild(nameDiv);

        imgCell.style.display = '';
        checkCell.style.display = '';
        // 입력 상자를 떠나기
        nameInput.blur();

        var codeDiv = document.createElement('div');
        codeDiv.textContent = codeInput.value;
        codeCell.innerHTML = '';
        codeCell.appendChild(codeDiv);

        var typeSpan = document.createElement('span');
        typeSpan.textContent = typeCombo.value;
        typeCell.innerHTML = '';
        typeCell.appendChild(typeSpan);

        var unitSpan = document.createElement('span');
        unitSpan.textContent = unitCombo.value;
        unitCell.innerHTML = '';
        unitCell.appendChild(unitSpan);

        var weightDiv = document.createElement('div');
        weightDiv.textContent = weightInput.value + " " + weightCombo.value;
        weightCell.innerHTML = '';
        weightCell.appendChild(weightDiv);

        var remarkDiv = document.createElement('div');
        remarkDiv.textContent = remarkInput.value;
        remarkCell.innerHTML = '';
        remarkCell.appendChild(remarkDiv);
    }
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
