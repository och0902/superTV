// renderer.3d.setTexture(model, 'character.png')     // 구문 오류
// renderer['3d'].setTexture(model, 'character.png')  // 정상 작동

const tt = {
   comments: [
      {
         username: '오케이',
         comment: ' OK ~~  OK ~~  OK ~~  OK ~~  OK ~~  OK ~~ '
      },
      { username: 'ttt', comment: 'tttt tttt' }
   ],
   _id: '611e6b7e0873853e0c9979fa',
   title: '이제 자자 ~~~',
   content: '이제 자자 ~~~ 이제 자자 ~~~ 이제 자자 ~~~ 이제 자자 ~~~ 이제 자자 ~~~ 이제 자자 ~~~ ',
   __v: 0
};

const test = tt;
console.log(tt);
console.log(test);
console.log(test.comments.length);
console.log(test['comments'].length);
test.comments.forEach(function(comment, idx) {
   console.log(idx, comment.username, comment.comment);
});
