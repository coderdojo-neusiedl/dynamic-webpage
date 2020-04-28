/* global assertNamespace:true, myNamespace:true, global, window */

var recursiveAssertObject = function recursiveAssertObject(parentObject, objects) {
   
   if (parentObject[objects[0]] === undefined) {
      parentObject[objects[0]] = {};  
   }
   
   var newParentObject = parentObject[objects[0]];
   
   if (objects.length > 1) {
      recursiveAssertObject(newParentObject, objects.slice(1));
   }
};

assertNamespace = function assertNamespace(namespace) {
   
   var rootObject = (typeof window === 'undefined') ? global : window;
   var objects = namespace.split('.');
   recursiveAssertObject(rootObject, objects);
};
