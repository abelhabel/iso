'use strict'
function Workspace(w, h, gridX, gridY) {
  var ws = this;
  this.id = uniqueId();
  this.width = w || 100000;
  this.height = h || 100000;
  this.backgroundColor = "#000000";
  this.gridSizeX = gridX;
  this.gridSizeY = gridY;
  this.updateGridSize = function(w, h) {
    this.gridSizeX = w;
    this.gridSizeY = h;
  };
  this.gridify = function() {
    var grid = {};
    for(var i = 0; i < this.width; i += this.gridSizeX) {
      for(var j = 0; j < this.height; j += this.gridSizeY) {
        grid[i + ":" + j] = {
          xmin: i,
          xmax: i + this.gridSizeX,
          ymin: j,
          ymax: j + this.gridSizeY,
          x: i + this.gridSizeX/2,
          y: j + this.gridSizeY/2,
          size: 0,
          content: {}
        };
      }
    }
    this.grid = grid;
  };
  this.gridify();
  this.getGridTile = function(x, y) {
    var gridX = x - (x % this.gridSizeX);
    var gridY = y - (y % this.gridSizeY);
    return this.grid[gridX + ":" + gridY];
  };
  this.getGridTilesOnObject = function(obj) {
    var out = [];
    for(var x = obj.xmin; x < obj.xmax; x += this.gridSizeX) {
      for(var y = obj.ymin; y < obj.ymax; y += this.gridSizeX) {

          let tile = this.getGridTile(x, y);
          if(tile.size) out.push(tile.content);


      }
    }
    return out;
    var d = 50;
    var tile0 = this.getGridTile(obj.xmin - d, obj.ymin - d);
    var tile1 = this.getGridTile(obj.xmax + d, obj.ymin - d);
    var tile2 = this.getGridTile(obj.xmin - d, obj.ymax + d);
    var tile3 = this.getGridTile(obj.xmax + d, obj.ymax + d);
    var tile4 = this.getGridTile(obj.x, obj.y);
    var arr = {};
    tile0 && Object.keys(tile0).forEach((id) => arr[id] = (tile0[id])),
    tile1 && Object.keys(tile1).forEach((id) => arr[id] = (tile1[id])),
    tile2 && Object.keys(tile2).forEach((id) => arr[id] = (tile2[id])),
    tile3 && Object.keys(tile3).forEach((id) => arr[id] = (tile3[id])),
    tile4 && Object.keys(tile4).forEach((id) => arr[id] = (tile4[id]))
    return arr;
  };

  this.deleteOnId = function(id, dolog) {
    if(dolog) console.time('deleteOnId');
    var keys = Object.keys(this.grid);
    var i = 0, l = keys.length;
    for(i; i < l; i++) {
      if(this.grid[keys[i]][id]) {
        delete this.grid[keys[i]][id];
      }
    }
    if(dolog) console.timeEnd('deleteOnId');
  }

  this.tilesOnId = function(id) {
    var out = [];
    var keys = Object.keys(this.grid);
    var i = 0, l = keys.length;
    for(i; i < l; i++) {
      if(this.grid[keys[i]][id]) {
        out.push({key: keys[i], tile: this.grid[keys[i]]});
      }
    }
    return out;
  }

  this.addToGrid = function(obj, snap) {
    for(var x = obj.xmin; x < obj.xmax; x += this.gridSizeX) {
      for(var y = obj.ymin; y < obj.ymax; y += this.gridSizeX) {
        var tile = this.getGridTile(x, y);
        if(tile) {
          if(snap) {
            obj.x = tile.x;
            obj.y = tile.y;
            obj.setBB();
          }
          tile.content[obj.id] = obj;
          tile.size += 1;
        }
      }
    }
  };

  this.removeFromGrid = function(obj, dolog) {
    if(dolog) console.time('removeFromGrid');
    for(var x = obj.xmin; x < obj.xmax; x += this.gridSizeX) {
      for(var y = obj.ymin; y < obj.ymax; y += this.gridSizeX) {
        var tile = this.getGridTile(x, y);
        if(dolog) console.log(tile, obj.id);
        if(tile) {
          delete tile.content[obj.id];
          tile.size -= 1;
        }

        if(dolog) console.log(tile);
      }
    }
    if(dolog) console.timeEnd('removeFromGrid');
  };

  this.updateGrid = function(x, y, obj, snap) {
    this.deleteOnId(obj.id);
    this.addToGrid(obj, snap);
  };

  this.cotr = "Workspace";
}
