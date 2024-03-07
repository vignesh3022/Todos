const wordText = document.querySelector(".word"),
hintText = document.querySelector(".hint span"),
timeText = document.querySelector(".time b"),
inputField = document.querySelector("input"),
nextbtn = document.querySelector(".next-word"),
checkBtn = document.querySelector(".check-word");

let correctWord, timer;

let beep = new Audio('../bellsound/beep.mp3');
let notificationShown = false; // Add this global variable

function showNotification(message) {
    if (!notificationShown) { // Only show notification if it hasn't been shown before
        // Create a new notification container
        const notificationContainer = document.createElement("div");
        notificationContainer.classList.add("notification-container");
        document.body.appendChild(notificationContainer);

        // Set the content for the notification
        notificationContainer.textContent = message;

        // Slide in from the top and fade in simultaneously
        anime({
            targets: notificationContainer,
            top: 10,
            opacity: 1,
            duration: 800,
            easing: 'easeOutQuart'
        });

        setTimeout(() => {
            hideNotification(notificationContainer);
        }, 2000);

        notificationShown = true; // Set the flag to true after showing the notification
    }
}

// Add this function for hiding notifications
function hideNotification(container) {
    // Slide out to the top and fade out simultaneously
    anime({
        targets: container,
        top: -50,
        opacity: 0,
        duration: 800,
        easing: 'easeInQuart',
        complete: () => {
            container.style.display = "none";
            document.body.removeChild(container); // Remove the container from the DOM
        }
    });
}



const initTimer = maxTime => {
    clearInterval(timer);
    timer = setInterval(() => {
        if(maxTime > 0) {
            maxTime--;
            return timeText.innerText = maxTime;
        }
        showNotification(`Time off! ${correctWord.toUpperCase()} was the correct word`);

    }, 1000);
}


const usedWords = []; // Add this global variable to track used words

const initGame = () => {
    initTimer(31);
    notificationShown = false;
    // Filter out words that have already been used
    const availableWords = words.filter(wordObj => !usedWords.includes(wordObj.word));
    
    if (availableWords.length === 0) {
        // All words have been used, reset the usedWords array
        usedWords.length = 0;
        // You can optionally shuffle the words array to introduce randomness
        shuffle(words);
    }

    let randomObj = availableWords[Math.floor(Math.random() * availableWords.length)];
    usedWords.push(randomObj.word); // Add the selected word to the usedWords array

    let wordArray = randomObj.word.split("");
    for (let i = wordArray.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [wordArray[i], wordArray[j]] = [wordArray[j], wordArray[i]];
    }
    wordText.innerText = wordArray.join("");
    hintText.innerText = randomObj.hint;
    correctWord = randomObj.word.toLowerCase();;
    inputField.value = "";
    inputField.setAttribute("maxlength", correctWord.length);
}

// Helper function to shuffle an array
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}


initGame();

const checkWord = () => {
    let userWord = inputField.value.toLowerCase();
    if(!userWord) return alert("Please enter the word to check!");
    if(userWord !== correctWord) return alert(`Oops! ${userWord} is not a correct word`);
    beep.play();
    showNotification(`Congrats! ${correctWord.toUpperCase()} is the correct word`)
    clearInterval(timer);
    notificationShown = false;
}

nextbtn.addEventListener("click", initGame);
checkBtn.addEventListener("click", checkWord);

inputField.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        checkWord();
    }
});


