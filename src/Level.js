var DIRS = {
    "north": 0,
    "east": 1,
    "south": 2,
    "west": 3
};

var WORLD = [
    [
        [2,3,5],
        [3,1,3],
        [4,3,4]
    ],
    [
        [2,4,5],
        [3,1,4],
        [4,4,4]
    ],
    [
        [2,3,6],
        [3,1,3],
        [4,3,5]
    ]
];

function Level () {
    this.cubes = null;
    this.peeps = null;
};

Level.prototype = {

    init: function () {
        var id = 0,
            x,
            y,
            z,
            col,
            cube,
            ns;

        this.cubes = [];
        this.peeps = [];

        this.createMesh();

        for (x = 0; x < 3; x++) {
            this.cubes.push([]);
            for (y = 0; y < 3; y++) {
                this.cubes[x].push([]);
                for (z = 0; z < 3; z++) {
                    col = geom.colHSL((x * 3 + y * 3 + z) / 27, 0.8, Math.random());
                    cube = new Cube(col, id++).init(x - 1, y - 1, z - 1, WORLD[y][x][z]);

                    if (id === 17) {
                        var peep = new Peep(col).init(cube);
                        this.addPeep(peep);
                        cube.addPeep(peep);
                    }

                    if (y < 2 && Math.random() < 0.2) {
                        cube.addThing(new Ladder().init());
                    }

                    this.cubes[x][y].push(cube);
                }
            }
        }

        // Set the cube's neighbours
        for (x = 0; x < 3; x++) {
            for (y = 0; y < 3; y++) {
                for (z = 0; z < 3; z++) {
                    ns = [null, null, null, null, null, null];

                    //if (k > 0) ns.push(this.cubes[k - 1][j][i]);
                    //if (k < 2) ns.push(this.cubes[k + 1][j][i]);

                    if (z > 0) ns[DIRS.north] = this.cubes[x][y][z - 1];
                    if (x < 2) ns[DIRS.east] = this.cubes[x + 1][y][z];

                    if (z < 2) ns[DIRS.south] = this.cubes[x][y][z + 1];
                    if (x > 0) ns[DIRS.west] = this.cubes[x - 1][y][z];


                    this.cubes[x][y][z].ns = ns;
                }
            }
        }

        return this;
    },

    createMesh: function () {
        this.mesh = geom.container(geom.vec3(0, 0, 0));
    },

    addPeep: function (peep) {
        this.peeps.push(peep);
        this.mesh.add(peep.mesh);
    },

    removePeep: function (peep) {
        this.peeps = this.peeps.filter(function (p) {
            return p !== peep;
        });
        this.mesh.remove(peep.mesh);
    },

    getCubeFromWorldPos: function (pos) {

        var x = pos.x + 1.5 | 0,
            y = pos.y + 1.5 | 0,
            z = pos.z + 1.5 | 0;

        return this.cubes[x][y][z];
    },

    tick: function () {
        for (var x = 0; x < 3; x++) {
            for (var y = 0; y < 3; y++) {
                for (var z = 0; z < 3; z++) {
                    this.cubes[x][y][z].tick();
                }
            }
        }

        this.peeps.forEach(function (p) {
            var oldPos = geom.vec3().copy(p.pos);
            p.tick();
            var cube = this.getCubeFromWorldPos(p.pos);
            if (cube !== p.cube) {
                if (cube.rot.z !== 0) {
                    p.pos.copy(oldPos);
                    p.dir = Math.random() * (Math.PI * 2);
                } else {
                    p.cube.removePeep(p);
                    cube.addPeep(p);
                    p.cube = cube;
                }
            }
        }, this);
    }

};
