(function() {

// TODO: read current color theme from background-page

// iterate through DOM tree, and convert their color to gray
var elms = document.documentElement.getElementByTagName("*");
for (var i in elms) {
    console.log(elms[i].tagName);
}
})();
