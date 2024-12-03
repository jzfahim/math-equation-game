// Pages
const gamePage = document.getElementById('game-page');
const scorePage = document.getElementById('score-page');
const splashPage = document.getElementById('splash-page');
const countdownPage = document.getElementById('countdown-page');
// Splash Page
const startForm = document.getElementById('start-form');
const radioContainers = document.querySelectorAll('.radio-container');
const radioInputs = document.querySelectorAll('input');
const bestScores = document.querySelectorAll('.best-score-value');
// Countdown Page
const countdown = document.querySelector('.countdown');
// Game Page
const itemContainer = document.querySelector('.item-container');
// Score Page
const finalTimeEl = document.querySelector('.final-time');
const baseTimeEl = document.querySelector('.base-time');
const penaltyTimeEl = document.querySelector('.penalty-time');
const playAgainBtn = document.querySelector('.play-again');

// Equations

let equationsArray = [];

// Game Page
let firstNumber = 0;
let secondNumber = 0;
let equationObject = {};
const wrongFormat = [];
let questionAmount = 0;
let playerGuessArray = [];
let bestScoreArray = [];

// Time
let timer;
let timePlayed = 0;
let baseTIme = 0;
let penaltyTime = 0;
let finalTIme = 0;
let finalTImeDisplay = '0.0';


// Scroll
let valueY = 0;

// Refresh Splash page best scores

function bestScoreToDOM() {
  bestScores.forEach((bestScore, index) => {
    const bestScoreEl = bestScore;
    const val = bestScoreArray[index].bestScore;
    bestScoreEl.textContent = `${bestScoreArray[index].bestScore}s`;
  });
}

//CHeck local storage for BEst scores, set bestScoreArray
function getSavedBestScores() {
  if (localStorage.getItem('bestScores')) {
    bestScoreArray = JSON.parse(localStorage.bestScores)
  } else {
    bestScoreArray = [
      { questions: 10, bestScore: finalTImeDisplay },
      { questions: 25, bestScore: finalTImeDisplay },
      { questions: 50, bestScore: finalTImeDisplay },
      { questions: 99, bestScore: finalTImeDisplay }
    ];
    localStorage.setItem('bestScores', JSON.stringify(bestScoreArray));
  }
  bestScoreToDOM();
}


// Format and display resultts in DOM

function scoresToDOM() {
  finalTImeDisplay = finalTIme.toFixed(1);
  baseTIme = timePlayed.toFixed(1);
  penaltyTime = penaltyTime.toFixed(1);
  baseTimeEl.textContent = `Base Time: ${baseTIme}s`;
  penaltyTimeEl.textContent = `Penalty: +${penaltyTime}s`;
  finalTimeEl.textContent = `${finalTImeDisplay}s`;
  updateBestScore();

  //Scroll to top, go to score page;
  itemContainer.scrollTo({
    top: 0,
    behavior: 'instant'
  })
  showScorePage();
};


//Update the  best Score
function updateBestScore() {
  bestScoreArray.forEach((score, index) => {
    if (questionAmount == score.questions) {
      const savedBestScore = Number(bestScoreArray[index].bestScore)
      if (savedBestScore === 0 || savedBestScore > finalTIme) {
        bestScoreArray[index].bestScore = finalTImeDisplay;
      }
    }
  });
  // Update splash  page
  bestScoreToDOM();
  // Save to local Storge
  localStorage.setItem('bestScores', JSON.stringify(bestScoreArray))
}


// Reset  Game
function playAgain() {
  gamePage.addEventListener('click', startTImer);
  scorePage.hidden = true;
  splashPage.hidden = false;
  equationsArray = [];
  playerGuessArray = [];
  valueY = 0;
  playAgainBtn.hidden = true;
}


//Show the score page
function showScorePage() {
  // Show pay agian button after 2 seconds
  setTimeout(() => {
    playAgainBtn.hidden = false;
  }, 2000);
  gamePage.hidden = true;
  scorePage.hidden = false;
}


// Stop times, process Results, go to Score page

function checkTime() {
  if (playerGuessArray.length == questionAmount) {
    clearInterval(timer);

    // Check for wrong guesses, add penalty time
    equationsArray.forEach((equation, index) => {
      if (equation.evaluated === playerGuessArray[index]) {
        //Corret guesses no penalty
      } else {
        // Incorrect Guess,Add penalty
        penaltyTime += 0.5;
      }
    });
    finalTIme = timePlayed + penaltyTime;
    scoresToDOM();

  }
}

//Add a tenth of a second to timePlayed;
function addTime() {
  timePlayed += 0.1;
  checkTime();
}

//Start timer when game page is clicked

function startTImer() {
  // Reset times
  timePlayed = 0;
  penaltyTime = 0;
  finalTIme = 0;
  timer = setInterval(addTime, 100);
  gamePage.removeEventListener('click', startTImer)

}




// Scroll. store user selection in playerGUess araay;
function select(guessedTrue) {
  // scroll 80 px
  valueY += 80;
  itemContainer.scroll(0, valueY);

  return guessedTrue ? playerGuessArray.push('true') : playerGuessArray.push('false');

}



// Display our game page
function showGamePage() {
  gamePage.hidden = false;
  countdownPage.hidden = true;
}

// Get random nuber upto a max number
function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor((max)));
}


// Create Correct / Incorrect Random Equations
function createEquations() {
  // Randomly choose how many correct equations there should be
  const correctEquations = getRandomInt(questionAmount);
  // Set amount of wrong equations
  const wrongEquations = questionAmount - correctEquations;


  // Loop through, multiply random numbers up to 9, push to array
  for (let i = 0; i < correctEquations; i++) {
    firstNumber = getRandomInt(9);
    secondNumber = getRandomInt(9);
    const equationValue = firstNumber * secondNumber;
    const equation = `${firstNumber} x ${secondNumber} = ${equationValue}`;
    equationObject = { value: equation, evaluated: 'true' };
    equationsArray.push(equationObject);
  }
  //   // Loop through, mess with the equation results, push to array
  for (let i = 0; i < wrongEquations; i++) {
    firstNumber = getRandomInt(9);
    secondNumber = getRandomInt(9);
    const equationValue = firstNumber * secondNumber;
    wrongFormat[0] = `${firstNumber} x ${secondNumber + 1} = ${equationValue}`;
    wrongFormat[1] = `${firstNumber} x ${secondNumber} = ${equationValue - 1}`;
    wrongFormat[2] = `${firstNumber + 1} x ${secondNumber} = ${equationValue}`;
    wrongFormat[3] = `${firstNumber + 2} x ${secondNumber} = ${equationValue + 3}`;
    wrongFormat[4] = `${firstNumber} x ${secondNumber + 1} = ${equationValue - 3}`;
    const formatChoice = getRandomInt(4);
    const equation = wrongFormat[formatChoice];
    equationObject = { value: equation, evaluated: 'false' }; equationsArray.push(equationObject);
  }
  suffle(equationsArray);

}


// Equation to DOM
function equationToDOM() {
  equationsArray.forEach((equation) => {
    // Item
    const item = document.createElement('div');
    item.classList.add('item');
    // Equation Text
    const equationText = document.createElement('h1');
    equationText.textContent = equation.value;
    // Append
    item.appendChild(equationText);
    itemContainer.appendChild(item);
  })
}






// Dynamically adding correct/incorrect equations
function populateGamePage() {
  // Reset DOM, Set Blank Space Above
  itemContainer.textContent = '';
  // Spacer
  const topSpacer = document.createElement('div');
  topSpacer.classList.add('height-240');
  // Selected Item
  const selectedItem = document.createElement('div');
  selectedItem.classList.add('selected-item');
  // Append
  itemContainer.append(topSpacer, selectedItem);

  // Create Equations, Build Elements in DOM
  createEquations();
  equationToDOM();

  // Set Blank Space Below
  const bottomSpacer = document.createElement('div');
  bottomSpacer.classList.add('height-500');
  itemContainer.appendChild(bottomSpacer);
}




// Get the value from the selected radio button 

function getRadioValue() {
  let radioValue;
  for (let input of radioInputs) {
    if (input.checked) {
      radioValue = input.value;
    }
  }
  return radioValue;
}



// Qeestion Amount
function selectQuestionAmount(e) {
  e.preventDefault();

  questionAmount = getRadioValue();
  if (questionAmount) {
    showCountdown();
  }
}

// Display , 3-1 Go

function countdownStart() {
  countdown.textContent = '3';
  setTimeout(() => {
    countdown.textContent = '2'
  }, 1000);
  setTimeout(() => {
    countdown.textContent = '1'
  }, 2000);
  setTimeout(() => {
    countdown.textContent = 'GO!'
  }, 3000);


}





//Navigate from splash page to Countdown Page

function showCountdown() {
  countdownPage.hidden = false;
  splashPage.hidden = true;
  countdownStart();
  populateGamePage();
  setTimeout(showGamePage, 4000)
}



startForm.addEventListener('click', () => {
  for (let radioEl of radioContainers) {
    // Reoveing selected label styling
    radioEl.classList.remove('selected-label');
    // Add it back if radio input is checked
    if (radioEl.children[1].checked) {
      radioEl.classList.add('selected-label')
    }
  }
});

// Event Listeners
startForm.addEventListener('submit', selectQuestionAmount);
gamePage.addEventListener('click', startTImer);

// on Load
getSavedBestScores();