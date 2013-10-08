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
        this.cube = cube;

        this.dir = Math.random() * (Math.PI * 2);
        this.speed = (Math.random() * 0.003) + 0.001;
        this.pos = geom.vec3(
            cube.pos.x,
            cube.pos.y + (-0.48 + (this.h / 2) + 0.001),
            cube.pos.z);

        this.rot = geom.vec3(0, 0, 0);

        return this;
    },

    tick: function () {

        // var m = new THREE.Matrix4();
        // //m.makeTranslation(0, 2, 0);
        // m.setPosition(this.pos);
        // m.makeRotationY(this.dir * (Math.PI / 180));
        // m.makeScale(1.01,0,1.01);

        // this.pos.applyMatrix4(m);

        // this.sync();
        // return;


        var xo = this.speed * Math.sin(this.dir),
            zo = this.speed * Math.cos(this.dir),
            pos = this.pos;

        this.rot.y = this.dir;


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

