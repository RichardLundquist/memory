import {
    options_init,
    counterEvents
} from './options.js';
import "../css/style.css";

export const initGame = () => {

    let main_container = document.querySelector('.main');
    let grid_container = document.querySelector('.grid_container');
    let card_types;
    let cards;


    const initBoard = (amountOfCards) => {

        const createCards = () => {
            const cardStyles = {
                type: ['triangleCard', 'squareCard', 'ellipseCard'], // the available card types 
                color: ['#FC9E4F', '#909CC2', '#118AB2', '#EDD382', '#C44536'] // my color palette, colors can of course be replaced. 
            };

            // The deck array will store an object for every card, with color and type as property.
            let deck = [];

            for (let i = 0; i < cardStyles.type.length; i++) {

                let colorsTempArr = [];
                cardStyles.color.forEach(color => colorsTempArr.push(color)); // for each card type, copy the color array from the cardstyles property. This will be used pick random colors for each card. 

                for (let x = 0; x < amountOfCards / 6; x++) {

                    let randomColor = Math.floor(Math.random() * colorsTempArr.length); // random color from the temporary color array. 

                    for (let j = 0; j < 2; j++) { // there should be pairs for every color + type. 
                        let card = document.createElement('div'),
                            card_type = document.createElement('div');

                        card.classList.add('grid_item');
                        card_type.classList.add('card_obj');

                        card.appendChild(card_type);
                        //grid_container.appendChild(card);

                        card_type.classList.add(cardStyles.type[i]);

                        if (cardStyles.type[i] == 'triangleCard') {
                            card_type.style.borderBottomColor = colorsTempArr[randomColor];
                        } else {
                            card_type.style.backgroundColor = colorsTempArr[randomColor];
                            card_type.style.borderBottomColor = colorsTempArr[randomColor]
                        }

                        deck.push(card);
                    }

                    colorsTempArr.splice(randomColor, 1); // remove the color from the temporary color array, so that the same color is not picked for more than one pair. 
                }
            }


            // Shuffle the deck array
            for (let i = deck.length - 1; i > 0; i--) {
                let j = Math.floor(Math.random() * i);

                let temp = deck[i];
                deck[i] = deck[j];
                deck[j] = temp;
            }

            return deck;

            // add each card from the shuffled deck to the grid container
            /*deck.forEach(el => {
                grid_container.appendChild(el);
            });
            */
        }

        const initCardEvents = () => {

            let clickedCount = 0;
            let clickedCards = [];
            let matchedCards = [];

            let tempBlock = false;
            let firstCard = true;

            const cardClickTrigger = (e) => {

                // Start timer when the first card is picked 
                if (firstCard) {
                    counterEvents.timer.start();
                    firstCard = false;
                };

                //Save the currently picked card (type and color) as a variable
                let current_obj = e.currentTarget.querySelector('.card_obj');

                // If the same card is picked twice, or the card has already been paired, attach the class that plays the error animation to it. 
                if (clickedCards.includes(current_obj) || matchedCards.includes(current_obj)) {
                    //attachErrorAnimation(current_obj.parentElement)

                    current_obj.parentElement.classList.add('error_card');

                    setTimeout(function () {
                        current_obj.parentElement.classList.remove('error_card');
                    }, 200);

                }


                else if (!tempBlock) {

                    // count the amount of cards picked


                    counterEvents.moves.add(1);

                    clickedCards.push(current_obj);

                    // when clicked, show the card 
                    current_obj.classList.add('show_card');


                    // If two cards are picked ... 
                    if (clickedCards.length >= 2) {

                        // ... check to see if they match. Both card type (triangle, ellipse.. ) and color has to be checked. 
                        if ((clickedCards[0].classList[1] == clickedCards[1].classList[1] && clickedCards[0].style.borderBottomColor == clickedCards[1].style.borderBottomColor)) {

                            // add the matched cards to the matchedItems array
                            matchedCards.push(clickedCards[0]);
                            matchedCards.push(clickedCards[1]);

                            // empty the clickedCards array 
                            clickedCards = [];

                        }

                        // If they don't match... 
                        else {

                            tempBlock = true;

                            // ... flip them over again, add a temporary pause for picking a new card (1 sec), empty the clickedCards array
                            setTimeout(function () {
                                clickedCards.forEach(el => {
                                    el.classList.remove("show_card");
                                });

                                tempBlock = false;
                                clickedCards = [];

                            }, 1000)
                        }


                        counterEvents.accuracy.start(counterEvents.moves.current_moves, matchedCards.length);


                    }

                }

                // check if all cards has been matched
                if (matchedCards.length >= parseInt(amountOfCards)) {

                    // make cards "unclickable" by removing the eventlistener
                    for (let card of deck) {
                        card.removeEventListener('click', cardClickTrigger);
                    }

                    // stop the timer
                    counterEvents.timer.stop();

                    // ..and show the win overlay/animation
                    winAnimation();

                }
            }

            const deck = createCards(amountOfCards);
            // get the deck of cards and add the event listener that will activate all card events. 
            deck.forEach(el => {
                grid_container.appendChild(el);
                el.addEventListener('click', cardClickTrigger);
            })

        }

        initCardEvents();

    }

    // The win display
    const winAnimation = () => {

        // show the win overlay
        document.querySelector('.winner_overlay').style.display = 'flex';

        // generate confetti on the fly for the winner overlay. CSS animation
        for (let i = 0; i < 10; i++) {
            let confett = document.createElement('div');
            confett.className = 'confetti';
            document.querySelector('.winner_overlay').appendChild(confett);
        }


        // retrieve and update the stats with the current data from the counters 
        const win_outputs = document.querySelectorAll('.win_output');

        win_outputs[0].innerHTML = counterEvents.moves.current;
        win_outputs[1].innerHTML = counterEvents.timer.current;
        win_outputs[2].innerHTML = counterEvents.accuracy.current + '%';

    }

    // The reset function
    const reset = () => {

        // reset all counters to 0
        counterEvents.resetCounters();

        // remove all cards
        grid_container.innerHTML = "";
        // hide options and win overlay
        document.querySelector('.options_overlay').style.display = 'none';
        document.querySelector('.winner_overlay').style.display = 'none';

        // get a fresh deck of cards with the currently selected amount 
        initBoard(document.querySelector('.cardAmount_active').innerHTML);
    }


    // The default card amount should be 12 for mobile screens, 18 for tablet and up. To make sure the correct amount is shown on load, I've created the cardAmountOnScrnSize that checks wether the media query matches, and then calls on the newSetOnResize to display the default amount. 
    
    const newSetOnResize = (amountID) => {
        
        document.querySelectorAll('.cardAmount').forEach(el => {
            el.classList.remove('cardAmount_active');
        });

        document.querySelector(amountID).classList.add('cardAmount_active');

        reset();
    }

    const cardAmountOnScrnSize = (mql) => {

        if (mql.matches) {
            newSetOnResize('#cardAmount_18');  
        } else {
            newSetOnResize('#cardAmount_12');
        }
    }

    const mql = window.matchMedia('(min-width: 1023px)');
    cardAmountOnScrnSize(mql);

    //cardAmountOnScrnSize is passed as a callback to the listener for the media query list -> is the current screen size bigger than 1023px? 
    mql.addListener(cardAmountOnScrnSize);

    // last but not least, the options are initiated
    options_init(reset);
}
