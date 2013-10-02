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
                opacity: 0.2
            })
        );
    },

    basicPlane: function (color, mat) {
        return new THREE.Mesh(
            new THREE.PlaneGeometry(1, 1),
            new THREE.MeshBasicMaterial({
                transparent: true,
                //color: color,
                side: THREE.DoubleSide,
                map: octocho.materials[mat]
            })
        );
    },

    basicCube2: function (color, mat) {
        /*var shader = THREE.ShaderLib["normalmap"];
        var uniforms = THREE.UniformsUtils.clone( shader.uniforms );

        uniforms[ "enableAO" ].value = true;
        uniforms[ "enableDiffuse" ].value = false;
        uniforms[ "enableSpecular" ].value = false;
        uniforms[ "enableReflection" ].value = true;
        uniforms[ "enableDisplacement" ].value = true;

        uniforms[ "tNormal" ].value = THREE.ImageUtils.loadTexture("res/path-1-nm.png");
        uniforms[ "uNormalScale" ].value.y = -1;

        uniforms[ "uDiffuseColor" ].value.setHex(0x331100);
        uniforms[ "uSpecularColor" ].value.setHex(0xffffff);
        uniforms[ "uAmbientColor" ].value.setHex(0x050505);

        uniforms[ "uShininess" ].value = 10;

        //uniforms[ "tCube" ].value = reflectionCube;
        uniforms[ "uReflectivity" ].value = 0.1;

        uniforms[ "uDiffuseColor" ].value.convertGammaToLinear();
        uniforms[ "uSpecularColor" ].value.convertGammaToLinear();
        uniforms[ "uAmbientColor" ].value.convertGammaToLinear();
        //this.materials.normalMap = uniforms[ "tNormal" ].value;
        //normalMap: uniforms[ "tNormal" ].value
        */
        return new THREE.Mesh(
            new THREE.CubeGeometry(1, 0.1, 1, 1, 1, 1),
            new THREE.MeshFaceMaterial(mat)
        );
    },

    peep: function (peep) {
        return new THREE.Mesh(
            new THREE.CubeGeometry(peep.w, peep.h, peep.w),
            new THREE.MeshLambertMaterial({color: peep.col})
        );
    },

    cube: function (dims, material) {

        return new THREE.Mesh(
            new THREE.CubeGeometry(dims.x, dims.y, dims.z),
            new THREE.MeshPhongMaterial({
                transparent: true,
                map: material

            })
        );
    },
    plane: function () {}

}