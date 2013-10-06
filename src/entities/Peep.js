function Peep(col) {
    this.x = 0;
    this.y = 0;
    this.z = 0;

    this.col = col;

    this.w = 0.05;
    this.h = 0.1;

    this.dir = 0;
    this.mesh = null;
};

Peep.prototype = {

    init: function () {
        this.y = -0.48 + (this.h / 2) + 0.001;

        this.dir = Math.random() * 360 | 0;
        this.speed = (Math.random() * 0.003) + 0.001;
        this.mesh = geom.peep(this);

        return this;
    },

    tick: function (cube) {
        var xo = this.speed * Math.sin(this.dir * (Math.PI / 180)),
            zo = this.speed * Math.cos(this.dir * (Math.PI / 180));

        if (this.x + xo < -0.5) {
            cube.changePeep(DIRS.west, this, xo);
            return;
        }

        if (this.x + xo > 0.5) {
            cube.changePeep(DIRS.east, this, xo);
            return;
        }

        if (this.z + zo < -0.5) {
            cube.changePeep(DIRS.north, this, zo);
            return;
        }

        if (this.z + zo > 0.5) {
            cube.changePeep(DIRS.south, this, zo);
            return;
        }

        /*if (this.x + xo < -0.5 || this.x + xo > 0.5) {
            this.dir = Math.random() * 360 | 0;
            xo = 0;
        }
        if (this.z + zo < -0.5 || this.z + zo > 0.5) {
            this.dir = Math.random() * 360 | 0;
            zo = 0;
        }*/

        this.x += xo;
        this.z += zo;
        this.sync();
    },

    sync: function () {
        this.mesh.position.set(this.x, this.y, this.z);
    }
}

