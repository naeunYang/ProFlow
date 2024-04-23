function loginClick(){
    var username = document.getElementById('userName').value;
    var password = document.getElementById('password').value;

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
            if(data === "1") {
                window.location.href = '/product';
            } else if(data === "0"){
                alert("비밀번호가 일치하지 않습니다.");
            } else if(data === "-1"){
                alert("아이디가 존재하지 않습니다.");
            }
        })
        .catch((error) => {
            console.error('Error:', error);
        });

}