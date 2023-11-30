"use strict";

/* Code for menu button */
$("nav").hide();
$("#menu-btn").click(toggleMenu);

function toggleMenu() {
    $("nav").slideToggle(250);
}

/* Code for player objects (the computer will be considered a player of the game) */
class Player {
    constructor() {
        this.total = 0;
    }
    /* Return the player's total points */
    getTotal() {
        return this.total;
    }
    /* Add player's points to total */
    addToTotal(val) {
        this.total += val;
    }
    /* Reset scores for a new game */
    reset() {
        this.total = 0;
    }
}

/* Generate a random roll */
function rollDice() {
    return Math.round(Math.random() * 5) + 1;
}

/* Calculate the score after rolling the dice */
function calculateScoreToAdd(score1, score2) {
    if (score1 === 1 || score2 === 1) return 0;
    if (score1 === score2) return 2 * (score1 + score2);
    return score1 + score2;
}

/* Dice image elements */
const $playerDice1 = $("#player-dice-1");
const $playerDice2 = $("#player-dice-2");
const $computerDice1 = $("#computer-dice-1");
const $computerDice2 = $("#computer-dice-2");
const $playerDiceHistory1 = $("#player-dice-history-1");
const $playerDiceHistory2 = $("#player-dice-history-2");
const $playerDiceHistory3 = $("#player-dice-history-3");
const $computerDiceHistory1 = $("#computer-dice-history-1");
const $computerDiceHistory2 = $("#computer-dice-history-2");
const $computerDiceHistory3 = $("#computer-dice-history-3");

// Track player dice
let currPlayerDice1;
let currPlayerDice2;
let currComputerDice1;
let currComputerDice2;

// Create player objects. (Note: computer considered a player)
const player = new Player();
const computer = new Player();

const $rollDiceBtn = $("#roll-dice");
const $newGameBtn = $("#new-game");

let roundNumber = 1;

function displayResults() {
    const playerScore = player.getTotal();
    const computerScore = computer.getTotal();

    let result = ``;

    if (playerScore === computerScore) {
        result += `<h2>Draw!</h2><p>You both scored <span class="final-score">${playerScore}</span>.</p>`;
    } else if (playerScore > computerScore) {
        result += `<h2>You won!</h2><p>You scored <span class="final-score">${playerScore} points</span> while your opponent only scored <span class="final-score">${computerScore}</span>.</p>`;

        $("#results-container").css("background-color", "var(--results-win-color)");
    } else {
        result += `<h2>You lost!</h2><p>You only scored <span class="final-score">${playerScore} points</span> while your opponent scored <span class="final-score">${computerScore}</span>.</p>`;

        $("#results-container").css("background-color", "var(--results-lose-color)");
    }

    $("#results-div").html(result);
    $("#results-container").toggle();

    $("main").css({
        "opacity": "0.5",
    });

    $("header").css({
        "opacity": "0.5",
    });

    $("footer").css({
        "opacity": "0.5",
    });
}

function playGame() {

    let playerDice1, playerDice2, computerDice1, computerDice2;
    let playerScoreToAdd, computerScoreToAdd;
    let playerDice1Path, playerDice2Path, computerDice1Path, computerDice2Path;

    // Roll dice
    playerDice1 = rollDice();
    playerDice2 = rollDice();
    computerDice1 = rollDice();
    computerDice2 = rollDice();

    // Set path
    playerDice1Path = `images/dice-${playerDice1}.png`;
    playerDice2Path = `images/dice-${playerDice2}.png`;
    computerDice1Path = `images/dice-${computerDice1}.png`;
    computerDice2Path = `images/dice-${computerDice2}.png`;

    // Update and display dice on page
    $playerDice1.attr("src", playerDice1Path);
    $playerDice2.attr("src", playerDice2Path);
    $computerDice1.attr("src", computerDice1Path);
    $computerDice2.attr("src", computerDice2Path);

    // Display rolled dice on game summary
    $(`#player-dice-history-${roundNumber}`).html(`<img class="dice-round-history" src="${playerDice1Path}" alt="Player Round ${roundNumber} Dice 1"><img class="dice-round-history" src="${playerDice2Path}" alt="Player Round ${roundNumber} Dice 2">`);

    $(`#computer-dice-history-${roundNumber}`).html(`<img class="dice-round-history" src="${computerDice1Path}" alt="Computer Round ${roundNumber} Dice 1"><img class="dice-round-history" src="${computerDice2Path}" alt="Computer Round ${roundNumber} Dice 2">`);


    // Update current player dice 
    currPlayerDice1 = playerDice1;
    currPlayerDice2 = playerDice2;
    currComputerDice1 = computerDice1;
    currComputerDice2 = computerDice2;

    // Get score
    playerScoreToAdd = calculateScoreToAdd(playerDice1, playerDice2);
    computerScoreToAdd = calculateScoreToAdd(computerDice1, computerDice2);

    player.addToTotal(playerScoreToAdd);
    computer.addToTotal(computerScoreToAdd);

    $("#player-total").html(player.getTotal());
    $("#computer-total").html(computer.getTotal());

    const $playerScoreElement = `#you-score-${roundNumber}`;
    const $computerScoreElement = `#computer-score-${roundNumber}`;

    $($playerScoreElement).html(playerScoreToAdd);
    $($computerScoreElement).html(computerScoreToAdd)

    // Reset scores
    if (roundNumber === 3) {
        $($rollDiceBtn).prop("disabled", true);
        $($newGameBtn).prop("disabled", true);
        $($rollDiceBtn).css("background-color", "var(--disabled-color)");

        displayResults();
        player.reset();
        computer.reset();
        roundNumber = 1;

    } else {
        roundNumber++;
        // Enable roll dice
        $($rollDiceBtn).prop("disabled", false);
        $($rollDiceBtn).css("background-color", "var(--enabled-color)");
        $($newGameBtn).prop("disabled", false);
    }

    $($newGameBtn).css("background-color", "var(--enabled-color)");
}

/* Clear scores on table */
function clearScores() {

    for (let i = 1; i <= 3; i++) {
        const $playerScoreElement = `#you-score-${i}`;
        const $computerScoreElement = `#computer-score-${i}`;
        const $playerDiceHistoryElement = `#player-dice-history-${i}`;
        const $computerDiceHistoryElement = `#computer-dice-history-${i}`;

        $($playerScoreElement).html(``);
        $($computerScoreElement).html(``);
        $($playerDiceHistoryElement).html(``);
        $($computerDiceHistoryElement).html(``);

        $("#player-total").html(0);
        $("#computer-total").html(0);
    }
}

function resetGame() {

    $("#player-dice-1").hide();
    $("#player-dice-2").hide();
    $("#computer-dice-1").hide();
    $("#computer-dice-2").hide();

    $($rollDiceBtn).css("background-color", "var(--enabled-color)")

    // Enable roll dice
    $($rollDiceBtn).prop("disabled", false);
    player.reset();
    computer.reset();
    clearScores();

    roundNumber = 1;
}

// $("#results-prompt").toggle();
const rollingTime = 1745;

let $rollingAnimationHandler;
let $timeoutHandler;
let count = 0;

let $scaleXY = [`scaleX(-1)`, `scaleY(1)`, `scaleX(1)`, `scaleY(-1)`, `rotate(45deg)`, `rotate(-45deg)`];

function roll() {

    $($rollDiceBtn).prop("disabled", true);
    $($newGameBtn).prop("disabled", true);

    $($rollDiceBtn).css("background-color", "var(--disabled-color)");
    $($newGameBtn).css("background-color", "var(--disabled-color)");

    let $imagePath = `images/dice.png`;

    $playerDice1.attr("src", $imagePath);
    $playerDice2.attr("src", $imagePath);
    $computerDice1.attr("src", $imagePath);
    $computerDice2.attr("src", $imagePath);

    let $scale = $scaleXY[count % 7];

    $playerDice1.css("transform", $scale);
    $playerDice2.css("transform", $scale);
    $computerDice1.css("transform", $scale);
    $computerDice2.css("transform", $scale);

    if (count == 100) {
        clearTimeout($timeoutHandler);
        cancelAnimationFrame($rollingAnimationHandler);
        count = 0;
        $($rollDiceBtn).prop("disabled", false);
        $($newGameBtn).prop("disabled", false);
        return;
    }

    $timeoutHandler = setTimeout(function () {
        count++;
        $rollingAnimationHandler = requestAnimationFrame(roll);
    }, 1);
}

$($rollDiceBtn).click(function () {
    $("#player-dice-1").show();
    $("#player-dice-2").show();
    $("#computer-dice-1").show();
    $("#computer-dice-2").show();

    $rollingAnimationHandler = requestAnimationFrame(roll);

    setTimeout(playGame, rollingTime);

});

resetGame();

$($newGameBtn).click(resetGame);

$("#results-container").toggle();

$("#close-btn").click(function () {
    $($newGameBtn).prop("disabled", false);

    $("#results-container").toggle();
    $("main").css({
        "opacity": "1",
    });

    $("header").css({
        "opacity": "1",
    });

    $("footer").css({
        "opacity": "1",
    });
});