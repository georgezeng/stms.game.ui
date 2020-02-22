// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html
var common = require("common");

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
		flipCard: {
			default: null,
			type: cc.Sprite
		},
    },

    // LIFE-CYCLE CALLBACKS:
	
    onLoad () {
		this.node.on(cc.Node.EventType.TOUCH_MOVE, this.move, this);
	},

    move ( target ) {
		let delta = target.getDelta();
		this.node.y += delta.y;
		if (this.flipCard.node.y - this.node.y > 100) {
			common.setParameter('flipped', 'true');
			this.node.y = this.flipCard.node.y;
			this.node.active = false;
			this.flipCard.node.active = false;
		}
	},

    start () {
		
    },

    update (dt) {
		
	},
});
