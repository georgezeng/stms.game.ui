// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
		rSpeed: 100,
		xSpeed: 150,
		minRotation: -40,
		maxRotation: 40,
		endX: 0,
		startTime: 0
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
		this.node.x = -50;
		this.updateY();
    },
	
	updateY() {
		this.node.y = this.node.x * this.node.x / -100 + 100;
	},

    update (dt) {
		this.startTime += dt;
		if (this.startTime > 1) {
			if(this.node.angle * -1 < this.maxRotation) {
				this.node.angle -= this.rSpeed * dt;
				this.node.x += this.xSpeed * dt;
				this.updateY();
			} else {
				this.node.angle = -this.maxRotation
				if(this.endX > 0) {
					this.node.x = this.endX;
					this.updateY();
				}
			}
		}
	},
});
