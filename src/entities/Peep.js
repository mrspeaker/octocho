function Peep(col) {
    this.col = col;
    this.pos = null;
    this.rot = null;

    this.w = 0.05;
    this.h = 0.1;

    this.dir = 0;
    this.mesh = null;

    this.cellX = 0;
    this.cellZ = 0;
};

Peep.prototype = {

    pickDir: function () {
        return [0, 90, 180, 270][Math.random() * 4 | 0] * (Math.PI / 180);
    },

    init: function (cube) {
        this.mesh = geom.peep(this);
        this.cube = cube;

        this.dir = this.pickDir();
        this.speed = (Math.random() * 0.003) + 0.001;
        this.pos = geom.vec3(
            cube.pos.x,
            cube.pos.y + (-0.48 + (this.h / 2) + 0.001),
            cube.pos.z);

        this.rot = geom.vec3(0, 0, 0);

        return this;
    },

    tick: function (level) {
        var xo = this.speed * Math.sin(this.dir),
            zo = this.speed * Math.cos(this.dir),
            pos = this.pos,
            oldPos = geom.vec3().copy(pos);

        this.rot.y = this.dir;

        if (pos.x + xo < -1.5 || pos.x + xo > 1.5) {
            this.dir = this.pickDir();
            xo = 0;
        }
        if (pos.z + zo < -1.5 || pos.z + zo > 1.5) {
            this.dir = this.pickDir();
            zo = 0;
        }

        var cellX = Math.round((pos.x + xo) * 3) - (this.cube.pos.x * 3),
            cellZ = Math.round((pos.z + zo) * 3) - (this.cube.pos.z * 3);
        if (cellX !== this.cellX || cellZ !== this.cellZ) {
            this.cellX = cellX;
            this.cellZ = cellZ;
            console.log(cellX, cellZ);
            // Get the cell from the cube
            // if 1, ok to go
            // else - if one exit, go that way
            // else - if two exits, random?
            // else - go backwards
        }

        this.pos.add(geom.vec3(xo, 0, zo));

        var newCube = level.getCubeFromWorldPos(pos);
        if (newCube !== this.cube) {
            if (newCube.rot.z !== 0) {
                this.pos.copy(oldPos);
                this.dir = Math.random() * (Math.PI * 2);
            } else {
                this.cube.removePeep(this);
                newCube.addPeep(this);
                this.cube = newCube;
            }
        }

        this.sync();
    },

    sync: function () {
        this.mesh.position = this.pos;
        this.mesh.rotation.set(this.rot.x, this.rot.y, this.rot.z);
    }
}

