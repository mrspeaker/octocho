function Peep() {
    this.x = 0;
    this.y = 0;
    this.z = 0;

    this.w = 0.05;
    this.h = 0.1;

    this.dir = 0;

    this.obj = null;
};

Peep.prototype = {
    init: function (obj) {
        this.y = -0.5 + (this.h / 2);

        this.dir = Math.random() * 360 | 0;
        this.speed = (Math.random() * 0.003) + 0.001;
        this.obj = obj;
    },

    tick: function () {
        this.x += this.speed * Math.sin(this.dir * (Math.PI / 180));
        this.z += this.speed * Math.cos(this.dir * (Math.PI / 180));

        if (this.x < -0.5 || this.x > 0.5) {
            this.x = this.x < 0 ? -0.45 : 0.45;
            this.dir = Math.random() * 360 | 0;
        }
        if (this.z < -0.5 || this.z > 0.5) {
            this.z = this.z < 0 ? -0.45 : 0.45;
            this.dir = Math.random() * 360 | 0;
        }
        this.sync();
    },

    sync: function () {
        this.obj.position.x = this.x;
        this.obj.position.y = this.y;
        this.obj.position.z = this.z;
    }
}

