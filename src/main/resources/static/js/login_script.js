function loginClick(){
    var username = document.getElementById('userName').value;
    var password = document.getElementById('password').value;

    if(username == ""){
        alert("아이디를 입력하세요");
        return;
    }else if(password == ""){
        alert("비밀번호를 입력하세요");
        return;
    }

    var userInfo = {
        username : username,
        password : password
    };

    fetch('/loginCheck',{
        method: 'POST',
        headers: {'Content-Type': 'application/json',},
        body: JSON.stringify(userInfo),
    })
        .then(response => response.json())
        .then(data => {
            if(data.status == "1") {
                window.location.href = '/product'; //encodeURIComponent -> 사용자 이름에 공백이나 특수 문자가 포함되어 있을 경우를 대비하여 URL 인코딩을 수행
            } else if(data.status == "0"){
                alert("비밀번호가 일치하지 않습니다.");
            } else if(data.status == "-1"){
                alert("아이디가 존재하지 않습니다.");
            }
        })
        .catch((error) => {
            console.error('Error:', error);
        });

}