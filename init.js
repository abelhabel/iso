const go = {};
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
    MouseEvent: MouseEvent
  };

  // add DOM events
  document.getElementsByClassName('float-right').forEach((tag) => {
    tag.addEventListener('click', (e) => {
      if(tag.dataset.model == 'Layer') {
        var name = prompt("Name");
        var c = Screen.container;
        console.log(c.offsetWidth, c.offsetHeight);
        var w = c.offsetWidth;
        var h = c.offsetHeight;
        // var canvas = new Canvas(w, h)
        var screen = new Screen(w, h);
        screen.render();
        var layer = new Layer(name, screen.id);
        layer.render();
        layer.save();
      }
      if(tag.dataset.model == 'Tileset') {
        var a = prompt('url, x, y, w, h, scale');
        a = a.split(',').map((word) => word.trim());
        var t = new Tileset(
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
    maps: new Cache('maps', Workspace),
    tilesets: new Cache('tilesets', Tileset),
    layers: new Cache('layers', Layer),
    screens: new Cache('screens', Screen)
  };
  // Set up tool functionality
  const tools = getTools();
  //Load tools
  new Tool({id: false, name: 'Select', image: '/image/tool-select.png', activate: tools.select});
  new Tool({id: false, name: 'Paint', image: '/image/tool-paint.png', activate: tools.paint});

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
      console.log('clicked', tag.expanded)
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
  var workspace = new Workspace(10000, 10000, 64, 64);
  workspace.load();
  var camera = new Camera(5000, 5000, board.w, board.h);

  var moveMode = false, space = 32;;
  window.addEventListener('keydown', (e) => {
    if(e.keyCode = space) {
      moveMode = true;
    };
  }, false);
  window.addEventListener('keyup', (e) => {
    if(e.keyCode = space) {
      moveMode = false;
    };
  }, false);

  document.getElementById('save-button').addEventListener('click', (e) => {
    console.log('save workspace')
    workspace.save();
  }, false);
  var tilesets = go.db.tilesets.renderList(false, (map) => {
    tilesets.selected = map;
  });
  console.log(tilesets)
  var loadButton = new Button('Maps', 'button', () => {
    var pop = new Popup('Load Map', tilesets)
    console.log(pop)
  });

  var panel = document.getElementsByClassName('panel')[0];
  panel.appendChild(loadButton.tag);

  // board.on('mousedown', (e, b) => {
  //   if(!moveMode) return
  //   var x = e.offsetX;
  //   var y = e.offsetY;
  //   var move = board.on('mousemove', (e, b) => {
  //     camera.x -= e.offsetX - x;
  //     camera.y -= e.offsetY - y;
  //     x = e.offsetX;
  //     y = e.offsetY;
  //     camera.setBB();
  //     camera.clear();
  //     camera.render(workspace, go.activeLayer);
  //   });
  //
  //   var up = board.on('mouseup', (e, b) => {
  //
  //     board.detach('mousemove', move);
  //     board.detach('mouseup', up);
  //   });
  // })
  var grid = [];
  var tile = {
    w: 64,
    h: 64
  };
  var activeLayer;
  // var floorScreen = new Screen(
  //   board.w,
  //   board.h,
  //   document.getElementById('floor')
  // );
  // floorScreen.fillStyle = '#AA6F35';
  // floorScreen.renderBackground();
  // floorScreen.face = 'top';
  // var wallsScreen = new Screen(
  //   board.w,
  //   board.h,
  //   document.getElementById('walls')
  // );
  // wallsScreen.face = 'right';
  // var floorLayer = new Layer('Floor', floorScreen);
  // var wallsLayer = new Layer('Walls', wallsScreen);
  // var decorationLayer = new Layer('Decorations', wallsScreen);
  //
  // floorLayer.render();
  // wallsLayer.render();
  // decorationLayer.render();
  // camera.render(workspace, floorLayer);
  // var reorder = function(layer) {
  //   var arr = layers.children.map((l) => l);
  //   arr = arr.sort((c, n) => {
  //     return parseInt(c.offsetTop) > parseInt(n.offsetTop) ? 1 : -1;
  //   });
  //   arr.forEach((c, i) => {
  //     layers.removeChild(c);
  //     layers.appendChild(arr[i]);
  //   });
  //   // layer.container.style.top = 0;
  // }
  //
  // var dragndrop = (e, layer) => {
  //   layer.select();
  //   // activeLayer && activeLayer.clearGrid();
  //   activeLayer = layer;
  //   // grid = activeLayer.drawGrid();
  //   var tag = layer.container;
  //   tag.style.zIndex = 1;
  //   var x = e.x;
  //   var y = e.y;
  //   var move = (e2, layer) => {
  //     layer.container.style.top = e2.y - y + 'px';
  //   };
  //   var up = (e3, layer) => {
  //     reorder(layer);
  //     layer.container.style.zIndex = 0;
  //
  //
  //     layer.detach('mousemove', moveHandler);
  //     layer.detach('mouseup', upHandler);
  //     layer.container.style.top = 0;
  //   };
  //   var moveHandler = layer.on('mousemove', move);
  //   var upHandler = layer.on('mouseup', up)
  // };
  //
  // floorLayer.on('mousedown', dragndrop);
  // wallsLayer.on('mousedown', dragndrop);
  // decorationLayer.on('mousedown', dragndrop);

  board.on('mousedown', (e) => {
    if(!go.activeLayer) return;
    Tool.selectedTool.activate && Tool.selectedTool.activate(
      board, e, workspace, camera, Layer.activeLayer);

  });


}, false);
