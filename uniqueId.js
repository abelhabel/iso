function uniqueId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(0,4);
}
