function Ladder () {

};
Ladder.prototype = {

    init: function () {

        this.mesh = geom.cube(geom.vec3(0.1, 0.99, 0.1), octocho.materials.ladder);
        return this;

    }

};
