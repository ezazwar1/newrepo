angular.module('factory.general', [])
.factory('Scopes', function($rootScope) {
    var mem = {};
    return {
        store: function(key, value){
            mem[key] = value;
        },
        get: function(key){
            return mem[key];
        }
    };
})
.factory('Greetings', function() {
	var init = {
		morning: function(){
			var messages = [
				"How would you like to kickstart your awesome day?",
				"Let's help you decide your outfit for today!",
				"Is today an important day? Let's dress to kill then! ;D",
				"Morning blues? How about a bright outfit to brighten things up? :D",
				"You only get one chance to make a first impression. You've got this! ;)",
				"Need an extra dose of confidence today? Just wear red!",
				"No matter how tough times are, Get up. DRESS UP. Show up. And never give up!",
				"Feel like going simple today? You can't go wrong with black and white!",
				"Tough day ahead? If you think your day can't be better, just dress better!",
				"You don't have to be successful to dress the part... But you have to dress the part to be successful!",
				"Hey, you look vibrant this morning! Pick an outfit to match that!",
				"All else equal, the better dressed person usually gets the opportunities. ;)",
				"I know you don't just dress to impress... You dress to be the best!",
				"How would you like to get styled today?",
				"It's the best time the day! How would you like to get dressed?",
				"You are what you dress! So, what do you wanna be today? ;)",
				"New shoes too tight? Wear them with socks and blast them with a hairdryer.",
				"If someone tells you to 'Talk to the hand', you tell them 'I rather talk to a hand than talk to you!'",
				"More often than not, overdressing is better than underdressing!",
				"There's something good in every day. Enjoy yours! ;) ",
				"Tight flats or sandals giving you blisters? Rub deodorant on the soles! Less pain, less odor too!",
				"More often than not, overdressing is better than underdressing!",
				"No time to waste! Pick an outfit to start your day!",
				"To make your day and those around you happier, go for Yellow or Orange!",
				"Studies has shown that outfits with the color blue can fight stress!",
				"Hey good-lookin'. Life ain't perfect, but your outfit can be! Let's get you dressed!",
				"Need to sell an idea or command power today? Try dark green, navy, charcoal or brown outfits!",
				"Long day ahead of you? Wear something versatile!",
				"Can't wait to see what you'll pick for an outfit today!",
				"Is it time to create a new outfit folder? :)",
				"Is it time to save different types of outfits? :)",
				"Life's too short to wear boring clothes!",
				"A smile is the best looking accessory you can wear. :)"
			];

			var random = Math.floor(Math.random() * messages.length);
			if(random == messages.length) random = random - 1;
			return messages[random];
		},
		afternoon: function(){
			var messages = [
				"A new look to get pass the day perhaps?",
				"Is it an off day today? Time to dress down for town! :D",
				"Would like you a mid-day change in outfit?",
				"A sudden change in weather? You've got styles for that!",
				"Never underestimate the power of a GOOD OUTFIT on a bad day. ;)",
				"Relaxing for the rest of the day? :)",
				"Yo! Watcha up to today? :)",
				"Fashion's like eating. You don't stick with the same menu. Time for a change? ;)",
				"OOO!!! Are we gonna dress for a stress-free day today? XD",
				"Tough day so far? If it ain't getting better, just dress better!",
				"What kind of dress can't be worn? Address...",
				"Ever wondered why golfers wear two pairs of pants? In case they get a hole in one...",
				"New shoes too tight? Wear them with socks and blast them with a hairdryer.",
				"Going on a date today? Time to sweep someone off the feet!",
				"Is it time to wind down... I mean... dress down yet? :)",
				"More often than not, overdressing is better than underdressing!",
				"What are you gonna dress up for today? :)",
				"Heading for an afternoon date? Red is an obvious choice, but pink is more subtle.",
				"Making new friends today? Peach or rose colored outfits will make you look more engaging!",
				"Go for Yellow or Orange to make your day and those around you happier!",
				"Is it time to create a new outfit folder? :)",
				"Is it time to save different types of outfits? :)",
				"Life's too short to wear boring clothes!",
				"A smile is the best looking accessory you can wear. :)",
				"Studies has shown that outfits with the color blue can fight stress!",
				"Hey good-lookin'. Life ain't perfect, but your outfit can be! Let's get you dressed!",
				"Need to sell an idea or command power today? Try dark green, navy, charcoal or brown outfits!",
				"Long day ahead of you? Wear something versatile!",
				"Can't wait to see what you'll pick for an outfit today!",
				"Is it time to create a new outfit folder? :)",
				"Is it time to save different types of outfits? :)",
				"Life's too short to wear boring clothes!",
				"A smile is the best looking accessory you can wear. :)"
			];

			var random = Math.floor(Math.random() * messages.length);
			if(random == messages.length) random = random - 1;
			return messages[random];
		},
		evening: function(){
			var messages = [
				"Heading to a party? I'm sure you'll look dashing! ;)",
				"Date night? Time to sweep someone off the feet!",
				"Style: Because your personality isn't the first thing people see. :)",
				"DRESS UP and you won't need a second chance to make a first impression. :)",
				"How would you like to dress this lovely evening?",
				"Need to look dazzling this evening? I'm sure you can. ;)",
				"More often than not, overdressing is better than underdressing!",
				"Finally time to wind down... Are we heading out tonight? ;)",
				"Hey, well-dressed! Remember not to drink and drive!",
				"How would you like to get styled for tonight? ;)",
				"Trust me! You'll look amazing tonight!",
				"If someone tells you to 'Talk to the hand', you tell them 'I rather talk to a hand than talk to you!'",
				"When a group of people laugh, people will instinctively look at the person feel closest to.",
				"White wine will remove red wine stains. :) Doesn't work the other way round though.",
				"New shoes too tight? Wear them with socks and blast them with a hairdryer.",
				"Tight flats or sandals giving you blisters? Rub deodorant on the soles! Less pain, less odor too!",
				"Need some seduction power tonight? Red is an obvious choice, but pink is more subtle.",
				"Meeting new people tonight? Peach or rose colored outfits will make you look more engaging!",
				"Can't wait to see what you'll pick for an outfit tonight!",
				"An outfit should be an electric fence: serving its purpose without obstructing the view. ;)",
				"Is it time to create a new outfit folder? :)",
				"Is it time to save different types of outfits? :)",
				"Life's too short to wear boring clothes!",
				"A smile is the best looking accessory you can wear. :)"
			];

			var random = Math.floor(Math.random() * messages.length);
			if(random == messages.length) random = random - 1;
			return messages[random];
		},
		get: function(){
			var currDate = new Date();
			var eveningED1 = new Date(currDate.getFullYear(), currDate.getMonth(), currDate.getDate(), 3, 0, 0);
			var eveningED2 = new Date(currDate.getFullYear(), currDate.getMonth(), currDate.getDate(), 23, 59, 0);
			var morningED = new Date(currDate.getFullYear(), currDate.getMonth(), currDate.getDate(), 12, 0, 0);
			var afternoonED = new Date(currDate.getFullYear(), currDate.getMonth(), currDate.getDate(), 18, 0, 0);
			
			if(currDate <=  morningED && currDate > eveningED1){
				return "MR";
			}else if(currDate <=  afternoonED && currDate > morningED){
				return "AF";
			}else if(currDate <=  eveningED1 || currDate <=  eveningED2){
				return "EV";
			}else{
				return "";
			}
		}
	};

	return init;
});