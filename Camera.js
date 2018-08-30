if(typeof(require) == 'function') var Helpers = require("../../public/helpers.js");
function Camera(x, y, w, h) {
  // the camera represents the player's view
  // which has a position relative to the
  // workspace.
  this.x = x || 0;
  this.y = y || 0;
  this.w = w;
  this.h = h;
  this.hw = this.w/2;
  this.hh = this.h/2;
  this.cotr = "Camera";
  this.setBB();
}

Camera.prototype.setBB = function() {
  this.xmin = Math.max(0, this.x - this.hw);
  this.xmax = Math.min(this.w, this.x + this.hw);
  this.ymin = Math.max(0, this.y - this.hh);
  this.ymax = Math.min(this.h, this.y + this.hh);
};

Camera.prototype.renderAll = function(workspace) {
  Layer.layers.forEach(l => this.render(workspace, l));
}

Camera.prototype.render = function(workspace, layer) {
  layer.screen.context.clearRect(0, 0, this.w, this.h);
  var cells = workspace.getGridTilesOnObject(this);
  cells.forEach(cell => {
    Object.keys(cell.content).forEach((key) => {
      let t = cell.content[key];
      if(layer && t.layerId != layer.id) return;
      t.render(cell.x - this.xmin, cell.y - this.ymin, cell.w, cell.h);
    });
  })
  this.renderSelected();
}

Camera.prototype.renderSelected = function(workspace, layer) {
  Workspace.selectedCells.forEach(c => {
    Object.keys(c.content).forEach(key => {
      let tile = c.content[key];
      let layer = Layer.layers.find(l => l.id == tile.layerId);
      layer.screen.context.strokeRect(c.x - this.xmin, c.y - this.ymin, c.w, c.h);
    })
  })
}

Camera.prototype.clear = function() {
  // Layer.layers.forEach((l) => l.screen.renderBackground())
}

if(typeof module != 'undefined') module.exports = Camera;
