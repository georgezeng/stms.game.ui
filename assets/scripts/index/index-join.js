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
		roomNumber: {
			default: null,
			type: cc.EditBox
		},
		username: {
			default: null,
			type: cc.EditBox
		}
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
		let _this = this;
		this.node.on('click', function ( event ) {
			if (!_this.checkEdit(_this.roomNumber, "房间号")) {
				return
			}
			if (!_this.checkEdit(_this.username, "用户昵称")) {
				return
			}
			let roomNumber = _this.roomNumber.string.trim();
			let nickname = _this.username.string.trim();
			let serverUrl = common.getValue("serverEndPoint") + "joinRoom/" + roomNumber + "/" + nickname;
			$.get(serverUrl, 
				function (data) {
					if (data.code == 0) {
						common.setParameter("isHost", "false");
						common.setParameter("nickname", nickname);
						common.setParameter("roomNumber", roomNumber);
						cc.director.loadScene("play");
					} else {
						alert(data.msgs[0]);
					}
				}
			);
		});
	},
	
	checkEdit(obj, msg) {
		let value = obj.string.trim();
		if (value == "") {
			window.alert(msg + "不能为空");
			return false;
		} 
		return true
	},

    start () {
    },

    // update (dt) {},
});
