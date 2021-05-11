// https://stackoverflow.com/questions/31402576/enable-focus-only-on-keyboard-use-or-tab-press
var cssGlobal = "using-mouse";
// Let the document know when the mouse is being used
document.body.addEventListener('mousedown', function() {
  document.body.classList.add(cssGlobal);
});
document.body.addEventListener('keydown', function(e) {
  var origin = (e.target.tagName.toLowerCase())
  var movementKey = ['Tab', 'tab', 'Shift', 'shift', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)
  if(origin !== 'input' || movementKey)
  document.body.classList.remove(cssGlobal);
});
