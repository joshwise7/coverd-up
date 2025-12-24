const gameState = {
    currAlbum: null,
    guessesLeft: 5,
    pixelation: 5,

    albums: [
        {
            title: "Precipice",
            artist: "Indigo De Souza",
            cover: "https://m.media-amazon.com/images/I/814BCebY0cL.jpg",
            guesses: 0,
        },
        {
            title: "The Secret To Life",
            artist: "FIZZ",
            cover: "https://m.media-amazon.com/images/I/81Qg71I8pAL.jpg",
            guesses: 0,
        },
        {
            title: "Tetsuo & Youth",
            artist: "Lupe Fiasco",
            cover: "https://m.media-amazon.com/images/I/715Maq5-8tL.jpg",
            guesses: 0,
        },
        {
            title: "How Big, How Blue, How Beautiful",
            artist: "Florence + The Machine",
            cover: "https://m.media-amazon.com/images/I/71Pue1RopYL.jpg",
            guesses: 0,
        },
        {
            title: "The Race for Space",
            artist: "Public Service Broadcasting",
            cover: "https://m.media-amazon.com/images/I/81VhrQ9cx9L.jpg",
            guesses: 0,
        },
        {
            title: "five seconds flat",
            artist: "Lizzy McAlpine",
            cover: "https://m.media-amazon.com/images/I/51bISG3XAeL.jpg",
            guesses: 0,
        }
    ]
};

const elements = {
    albumCover: document.getElementById("albumCover"),
    guessInput: document.getElementById("searchInput"),
    submitGuess: document.getElementById("searchButton"),
    guessCount: document.getElementById("guess-count"),
    message: document.getElementById("message"),
    spinner: document.getElementById("spinner")
};

function getRandomAlbum(albums) {
    const randomIndex = Math.floor(Math.random() * albums.length);
    return albums[randomIndex];
}

function updateUI() {
    elements.guessCount.textContent = `Guesses Left: ${gameState.guessesLeft}`;
}

function applyPixelation() {
    if (gameState.pixelation <= 1) {
        elements.albumCover.src = gameState.currAlbum.cover;
        return;
    }

    const img = elements.albumCover;
    const tempImg = new Image();
    tempImg.crossOrigin = "Anonymous";
    tempImg.src = gameState.currAlbum.cover;
    
    tempImg.onload = function() {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.width = tempImg.naturalWidth;
        canvas.height = tempImg.naturalHeight;
        
        const blockSize = gameState.pixelation * 3;
        const smallWidth = Math.max(1, Math.floor(canvas.width / blockSize));
        const smallHeight = Math.max(1, Math.floor(canvas.height / blockSize));
        
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(tempImg, 0, 0, smallWidth, smallHeight);
        ctx.drawImage(canvas, 0, 0, smallWidth, smallHeight, 0, 0, canvas.width, canvas.height);
        
        img.src = canvas.toDataURL();
    };
}



function checkGuess() {
    const userGuess = elements.guessInput.value.trim().toLowerCase();
    if (!userGuess) return;
    
    const isCorrect = gameState.currAlbum.title.toLowerCase() === userGuess;
    
    if (isCorrect) {
        elements.albumCover.src = gameState.currAlbum.cover;
        elements.message.textContent = `Correct! The album is "${gameState.currAlbum.title}" by ${gameState.currAlbum.artist}.`;
        elements.submitGuess.disabled = true;
    } else {
        gameState.guessesLeft--;
        gameState.pixelation = Math.max(1, gameState.pixelation - 1);
        
        if (gameState.guessesLeft <= 0) {
            elements.albumCover.src = gameState.currAlbum.cover;
            elements.message.textContent = `Game Over! The album was "${gameState.currAlbum.title}" by ${gameState.currAlbum.artist}.`;
            elements.submitGuess.disabled = true;
        } else {
            applyPixelation();
            elements.message.textContent = `Wrong! You have ${gameState.guessesLeft} guesses left.`;
        }
    }
    elements.guessInput.value = "";
    updateUI();
}


elements.submitGuess.addEventListener("click", checkGuess);
elements.guessInput.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        checkGuess();
    }
});

function initGame() {
    gameState.currAlbum = getRandomAlbum(gameState.albums);
    gameState.guessesLeft = 5;
    gameState.pixelation = 7;

    // Show loading spinner
    elements.spinner.style.display = "block";
    elements.albumCover.classList.remove("loaded")
    
    // Load the original image first
    const tempImg = new Image();
    tempImg.crossOrigin = "Anonymous";
    tempImg.src = gameState.currAlbum.cover;
    
    tempImg.onload = () => {
        applyPixelation();

        elements.spinner.style.display = "none"; // Hide spinner after loading
        elements.albumCover.classList.add("loaded"); // Add class to trigger CSS transition
        
        updateUI();
    };
    elements.message.textContent = "Guess the album!";
    elements.submitGuess.disabled = false;
}

// Start the game when the page loads
window.addEventListener('DOMContentLoaded', initGame);