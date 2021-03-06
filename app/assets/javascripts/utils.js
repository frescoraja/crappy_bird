(function () {
  if (typeof CrappyBird === 'undefined') {
    window.CrappyBird = {};
  }

  var Utils = CrappyBird.Utils = {};

  Utils.inherits = function(childClass, parentClass) {

    childClass.prototype = Object.create(parentClass.prototype, {
      constructor: {
        configurable: true,
        enumerable: true,
        writable: true,
        value: childClass
      }
    });
  }

  Utils.merge = function(obj1, obj2) {
    for (var key in obj2) {
      if (obj2 !== undefined) {
        obj1[key] = obj2[key];
      }
    }
  };
})();
