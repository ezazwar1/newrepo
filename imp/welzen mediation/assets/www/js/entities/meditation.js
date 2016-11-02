function Meditation(){
	this.product = null;
	this.category = null;
	this.description = null; 
	this.icon = null;
	this.new_icon = null;
	this.medias = null;
	this.title = null;
	return this;
}


 
Meditation.prototype.from = function(obj) {
	this.product = obj.product ? obj.product : null;
	this.category = obj.category ? obj.category : null;
	this.title = obj.title ? obj.title : null;
	this.description = obj.description ? obj.description : null;
	this.icon = obj.icon ? obj.icon : null;
	this.new_icon = obj.new_icon ? obj.new_icon : null;
	if ( obj.medias ) {
		this.medias = [];
		for (var i = 0; i < obj.medias.length; i++) {
			var media = obj.medias[i];
			this.medias.push((new MediaWZ()).from(media));
		}
		//also ordered by media.order if need, otherwise by length
		this.medias.sort(function(a, b) {
			if(a.order !== undefined && a.order !== null && b.order !== undefined && b.order !== null){
				return a.order - b.order;
			} else if(a.length !== undefined && b.length !== undefined){
				 return a.length - b.length;
			}
			return 1;
		});
		//si es mindfulnesscoaching, lo ordeno por free primero
		if('MindfulnessCoaching'===this.product){
			this.medias.sort(function(a, b) {
				//logica media extraña, pero Free viene antes que Premium en el diccionario
				if(a.membrecy < b.membrecy) return -1;
				if(a.membrecy > b.membrecy) return 1;
				return 0;
			});
		}
	}
	return this;
};

Meditation.prototype.hasCategory = function() {
	if (this.category === null || this.category === undefined){
		return false;
	}
	return true;
};