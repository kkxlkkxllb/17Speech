var speakInput;
var wordList;

$(document).ready(function(){
	speakInput = $("#inpSpeakMe");
	wordList = $("#wordList");
	$("#btnSpeak").click(function(){
		var toSay = speakInput.val();
		var words = toSay.split(" ");
		var html = $.map(words,function(w){
			return("<span>" + w + "</span>");
		}).join(" ");
		wordList.html(html);
		chrome.tts.speak(
			toSay,
			{
				rate: 0.1,
				// requiredEventTypes: ["word"],
				onEvent: function(event) {
					console.log('Event ' + event.type + ' at position ' + event.charIndex);
					// if (event.type == "word") {
					// 	var start = event.charIndex;
					// 	console.log(start);

					// } else if (event.type == "end") {
					// 	wordList.find("span").removeClass("text-danger");
					// }
				}
			},function(){
				console.log("ss");
			});
	})
});
