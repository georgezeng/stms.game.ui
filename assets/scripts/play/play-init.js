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
		flipBtn: {
			default: null,
			type: cc.Button
		},
		exitBtn: {
			default: null,
			type: cc.Button
		},
		room: null,
		flipBackCard: {
			default: null,
			type: cc.Sprite
		},
		flipCard: {
			default: null,
			type: cc.Sprite
		},
		playerNodesArr: []
    },

    // LIFE-CYCLE CALLBACKS:
	
    onLoad () {
		let _this = this;
		this.isHost = common.getValue("isHost");
		this.serverUrl = common.getValue("serverEndPoint");
		this.nickname = common.getValue("nickname");
		this.roomNumber = '1'//common.getValue("roomNumber");
		cc.director.setClearColor(cc.color(4, 148, 44, 255));
		if (this.isHost == "false") {
			this.startBtn.target.destroy();
			this.exitTxt.string = "退出房间";
			this.roomNumberTxt.string = this.roomNumber;
		} else if(common.getValue('hostJoin') == 'false') {
			$.get(this.serverUrl + "createRoom/" + this.nickname, function( data ) {
			  _this.roomNumber = data.data
			  _this.roomNumberTxt.string = _this.roomNumber
			  common.setParameter("roomNumber", _this.roomNumber)
			});
		} else {
			this.roomNumberTxt.string = this.roomNumber;
		}
		this.ghostCardNode.active = false;
		this.notFillBtn.interactable = false;
		this.flipBtn.interactable = false;
		this.fillBtn.interactable = false;
		this.flipCard.node.active = false;
		this.flipBackCard.node.active = false;
		wsClient.connect(function (room) {
			// $.get(_this.serverUrl + "getRoomInfo/" + _this.roomNumber, function( data ) {
				// let room = data.data;
				let playerNodes = _this.playerNodesArr;
				if (_this.isHost == 'true' && room.status == 'In') {
					_this.startBtn.interactable = false;
				} 
				let isPlaying = room.status == 'In' || room.status == 'Calculated';
				_this.ghostCardNode.active = isPlaying;
				if (isPlaying) {
					_this.exitBtn.interactable = false;
				}
				_this.fillBtn.interactable = false;
				_this.notFillBtn.interactable = false;
				_this.flipBtn.interactable = false;
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
						playerNode.nickname = player.nickname;
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
					let isCurrentPlayer = player.nickname == _this.nickname;
					if (room.stage && room.stage.currentTurn == player.index && isPlaying) {
						sprites[0].node.opacity = 255;
					} else {
						sprites[0].node.opacity = 0;
					}
					if (isCurrentPlayer && player.status == 'Locked' && player.times != null) {
						switch(player.times.priority) {
							case 8: {
								switch(player.times.value) {
									case 1: labels[2].string = player.points + '点'; break;
									default: labels[2].string = player.times.name + player.points;
								}
							} break;
							case 2:
							case 3:
							case 6: {
								switch(player.points) {
									case 11: labels[2].string = player.times.name + 'J'; break;
									case 12: labels[2].string = player.times.name + 'Q'; break;
									case 13: labels[2].string = player.times.name + 'K'; break;
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
							_this.flipBtn.interactable = true;
						}
					}
					labels[1].string = '得分: ' + player.amount;
				}
				let newPlayerNodes = [];
				let remove = false;
				for(let i in playerNodes) {
					let playerNode = playerNodes[i];
					let found = false;
					for(let j in room.players) {
						let player = room.players[j];
						if (player.nickname == playerNode.nickname) {
							newPlayerNodes.push(playerNode);
							found = true;
							remove = true;
							break;
						} 
					}
					if (!found) {
						playerNode.destroy();
					}
				}
				_this.playerNodesArr = newPlayerNodes;
				playerNodes = newPlayerNodes;
				if (remove) {
					for(let i in playerNodes) {
						let playerNode = playerNodes[i];
						playerNode.y = _this.playerTemplate.y - (parseInt(i/2) * 110);
						if (i % 2 == 1) {
							playerNode.x = _this.playerTemplate.x + 400;
						}
					}
				}
				let lastPlayer = room.players[room.players.length - 1];
				let isCurrentPlayer = lastPlayer ? lastPlayer.nickname == _this.nickname : false;
				if (lastPlayer && (lastPlayer.cards.length == 2 || !isCurrentPlayer || isCurrentPlayer && lastPlayer.cards.length == 3 && common.getValue('flipped') == 'true') && lockCount == room.players.length && lockCount > 0) {
					_this.flipCard.node.active = false;
					_this.flipBackCard.node.active = false;
					if (_this.isHost == 'true') {
						_this.startBtn.interactable = true;
					}
					_this.exitBtn.interactable = true;
					for(let i in playerNodes) {
						let player = room.players[i];
						let playerNode = playerNodes[i];
						let labels = playerNode.getComponentsInChildren(cc.Label);
						let sprites = playerNode.getComponentsInChildren(cc.Sprite);
						sprites[0].node.opacity = 0;
						if (player.status == 'Locked') {
							if (player.times != null) {
								switch(player.times.priority) {
									case 8: {
										switch(player.times.value) {
											case 1: labels[2].string = player.points + '点'; break;
											default: labels[2].string = player.times.name + player.points;
										}
									} break;
									case 2:
									case 3:
									case 6: {
										switch(player.points) {
											case 11: labels[2].string = player.times.name + 'J'; break;
											case 12: labels[2].string = player.times.name + 'Q'; break;
											case 13: labels[2].string = player.times.name + 'K'; break;
											default: labels[2].string = player.times.name + player.points;
										}
									} break;
									default: labels[2].string = player.times.name
								}
							}
							sprites.map((sprite, index) => {
								if (index > 0) {
									sprite.node.getComponentInChildren(cc.Label).node.opacity = 0;
									let card = player.cards[index - 1];
									if (card) {
										common.loadCardImg(sprite, card.name);
										if (card.index == room.stage.extraGhost.index) {
											sprite.node.getComponentInChildren(cc.Label).node.opacity = 255;
										}
									}
								}
							});
						} else if (player.status == 'Exit') {
							labels[1].string = '得分: ' + player.amount;
							labels[2].string = '已退出';
							sprites.map((sprite, index) => {
								if (index > 0) {
									common.loadCardImg(sprite, 'back');
									sprite.node.getComponentInChildren(cc.Label).node.opacity = 0;
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
										$.get(_this.serverUrl + "getRoomInfo/" + _this.roomNumber, function( data ) {
											if (data.data.status == 'Calculated') {
												// common.setParameter('autoStart', 'true');
											}
										});
									}, 15 * 1000);
								}
							});
						}
					}
				} else {
					for(let i in playerNodes) {
						let player = room.players[i];
						let playerNode = playerNodes[i];
						let labels = playerNode.getComponentsInChildren(cc.Label);
						let sprites = playerNode.getComponentsInChildren(cc.Sprite);
						if (player.status == 'Exit') {
							labels[1].string = '得分: ' + player.amount;
							labels[2].string = '已退出';
							sprites.map((sprite, index) => {
								if (index > 0) {
									common.loadCardImg(sprite, 'back');
									sprite.node.getComponentInChildren(cc.Label).node.opacity = 0;
								}
							});
						} else {
							let isCurrentPlayer = player.nickname == _this.nickname;
							sprites.map((sprite, index) => {
								if (index > 0) {
									sprite.node.getComponentInChildren(cc.Label).node.opacity = 0;
									let card = player.cards[index - 1];
									if (card) {
										if (isCurrentPlayer) {
											if (index == 3 && common.getValue('flipped') == 'false') {
												common.loadCardImg(sprite, 'back');
												common.loadCardImg(_this.flipCard, card.name);
												_this.flipCard.node.active = true;
												_this.flipBackCard.node.active = true;
											} else {
												common.loadCardImg(sprite, card.name);
												if (card.index == room.stage.extraGhost.index) {
													sprite.node.getComponentInChildren(cc.Label).node.opacity = 255;
												}
											}
										} else {
											common.loadCardImg(sprite, 'back');
										}
									} else {
										sprite.node.opacity = 0;
									}
								}
							});
						}
					}
				}
				if (room.status == 'End' && _this.isHost == 'false') {
					clearInterval(common.getValue('clearId'));
					cc.director.loadScene("result");
				}
			// });
		});
		var clearId = setInterval(function() {
			// if (_this.isHost == 'true') {
				wsClient.send();
			// }
		}, 1000);
		// common.setParameter('clearId', clearId);
	},

    start () {
		
    },

    update (dt) {
		
	},
});
