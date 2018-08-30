const go = {moveMode: false};
window.addEventListener('load', () => {
  // Set up constructors
  go.cotr = {
    Tileset: Tileset,
    Cache: Cache,
    Tile: Tile,
    Button: Button,
    Camera: Camera,
    Workspace: Workspace,
    Popup: Popup,
    Screen: Screen,
    Swatch: Swatch,
    SwatchCollection: SwatchCollection,
    MouseEvent: MouseEvent
  };

  // go.project = new Project(null, "Meander");
  // go.project.init({name: "Meander", workspace: {w: 1000, h: 1000}})
  Project.load('jlfoh4zi0.y5')
  .then(project => {
    console.log('project', project);
    go.project = project;
    go.camera = new Camera(project.workspace.width/2, project.workspace.height/2, board.w, board.h);
    go.camera.renderAll(go.project.workspace);
    Screen.render();

  })
  // add DOM events
  document.getElementsByClassName('float-right').forEach((tag) => {
    tag.addEventListener('click', (e) => {
      if(tag.dataset.model == 'Layer') {
        var name = prompt("Name");
        var c = Screen.container;
        var w = c.offsetWidth;
        var h = c.offsetHeight;
        // var canvas = new Canvas(w, h)
        var screen = new Screen(w, h);
        screen.render();
        var layer = go.project.createLayer(name, screen.id);
        layer.render();
        layer.save();
      }
      if(tag.dataset.model == 'Tileset') {
        var a = prompt('url, x, y, w, h, scale');
        a = a.split(',').map((word) => word.trim());
        var t = go.project.createTileset(
          '/image/' +a[0],
          Number(a[1]),
          Number(a[2]),
          Number(a[3]),
          Number(a[4]),
          Number(a[5])
        );
        t.fetching.then(() => t.render());
      }

      e.stopPropagation();
    }, false);
  });

  // Set up database
  go.db = {
  };
  // Set up tool functionality
  const tools = getTools();
  //Load tools
  new Tool({id: false, name: 'Select', activate: tools.select});
  new Tool({id: false, name: 'Paint', activate: tools.paint});
  new Tool({id: false, name: 'Remove', activate: tools.remove});
  new Tool({id: false, name: 'Fill', activate: tools.fill});
  new Tool({id: false, name: 'Move', preactivate: () => go.moveMode = true, deactivate: () => {
    go.moveMode = false;
  }
  });

  Tool.render();

  // Set up Screens
  Tileset.render();
  Layer.render();

  // Load Layers
  // new TileSet(
  //   '/image/http://orig01.deviantart.net/0f53/f/2011/273/b/e/tile_elements_ii_by_ayene_chan-d4becnf.png',
  //   32, 32, 288, 256, 2
  // );

  document.getElementsByClassName('side-panel-title').forEach((tag) => {
    tag.expanded = true;
    tag.addEventListener('click', function(e) {
      tag.expanded = !tag.expanded;
      if(tag.expanded) {
        document.getElementById(tag.dataset.for).style.display = 'block';
      } else {
        document.getElementById(tag.dataset.for).style.display = 'none';
      }
    }, false)
  });


  var layers = document.getElementById('layers');
  var board = new Board(document.getElementById('board'));

  go.moveMode = false, space = 32;;
  window.addEventListener('keydown', (e) => {
    if(e.keyCode = space) {
      go.moveMode = true;
    };
  }, false);
  window.addEventListener('keyup', (e) => {
    if(e.keyCode = space) {
      go.moveMode = false;
    };
  }, false);

  document.getElementById('save-button').addEventListener('click', (e) => {
    Tileset.save();
    Layer.save();
  }, false);
  var loadButton = new Button('Maps', 'button', () => {
    var pop = new Popup('Load Map', tilesets)
  });

  var panel = document.getElementsByClassName('panel')[0];
  panel.appendChild(loadButton.tag);
  var boardZoom = 1;
  board.on('wheel', e => {
    if(e.wheelDeltaY > 0) {
      // scroll down, zoom in
      boardZoom += 0.1;
    } else {
      boardZoom -= 0.1;
    }
    boardZoom = Math.min(Math.max(0.1, boardZoom), 3);
    board.container.style.transform = `scale(${boardZoom}, ${boardZoom})`;
  })

  board.on('dblclick', e => {
    boardZoom = 1;
    board.container.style.transform = `scale(${boardZoom}, ${boardZoom})`;
  });

  board.on('mousedown', (e, b) => {
    if(!go.moveMode) return
    var x = e.offsetX;
    var y = e.offsetY;
    var move = board.on('mousemove', (e, b) => {
      go.camera.x -= e.offsetX - x;
      go.camera.y -= e.offsetY - y;
      go.camera.setBB();
      x = e.offsetX;
      y = e.offsetY;
      go.camera.clear();
      go.camera.renderAll(go.project.workspace);
      displayCoordinates(e);
    });

    var up = board.on('mouseup', (e, b) => {

      board.detach('mousemove', move);
      board.detach('mouseup', up);
    });
  })

  board.on('mousedown', (e) => {
    if(!go.activeLayer) return;
    Tool.selectedTool.activate && Tool.selectedTool.activate(
      board, e, go.project.workspace, go.camera, Layer.activeLayer);

  });
  var coordinates = document.getElementById('coordinates');
  function displayCoordinates(e) {
    var x = go.camera.xmin + e.offsetX;
    var y = go.camera.ymin + e.offsetY;
    var cx = go.camera.x + e.offsetX;
    var cy = go.camera.y + e.offsetY
    coordinates.textContent = `x: ${x}, y: ${y}, cx: ${cx}, cy: ${cy}`
  }


}, false);
