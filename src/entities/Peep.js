function Peep(col) {

    this.pos = null;
    this.col = col;

    this.w = 0.05;
    this.h = 0.1;

    this.dir = 0;
    this.mesh = null;
};

Peep.prototype = {

    init: function () {

        this.mesh = geom.peep(this);

        this.dir = Math.random() * 360 | 0; //90 * (Math.PI / 180);
        this.speed = (Math.random() * 0.003) + 0.001;
        var yPos = -0.48 + (this.h / 2) + 0.001;
        this.pos = geom.vec3(0, yPos, 0);

        return this;

    },

    tick: function (cube) {

        var xo = this.speed * Math.sin(this.dir * (Math.PI / 180)),
            zo = this.speed * Math.cos(this.dir * (Math.PI / 180)),
            pos = this.pos;

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

    }
}

