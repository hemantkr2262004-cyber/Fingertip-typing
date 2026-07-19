// HTML Elements selection (Aapke HTML IDs ke mutabik)
const paragraph = document.getElementById("paragraph");
const inputField = document.getElementById("inputField");
const timerTag = document.getElementById("timer");
const wpmTag = document.getElementById("wpm");
const accuracyTag = document.getElementById("accuracy");
const mistakeTag = document.getElementById("mistakes");
const restartBtn = document.getElementById("restartBtn");
const timeButtons = document.querySelectorAll(".time-btn");

// Application variables
let timer = null;
let maxTime = 120;
let timeLeft = maxTime;
let charIndex = 0;
let mistakes = 0;
let isTyping = false;

// Agar paragraphs.js kisi wajah se load na ho, toh ye backup text kaam karega
const paragraphList = typeof paragraphs !== 'undefined' ? paragraphs : [
    "Learning by building projects is the fastest way to improve."
];

// 1. Random Paragraph Load karne ka function
function loadParagraph() {
    const random = paragraphList[Math.floor(Math.random() * paragraphList.length)];
    paragraph.innerHTML = "";

    // Har character ko alag span tag me convert karna
    random.split("").forEach((ch, index) => {
        const span = document.createElement("span");
        span.innerText = ch;
        if (index === 0) {
            span.classList.add("active"); // Pehle letter ko highlight kiya
        }
        paragraph.appendChild(span);
    });

    // Saare settings ko reset karna new test ke liye
    clearInterval(timer);
    timeLeft = maxTime;
    charIndex = 0;
    mistakes = 0;
    isTyping = false;
    
    inputField.value = "";
    timerTag.innerText = timeLeft;
    wpmTag.innerText = "0";
    accuracyTag.innerText = "100%";
    mistakeTag.innerText = "0";
}

// 2. Timer Countdown aur live WPM calculate karne ka function
function initTimer() {
    if (timeLeft > 0) {
        timeLeft--;
        timerTag.innerText = timeLeft;
        
        // Live WPM Logic
        let wpm = Math.round((((charIndex - mistakes) / 5) / (maxTime - timeLeft)) * 60);
        wpm = wpm < 0 || !wpm || wpm === Infinity ? 0 : wpm;
        wpmTag.innerText = wpm;
    } else {
        clearInterval(timer);
        inputField.value = ""; // Time khatam toh maze band
    }
}

// 3. Typing Validation Logic
function initTyping() {
    const spans = paragraph.querySelectorAll("span");
    const typedChar = inputField.value.split("")[charIndex];

    if (charIndex < spans.length && timeLeft > 0) {
        // Pehla character press hote hi countdown shuru hoga
        if (!isTyping) {
            timer = setInterval(initTimer, 1000);
            isTyping = true;
        }

        // Backspace functionality handle karne ke liye
        if (typedChar == null) {
            if (charIndex > 0) {
                charIndex--;
                if (spans[charIndex].classList.contains("incorrect")) {
                    mistakes--;
                }
                spans[charIndex].classList.remove("correct", "incorrect");
            }
        } else {
            // Agar type kiya hua letter screen wale letter se match kare
            if (spans[charIndex].innerText === typedChar) {
                spans[charIndex].classList.add("correct");
            } else {
                mistakes++;
                spans[charIndex].classList.add("incorrect");
            }
            charIndex++;
        }

        // Active indicator dot/highlight ko aage badhana
        spans.forEach(span => span.classList.remove("active"));
        if (spans[charIndex]) {
            spans[charIndex].classList.add("active");
        }

        // Scoreboard tags update karna
        mistakeTag.innerText = mistakes;
        let accuracy = charIndex > 0 ? Math.round(((charIndex - mistakes) / charIndex) * 100) : 100;
        accuracyTag.innerText = (accuracy < 0 ? 0 : accuracy) + "%";
    }
}

// 4. Time selection options (15s, 30s, 60s, 120s) ke event listeners
timeButtons.forEach(button => {
    button.addEventListener("click", () => {
        timeButtons.forEach(btn => btn.classList.remove("active"));
        button.classList.add("active");
        maxTime = parseInt(button.getAttribute("data-time"));
        loadParagraph();
    });
});

// App initialization aur click events
loadParagraph();
inputField.addEventListener("input", initTyping);
restartBtn.addEventListener("click", loadParagraph);

// Taki user screen par kahin bhi ho, seedhe type karna shuru kar sake
document.addEventListener("keydown", () => inputField.focus());
paragraph.addEventListener("click", () => inputField.focus());