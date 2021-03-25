//Global constants
//const clueHoldTime = 1000 //is now a variable
const cluePauseTime = 333;
const nextClueWaitTime = 1000;

//Global variables
var pattern = [2, 6, 4, 3, 5, 1, 2, 4, 1];
var progress = 0;
var gamePlaying = false;
var tonePlaying = false;
var volume = 0.5; // must be between 0.0 and 1.0
var guessCounter = 0;
var clueHoldTime = 1000;
var mistakes = 0;

function startGame() {
  //Initialize game variables
  progress = 0;
  gamePlaying = true;
  mistakes = 0;
  clueHoldTime = 1000;
  //Swap the Start and End buttons
  document.getElementById("startBtn").classList.add("hidden");
  document.getElementById("stopBtn").classList.remove("hidden");
  playClueSequence();
}

function stopGame() {
  gamePlaying = false;
  document.getElementById("startBtn").classList.remove("hidden");
  document.getElementById("stopBtn").classList.add("hidden");
}

function lightButton(btn) {
  document.getElementById("button"+btn).classList.add("lit");
}

function clearButton(btn) {
  document.getElementById("button"+btn).classList.remove("lit"); 
}

function playSingleClue(btn) {
  if(gamePlaying){
    lightButton(btn);
    playTone(btn, clueHoldTime);
    setTimeout(clearButton, clueHoldTime, btn);
  }
}

function playClueSequence() {
  guessCounter = 0;
  let delay = nextClueWaitTime
  for (let i=0; i<=progress; i++){
    console.log("play single clue: " + pattern[i] + " in " + delay + "ms");
    setTimeout(playSingleClue, delay, pattern[i]);
    delay += clueHoldTime;
    delay += cluePauseTime;
    clueHoldTime -= 20;
  }
}

function loseGame() {
  stopGame();
  alert("Game over. You lost. gg")
}

function winGame() {
  stopGame();
  alert("Game over. You won!")
}

// Sound Synthesis Functions
const freqMap = {
  1: 261.6,
  2: 329.6,
  3: 392,
  4: 466.2,
  5: 500,
  6: 570
}

function playTone(btn,len){ 
  o.frequency.value = freqMap[btn]
  g.gain.setTargetAtTime(volume,context.currentTime + 0.05,0.025)
  tonePlaying = true
  setTimeout(function(){
    stopTone()
  },len)
}

function startTone(btn){
  if(!tonePlaying){
    o.frequency.value = freqMap[btn]
    g.gain.setTargetAtTime(volume,context.currentTime + 0.05,0.025)
    tonePlaying = true
  }
}

function stopTone(){
    g.gain.setTargetAtTime(0,context.currentTime + 0.05,0.025)
    tonePlaying = false
}

function guess(btn) {
  console.log("user guessed: " + btn);
  if(!gamePlaying){
    return;
  }
  
  if(pattern[guessCounter] == btn){
    if(guessCounter == progress){
      if(progress == pattern.length - 1){
        winGame();
      }else{
        progress++;
        playClueSequence();
      }
    }else{
      guessCounter++;
    }
  }else{
    mistakes++
    if(mistakes == 3){
      loseGame();
    }
  }
}

//Page Initialization
// Init Sound Synthesizer
var context = new AudioContext()
var o = context.createOscillator()
var g = context.createGain()
g.connect(context.destination)
g.gain.setValueAtTime(0,context.currentTime)
o.connect(g)
o.start(0)