var geom = {

    vec3: function (x, y, z) {
        return new THREE.Vector3(x || 0, y || 0, z || 0);
    },

    col: function (c) {
        return new THREE.Color(c);
    },

    colHSL: function (h, s, l) {
        var col = new THREE.Color();
        col.setHSL(h, s, l);
        return col;
    },

    container: function (pos) {
        var obj = new THREE.Object3D();
        obj.position = pos;
        return obj;
    },

    basicCube: function (color) {
        return new THREE.Mesh(
            new THREE.CubeGeometry(1, 1, 1),
            new THREE.MeshBasicMaterial({
                transparent: true,
                color: color,
                wireframe: true,
                opacity: 0.1
            })
        );
    },

    basicPlane: function (color) {
        return new THREE.Mesh(
            new THREE.PlaneGeometry(1, 1),
            new THREE.MeshBasicMaterial({color: color})
        );
    },

    peep: function (peep) {
        return new THREE.Mesh(
            new THREE.CubeGeometry(peep.w, peep.h, peep.w),
            new THREE.MeshLambertMaterial({color: peep.col})
        );
    },

    cube: function () {},
    plane: function () {}

}