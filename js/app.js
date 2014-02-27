var $speakInput;
var $wordList;
var $voiceSel;
var $rateInput;

$(document).ready(function(){
	$speakInput = $("#inpSpeakMe");
	$wordList = $("#wordList");
	$voiceSel = $("#voiceSel");
	$rateInput = $("#rate");

	chrome.tts.getVoices(function(voices) {
		var voiceHtml = "";
		for (var i = 0; i < voices.length; i++) {
			voiceHtml += "<option value='" + voices[i].voiceName + "'>" + voices[i].voiceName + "</option>";
		}
		$voiceSel.html(voiceHtml);
	});

	$rateInput.change(function(){
		var rate = $(this).val();
		$(this).prev().text("Voice Rate: " + rate);
	}).trigger("change");

	$("#btnSpeak").click(function(){
		var toSay = $speakInput.val();
		var voiceN = $voiceSel.val();
		var rateV = parseFloat($rateInput.val());

		var words = toSay.split("");
		$wordList.html("");
		for (var i = 0; i < words.length; i++) {
			words[i] = $("<span>").text(words[i]);
			$wordList.append(words[i]);
			$wordList.append("");
		}
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
						$wordList.find("span").removeClass("text-danger");
						var inWord = true;
						while (inWord) {
							words[start++].addClass("text-danger");
							if ((words[start] === undefined) || (words[start].text() == " ")) {
								inWord = false;
							}
						}
					} else if (event.type == "end") {
						$wordList.find("span").removeClass("text-danger");
					}
				}
			},function(){
			});
	});
});
