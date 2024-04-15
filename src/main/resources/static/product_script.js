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

function showAlert(){
    var result = confirm("삭제하시겠습니까?");
    if(result){
        alert("삭제되었습니다.");
    }
}

function checkActiveRow(activeRows){
    // 행 한개씩 클릭
    var rows = activeRows.querySelectorAll('tr');
    var previousRow = null;
    var isDrag = false;

    rows.forEach(function(row) {

        row.addEventListener('click', function(){
            // 이 경우, 단순 클릭입니다.
            if(previousRow != null){
                previousRow.style.backgroundColor = "";
            }
            row.style.backgroundColor = "#becbd4";
            previousRow = row;

            console.log('단순 클릭이 발생했습니다.');
        })

    });

    console.log("활성화 된 행 : " + previousRow);

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
function updateMode(button){
    var row = button.parentNode.parentNode;
    var imgCell = row.querySelector('.name img');
    imgCell.style.display = "none";

    var nameCell = row.querySelector('.name div');
    var nameInput = document.createElement("input");
    nameInput.type = "text";
    nameInput.value = nameCell.textContent.trim();
    nameInput.style.width= "100%";
    nameInput.style.height= "1.5rem";
    nameInput.style.borderRadius= "0.3rem";

    nameCell.innerHTML = '';
    nameCell.appendChild(nameInput);
    nameInput.focus();

    nameInput.addEventListener("keyup", function(event) {
        // keyCode 13은 엔터 키를 의미합니다.
        if (event.keyCode === 13) {
            var newLink = document.createElement('div');
            newLink.textContent = nameInput.value; // input 값으로 설정
            nameCell.innerHTML = '';
            nameCell.appendChild(newLink);
            imgCell.style.display = "";
            // 입력 상자를 떠나기
            nameInput.blur();
        }
    });

    var codeCell = row.querySelector('.code div');
    var codeInput = document.createElement("input");
    codeInput.type = "text";
    codeInput.value = codeCell.textContent.trim();
    codeInput.style.width = "100%";
    codeInput.style.height = "1.5rem";
    codeInput.style.borderRadius = "0.3rem";

    codeCell.innerHTML = '';
    codeCell.appendChild(codeInput);

    var typeCell =row.querySelector('.type');
    var typeInput = document.createElement("select");
    // 옵션 생성 및 추가
    var option1 = new Option("A", "A");
    var option2 = new Option("B", "B");
    var option3 = new Option("C", "C");

    typeInput.appendChild(option1);
    typeInput.appendChild(option2);
    typeInput.appendChild(option3);

    typeInput.value = typeCell.textContent;
    typeInput.style.width="50%";
    typeInput.style.height="1.8rem";
    typeInput.style.textAlign="center";
    typeInput.style.borderRadius="0.3rem";
    typeInput.style.marginRight="0.8rem";
    typeCell.innerHTML = '';
    typeCell.appendChild(typeInput);

    var unitCell =row.querySelector('.unit');
    var unitInput = document.createElement("select");
    // 옵션 생성 및 추가
    var optionU1 = new Option("CAN", "CAN");
    var optionU2 = new Option("%", "%");
    var optionU3 = new Option("개", "개");

    unitInput.appendChild(optionU1);
    unitInput.appendChild(optionU2);
    unitInput.appendChild(optionU3);

    unitInput.value = unitCell.textContent;
    unitInput.style.width="50%";
    unitInput.style.height="1.8rem";
    unitInput.style.textAlign="center";
    unitInput.style.borderRadius="0.3rem";
    unitInput.style.marginRight="0.8rem";
    unitCell.innerHTML = '';
    unitCell.appendChild(unitInput);

    var weightCell =row.querySelector('.weight');
    var weightInput = document.createElement("input");
    weightInput.type = "text";
    var numericValue = parseFloat(weightCell.textContent.match(/\d+(\.\d+)?/)[0]);
    weightInput.value = numericValue;
    weightInput.style.width= "5rem";
    weightInput.style.height= "1.8rem";
    weightInput.style.borderRadius= "0.3rem";
    weightInput.style.paddingLeft= "0.5rem";
    weightInput.style.marginRight="0.2rem";
    weightInput.style.display= "inline";

    var weightCombo = document.createElement("select");
    // 옵션 생성 및 추가
    var optionW1 = new Option("KG", "KG");
    var optionW2 = new Option("G", "G");
    var optionW3 = new Option("CM", "CM");

    weightCombo.appendChild(optionW1);
    weightCombo.appendChild(optionW2);
    weightCombo.appendChild(optionW3);

    weightCombo.value = weightCell.textContent;
    weightCombo.style.width="5rem";
    weightCombo.style.height="1.8rem";
    weightCombo.style.textAlign="center";
    weightCombo.style.borderRadius="0.3rem";
    weightCombo.style.marginRight="0.8rem";
    weightCombo.style.display="inline";
    weightCell.innerHTML = '';
    weightCell.appendChild(weightInput);
    weightCell.appendChild(weightCombo);

    var remarkCell =row.querySelector('.remark div');
    var remarkInput = document.createElement("input");
    remarkInput.type = "text";
    remarkInput.value = remarkCell.textContent;
    remarkInput.style.width= "100%";
    remarkInput.style.height= "1.5rem";
    remarkInput.style.borderRadius= "0.3rem";
    remarkInput.style.paddingLeft= "0.5rem";
    remarkCell.innerHTML = '';
    remarkCell.appendChild(remarkInput);
}