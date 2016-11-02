

	function MediaWZ(){
		this.media_id = null;
		this.id = null;
		this.type = null;
		this.url = null;
		this.length = null;
		this.membrecy = null;
		this.title = null;
		this.description = null;
		this.realLength = null;
		this.order = null;
		this.meditationid = null;
		this.product = null;
		this.product_title = null;
		this.seriesImage = null;
		this.seriesIcon = '';
		this.locked = true;
		this.coachingListened = false;
		this.hasSound = false;

		return this;
	}

	var KEY_COACHING = 'coaching';


	MediaWZ.prototype.isPremium = function(){
		if (this.membrecy === "Free"){
			return false;
		}
		return true;
	};

	MediaWZ.prototype.isVideo = function(){
		if (this.type === "Audio"){
			return false;
		}
		return true;
	};

	 
	MediaWZ.prototype.from = function(obj) {
		this.id = obj._id ? obj._id : null;
		this.media_id = obj.media_id ? obj.media_id : null;
		this.type = obj.type ? obj.type : null;
		this.url = this.normalizeUrl(obj.url);
		this.length = obj.length ? obj.length : null;
		this.membrecy = obj.membrecy ? obj.membrecy : null;
		this.title = obj.title ? obj.title : null;
		this.description = obj.description ? obj.description : null;
		this.realLength = obj.real_length ? obj.real_length : null;
		this.product = obj.product ? obj.product : null;
		this.product_title = obj.product_title ? obj.product_title : null;
		this.order = (obj.order !== undefined) ? obj.order : null;
		this.hasSound = (obj.hasSound !== undefined && obj.hasSound === "true") ? true : false;
		this.meditationid = obj.meditationid ? obj.meditationid : null;
		if(this.order !== undefined){
			this.updateSeries();
		}
		if(this.product === 'MindfulnessCoaching'){
			this.markListened();
		}
		return this;
	};

	MediaWZ.prototype.normalizeUrl = function(url){
		var newUrl = null;
		if(url && url.startsWith('/')){
			var path = window.location.pathname;
	    	path = path.substr( path, path.length - 11 );	
	    	//if android add path if iOS direct the url
	    	if(path.indexOf('android') > -1){
	    		// android
	    		newUrl = path + url;
	    	}else{
	    		//iOS
	    		newUrl = url;
	    	}
		}else if(url){
			newUrl = url;
		}
		return newUrl;
	};

	MediaWZ.prototype.getSeriesImage = function(){
		return this.seriesImage;
	};

	MediaWZ.prototype.markListened = function(){
		this.getCoachingListenedList().then(function(coachingList){
			this.coachingListened = coachingList[this.media_id] === true;
		}.bind(this));
	};

	MediaWZ.prototype.updateSeries = function(){
		if(this.order === 0){
			this.seriesImage = 'img/ico-play-btn-med.png';
			this.locked = false;
			return;
		}

		var tmp_seriesImage = 'img/day' + this.order;
		this.getCurrentSeriesUnlocked().then(function(seriesInfo) {
			if(seriesInfo.current == this.order){
				this.seriesImage = tmp_seriesImage + '-next.png';
				this.locked = false;
				if(seriesInfo.started){
					this.seriesIcon = 'incomplete';
				}
			}else if(this.order < seriesInfo.current){
				this.seriesImage = tmp_seriesImage + '-ready.png';
				this.seriesIcon = 'checked';
				this.locked = false;
			}else{
				this.seriesImage = tmp_seriesImage + '-unav.png';
			}
		}.bind(this));
	};

	MediaWZ.prototype.getCurrentSeriesUnlocked = function(){
		var q = new Promise(function(resolve, reject) {
			localforage.getItem(this.meditationid.toString()).then(function(seriesInfo) {
				if(seriesInfo) {
					resolve(seriesInfo);
				}else{
					resolve({current:1, started: false});
				}
			});	
		}.bind(this));
		return q;
	};

	MediaWZ.prototype.getCoachingListenedList = function(){
		var q = new Promise(function(resolve, reject) {
			localforage.getItem(KEY_COACHING).then(function(coachingList) {
				if(coachingList) {
					resolve(coachingList);
				}else{
					resolve([]);
				}
			});	
		}.bind(this));
		return q;
	};

	MediaWZ.prototype.startedSeries = function(){
		this.getCurrentSeriesUnlocked().then(function(seriesInfo) {

			//tengo q validar que sea el actual, si es viejo no hago nada
			if(seriesInfo.current == this.order){
				seriesInfo.started = true;
				localforage.setItem(this.meditationid.toString(), seriesInfo).then(function(value) {
					console.log('serie updated ok!');
				}, function(error) {
					console.error('serie updated error: ' + JSON.stringify(error));
				});		
			}

		}.bind(this));
	};

	MediaWZ.prototype.finishSeries = function(){
		var q = new Promise(function(resolve, reject) {
			if(this.order){
				//son de los de 5 days o series
				this.getCurrentSeriesUnlocked().then(function(seriesInfo) {
					//tengo q validar que sea el actual, si es viejo no hago nada
					if(seriesInfo.current == this.order){
						seriesInfo.started = false;
						seriesInfo.current += 1;
						localforage.setItem(this.meditationid.toString(), seriesInfo).then(function(value) {
							console.log('serie finish updated ok!');
							resolve();
						}, function(error) {
							console.error('serie updated error: ' + JSON.stringify(error));
							resolve();
						});		
					}
				}.bind(this));				
			}else if(this.product === 'MindfulnessCoaching'){
				this.getCoachingListenedList().then(function(coachingList) {
					coachingList[this.media_id] = true;
					this.coachingListened = true;
					localforage.setItem(KEY_COACHING, coachingList).then(function(value) {
						console.log('coaching updated ok!');
						resolve();
					}, function(error) {
						console.error('coaching updated error: ' + JSON.stringify(error));
						resolve();
					});		
				}.bind(this));
			}else{
				resolve();	
			}
		}.bind(this));
		return q;
	};
