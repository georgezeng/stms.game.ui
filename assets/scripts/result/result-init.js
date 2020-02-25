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
var wsClient = require("websocket");
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
		serverUrl: null,
		isHost: null,
		nickname: null,
		roomNumber: null,
		content: {
			default: null,
			type: cc.Node
		}
    },

    // LIFE-CYCLE CALLBACKS:
	
    onLoad () {
		let _this = this;
		this.isHost = common.getValue("isHost");
		this.serverUrl = common.getValue("serverEndPoint");
		this.nickname = common.getValue("nickname");
		this.roomNumber = common.getValue("roomNumber");
		cc.director.setClearColor(cc.color(4, 148, 44, 255));
		wsClient.disconnect();
		$.get(this.serverUrl + "getRoomInfo/" + this.roomNumber, function( data ) {
			let room = data.data
			for (let i in room.players) {
				let player = room.players[i];
				let nicknameNode = new cc.Node();
				let label = nicknameNode.addComponent(cc.Label);
				label.string = player.nickname + ': ' + player.amount;
				label.fontSize = 20;
				nicknameNode.x = -400;
				nicknameNode.y = -25 - parseInt(i/2) * 60;
				if (i % 2 == 1) {
					nicknameNode.x = 0;
				}
				nicknameNode.parent = _this.content;
			}
		});
	},

    start () {
		
    },

    update (dt) {
		
	},
});
