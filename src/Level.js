var DIRS = {
    "north": 0,
    "east": 1,
    "south": 2,
    "west": 3
};

var PATHS = {
    X: [0, 1, 0, 1, 1, 1, 0, 1, 0],
    TL: [0, 1, 0, 1, 1, 0, 0, 1, 0],
    TR: [0, 1, 0, 0, 1, 1, 0, 1, 0],
    TU: [0, 1, 0, 1, 1, 1, 0, 0, 0],
    TD: [0, 0, 0, 1, 1, 1, 0, 1, 0],
    CUL: [0, 1, 0, 1, 1, 0, 0, 0, 0],
    CUR: [0, 1, 0, 0, 1, 1, 0, 0, 0],
    CDL: [0, 0, 0, 1, 1, 0, 0, 1, 0],
    CDR: [0, 0, 0, 0, 1, 1, 0, 1, 0],
    idx: ["X", "TL", "TR", "TU", "TD", "CUL", "CUR", "CDL", "CDR"]
};

var PATHNAMES = {
    X: 0,
    TL: 1,
    TR: 2,
    TU: 3,
    TD: 4,
    CUL: 5,
    CUR: 6,
    CDL: 7,
    CDR: 8
};


var WORLD = [
    [
        [8,4,7],
        [2,0,1],
        [6,3,5]
    ],
    [
        [2,4,5],
        [3,0,4],
        [4,4,4]
    ],
    [
        [8,5,7],
        [2,0,1],
        [1,3,6]
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
                    cube = new Cube(col, id++).init(x - 1, y - 1, z - 1, WORLD[2 - y][z][x]);

                    //if (id === 17) {
                        var peep = new Peep(col).init(cube);
                        this.addPeep(peep);
                        cube.addPeep(peep);
                    //}

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

        var self = this;
        this.peeps.forEach(function (p) {
            p.tick(self);
        });
    }

};
