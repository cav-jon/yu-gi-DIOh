const state = {
    score: {
        playerScore: 0,
        computerScore: 0,
        scoreBox: document.getElementById('score_points')
    },
    cardSprites:{
        avatar: document.getElementById('card-image'),
        name: document.getElementById('card-name'),
        type: document.getElementById('card-type'),
    },
    fieldCards: {
        player: document.getElementById('player-field-card'),
        computer: document.getElementById('computer-field-card'),
    }, 
    playerSides:{
        player1: "player-cards",
        player1BOX: document.querySelector("#player-cards"),
        computer: "computer-cards",
        computerBOX: document.querySelector("#computer-cards")
    },
    actions:{
        button:document.getElementById('next-duel')
    }
}

const pathImages = "./src/assets/icons/"
const pathAudios = "./src/assets/audios/"
const cardData = [
    {
        id: 0,
        name:"Blue Eyes White Dragon",
        type: "Paper",
        img: `${pathImages}dragon.png`,
        winOf: [1],
        loseOf: [2],
    },
    {
        id: 1,
        name: "Dark Magician",
        type: "Rock",
        img: `${pathImages}magician.png`,
        winOf: [2],
        loseOf: [0],
    },
    {
        id: 2,
        name: "Exodia the Forbidden One",
        type: "Scissors",
        img: `${pathImages}exodia.png`,
        winOf: [0],
        loseOf: [1],
    },
]
async function resetDuel(){
    state.cardSprites.avatar.src = "";
    state.actions.button.style.display = "none";

    state.fieldCards.player.style.display = "block"
    state.fieldCards.computer.style.display = "block"
    state.cardSprites.name.innerText = "";
    state.cardSprites.type.innerText = "";
    init();
}
async function updateScore() {
    state.score.scoreBox.innerText = `Win: ${state.score.playerScore} | Lose: ${state.score.computerScore}`
}

async function drawButton(text){
    state.actions.button.innerText = text;
    state.actions.button.style.display = "block";
}
async function checkDuelResults(playerCardId, computerCardId) {
    let duelResults = "Draw!";
    let playerCard = cardData[playerCardId];

    if(playerCard.winOf.includes(computerCardId)){
        duelResults = "Win!";
        state.score.playerScore++
        playSound("win.wav", 0.3);
    }if(playerCard.loseOf.includes(computerCardId)){
        duelResults = "Lose!";
        state.score.computerScore++
        playSound("lose.wav", 0.3);
    }

    return duelResults

}
async function getRandomCardId() {
    const randomIndex = Math.floor(Math.random() * cardData.length)
    return cardData[randomIndex].id
}
async function drawSelectedCard(cardId) {
    state.cardSprites.avatar.src = cardData[cardId].img;
    state.cardSprites.name.innerText = cardData[cardId].name;
    state.cardSprites.type.innerText = cardData[cardId].type;
}
async function removeAllCardsImages() {
    let {computerBOX, player1BOX} = state.playerSides;
    
    let imageElements = computerBOX.querySelectorAll("img");
    imageElements.forEach((img)=>img.remove());

    
    imageElements = player1BOX.querySelectorAll("img");
    imageElements.forEach((img) => img.remove());
}

async function setCardsField(cardId) {
    await removeAllCardsImages();

    let computerCardId = await getRandomCardId();

    state.fieldCards.player.style.display = "block";
    state.fieldCards.computer.style.display = "block";

    state.fieldCards.player.src = cardData[cardId].img;
    state.fieldCards.computer.src = cardData[computerCardId].img;

    let duelResults = await checkDuelResults(cardId, computerCardId);

    await updateScore();
    await drawButton(duelResults);
}

async function createCardImage(cardId,fieldSide){
    const cardImage = document.createElement("img");
    cardImage.setAttribute("height","100px");
    cardImage.setAttribute("src","./src/assets/icons/card-back.png");
    cardImage.setAttribute("data-id",cardId);
    cardImage.classList.add("card");



    if(fieldSide === state.playerSides.player1) {
        cardImage.setAttribute("src", "./src/assets/icons/card-front.png");
        cardImage.addEventListener("mouseover", () => {
            drawSelectedCard(cardId);
        })
        cardImage.addEventListener("click",()=>{    
            setCardsField(cardImage.getAttribute("data-id"));
        });
        
    }

    

    return cardImage
}

async function drawCards(cardNum,fieldSide){
    for(let i = 0; i < cardNum; i++) {
        const randomIdCard = await getRandomCardId();
        const cardImage = await createCardImage(randomIdCard, fieldSide)
        
        document.getElementById(fieldSide).appendChild(cardImage)
    }
}
function playSound(sound, volume){
    let audio = new Audio(`${pathAudios}${sound}`);
    audio.volume = volume || 1;
    audio.play();
}
const init = () =>{
    
    state.fieldCards.player.style.display = "none";
    state.fieldCards.computer.style.display = "none";
    
    drawCards(5,state.playerSides.player1)
    drawCards(5,state.playerSides.computer)
    
}

init()
