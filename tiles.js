window.addEventListener('load', () => {
  var path = window.location.search.substr(1);
  var query = {};
  path.split('&').forEach((kp) => {
    var kv = kp.split('=');
    query[kv[0]] = kv[1];
  })
  console.log(query);
  var rmin = Number(query.rmin) || 0,
      rmax = Number(query.rmax) || 255,
      gmin = Number(query.gmin) || 0,
      gmax = Number(query.rmax) || 255,
      bmin = Number(query.bmin) || 0,
      bmax = Number(query.rmax) || 255,
      alpha = Number(query.a) / 100 || 1
  var tiles = new Screen(
    window.innerWidth,
    window.innerHeight,
    document.getElementById('tiles')
  );

  // var tile = new Polygon(100,100, 100, 6);
  // console.log(tile);
  // tile.render(tiles);

  var polygons = Polygon.generate(525, 50,50,50,6);
  console.log(polygons)
  var prevFS;
  polygons.forEach((p, i) => {
    var width = 2 + Math.floor(tiles.width/p.width);
    var x = i % width;
    var y = Math.floor(i / width);

    p.posx += (p.width * (x)) + (y%2 * p.width/2);
    p.posy += (1.5*p.height * (y));
    p.fillStyle = randomColor();
    if(prevFS) p.strokeStyle = prevFS;
    prevFS = p.fillStyle;
    // p.stroke = false;
    p.render(tiles);
  })

  document.body.style.backgroundColor = randomColor();
  function rand(min, max) {
    min = Number(min) || 0;
    max = Number(max) || 255;
    return min + Math.floor(Math.random() * (max - min + 1));
  }
  function randomColor() {
    return `rgba(${rand(rmin, rmax)},${rand(rmin, rmax)},${rand(rmin, rmax)}, ${alpha})`;
  }
}, false);
