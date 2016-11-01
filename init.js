window.addEventListener('load', () => {
  HTMLCollection.prototype.sort = Array.prototype.sort;
  HTMLCollection.prototype.forEach = Array.prototype.forEach;
  HTMLCollection.prototype.map = Array.prototype.map;
  var layers = document.getElementById('layers');
  var board = new Board(document.getElementById('board'));
  var workspace = new Workspace(10000, 10000, 64, 64);
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
  board.down = board.on('mousedown', (e, b) => {
    if(!moveMode) return
    var x = e.offsetX;
    var y = e.offsetY;
    var move = board.on('mousemove', (e, b) => {
      camera.x += e.offsetX - x;
      camera.y += e.offsetY - y;
      x = e.offsetX;
      y = e.offsetY;
      camera.setBB();
      camera.clear();
      camera.render(workspace, activeLayer);
    });

    var up = board.on('mouseup', (e, b) => {

      board.detach('mousemove', move);
      board.detach('mouseup', up);
    });
  })
  var grid = [];
  var tile = {
    w: 64,
    h: 64
  };
  var activeLayer;
  var floorScreen = new Screen(
    board.w,
    board.h,
    document.getElementById('floor')
  );
  floorScreen.fillStyle = '#AA6F35';
  floorScreen.renderBackground();
  floorScreen.face = 'top';
  var wallsScreen = new Screen(
    board.w,
    board.h,
    document.getElementById('walls')
  );
  wallsScreen.face = 'right';
  var floorLayer = new Layer('Floor', floorScreen);
  var wallsLayer = new Layer('Walls', wallsScreen);

  floorLayer.render();
  wallsLayer.render();

  var reorder = function(layer) {
    var arr = layers.children.map((l) => l);
    arr = arr.sort((c, n) => {
      return parseInt(c.offsetTop) > parseInt(n.offsetTop) ? 1 : -1;
    });
    arr.forEach((c, i) => {
      layers.removeChild(c);
      layers.appendChild(arr[i]);
    });
    // layer.container.style.top = 0;
  }

  var dragndrop = (e, layer) => {
    layer.select();
    // activeLayer && activeLayer.clearGrid();
    activeLayer = layer;
    // grid = activeLayer.drawGrid();
    var tag = layer.container;
    tag.style.zIndex = 1;
    var x = e.x;
    var y = e.y;
    var move = (e2, layer) => {
      layer.container.style.top = e2.y - y + 'px';
    };
    var up = (e3, layer) => {
      reorder(layer);
      layer.container.style.zIndex = 0;


      layer.detach('mousemove', moveHandler);
      layer.detach('mouseup', upHandler);
      layer.container.style.top = 0;
    };
    var moveHandler = layer.on('mousemove', move);
    var upHandler = layer.on('mouseup', up)
  };

  floorLayer.on('mousedown', dragndrop);
  wallsLayer.on('mousedown', dragndrop);

  board.on('mousedown', (e) => {
    if(moveMode) return;
    var ox = camera.xmin;
    var oy = camera.ymin;
    var p = new Square(ox + e.offsetX, oy + e.offsetY, tile.w, tile.h);
    workspace.addToGrid(p, true);
    var t = workspace.getGridTile(p.x, p.y);
    floorScreen.renderBackground();
    camera.render(workspace, activeLayer);
    lx = e.x, ly = e.y;
    var lt = workspace.getGridTile(ox + e.offsetX, oy + e.offsetY);
    var move = board.on('mousemove', (e, b) => {
      if(lt != workspace.getGridTile(ox + e.offsetX, oy + e.offsetY)) {
        var p = new Square(ox + e.offsetX, oy + e.offsetY, tile.w, tile.h);
        workspace.addToGrid(p, true);
        var t = workspace.getGridTile(p.x, p.y);
        floorScreen.renderBackground();
        camera.render(workspace, activeLayer);
        lt = workspace.getGridTile(ox + e.offsetX, oy + e.offsetY);
      }

    });

    var up = board.on('mouseup', (e, b) => {

      board.detach('mousemove', move);
      board.detach('mouseup', up);
    });
  });


}, false);
