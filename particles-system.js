class ParticlesSystem {
  constructor() {
    this.particles = [];
    this.rules = {};
  }

  getTypeArray(type) {
    return this.particles.filter(p => p.type === type);
  }

  generate(type, count, cb) {
    for (let i = 0; i < count; i++) {
      const particle = new Particle(type);
      if (cb) cb(particle);
      this.particles.push(particle);
    }
  }

  setRule(type1, type2, relation) {
    if (!this.rules[type1]) this.rules[type1] = {};
    this.rules[type1][type2] = relation;
  }

  update(ctx) {
    this.particles.forEach(p => p.update(ctx));

    Object.keys(this.rules).forEach(t1 => {
      const t1Arr = this.getTypeArray(t1);
      Object.keys(this.rules[t1]).forEach(t2 => {
        const relation = this.rules[t1][t2];
        const t2Arr = this.getTypeArray(t2);
        t1Arr.forEach(p1 => {
          t2Arr.forEach(p2 => {
            if (p1.id === p2.id) return;
            this.applyGravity(p1, p2, relation);
          });
        });
      });
    });
  }

  applyGravity(p1, p2, g) {
    const dx = p2.pos.x - p1.pos.x;
    const dy = p2.pos.y - p1.pos.y;
    const d = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));

    if (d > 0) {
      const f = ((g / 500) * p1.mass * p2.mass) / (Math.pow(d, 2) + 1);
      p1.applyForce({ x: f * dx, y: f * dy });
    }
  }
}
