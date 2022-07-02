'use strict';

const util = {

   convertToTrees: function(comments, idField, parentIdField, childField) {
      let array = comments.slice();

      for(let idx = array.length-1 ; idx >= 0  ; idx--) {
         let parentId = array[idx][parentIdField];

         if(parentId) {
            let filteredArray = array.filter( function(arrayElem) {
               return arrayElem[idField].toString() == parentId.toString();
            });

            if(filteredArray.length){
               let parent = filteredArray[0];

               if(parent[childField]){
                  parent[childField].unshift(array[idx]);
               }
               else {
                  parent[childField] = [array[idx]];
               }
            }
            array.splice(idx,1);
         }
      }
      return array;
   },

};

module.exports = util;