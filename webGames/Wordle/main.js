import { Palabras } from "../Wordle/palabras.js";

let gameBoard = document.querySelector(".gameBoard");
let virtualKeyboard = document.querySelector(".virtualKeyboard");
let keyboardKeys 
let letterRows

const number_of_guesses = 6;
var current_guess = [];
var correct_word = "";
var next_letter_idx = 0;
var remaining_guesses;
var current_guess_idx = 0;

addEventListener("DOMContentLoaded", ready())

function ready(){
    remaining_guesses = number_of_guesses;
    correct_word = "ganso";
    initBoard()

    keyboardKeys = virtualKeyboard.querySelectorAll(".keyboardButton"); 
    keyboardKeys.forEach((key_i, idx) => {
        key_i.id = key_i.textContent;
    })
}

function initBoard(){
    for(let i = 0; i < number_of_guesses; i++){
        const row = document.createElement("div");
        row.className = "letterRow";

        for(let j = 0; j < 5; j++){
            const box = document.createElement("div");
            const boxText = document.createElement("p");
            box.className = "letterBox"
            box.appendChild(boxText);
            row.appendChild(box);
        }
        gameBoard.appendChild(row);
    }
    letterRows = document.querySelectorAll(".letterRow");
}

/* Normal key input */
document.addEventListener("keyup", (event) => {
    /* Block input if no guesses remaining*/
    if(remaining_guesses == 0){ return; }

    let pressedKey = String(event.key);

    /* Delete letter with backspace */
    if(pressedKey == "Backspace" && next_letter_idx != 0){
        deleteLetter();
        return;
    }

    /* Submit guess with enter */
    if(pressedKey == "Enter"){
        submitGuess();
    }

    /* Reject letter input if it isnt a letter of if its multiple letters */
    let eventLetter = pressedKey.match(/[a-za-ñ]/gi);
    if(!eventLetter || eventLetter.length > 1){
        return;
    }

    insertLetter(pressedKey);
})

/* Virtual keyboard input */
virtualKeyboard.addEventListener("click", (event) =>{
    const target = event.target;
    
    if(!target.classList.contains("keyboardButton")){
        return;
    }
    let key = target.textContent;
    if(target.classList.contains("backspace")){
        key = "Backspace"
    }
    document.dispatchEvent(new KeyboardEvent("keyup", {'key': key}));
})

function insertLetter(pressedKey){
    if(next_letter_idx == 5){
        return;
    }
    pressedKey = pressedKey.toLowerCase();

    let currentRow = letterRows[current_guess_idx];
    let currentBox = currentRow.children[next_letter_idx];
    let boxText = currentBox.firstChild;

    boxText.textContent = pressedKey;
    currentBox.classList.add("filledBox");
    current_guess.push(pressedKey);
    next_letter_idx++;
}

function deleteLetter(){
    let currentRow = letterRows[current_guess_idx];
    let currentBox = currentRow.children[next_letter_idx - 1];
    let boxText = currentBox.firstChild;
    /*boxText.textContent = "";*/
    currentBox.classList.remove("filledBox");
    current_guess.pop()
    next_letter_idx--;
}

function submitGuess(){
    let currentRow = letterRows[current_guess_idx];
    var current_guess_string = "";

    /* Construct string from correct guess array */
    for(const i of current_guess){
        current_guess_string += i;
    }
    if(current_guess_string.length != 5){
        alert("No hay suficientes letras!")
        /* Insert reject animation */
        return;
    }
    if(!Palabras.includes(current_guess_string)){
        alert("Palabra invalida!");
        return;
    }

    for(var i=0; i<5; i++){
        let current_box = currentRow.children[i];
        let current_letter = current_guess[i];
        let correct_guess_array = Array.from(correct_word);
        let box_class = "null";

        let letter_position = correct_guess_array.indexOf(current_guess[i])
        if(letter_position === -1){
            box_class = "null";
        }
        else{
            if(current_guess[i] === correct_guess_array[i]){
                box_class = "correct"
            }
            else{
                box_class = "halfCorrect"
            }
        }
    
        /*Animating the tile */
        let delay = 400 * i
        setTimeout(() => {
            current_box.classList.add("submitted");
            current_box.classList.add(box_class);
            color_keyboard(current_letter, box_class);
        }, delay)

    }

    if(current_guess_string === correct_word){
        remaining_guesses = 0;
        return;
    }
    else{
        remaining_guesses --;
        current_guess = [];
        next_letter_idx = 0;

        if(remaining_guesses <= 0){
        }
        current_guess_idx++;
    }
}

function color_keyboard(key, box_class){
    document.getElementById(key).classList.add(box_class);
}