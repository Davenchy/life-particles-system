class Particle {
  static _id = 0;
  constructor(type) {
    this.id = Particle._id++;
    this.type = type;
    this.r = 2;
    this.color = type;
    this.mass = 10;

    this.pos = {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height
    };

    this.vel = {
      x: 0,
      y: 0
    };

    this.acc = {
      x: 0,
      y: 0
    };
  }

  update(ctx) {
    ctx.beginPath();
    ctx.arc(this.pos.x, this.pos.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();

    this.vel.x += this.acc.x;
    this.vel.y += this.acc.y;

    this.pos.x += this.vel.x;
    this.pos.y += this.vel.y;

    this.acc = { x: 0, y: 0 };

    if (this.pos.x < 0 || this.pos.x > canvas.width) this.vel.x *= -1;
    if (this.pos.y < 0 || this.pos.y > canvas.height) this.vel.y *= -1;
  }

  applyForce(force = { x: 0, y: 0 }) {
    this.acc.x += force.x;
    this.acc.y += force.y;
  }
}
