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
		playerNodes: {
			default: null,
			type: cc.Node
		},
		startBtn: {
			default: null,
			type: cc.Button
		},
		exitTxt: {
			default: null,
			type: cc.Label
		},
		isHost: null,
		serverUrl: null,
		nickname: null,
		roomNumber: null,
		roomNumberTxt: {
			default: null,
			type: cc.Label
		},
		playerTemplate: {
			default: null,
			type: cc.Node
		},
		ghostCardNode: {
			default: null,
			type: cc.Node
		},
		fillBtn: {
			default: null,
			type: cc.Button
		},
		notFillBtn: {
			default: null,
			type: cc.Button
		},
		exitBtn: {
			default: null,
			type: cc.Button
		},
		room: null,
    },

    // LIFE-CYCLE CALLBACKS:
	
    onLoad () {
		let _this = this;
		this.isHost = common.getValue("isHost");
		this.serverUrl = common.getValue("serverEndPoint");
		this.nickname = common.getValue("nickname");
		this.roomNumber = common.getValue("roomNumber");
		cc.director.setClearColor(cc.color(4, 148, 44, 255))
		if(this.isHost == "false") {
			this.startBtn.target.destroy();
			this.exitTxt.string = "退出房间";
			this.roomNumberTxt.string = this.roomNumber;
		} else {
			$.get(this.serverUrl + "createRoom/" + this.nickname, function( data ) {
			  _this.roomNumber = data.data
			  _this.roomNumberTxt.string = _this.roomNumber
			  common.setParameter("roomNumber", _this.roomNumber)
			});
		}
		this.ghostCardNode.active = false;
		this.notFillBtn.interactable = false;
		this.fillBtn.interactable = false;
		let playerNodes = [];
		var clearId = setInterval(function () {
			$.get(_this.serverUrl + "getRoomInfo/" + _this.roomNumber, function( data ) {
				let room = data.data;
				let isPlaying = room.status == 'In' || room.status == 'Calculated';
				_this.ghostCardNode.active = isPlaying;
				if (isPlaying) {
					_this.exitBtn.interactable = false;
				}
				_this.fillBtn.interactable = false;
				_this.notFillBtn.interactable = false;
				if (isPlaying) {
					common.loadCardImg(_this.ghostCardNode.getComponentInChildren(cc.Sprite), room.stage.extraGhost.name);
				}
				let lockCount = 0;
				for(let i in room.players) {
					let player = room.players[i];
					if (player.status != 'Ready') {
						lockCount++;
					}
					let playerNode = playerNodes[i];
					if (!playerNode) {
						playerNode = cc.instantiate(_this.playerTemplate);
						playerNode.getComponentsInChildren(cc.Label)[0].string = player.nickname;
						playerNode.y = _this.playerTemplate.y - (parseInt(i/2) * 110);
						if (i % 2 == 1) {
							playerNode.x = _this.playerTemplate.x + 400;
						}
						playerNode.opacity = 255;
						playerNode.parent = _this.playerNodes;
						playerNodes.push(playerNode);
					}
					let labels = playerNode.getComponentsInChildren(cc.Label);
					let sprites = playerNode.getComponentsInChildren(cc.Sprite);
					if (player.status == 'Exit') {
						labels[1].string = '得分: ' + player.amount;
						labels[2].string = '已退出';
						sprites.map((sprite, index) => {
							common.loadCardImg(sprite, 'back');
						});
						continue;
					} 
					let isCurrentPlayer = player.nickname == _this.nickname;
					if (isCurrentPlayer && player.status == 'Locked' && player.times != null) {
						switch(player.times.priority) {
							case 8: {
								switch(player.times.value) {
									case 1: labels[2].string = player.points + '点'; break;
									default: labels[2].string = player.times.name + player.points;
								}
							} break;
							default: labels[2].string = player.times.name
						}
					} else {
						labels[2].string = '';
					}
					if (isCurrentPlayer && room.stage && room.stage.currentTurn == player.index) {
						if (player.status == 'Ready') {
							_this.fillBtn.interactable = true;
							_this.notFillBtn.interactable = true;
						}
					}
					sprites.map((sprite, index) => {
						let card = player.cards[index];
						if (card) {
							if (isCurrentPlayer) {
								common.loadCardImg(sprite, card.name);
							} else {
								common.loadCardImg(sprite, 'back');
							}
						} else {
							sprite.node.opacity = 0;
						}
					});
					labels[1].string = '得分: ' + player.amount;
				}
				while (room.players.length < playerNodes.length) {
					let len = playerNodes.length - 1;
					playerNodes[len].destroy();
					playerNodes.splice(len, 1);
				}
				if (lockCount == room.players.length && lockCount > 0) {
					if (_this.isHost == 'true') {
						_this.startBtn.interactable = true;
					}
					_this.exitBtn.interactable = true;
					for(let i in playerNodes) {
						let player = room.players[i];
						if (player.status == 'Locked') {
							let playerNode = playerNodes[i];
							let labels = playerNode.getComponentsInChildren(cc.Label);
							let sprites = playerNode.getComponentsInChildren(cc.Sprite);
							if (player.times != null) {
								switch(player.times.priority) {
									case 8: {
										switch(player.times.value) {
											case 1: labels[2].string = player.points + '点'; break;
											default: labels[2].string = player.times.name + player.points;
										}
									} break;
									default: labels[2].string = player.times.name
								}
							}
							sprites.map((sprite, index) => {
								let card = player.cards[index];
								if (card) {
									common.loadCardImg(sprite, card.name);
								}
							});
						}
						
					}
					let calculated = common.getValue('calculated');
					if (calculated == 'false') {
						common.setParameter('calculated', 'true');
						if (_this.isHost == 'true') {
							$.get(_this.serverUrl + "calResult/" + _this.roomNumber + "/" + _this.nickname, function(data) {
								if (data.code == 0) {
									setTimeout(function() {
										if (data.data == 'Calculated') {
											common.setParameter('autoStart', 'true');
										}
									}, 10 * 1000);
								}
							});
						}
					}
				}
				if (room.status == 'End' && _this.isHost == 'false') {
					clearInterval(common.getValue('clearId'));
					cc.director.loadScene("result");
				}
			});
		}, 1000);
		common.setParameter('clearId', clearId);
	},

    start () {
		
    },

    update (dt) {
		
	},
});
