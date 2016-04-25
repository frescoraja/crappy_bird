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
})();
