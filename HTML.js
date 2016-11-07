HTMLCollection.prototype.sort = Array.prototype.sort;
HTMLCollection.prototype.forEach = Array.prototype.forEach;
HTMLCollection.prototype.map = Array.prototype.map;
HTMLElement.prototype.appendMany = function(arr) {
  arr.forEach((tag) => this.appendChild(tag));
}
