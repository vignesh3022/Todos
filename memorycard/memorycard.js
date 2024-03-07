
// Add your JavaScript code here
const cardContainer = document.querySelector('.wrapper');
const refreshButton = document.getElementById('refresh-btn');
const flipSound = new Audio('../bellsound/pageturn.mp3'); // Add your sound file
const victorySound = new Audio('../bellsound/short-success.mp3'); // Replace with your victory sound file

const numRows = 6;
const numCols = 6;

let cards = [];
let cardFlipped = false;
let disableClick = false;
let firstCard, secondCard;



// Add this function for showing notifications
function showNotification(message) {
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

function createCard() {
  const card = document.createElement('div');
  card.classList.add('card');

  const front = document.createElement('div');
  front.classList.add('front');
  front.style.backgroundImage = "url('./que_icon.svg')";
  front.style.backgroundSize = 'contain';
  front.style.backgroundRepeat = 'no-repeat'; // Ensure the background image is not repeated
  front.style.backgroundPosition = 'center';
  

  const back = document.createElement('div');
  back.classList.add('back');
  const img = document.createElement('img');
  back.appendChild(img);

  card.appendChild(front);
  card.appendChild(back);

  card.addEventListener('click', flipCard);

  return card;
}

function playFlipSound() {
  flipSound.currentTime = 0;
  flipSound.play();
}

function flipCard() {
  if (disableClick) return;
  if (this === firstCard) return;

  playFlipSound();

  this.classList.add('flip');

  if (!cardFlipped) {
    cardFlipped = true;
    firstCard = this;
    return;
  }

  secondCard = this;
  checkForMatch();
}

function checkForMatch() {
  const isMatch = firstCard.querySelector('img').src === secondCard.querySelector('img').src;

  isMatch ? disableCards() : unflipCards();
}

function disableCards() {
  firstCard.removeEventListener('click', flipCard);
  secondCard.removeEventListener('click', flipCard);

  if (checkVictory()) {
    showVictoryMessage();
    playVictorySound();
  }

  resetBoard();
}

function checkVictory() {
    return cards.every(card => card.classList.contains('flip'));
  }
  
  function showVictoryMessage() {
    // Display your victory message using the showNotification function
    showNotification("Congratulations! You've won! please click on refresh");
  }
  
  function playVictorySound() {
    // Add your code to play the victory sound here
    victorySound.play();
  }
function unflipCards() {
  disableClick = true;

  setTimeout(() => {
    firstCard.classList.remove('flip');
    secondCard.classList.remove('flip');

    resetBoard();
  }, 800);
}

function resetBoard() {
  [cardFlipped, disableClick] = [false, false];
  [firstCard, secondCard] = [null, null];
}

function shuffle(array) {
    let currentIndex = array.length, randomIndex;
  
    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
  
    // Ensure the same images are not adjacent
    for (let i = 0; i < array.length - 1; i++) {
      if (array[i] === array[i + 1]) {
        [array[i], array[i + 1]] = [array[i + 1], array[i]];
        i++; // Skip the next element
      }
    }
  
    return array;
  }
  
  
document.body.classList.add('initial-load');
function createGameBoard() {
  cardContainer.innerHTML = ''; // Clear the previous cards

  const totalPairs = (numRows * numCols) / 2;
  
  const selectedImages = [
    
    "https://images.unsplash.com/photo-1504194104404-433180773017?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fGZyZWV8ZW58MHx8MHx8fDA%3D",
    "https://media.istockphoto.com/id/1439643582/photo/new-york-city-skyline-and-statue-of-liberty-at-dusk.webp?b=1&s=170667a&w=0&k=20&c=J3sQy3x92bNm5be8DGQjJ2fhj9_EWSGm_v0NW7fNcvk=",
    "https://images.unsplash.com/photo-1483921020237-2ff51e8e4b22?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fGZyZWV8ZW58MHx8MHx8fDA%3D",   
    "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%3Fid%3DOIP.Us3vornr4pB02KFIC55WZwHaFF%26pid%3DApi&f=1&ipt=7b17696531843030c622f11b38c5ad256852dc48560866471d6bafb57dc509bb&ipo=images",
    "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%3Fid%3DOIP.3MxqaJv2Z5QsG7wIXzizjAHaEo%26pid%3DApi&f=1&ipt=64d9c1a0643bdffb90fc97c85697c704cd1e2db28688a8f3c55eaf09b39f3422&ipo=images",
    "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%3Fid%3DOIP.bPBCgvp9N0SUbVYJnBg2IQHaEo%26pid%3DApi&f=1&ipt=bfe916550f7b0bbf5c85d9bd411f71ee8f318922570eb47794c92e2233b9cd8d&ipo=images",
    "https://cdn.pixabay.com/photo/2018/04/05/14/09/sunflowers-3292932_1280.jpg",
    "https://cdn.pixabay.com/photo/2017/06/04/23/17/lighthouse-2372461_1280.jpg",
    "https://cdn.pixabay.com/photo/2018/11/09/08/08/forest-3804001_1280.jpg",
    "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%3Fid%3DOIP.m4FmOjk0Bx-N4JaBzsBoTgHaEP%26pid%3DApi&f=1&ipt=45ba690599d9f76a86346ef745100fe6991823ffe6a27377d17733ffca9a8b27&ipo=images",
    "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%3Fid%3DOIP.wwxK07x0Umfnh0l-nrjxjgHaDg%26pid%3DApi&f=1&ipt=6fac90de362a65d2e3d47b9d47ec96edb5a679f5fc4b447b26963bd870866b0b&ipo=images",
    "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse4.mm.bing.net%2Fth%3Fid%3DOIP.y2wQKuJK8ZMxUCgqhh03_wHaD4%26pid%3DApi&f=1&ipt=0bfe8a503f2fddf4701ef5a6566a627e4af4d2d81e0c9916bd5d3429180a8bb2&ipo=images",  
    "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse4.mm.bing.net%2Fth%3Fid%3DOIP.nyFLBYjD207JNHC4hBQBAwHaE8%26pid%3DApi&f=1&ipt=d90356b86a287f2ad1c460c0fcc3a06c34a99aa62904f92f70368cd52c8970b2&ipo=images",
    "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse3.mm.bing.net%2Fth%3Fid%3DOIP.MITpGupL_zlu92PU8lACygHaE8%26pid%3DApi&f=1&ipt=fd6187850f26d19fd44c3fc5cad08b581da088e7b33b50f197901cb322f5243b&ipo=images",
    "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse3.mm.bing.net%2Fth%3Fid%3DOIP.eKE8nrMRCK3bdvd62kWJ_wHaEK%26pid%3DApi&f=1&ipt=e8ac1578dcad61ec6f8a6cb90719cb5185f5e5ee96a5b237b11d656adbc06deb&ipo=images",
    "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%3Fid%3DOIP.VyeGOidyaY2qOUtlJD55BgHaFE%26pid%3DApi&f=1&ipt=c4e3026814783d7dacd35c74b82b62fe09cf5e4b5dd477fce266be5802764525&ipo=images",
    "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%3Fid%3DOIP.DpcLyyRCeTWoiiMNdCTXxQHaEK%26pid%3DApi&f=1&ipt=b18f1dd11eb3185a1b7f9d3f862bf2bcc6f3aecd90732a2a1a7c6084afc911f7&ipo=images",
    "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse3.mm.bing.net%2Fth%3Fid%3DOIP.cKTq4enAGO_Wg_Omp0ysngAAAA%26pid%3DApi&f=1&ipt=b5ba5664e6795dff309f0ff0806bc91f00e4606dfc14f3c93d491b8af437ed3a&ipo=images",
    "https://plus.unsplash.com/premium_photo-1680582107403-04dfac02efc3?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8Y2l0eXxlbnwwfHwwfHx8MA%3D%3D",
    "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8Y2l0eXxlbnwwfHwwfHx8MA%3D%3D",
    "https://images.unsplash.com/photo-1444723121867-7a241cacace9?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGNpdHl8ZW58MHx8MHx8fDA%3D",
    "https://media.istockphoto.com/id/940940584/photo/the-indian-flag-flying-high-on-top-of-a-pole.jpg?s=612x612&w=0&k=20&c=_FpT0t60egHsZ3yDVh9M-dvBxmH5Yedhl8sSN9FrCaA=",
    "https://media.istockphoto.com/id/520840182/photo/red-fort-lal-qila-with-indian-flag-delhi-india.jpg?s=612x612&w=0&k=20&c=pOIkOX7dnJh2zwJhF9HrknY7kwYZtDgOd1n98wkHCKQ=",
    "https://media.istockphoto.com/id/1221548744/photo/a-woman-with-white-hat-walks-down-a-tropical-paradise-beach-with-palm-trees-and-turquoise-sea.jpg?s=612x612&w=0&k=20&c=-zcKEcBYzkLZqgE9ZuXXFbiXogpNL96KxyDwXq5Px-I=",
    "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse3.mm.bing.net%2Fth%3Fid%3DOIP.dsdW3espvkGZ4jBXQuXHXAHaE8%26pid%3DApi&f=1&ipt=3af2870d7e754674cd1984ece46e58656c5c192e151a42bb5e746756794b3dfc&ipo=images",
    "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse3.mm.bing.net%2Fth%3Fid%3DOIP.DTOQsKz0n7H9WORkibQrAgHaEo%26pid%3DApi&f=1&ipt=bba5632f00af6e14c206ca4c24b569c19de7464ab91c112630c520d89625f55a&ipo=images",
    "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.explicit.bing.net%2Fth%3Fid%3DOIP.bIR8QaFJi2LwY94YmyJKMwHaEo%26pid%3DApi&f=1&ipt=92680b99c6a69c98c4b0f490cae1da04086e2ac03527d1866a64d3f0bce560a5&ipo=images",
    "https://cdn.pixabay.com/photo/2017/12/28/16/18/bicycle-3045580_1280.jpg",
    "https://plus.unsplash.com/premium_photo-1675804669850-a1c3b87589d5?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8aGQlMjBwaG90b3N8ZW58MHx8MHx8fDA%3D",
    "https://plus.unsplash.com/premium_photo-1676009547155-32d75ba9d089?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fGhkJTIwcGhvdG9zfGVufDB8fDB8fHww",
    "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Y2l0eXxlbnwwfHwwfHx8MA%3D%3D",
    "https://cdn.pixabay.com/photo/2016/01/19/19/26/amsterdam-1150319_1280.jpg",
    "https://img.freepik.com/free-photo/view-wild-lion-nature_23-2150460851.jpg",
    "https://c4.wallpaperflare.com/wallpaper/982/652/971/bird-parrot-tropical-wallpaper-preview.jpg",   
    "https://c4.wallpaperflare.com/wallpaper/906/546/478/cute-256x1600-dekstop-wallpaper-preview.jpg",
    "https://w0.peakpx.com/wallpaper/926/770/HD-wallpaper-giraffe-giraffe-animals.jpg",
    "https://wallpapercave.com/wp/wp6961946.jpg",
    "https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxleHBsb3JlLWZlZWR8Mnx8fGVufDB8fHx8fA%3D%3D",
    "https://images.hindustantimes.com/rf/image_size_960x540/HT/p2/2018/01/05/Pictures/_cc192352-f232-11e7-a734-adae4971e2ad.jpg",
    "https://media.istockphoto.com/id/1214446442/photo/island-small-island-in-ocean-3d-render.jpg?s=612x612&w=0&k=20&c=DwuEr7ok2tUYS3H7A81GqyoS26giHBt21CsEj_Eks5k=",
];


  let imagePairs = [];
  for (let i = 0; i < totalPairs; i++) {
    const randomIndex = Math.floor(Math.random() * selectedImages.length);
    const selectedImage = selectedImages.splice(randomIndex, 1)[0];
    imagePairs.push(selectedImage, selectedImage);
  }

  const shuffledPairs = shuffle(imagePairs);

  for (let row = 0; row < numRows; row++) {
    for (let col = 0; col < numCols; col++) {
      const index = row * numCols + col;
      const imageUrl = shuffledPairs[index];
      const card = createCard();
      card.remove('shuffle');
      card.querySelector('img').src = imageUrl;
      cards.push(card);
    }
  }
  
  cards.forEach(card => cardContainer.appendChild(card));
}
createGameBoard();

 
  
function handleRefreshClick() {
    disableClick = false;
    
    // Shuffle the cards with a random delay for each
    cards.forEach((card, index) => {
      const randomDelay = Math.random() * 500; // Adjust the maximum delay as needed
      card.style.transition = `transform 0.5s ease ${randomDelay}ms`;
      card.style.transform = 'rotateY(180deg)';
      card.classList.add('blink');
      
    });
  
    // After a short delay, remove the rotation to stop the animation and refresh the game
    setTimeout(() => {
        document.body.classList.remove('initial-load');  
        cards.forEach((card) => {
        card.style.transition = '';
        card.style.transform = 'rotateY(0deg)';
        card.classList.remove('blink');
      });
      cards = []; // Reset the cards array
      cardContainer.innerHTML = ''; // Clear the card container
      createGameBoard();
    }, 1000); // Adjust the delay (in milliseconds) as needed
  }
  

refreshButton.addEventListener('click', handleRefreshClick);




  
