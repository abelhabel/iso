function getTools() {
  function paint(board, e, workspace, camera, layer) {
    var eox = e.offsetX;
    var eoy = e.offsetY;
    var ox = camera.xmin;
    var oy = camera.ymin;
    var lt = workspace.getGridTile(ox + eox, oy + eoy);
    var tileInCell = lt.onLayer(layer.id);
    if(tileInCell) return
    var swatch = Swatch.getSwatch(true);
    var p = new Tile(swatch.id, layer.id);
    lt.add(p, true);
    camera.render(workspace, layer);
    var move = board.on('mousemove', (e, b) => {
      eox = e.offsetX;
      eoy = e.offsetY;
      var cell = workspace.getGridTile(ox + eox, oy + eoy);
      if(lt.id != cell.id) {
        if(cell.onLayer(layer.id)) return
        swatch = Swatch.getSwatch(true);
        var t = new Tile(swatch.id, layer.id);
        cell.add(t, true);
        camera.render(workspace, layer);
        lt = cell;

      }

    });

    var up = board.on('mouseup', (e, b) => {

      board.detach('mousemove', move);
      board.detach('mouseup', up);
    });
  }

  function select(board, e, workspace, camera, layer) {
    var ox = camera.xmin, oy = camera.ymin;
    var x = ox + e.offsetX, y = oy + e.offsetY;
    var cell = workspace.getGridTile(x, y);
    console.log(cell, Swatch.getSwatch(true))
    if(!cell) return
    Workspace.selectCells(cell);
    cell.stats.render();
    cell.renderTilesPreview();
    camera.render(workspace, layer);
  }

  function remove(board, e, workspace, camera, layer) {
    var ox = camera.xmin, oy = camera.ymin;
    var x = ox + e.offsetX, y = oy + e.offsetY;
    var cell = workspace.getGridTile(x, y);
    cell.removeContent(layer.id);
    camera.render(workspace, layer);
    var move = board.on('mousemove', (e, b) => {
      var c = workspace.getGridTile(ox + e.offsetX, oy + e.offsetY);
      c.removeContent(layer.id);
      camera.render(workspace, layer);
    });

    var up = board.on('mouseup', (e, b) => {
      board.detach('mousemove', move);
      board.detach('mouseup', up);
    });
  }

  function fill(board, e, workspace, camera, layer) {
    if(!Swatch.activeSwatch.canvas) return;
    var ox = camera.xmin, oy = camera.ymin;
    var x = ox + e.offsetX, y = oy + e.offsetY;
    var up = board.on('mouseup', (e, b) => {
      var ex = ox + e.offsetX, ey = oy + e.offsetY;
      var minx = Math.min(x, ex);
      var maxx = Math.max(x, ex);
      var miny = Math.min(y, ey);
      var maxy = Math.max(y, ey);
      var cells = workspace.getGridTilesFrom(minx, miny, maxx, maxy);
      cells.forEach(cell => {
        var swatch = Swatch.getSwatch(true);
        let tile = new Tile(swatch.id, layer.id);
        cell.add(tile, true);
      });
      camera.render(workspace, layer);
      board.detach('mouseup', up);
    });
  }

  return {
    paint: paint,
    select: select,
    remove: remove,
    fill: fill
  }
}
