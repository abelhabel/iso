'use strict'
function Workspace(w, h, gridX, gridY, grid) {
  var ws = this;
  this.id = uniqueId();
  this.width = w || 10000;
  this.height = h || 10000;
  this.backgroundColor = "#000000";
  this.gridSizeX = gridX || 32;
  this.gridSizeY = gridY || 32;
  this.grid = grid;
  this.gridify();
  this.cotr = "Workspace";
}

Workspace.selectedCells = [];
Workspace.selectCells = function(cells) {
  if(Array.isArray(cells)) {
    this.selectedCells = cells;
  } else {
    this.selectedCells = [cells];
  }
}

Workspace.prototype.save = function() {
  return this;
}

Workspace.prototype.updateGridSize = function(w, h) {
  this.gridSizeX = w;
  this.gridSizeY = h;
};

Workspace.prototype.gridify = function() {
  var grid = {};
  for(var i = 0; i < this.width; i += this.gridSizeX) {
    for(var j = 0; j < this.height; j += this.gridSizeY) {
      let key = i + ":" + j;
      let c = new Cell(i, j, this.gridSizeX, this.gridSizeY);
      grid[key] = c;
      if(this.grid && this.grid[key] && this.grid[key].size) {
        grid[key].merge(this.grid[key])
      }
    }
  }
  this.grid = grid;
};

Workspace.prototype.getGridTile = function(x, y) {
  var gridX = x - (x % this.gridSizeX);
  var gridY = y - (y % this.gridSizeY);
  return this.grid[gridX + ":" + gridY];
};

Workspace.prototype.getGridTilesFrom = function(sx, sy, ex, ey) {
  var out = [];
  for(var y = sy; y < ey; y += this.gridSizeY) {
    for(var x = sx; x < ex; x += this.gridSizeX) {
      out.push(this.getGridTile(x, y));
    }
  }
  return out;
}

Workspace.prototype.getGridTilesOnObject = function(obj) {
  var out = [];
  for(var x = obj.xmin; x < obj.xmax; x += this.gridSizeX) {
    for(var y = obj.ymin; y < obj.ymax; y += this.gridSizeX) {
      let cell = this.getGridTile(x, y);
      if(cell && cell.size) out.push(cell);
    }
  }
  return out;
};

Workspace.prototype.deleteOnId = function(id, dolog) {
  var keys = Object.keys(this.grid);
  var i = 0, l = keys.length;
  for(i; i < l; i++) {
    if(this.grid[keys[i]][id]) {
      delete this.grid[keys[i]][id];
    }
  }
}

Workspace.prototype.tilesOnId = function(id) {
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

Workspace.prototype.addToCell = function(obj, snap) {
  var tile = this.getGridTile(obj.x, obj.y);
  obj.x = tile.x;
  obj.y = tile.y;
  obj.setBB();
  tile.content[obj.id] = obj;
  tile.size += 1;
  return tile;
}

Workspace.prototype.addToGrid = function(obj, snap) {
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

Workspace.prototype.purgeCell = function(cell, layerId) {
  if(layerId) {
    var tile = cell.onLayer(layerId);
    if(tile) {
      delete cell.content[tile.id];
      cell.size -= 1;
    }
  } else {
    cell.content = {};
    cell.size = 0;
  }
}


Workspace.prototype.removeFromGrid = function(obj, dolog) {
  for(var x = obj.xmin; x < obj.xmax; x += this.gridSizeX) {
    for(var y = obj.ymin; y < obj.ymax; y += this.gridSizeX) {
      var tile = this.getGridTile(x, y);
      if(tile) {
        delete tile.content[obj.id];
        tile.size -= 1;
      }

    }
  }
};

Workspace.prototype.updateGrid = function(x, y, obj, snap) {
  this.deleteOnId(obj.id);
  this.addToGrid(obj, snap);
};

class Cell {
  constructor(x, y, w, h) {
    this.id = uniqueId();
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.content = {};
    this.size = 0;
  }

  static get tilesContainer() {
    return document.getElementById('tiles');
  }

  get tiles() {
    return Object.keys(this.content).map(k => this.content[k]);
  }

  renderTilesPreview() {
    Cell.tilesContainer.innerHTML = '';
    this.tiles.forEach(t => {
      var c = new Canvas(this.w, this.h);
      t.renderPreview(c.context, 0, 0, this.w, this.h);
      Cell.tilesContainer.appendChild(c.canvas);
    })
  }

  get stats() {
    var stats = {};
    this.tiles.sort((a, b) => {
      return a.layer.index < b.layer.index ? -1 : 1;
    })
    .forEach(tile => {
      Object.assign(stats, tile.stats);
    });
    return new Stats(stats)
  }

  add(obj, snap) {
    if(!this.content[obj.id]) this.size += 1;
    this.content[obj.id] = obj;
  }

  merge(cell) {
    Object.keys(cell.content)
    .forEach(tileId => {
      let tile = cell.content[tileId];
      let ntile = new Tile(tile.swatchId, tile.layerId, tile.stats);
      ntile.id = tileId;
      this.add(ntile);
    })
  }
}

Cell.prototype.renderStats = function() {
  this.stats.render();
}

Cell.prototype.each = function(fn) {
  Object.keys(this.content).forEach(key => {
    fn(this.content[key], key);
  })
}

Cell.prototype.onLayer = function(layerId) {
  var out;
  Object.keys(this.content).find((key) => {
    if(this.content[key].layerId == layerId) {
      return out = this.content[key];
    }
  })
  return out;
}


Cell.prototype.removeContent = function(layerId) {
  Object.keys(this.content).forEach(tileId => {
    if(layerId) {
      let tile = this.content[tileId];
      if(tile.layerId !== layerId) return;
    }
    delete this.content[tileId];
  })
}

Cell.prototype.setBB = function() {
  this.xmin = this.x - this.w/2;
  this.xmax = this.x + this.w/2;
  this.ymin = this.y - this.h/2;
  this.ymax = this.y + this.h/2;
};
