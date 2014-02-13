var speakInput;
var wordList;
var voiceSel;

$(document).ready(function(){
	speakInput = $("#inpSpeakMe");
	wordList = $("#wordList");
	voiceSel = $("#voiceSel");
	rateInput = $("#rate");
	chrome.tts.getVoices(
		function(voices) {
			var voiceHtml = "";
			for (var i = 0; i < voices.length; i++) {
				voiceHtml += "<option value='" + voices[i].voiceName + "'>" + voices[i].voiceName + "</option>";
			}
			$("#voiceSel").html(voiceHtml);
		});
	$("#rate").change(function(){
		var rate = $(this).val();
		$(this).prev().text("Voice Rate: " + rate);
	}).trigger("change");
	speakInput.change(function(){
		var words = $(this).val().split("");
		var html = $.map(words,function(w){
			return("<span>" + w + "</span>");
		}).join("");
		wordList.html(html);
	}).trigger("change");
	$("#btnSpeak").click(function(){
		var toSay = speakInput.val();
		var voiceN = voiceSel.val();
		var rateV = parseFloat(rateInput.val());

		chrome.tts.speak(
			toSay,
			{
				rate: rateV,
				voiceName: voiceN,
				// gender: "female",
				requiredEventTypes: ["word"],
				onEvent: function(event) {
					if (event.type == "word") {
						var start = event.charIndex;
						wordList.find("span").removeClass("text-danger");
						var inWord = true;
						while (inWord) {
							$($("span")[start++]).addClass("text-danger");
							if (($("span")[start] === undefined) || ($($("span")[start]).text() == " ")) {
								inWord = false;
							}
						}
					} else if (event.type == "end") {
						wordList.find("span").removeClass("text-danger");
					}
				}
			},function(){
			});
	})
});
