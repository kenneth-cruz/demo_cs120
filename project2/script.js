/**
 Wordle mock up, project 2
 * 1) use API to fetch 5 letter word, backup array of words I made in case API fails
 * 2) Cookie-based average guess 
 * 3) Correct letter and place = green, Wrong place, Correct letter = yellow, Not in word = no color
 **/

/* Cookie helper functions */
function cookieHelper(name, value, days) {
    const d = new Date();
    d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000);
    const expires = "expires=" + d.toUTCString();
    document.cookie = `${name}=${value};${expires};path=/`;
  }
  
  function getCookie(name) {
    const decodedCookie = decodeURIComponent(document.cookie);
    const ca = decodedCookie.split(";");
    const prefix = name + "=";
    for (let item of ca) {
      item = item.trim();
      if (item.indexOf(prefix) === 0) {
        return item.substring(prefix.length);
      }
    }
    return "";
  }
  
  // backup if API FAILS
  const fallbackWords = [
    "APPLE", "HELLO", "CRANE", "DRAFT", "ROAST",
    "POINT", "QUEEN", "BOAST", "SHELF", "THINK",
    "TOAST", "LIGHT", "HONEY", "NIGHT", "OPERA",
    "UNITE", "VIRAL", "WATER", "XENON", "YOUTH",
    "FAITH", "GRASS", "HEART", "INDEX", "SASSY",
    "ZEBRA", "NAIVE", "TRACE", "SHAPE", "LAUGH"
  ];
  
  // fetch 5 letter word from api
  // function works asynchronously
  async function fetchRandomFiveLetterWord() {
    try {
      const response = await fetch("https://random-word-api.herokuapp.com/word?length=5");
      const data = await response.json();  
      let randomFetchWord = data[0].toUpperCase();
      console.log("API fetched word:", randomFetchWord);
      return randomFetchWord;
    } catch (error) {
      console.error("Error fetching word from API, using fallback:", error);
      // manual random pick from my "dictionary"
      return fallbackWords[Math.floor(Math.random() * fallbackWords.length)];
    }
  }
  
 // Game Board State
  let gameState = {
    currentRow: 0,
    maxRows: 6,
    columns: 5,
    answer: "",
    usedLettersStatus: {} 
  };
  
  /* Priority for merging letter statuses */
  function mergeLetterStatus(oldStatus, newStatus) {
    const priority = { none: 1, wrong: 2, correct: 3 };
    if (!oldStatus) return newStatus;
    return (priority[newStatus] > priority[oldStatus]) ? newStatus : oldStatus;
  }
  
  // update the status of the letter
  function updateLetterStatuses(guess) {
    for (let i = 0; i < guess.length; i++) {
      let letter = guess[i];
      if (letter === gameState.answer[i]) {
        // Correct spot
        gameState.usedLettersStatus[letter] =
          mergeLetterStatus(gameState.usedLettersStatus[letter], "correct");
      } else if (gameState.answer.includes(letter)) {
        // correct word, wrong spot
        gameState.usedLettersStatus[letter] =
          mergeLetterStatus(gameState.usedLettersStatus[letter], "wrong");
      } else {
        // Not in word
        gameState.usedLettersStatus[letter] =
          mergeLetterStatus(gameState.usedLettersStatus[letter], "none");
      }
    }
  }
  
  // display via HTML the three categories
  function updateUsedLettersBoard() {
    const correct_letter = document.getElementById("correct-letters");
    const wrong_letter   = document.getElementById("wrong-letters");
    const none_letter    = document.getElementById("none-letters");
  
    correct_letter.textContent = "Correct place: ";
    wrong_letter.textContent   = "Wrong place: ";
    none_letter.textContent    = "Not in word: ";
  
    // organize the appearrance of the HTML 
    for (let letter in gameState.usedLettersStatus) {
      let status = gameState.usedLettersStatus[letter];
      if (status === "correct") {
        correct_letter.textContent += letter + " ";
      } else if (status === "wrong") {
        wrong_letter.textContent += letter + " ";
      } else {
        none_letter.textContent += letter + " ";
      }
    }
  }
  
  // making the baord.
  function createBoard() {
    const board = document.getElementById("board");
    board.innerHTML = "";
    for (let i = 0; i < gameState.maxRows * gameState.columns; i++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.id = `cell-${i}`;
      board.appendChild(cell);
    }
  }
  
  // average display upadte, cookie states incorporated
  function update_avg() {
    const display_letters = document.getElementById("average-display");
    let statsCookie = getCookie("wordleStats");
    if (!statsCookie) {
      display_letters.textContent = "No wins yet!";
      return;
    }
    let stats = JSON.parse(statsCookie);
    let average = stats.wins > 0 ? (stats.totalGuesses / stats.wins).toFixed(2) : 0;
    display_letters.textContent = `Average guesses until now: ${average}`;
  }
  
  // Record win and states
  function recordWin(guessCount) {
    let statsCookie = getCookie("wordleStats");
    let stats = { wins: 0, totalGuesses: 0 };
    if (statsCookie) {
      stats = JSON.parse(statsCookie);
    }
    stats.wins += 1;
    stats.totalGuesses += guessCount;
  
    // store cookies for 1 year
    cookieHelper("wordleStats", JSON.stringify(stats), 365);
  
    update_avg();
  }
  
  // handler for guesses
  function handleGuess() {
    const guessInputHandle = document.getElementById("guess-input");
    let guess = guessInputHandle.value.toUpperCase();
  
    if (guess.length !== gameState.columns) {
      alert("Please enter a 5-letter word.");
      return;
    }
  
    // Fill row with letters
    const rowStart = gameState.currentRow * gameState.columns;
    for (let i = 0; i < guess.length; i++) {
      let cell = document.getElementById(`cell-${rowStart + i}`);
      cell.textContent = guess[i];
  
      cell.classList.remove("correct-position", "wrong-position", "winner");
  
      // Check letter submitted versus answer
      if (guess[i] === gameState.answer[i]) {
        // green
        cell.classList.add("correct-position");
      } else if (gameState.answer.includes(guess[i])) {
        //  yellow
        cell.classList.add("wrong-position");
      } 
      // otherwise no color 
    }
  
    updateLetterStatuses(guess);
    updateUsedLettersBoard();
  
    if (guess === gameState.answer) {
      // No more guesses after win
      document.getElementById("guess-button").disabled = true;
      // win = mark the whole row green
      for (let i = 0; i < gameState.columns; i++) {
        let cell = document.getElementById(`cell-${rowStart + i}`);
        cell.classList.remove("correct-position", "wrong-position");
        cell.classList.add("winner");
      }
      setTimeout(() => {
        alert("Congratulations! You guessed the word!");
        recordWin(gameState.currentRow + 1); 
        showRestartButton();
      }, 100);
      return;
    }
  
    // you loose the game
    gameState.currentRow++;
    if (gameState.currentRow === gameState.maxRows) {
      document.getElementById("guess-button").disabled = true;
      setTimeout(() => {
        alert(`Sorry, no more tries left! Thanks for playing`);
        showRestartButton();
      }, 100);
    }
  
    // clear input
    guessInputHandle.value = "";
  }
  
  // Reset the game button appears, activate
  function showRestartButton() {
    if (document.getElementById("restart-button")) return; // already there
    const container = document.getElementById("restart-container") || createRestartContainer();
    const button = document.createElement("button");
    button.textContent = "Restart Game";
    button.id = "restart-button";
    button.addEventListener("click", resetGame);
    container.appendChild(button);
  }
  
  function createRestartContainer() {
    const container = document.createElement("div");
    container.id = "restart-container";
    document.body.appendChild(container);
    return container;
  }
  
  // restart game
  async function resetGame() {
    gameState.currentRow = 0;
    gameState.usedLettersStatus = {};
    document.getElementById("guess-button").disabled = false;
    gameState.answer = await fetchRandomFiveLetterWord();
    console.log("New secret answer:", gameState.answer);
  
    //Clear board
    const totalCells = gameState.maxRows * gameState.columns;
    for (let i = 0; i < totalCells; i++) {
      let cell = document.getElementById(`cell-${i}`);
      if (cell) {
        cell.textContent = "";
        cell.classList.remove("correct-position", "wrong-position", "winner");
      }
    }
  
    // used letter board update
    updateUsedLettersBoard();
  
    // Remove restart button
    const restartButton = document.getElementById("restart-button");
    if (restartButton) {
      restartButton.remove();
    }
      document.getElementById("guess-input").value = "";
  }
  
  // start game, set up board, answer, guess button, update average
  async function initGame() {
    createBoard();
    gameState.answer = await fetchRandomFiveLetterWord();
    console.log("Secret answer (debug):", gameState.answer);
  
    document.getElementById("guess-button").addEventListener("click", handleGuess);
      updateUsedLettersBoard();
      update_avg();
  }
  
  // start game when you load
  window.onload = initGame;
  