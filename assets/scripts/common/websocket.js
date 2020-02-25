var common = require("common");
var client = {};
var stompClient = null;
var connected = false;
client.connect = function (callback) {
	let serverUrl = common.getValue("serverEndPoint");
    let socket = new SockJS(serverUrl + 'websocket');
    stompClient = Stomp.over(socket);
    stompClient.connect({}, function (frame) {
        stompClient.subscribe('/user' + serverUrl + 'topic/room', function (result) {
			let room = JSON.parse(result.body).data;
			if (room.number == common.getValue('roomNumber')) {
				callback(room);
			}
        });
		connected = true;
    });
}

client.disconnect = function () {
    if (stompClient !== null) {
        stompClient.disconnect();
		connected = false;
    }
}

client.send = function send() {
	let serverUrl = common.getValue("serverEndPoint");
	let roomNumber = common.getValue("roomNumber");
	if (connected && roomNumber != '') {
		stompClient.send(serverUrl + "ws/getRoomInfo", {}, JSON.stringify({data: roomNumber}));
	}
}

//导出为引用模块
module.exports = client;