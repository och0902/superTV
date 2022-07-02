'use strict';

const id = document.querySelector('#id'),
   name = document.querySelector('#name'),
   psword = document.querySelector('#psword'),  
   registerBtn = document.querySelector('#register-btn');

// register

function register() {
   if(!id.value) return alert('아이디를 입력해 주세요');
   if(!name.value) return alert('이름을 입력해 주세요');
   if(!psword.value) return alert('사번을 입력해 주세요');

   // if(!confirmPsword.value) return alert('확인용 사번을 입력해 주세요');
   // if(psword.value !== confirmPsword.value) return alert('입력한 사번이 상이합니다');

   const req = {
      id: id.value,
      name: name.value,
      psword: psword.value,
   }

   fetch('/register', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json', },
         body: JSON.stringify(req),
   })
   .then((res) => res.json())
   .then((response) => {
      if(response.success) { location.href = '/'; }
         else { alert(response.msg); }
   })
   .catch((err) => {
      console.error(new Error('구성원 등록 중 에러가 발생되었습니다'));
   });
};


registerBtn.addEventListener('click', register);