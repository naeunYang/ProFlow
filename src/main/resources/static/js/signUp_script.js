async function signUpAlert(){
    var id = document.getElementById('userName').value;
    var pwd = document.getElementById('password').value;
    var checkPwd = document.getElementById('checkpassword').value;
    var name = document.getElementById('name').value;
    var tel = document.getElementById('tel').value;
    var email = document.getElementById('email').value;

    var userInfo = {
        id : id,
        pwd : pwd,
        name : name,
        tel : tel,
        email : email
    }

    var checkPwd_msg = document.getElementById('checkPwd_msg');
    var id_msg = document.getElementById('id_msg');
    checkPwd_msg.style.visibility = "hidden";
    id_msg.style.visibility = "hidden";

    // 필수입력 검사
    if(!checkField(userInfo.id, userInfo.pwd, userInfo.name)) return;

    // 비밀번호 일치 검사
    if(pwd !== checkPwd){
        checkPwd_msg.style.visibility = "visible";

        alert("비밀번호가 일치하지 않습니다.");
        return;
    }else
        checkPwd_msg.style.visibility = "hidden";


    // 아이디 중복 검사
    if(!await checkId(userInfo.id, id_msg)) return;

    // 회원 정보 저장
        fetch('/signUp/insert',{
        method: 'POST',
        headers: {'Content-Type': 'application/json',},
        body: JSON.stringify(userInfo),
    })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
            window.location.href = '/product';
            alert("가입이 완료되었습니다");
        })
        .catch((error) => {
            console.error('Error:', error);
        });

    return true;

}

// 필수 입력 검사
function checkField(id, pwd, name){
    if(id === "" || id == null){
        alert("아이디를 입력하세요");
        return false;
    }else if(pwd === "" || pwd == null){
        alert("비밀번호를 입력하세요");
        return false;
    }else if(name === "" || name == null){
        alert("이름을 입력하세요");
        return false;
    }

    return true;
}

// 아이디 중복 검사
async function checkId(id, id_msg){
    try {
        const response = await fetch('/idCheck', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({id : id})
        });
        const data = await response.json();

        if(data) {
            id_msg.style.visibility = "visible";

            alert("중복된 아이디입니다.");
            return false;
        } else {
            id_msg.style.visibility = "hidden";
            return true;
        }
    } catch (error) {
        console.error('Error:', error);
        return false;
    }
}

// 글자 수 제한
function limitInputLength(input){
    if (input.value.length > 11) {
        input.value = input.value.slice(0, 11);
    }
}

function enterEvent(event){
    if(event.keyCode === 13){
        signUpAlert();
    }
}