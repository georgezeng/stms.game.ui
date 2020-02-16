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
    },

    // LIFE-CYCLE CALLBACKS:
	
    onLoad () {
		let _this = this;
		this.node.on('click', function ( event ) {
			let isHost = common.getValue("isHost");
			let serverUrl = common.getValue("serverEndPoint")
			let nickname = common.getValue("nickname")
			let roomNumber = common.getValue("roomNumber")
			if (isHost == "false") {
				$.get(serverUrl + "exitRoom/" + roomNumber + "/" + nickname, function(data) {
					if (data.code == 0) {
						clearInterval(common.getValue('clearId'));
						cc.director.loadScene("index");
					} else {
						alert(data.msgs[0])
					}
				});
			} else {
				$.get(serverUrl + "endGame/" + roomNumber + "/" + nickname, function(data) {
					if (data.code == 0) {
						clearInterval(common.getValue('clearId'));
						cc.director.loadScene("result");
					} else {
						alert(data.msgs[0])
					}
				});
			}
		});
	},

    start () {
		
    },

    update (dt) {
		
	},
});
