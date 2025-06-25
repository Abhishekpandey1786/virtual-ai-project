let btn = document.querySelector("#btn");
let content = document.querySelector("#con");
let voice = document.querySelector("#voice");

let SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition = new SpeechRecognition();
recognition.lang = "en-IN";
recognition.interimResults = false;

let waitingForFollowup = false;
let isListening = false;

function speak(text, callback) {
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = "hi-IN";
    utter.rate = 1;
    utter.pitch = 1;
    utter.volume = 1;
    utter.onend = () => {
        if (callback) callback();
    };
    window.speechSynthesis.speak(utter);
}

function wishMe() {
    let hour = new Date().getHours();
    if (hour >= 0 && hour < 12) {
        speak("गुड मॉर्निंग सर! इस दुनिया में, जो अभिषेक भइया जी ने बनाई है, आपका हार्दिक स्वागत है। बताइए, मैं आपकी क्या मदद कर सकती हूँ?");
    } else if (hour >= 12 && hour < 16) {
        speak("गुड आफ्टरनून सर! इस दुनिया में, जो अभिषेक भइया जी ने बनाई है, आपका हार्दिक स्वागत है। बताइए, मैं आपकी क्या मदद कर सकती हूँ?");
    } else {
        speak("गुड ईवनिंग सर! इस दुनिया में, जो अभिषेक भइया जी ने बनाई है, आपका हार्दिक स्वागत है। बताइए, मैं आपकी क्या मदद कर सकती हूँ?");
    }
}

btn.addEventListener("click", () => {
    wishMe();
    startListening();
});

function startListening() {
    isListening = true;
    recognition.start();
    btn.style.display = "none";
    voice.style.display = "block";
}

recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript.toLowerCase().trim();
    content.innerText = transcript;

    if (waitingForFollowup) {
        handleFollowup(transcript);
    } else {
        takeCommand(transcript);
    }
};

recognition.onend = () => {
    voice.style.display = "none";
    if (!isListening) {
        btn.style.display = "block";
    }
};

function takeCommand(message) {
    if (message.includes("hello") || message.includes("hey")) {
        speak("Hello sir, what can I help you with?", askFollowup);
    } else if (message.includes("shipra who are you")) {
        speak("मैं एक वर्चुअल असिस्टेंट हूँ, जिसे अभिषेक भइया जी ने बनाया है।", askFollowup);
    } else if (message.includes("open youtube")) {
        speak("YouTube खोल रही हूँ...", () => {
            window.open("https://www.youtube.com/", "_blank");
            askFollowup();
        });
    } else if (message.includes("open google")) {
        speak("Google खोल रही हूँ...", () => {
            window.open("https://www.google.com", "_blank");
            askFollowup();
        });
    } else if (message.includes("open instagram")) {
        speak("Instagram खोल रही हूँ...", () => {
            window.open("https://www.instagram.com", "_blank");
            askFollowup();
        });
    } else {
        speak("इसे Google पर खोज रही हूँ...", () => {
            window.open(`https://www.google.com/search?q=${encodeURIComponent(message)}`, "_blank");
            askFollowup();
        });
    }
}

function askFollowup() {
    waitingForFollowup = true;
    isListening = true;
    speak("सर, क्या मैं आपकी और मदद कर सकती हूँ?", () => {
        recognition.start();
    });
}

function handleFollowup(reply) {
    waitingForFollowup = false;
    isListening = false;

    if (reply.includes("नहीं") || reply.includes("no") || reply.includes("nahin")) {
        speak("ठीक है सर, कभी भी पुकारिए।");
        btn.style.display = "block";
    } else if (reply.includes("हाँ") || reply.includes("haan") || reply.includes("yes") || reply.includes("hmm")) {
        speak("सर, आपकी अगली कमांड क्या है?", () => {
            startListening();
        });
    } else {
        speak("ठीक है सर, समझ नहीं आया। कृपया फिर से कमांड दीजिए।", () => {
            btn.style.display = "block";
        });
    }
}
