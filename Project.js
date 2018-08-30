class Project {
  constructor(id, name) {
    this.id = id || uniqueId();
    this.name = name || '';
    this.workspace = null;
    this.tilesets = [];
    this.layers = [];
  }

  init(p = {}) {
    return this.addTilesets(p.tilesets)
    .then(() => {
      Tileset.render();
      this.addLayers(p.layers);
      Layer.render();
      this.addWorkspace(p.workspace);
      return this;
    })
    .catch(err => {
      console.log('error loading project', err)
    });
  }

  setAsCurrent() {
    localStorage.currentProject = this.id;
  }

  save() {
    return fetch('saveProject?id=' + this.id, {
      method: 'POST',
      body: JSON.stringify({
        id: this.id,
        name: this.name,
        workspace: this.workspace.save(),
        tilesets: this.tilesets.map(t => t.save()),
        layers: this.layers.map(l => l.save())
      })
    })
    .then(res => console.log('saved'))
    .catch(err => console.log('error', err))
  }

  static load(id) {
    return fetch('loadProject?id=' + id)
    .then(res => res.json())
    .then(p => {
      console.log('loaded');
      return new Project(id).init(p);
    })
    .catch(err => console.log('error', err))
  }

  addWorkspace(ws) {
    console.log('addWorkspace', ws)
    if(ws) {
      this.workspace = new Workspace(
        ws.width,
        ws.height,
        ws.gridSizeX,
        ws.gridSizeY,
        ws.grid
      );
    } else {
      this.workspace = new Workspace(10000, 10000, 32, 32);
    }
  }

  addTilesets(ts) {
    if(!Array.isArray(ts)) return Promise.resolve();
    ts.forEach(t => this.tilesets.push(new Tileset(t)));
    return Promise.all(this.tilesets.map(t => t.fetching))

  }

  addLayers(ls) {
    if(!Array.isArray(ls)) return;
    ls.forEach(l => this.layers.push(new Layer(l)));
  }

  createLayer(name, screenId) {
    var l = new Layer(name, screenId);
    this.layers.push(l);
    return l;
  }

  createTileset(image, x, y, w, h, scale) {
    var ts = new Tileset(image, x, y, w, h, scale);
    this.tilesets.push(ts);
    return ts;
  }
}
