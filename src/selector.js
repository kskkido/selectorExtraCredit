var traverseDomAndCollectElements = function(matchFunc, startEl) {
  var resultSet = [];
  
  if (typeof startEl === "undefined") {
    startEl = document.body;
  }


  // traverse the DOM tree and collect matching elements in resultSet
  // use matchFunc to identify matching elements

  // YOUR CODE HERE
  traverse(matchFunc, startEl, resultSet);

  return resultSet;
};

function traverse(matchFunc, currElement, resultSet){
  if(matchFunc(currElement)){
    resultSet.push(currElement);
  }
  for(var i = 0; i<currElement.children.length; i++){
    var currChild = currElement.children[i];
    traverse(matchFunc, currChild, resultSet);
  }
}

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

  if (selector.indexOf(">")> -1 || selector.indexOf(" ")> -1) {
    return "selector hierarchy"
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

  if (selectorType === "selector hierarchy") {
    
    matchFunction = function (element) {
      
      var directChildOnly = false
      var selectorList = selector.split(" ")
    //recursion by checking every last two selectors. moves on only if the first set is true
    // first return a set and then push off the first element or first two if > and call the remainder, if all true, return true
    // sample: div div > p, current [div > p], next recursion should be [div div]
      var set = [selectorList.pop()]
      if (selectorList[selectorList.length-1] == ">") {
        directChildOnly = true
        set.unshift(selectorList.pop())
      }
      set.unshift(selectorList[selectorList.length-1])

      // currently set = [div > p] and selectorList = [div, >, p]
      var childSelector = set[set.length-1]
      var parentSelector = set[0]

      var childMatcher = matchFunctionMaker(childSelector)
      var parentMatcher = matchFunctionMaker(parentSelector)
      var parentElement = element.parentNode
      // create a function that checks whether that compares an element to the child selector
      if (childMatcher(element) && parentElement) { //element will always be the child

        if(directChildOnly) { // if > and parent node does not match, return false
          if (!parentMatcher(parentElement)) return false
          else {
            if (selectorList.length > 1){
            var nextSet = selectorList.join(" ")
            var recursiveMatch = matchFunctionMaker(nextSet)
            return recursiveMatch(parentElement)
            }
            else {
              console.log(element, parentElement)
              return true;
            }
          }
        }

        else { //meaning search includes indirect child, traverse down the child, jk we go up
          var current = parentElement
          var check = false
          while(current) {
            // if (current === this) return false
            if(parentMatcher(current)){
              check = true;
              break
            }
            current = current.parentNode
          }
          if(!check) {
            return false
          }
          else{
            if(selectorList.length > 1) {
              var nextSet = selectorList.join(" ")
              var recursiveMatch = matchFunctionMaker(nextSet)
              return recursiveMatch(current)
            }
            else return true;
          }
        }

      } else return false
    }
  }


  //     for (var i = selectorList.length-1; i>0 ;i--) {
  //       if(selectorList[i] == ">") continue


  //       var currentSelector = selectorList[i]
  //       var parentSelector

  //       if (selectorList[i-1] === ">") {
  //         directChildOnly = !directChildOnly 
  //         parentSelector = selectorList[i-2] 
  //       } else {
  //         directChildOnly = false; 
  //         parentSelector = selectorList[i-1]
  //       }
  
  //       var childMatcher = matchFunctionMaker(currentSelector)
  //       var parentMatcher = matchFunctionMaker(parentSelector)

  //       if (childMatcher(element)) {// if element equals the child level of selector hierarchy
  //         if (directChildOnly) {
  //           if(!parentMatcher(element.parentNode)) return false
  //         }
          
  //         else {
  //           current = element.parentNode
  //           while(current) {
  //             if (parentMatcher(parent)) var good = "passed"; break
  //             current = current.parentNode
  //           }
  //           if(!good) return false
  //         }

  //       } 
  //       else return false
  //     }
  //     return true
  //   }

  // }

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
      if(!element.tagName) return false
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
}
