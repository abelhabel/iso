function getTools() {
  function paint(board, e, workspace, camera, layer) {
    var ox = camera.xmin;
    var oy = camera.ymin;
    var lt = workspace.getGridTile(ox + e.offsetX, oy + e.offsetY);
    var tileInCell = lt.onLayer(layer.id);
    console.log(lt, tileInCell, layer.id)
    if(tileInCell) return
    var swatch = Swatch.activeSwatch.canvas;
    var tile = {w: workspace.gridSizeX, h: workspace.gridSizeY}
    var p = new Tile(ox + e.offsetX, oy + e.offsetY, tile.w, tile.h, swatch, '' + layer.id);
    lt.add(p, true);
    console.log('added', p, 'to', lt);
    camera.render(workspace, layer);
    var move = board.on('mousemove', (e, b) => {
      var nlt = workspace.getGridTile(ox + e.offsetX, oy + e.offsetY);
      if(lt.id != nlt.id) {
        if(nlt.onLayer(layer.id)) return
        var p = new Tile(ox + e.offsetX, oy + e.offsetY, tile.w, tile.h, swatch, layer.id);
        nlt.add(p, true);
        camera.render(workspace, layer);
        lt = nlt;

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
    cell.stats.render();
  }

  return {
    paint: paint,
    select: select
  }
}
