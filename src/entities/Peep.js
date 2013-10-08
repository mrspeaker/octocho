function Peep(col) {
    this.col = col;
    this.pos = null;
    this.rot = null;

    this.w = 0.05;
    this.h = 0.1;

    this.dir = 0;
    this.mesh = null;
};

Peep.prototype = {

    init: function (cube) {
        this.mesh = geom.peep(this);

        this.dir = Math.random() * 360 | 0;
        this.speed = (Math.random() * 0.003) + 0.001;
        this.pos = geom.vec3(
            cube.pos.x,
            cube.pos.y + (-0.48 + (this.h / 2) + 0.001),
            cube.pos.z);
        this.rot = geom.vec3(0, 0, 0);

        return this;
    },

    tick: function () {
        var xo = this.speed * Math.sin(this.dir * (Math.PI / 180)),
            zo = this.speed * Math.cos(this.dir * (Math.PI / 180)),
            pos = this.pos;

        this.rot.y = this.dir * (Math.PI / 180);

        if (pos.x + xo < -1.5 || pos.x + xo > 1.5) {
            this.dir = Math.random() * 360 | 0;
            xo = 0;
        }

        if (pos.z + zo < -1.5 || pos.z + zo > 1.5) {
            this.dir = Math.random() * 360 | 0;
            zo = 0;
        }

        this.pos.add(geom.vec3(xo, 0, zo));
        this.sync();
    },

    sync: function () {
        this.mesh.position = this.pos;
        this.mesh.rotation.set(this.rot.x, this.rot.y, this.rot.z);
    }
}

