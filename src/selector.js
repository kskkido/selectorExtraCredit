var traverseDomAndCollectElements = function(matchFunc, startEl) {
  var resultSet = [];
  
  if (typeof startEl === "undefined") {
    startEl = document.body;
  }

  // traverse the DOM tree and collect matching elements in resultSet
  // use matchFunc to identify matching elements

  // YOUR CODE HERE

  return resultSet;
};


// detect and return the type of selector
// return one of these types: id, class, tag.class, tag

var selectorTypeMatcher = function(selector) {
  // your code here
  var firstChar = selector.charAt(0); 
  if(firstChar === '#'){
    return 'id';
  }
  if(firstChar === '.'){
    return 'class';
  }
  var containsPeriodNotFirst = false;
  for(var i = 1; i<selector.length - 1; i++){
    var currChar = selector[i];
    if(currChar === '.'){
      containsPeriodNotFirst = true;
      break;
    }
  }
  if(containsPeriodNotFirst){
    return 'tag.class';
  }
  return 'tag';
};


// NOTE ABOUT THE MATCH FUNCTION
// remember, the returned matchFunction takes an *element* as a
// parameter and returns true/false depending on if that element
// matches the selector.

var matchFunctionMaker = function(selector) {
  var selectorType = selectorTypeMatcher(selector);
  var matchFunction;
  if (selectorType === "id") {
    matchFunction = function (element) {
      return "#" + element.id === selector
    }

  } else if (selectorType === "class") {
    // define matchFunction for class
    matchFunction = function (element) {
      var classList = element.className.split(" ")
      return classList.indexOf(selector.slice(1)) > -1
    }
    
  } else if (selectorType === "tag.class") {
    matchFunction = function (element) {
      
      var tag = element.tagName.toLowerCase()
      var classList = element.className.split(" ")

      for (var i = 0; i < classList.length; i++) {
        if (tag+"."+classList[i] === selector)
          return true
      }

      return false
    }
    
  } else if (selectorType === "tag") {
    // define matchFunction for tag
    matchFunction = function (element) {
      return element.tagName.toLowerCase() === selector
    }
    
  }
  return matchFunction;
};

var $ = function(selector) {
  var elements;
  var selectorMatchFunc = matchFunctionMaker(selector);
  elements = traverseDomAndCollectElements(selectorMatchFunc);
  return elements;
};
