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
		editAreaForJoin: {
			default: null,
			type: cc.Node
		},
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
    	cc.director.setClearColor(cc.color(4, 148, 44, 1));
		// common.setParameter("serverEndPoint", "http://localhost:8081/");
		common.setParameter('autoStart', 'false');
		common.setParameter('flipped', 'false');
		common.setParameter("serverEndPoint", "/");
    },

    start () {
		this.editAreaForJoin.active = false;
    },

    // update (dt) {},
});
