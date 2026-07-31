const startJourney = document.getElementById("startJourney");
const musicButton = document.getElementById("musicButton");
const backgroundMusic = document.getElementById("backgroundMusic");
const musicIcon = document.getElementById("musicIcon");
const floatingHearts = document.getElementById("floatingHearts");
const cursorGlow = document.getElementById("cursorGlow");
const heartOpening = document.getElementById("heartOpening");

let musicPlaying = false;

startJourney.addEventListener("click", () => {
  heartOpening.classList.remove("opening");
  void heartOpening.offsetWidth;
  heartOpening.classList.add("opening");
  createHeartBurst(24);

  backgroundMusic.play().then(() => {
    musicPlaying = true;
    musicButton.classList.add("playing");
    musicIcon.textContent = "❚❚";
  }).catch(() => {
    // Browsers may block autoplay. The music button remains available.
  });

  window.setTimeout(() => {
    document.getElementById("welcome").scrollIntoView({ behavior: "smooth" });
  }, 3400);

  window.setTimeout(() => heartOpening.classList.remove("opening"), 3900);
});

musicButton.addEventListener("click", async () => {
  if (musicPlaying) {
    backgroundMusic.pause();
    musicPlaying = false;
    musicButton.classList.remove("playing");
    musicIcon.textContent = "♫";
  } else {
    try {
      await backgroundMusic.play();
      musicPlaying = true;
      musicButton.classList.add("playing");
      musicIcon.textContent = "❚❚";
    } catch {
      alert("The music could not be played. Please try again.");
    }
  }
});

document.addEventListener("mousemove", (event) => {
  cursorGlow.style.left = `${event.clientX}px`;
  cursorGlow.style.top = `${event.clientY}px`;
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  },
  { threshold: 0.15 }
);

document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));

document.querySelectorAll(".tilt-card").forEach((card) => {
  card.addEventListener("mousemove", (event) => {
    const rectangle = card.getBoundingClientRect();
    const x = event.clientX - rectangle.left;
    const y = event.clientY - rectangle.top;
    const rotateY = ((x / rectangle.width) - 0.5) * 8;
    const rotateX = ((y / rectangle.height) - 0.5) * -8;
    card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  });

  card.addEventListener("mouseleave", () => {
    card.style.transform = "perspective(800px) rotateX(0) rotateY(0)";
  });
});

const reasonDisplay = document.getElementById("reasonDisplay");
document.querySelectorAll(".reason-card").forEach((card) => {
  card.addEventListener("click", () => {
    document.querySelectorAll(".reason-card").forEach((item) => item.classList.remove("active"));
    card.classList.add("active");
    reasonDisplay.textContent = card.dataset.message;
    createHeartBurst(8);
  });
});

const openLetter = document.getElementById("openLetter");
const envelopeFront = document.querySelector(".envelope-front");
const loveLetter = document.getElementById("loveLetter");

openLetter.addEventListener("click", () => {
  envelopeFront.style.display = "none";
  loveLetter.style.display = "block";
  createHeartBurst(20);
});

const gameArea = document.getElementById("gameArea");
const startGame = document.getElementById("startGame");
const scoreElement = document.getElementById("score");
const timerElement = document.getElementById("timer");
const gameMessage = document.getElementById("gameMessage");

let score = 0;
let timeLeft = 20;
let gameTimer = null;
let heartTimer = null;

startGame.addEventListener("click", beginGame);

function beginGame() {
  score = 0;
  timeLeft = 20;
  scoreElement.textContent = score;
  timerElement.textContent = timeLeft;
  gameMessage.textContent = "";
  gameArea.innerHTML = "";

  spawnHeart();
  heartTimer = setInterval(spawnHeart, 850);

  gameTimer = setInterval(() => {
    timeLeft -= 1;
    timerElement.textContent = timeLeft;

    if (timeLeft <= 0 || score >= 7) {
      finishGame();
    }
  }, 1000);
}

function spawnHeart() {
  if (score >= 7 || timeLeft <= 0) return;

  const heart = document.createElement("button");
  heart.className = "catch-heart";
  heart.textContent = ["💗", "💖", "💕", "❤️"][Math.floor(Math.random() * 4)];

  const maxX = Math.max(0, gameArea.clientWidth - 60);
  const maxY = Math.max(0, gameArea.clientHeight - 60);

  heart.style.left = `${Math.random() * maxX}px`;
  heart.style.top = `${Math.random() * maxY}px`;

  heart.addEventListener("click", () => {
    score += 1;
    scoreElement.textContent = score;
    heart.remove();
    createHeartBurst(4);

    if (score >= 7) {
      finishGame();
    }
  });

  gameArea.appendChild(heart);
  setTimeout(() => heart.remove(), 1200);
}

function finishGame() {
  clearInterval(gameTimer);
  clearInterval(heartTimer);
  gameArea.innerHTML = "";

  if (score >= 7) {
    gameMessage.textContent = "Secret unlocked: You already caught my heart a long time ago. ❤️";
    createHeartBurst(25);
  } else {
    gameMessage.textContent = "You missed a few hearts—but you still have mine forever. Try again!";
  }

  const replayButton = document.createElement("button");
  replayButton.className = "primary-button";
  replayButton.textContent = "Play Again";
  replayButton.addEventListener("click", beginGame);
  gameArea.appendChild(replayButton);
}

const noButton = document.getElementById("noButton");
const yesButton = document.getElementById("yesButton");
const finalMessage = document.getElementById("finalMessage");
const loveModal = document.getElementById("loveModal");
const closeModal = document.getElementById("closeModal");
let noBecameYes = false;

["mouseenter", "touchstart"].forEach((eventName) => {
  noButton.addEventListener(eventName, moveNoButton, { passive: true });
});

function moveNoButton() {
  if (noBecameYes) return;

  const x = Math.random() * 180 - 90;
  const y = Math.random() * 120 - 60;
  noButton.style.transform = `translate(${x}px, ${y}px)`;
  finalMessage.textContent = "Nice try 😜";
}

noButton.addEventListener("click", () => {
  if (noBecameYes) {
    yesButton.click();
    return;
  }

  noBecameYes = true;
  noButton.textContent = "Yes ❤️";
  noButton.classList.remove("secondary-button", "moving-button");
  noButton.classList.add("primary-button");
  noButton.style.transform = "none";
  finalMessage.textContent = "Hehe… now there is only one answer 😌❤️";
  createHeartBurst(12);
});

yesButton.addEventListener("click", () => {
  finalMessage.textContent = "Best answer ever! ❤️";
  loveModal.classList.add("open");
  loveModal.setAttribute("aria-hidden", "false");
  createHeartBurst(45);
});

closeModal.addEventListener("click", closeLoveModal);
loveModal.addEventListener("click", (event) => {
  if (event.target === loveModal) closeLoveModal();
});

function closeLoveModal() {
  loveModal.classList.remove("open");
  loveModal.setAttribute("aria-hidden", "true");
}

function createHeartBurst(count = 12) {
  for (let index = 0; index < count; index += 1) {
    const heart = document.createElement("span");
    heart.className = "floating-heart";
    heart.textContent = ["❤️", "💗", "💕", "💖"][Math.floor(Math.random() * 4)];
    heart.style.left = `${Math.random() * 100}%`;
    heart.style.fontSize = `${16 + Math.random() * 24}px`;
    heart.style.animationDuration = `${3 + Math.random() * 3}s`;
    heart.style.animationDelay = `${Math.random() * 0.6}s`;
    floatingHearts.appendChild(heart);
    setTimeout(() => heart.remove(), 7000);
  }
}

setInterval(() => createHeartBurst(1), 1700);
