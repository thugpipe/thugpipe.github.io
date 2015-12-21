"use strict";

//(function () {
var suits = ['diamonds', 'hearts', 'clubs', 'spades']
var deck = [];
var playerHand;
// playerHand.push(0) 
var computerHand;
// computerHand.push(0)
var dealerAcesUsed = 0;
var statusDisplay = $('.status');
var endOverlay = $('.background');
var playBtn = $('.play');
var drawBtn = $('.draw');
var stayBtn = $('.stay');
var smallBtns = $('.btn');
var playerDisplay = $('.player');
var dealerDisplay = $('.computer');
	
var deal = function(){
	deck = []
	playerHand = [0];
	computerHand = [0];
	dealerAcesUsed = 0;

	for(var i=0;i<52;i++) {
		deck.push(i);
	}
	for(var j, x, i = deck.length; i; j = Math.floor(Math.random() * i), x = deck[--i], deck[i] = deck[j], deck[j] = x);

	return;
}

var endGame = function(){
		setTimeout(function(){
		endOverlay.css('display', 'block')
	}, 1500);
}

var displayCard = function( player, tempCard){

	if ( tempCard ) {
		var tempCard = $('<div>');
		tempCard.addClass('tempCard onTop').appendTo(dealerDisplay);
		return;
	}
	if(player === computerHand && player.length > 3){

		var card = player[ $('.computer .card').length + 1 ];

	}else{

		var card = player[player.length - 1];

	}

	var cardSuit = Math.floor(card / 13);

	if(card % 13 === 11){ 

		card = "Q";

	}else if(card % 13 === 12){ 

		card = "K";

	}else if(card % 13 === 1){ 

		card = "J";

	}else if(card % 13 === 0){ 

		card = "A";

	}else{ 

		card = (card % 13) + "";};

	var tempCard = $('<div>');

	var line1 = $('<div>');

	var line2 = $('<div>');

	if(player.length > 2){

		tempCard.addClass('onTop');
	}

	tempCard.text(card);

	tempCard.addClass('card ' + suits[cardSuit]);

	line2.appendTo(line1);

	line1.appendTo(tempCard);

	if(player === playerHand){

		tempCard.appendTo(playerDisplay);

	}else{

		tempCard.appendTo(dealerDisplay);

	}

}

var drawCard = function(player){
	var card = deck.pop();
	player.push(card);
	if(card % 13 === 0){
		player[0] ++;
	}
	return;
}

var scoreHand = function(player){
	var score = 0;
	dealerAcesUsed = 0;
	player.forEach(function(crd, posi){
		if(posi > 0){
			if(crd % 13 === 11 || crd % 13 === 12 || crd %13 === 1){ 
				score += 10;
			}else if(crd % 13 === 0){ 
				score += 11;
			}else{ 
				score += crd % 13;
			};
		};
	})
	
	if(score > 21 && player[0] > 0){
		for(var i = 0; i < player[0]; i++){
			score -= 10;
			if(score <= 21){ 
				//i = player[0];
				dealerAcesUsed = i + 1;
				break;
			}
		}
	};
	
	return score;
}

var isItNatural = function(player){

	if(player[0] === 1 && player.length === 3){
		return true;
	}
	return false;
}

var playTheGame = function(){
	$('.card').remove();
	deal();
	endOverlay.css('display', 'none')
	$(".main .big_btn").hide();
	smallBtns.css("display", "inline-block");
	
	for ( var i = 0; i < 4; i++ ) {
		if ( i % 2 === 0 ){
			drawCard(playerHand);
			displayCard(playerHand)
		} else {
			drawCard(computerHand);
			displayCard(computerHand, i === 3 )
		}
	}
}

var dealerReveal = function(){
	$('.tempCard').remove();
	displayCard(computerHand);
	return;
}

var playersTurn = function(){
	drawCard(playerHand);
	displayCard(playerHand);
	if(scoreHand(playerHand) > 21){
		smallBtns.hide();
		setTimeout(function(){
			dealerReveal();
		}, 1000);
		
		statusDisplay.text('You Busted, the dealer wins.');
		endGame();
	}
}

var dealersTurn = function(){
	smallBtns.hide();
	dealerReveal();

	//computerHand = [0, 2, 3]; //for testing purposes only!

	if( ( scoreHand(computerHand) === 17 && computerHand[0] === 1 )|| scoreHand(computerHand) < 17){

		//computerHand = [2, 2, 3, 39, 13]; //for testing purposes only!
		//This conditional is to account for a dealer getting a soft 17 as is the one in the if statement above
		for(var i = 1; ( scoreHand(computerHand) === 17 && computerHand[0] > dealerAcesUsed ) || scoreHand(computerHand) < 17; i++){
			drawCard(computerHand);
			var lastCard = computerHand.length - 1;
			setTimeout(function(){
				displayCard(computerHand);
			},i * 1000)
		}
		// while(scoreHand(computerHand) < 17){
		// 	drawCard(computerHand);
		// 	displayCard(computerHand);
		// }
	};
	if(scoreHand(computerHand) > 21){

		statusDisplay.text('The dealer busted, you win!');

	}else if(scoreHand(computerHand) === scoreHand(playerHand)){

		if(scoreHand(playerHand) === 21){

			if(isItNatural(playerHand) && isItNatural(computerHand)){
				
				statusDisplay.text('Both you and the dealer drew Blackjack. This hand is a push.');

			}else if(isItNatural(playerHand)){
				
				statusDisplay.text('You won by drawing Blackjack which beats the dealers 21.');

			}else if(isItNatural(computerHand)){
				
				statusDisplay.text('The dealer won by drawing Blackjack which beats your 21.');

			}else{ 
					statusDisplay.text('Both you and the dealer drew 21. This hand is a push.');
				}
	}else{ 

		statusDisplay.text('Both you and the dealer drew ' + scoreHand(playerHand) + '. This hand is a push.');}

	}else if(scoreHand(computerHand) > scoreHand(playerHand)){
		
		statusDisplay.text('The dealer wins with ' + scoreHand(computerHand) + ' to your ' + scoreHand(playerHand) + '.' );

	}else{ 
			statusDisplay.text('You win with ' + scoreHand(playerHand) + ' to the dealers ' + scoreHand(computerHand) + '.' );
		};
endGame();
}

var eventListenrs = function(){
	playBtn.click( playTheGame );
	drawBtn.click( playersTurn );
	stayBtn.click( dealersTurn );	

}()

//})();