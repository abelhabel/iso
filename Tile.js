class Tile {
  constructor(swatchId, layerId, stats) {
    this.id = uniqueId();
    this.swatchId = swatchId;
    this.layerId = layerId;
    this.stats = typeof stats == 'object' ? new Stats(stats) : new Stats(Layer.getStats(layerId));
  }

  get layer() {
    return Layer.layers.find(l => l.id == this.layerId);
  }

  render(x, y, w, h) {
    var c = this.layer.screen.context;
    var swatch = Swatch.getOnId(this.swatchId);
    if(!swatch) return;
    return c.drawImage(swatch.canvas, x, y, w, h)
  };

  renderPreview(context, x, y, w, h) {
    var swatch = Swatch.getOnId(this.swatchId);
    if(!swatch) return;
    return context.drawImage(swatch.canvas, x, y, w, h)
  };
};
