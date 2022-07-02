'use strict';

const id = document.querySelector('#id'),
   psword = document.querySelector('#psword'),
   loginBtn = document.querySelector('#login-btn');

function login() {
   if(!id.value) return alert('아이디를 입력해 주세요');
   if(!psword.value) return alert('사번을 입력해 주세요');

   const req = {
      id: id.value,
      psword: psword.value,
   }

   fetch('/login', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json', },
         body: JSON.stringify(req),
   })
   .then((res) => res.json())
   .then((response) => {
      if(response.success) { location.href = `/main`; }
         else { 
            alert(req.flash('msg'));
            // alert(response.msg);
         }

   })
   .catch((err) => {
      console.error(new Error('로그인 중 에러가 발생되었습니다'));
   });
};


loginBtn.addEventListener('click', login);
