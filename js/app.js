var speakInput;
var btnSpeak;
var wordList;

$(document).ready(function(){
  speakInput = $("#inpSpeakMe");
  btnSpeak = $("#btnSpeak");
  wordList = $("#wordList");
  btnSpeak.bind("click", saySomething)
    .removeAttr("disabled");
});


function saySomething(evt) {
  var toSay = speakInput.val();

  var words = toSay.split("");
  wordList.html("");
  for (var i = 0; i < words.length; i++) {
    words[i] = $("<span>").text(words[i]);
    wordList.append(words[i]);
    wordList.append("");
  }
  chrome.tts.speak(toSay, {
      rate: 0.8,
      onEvent: function(event) {
        if (event.type == "word") {
          var start = event.charIndex;
          wordList.find("span").removeClass("highlight");
          var inWord = true;
          while (inWord) {
            words[start++].addClass("highlight");
            if ((words[start] === undefined) || (words[start].text() == " ")) {
              inWord = false;
            }
          }
        } else if (event.type == "end") {
          wordList.find("span").removeClass("highlight");
        }
      }
    }, function(evt) {
    });
}
