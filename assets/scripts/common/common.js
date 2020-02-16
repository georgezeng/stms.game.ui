var common = {
    getValue: function (key) {
        let value = cc.sys.localStorage.getItem(key);
		return value;
    },
	
	setParameter: function(key, value) {
		cc.sys.localStorage.setItem(key, value);
	},
	
	loadCardImg(sprite, cardName) {
		cc.loader.loadRes(cardName, cc.SpriteFrame, function(err, spriteFrame) {
			sprite.spriteFrame = spriteFrame;
			sprite.node.opacity = 255;
		}); 
	}
};
 
//导出为引用模块
module.exports = common;