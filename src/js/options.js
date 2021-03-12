import "../css/style_options.css";

export const counterEvents = {

     // Timer, moves and accuracy are all arranged as objects with corresponding functions to update current counter property. 
     
     // TIMER
     timer: {
         updateCounter: function (current) {

             if (this.io) {
                 document.querySelector('.time_counter').innerHTML = current;
             } else {
                 document.querySelector('.time_counter').innerHTML = '--:--';
             }

         },
         io: true,
         current: '00:00',
         t: 0,
         start: function () {

             let s = 0;

             let m = '0' + 0;

             this.t = setInterval(() => {
                 s++;

                 s < 10 ? s = '0' + s : s;

                 if (s > 59) {

                     m++;
                     m < 10 ? m = '0' + m : m;

                     s = 0;
                 }

                 this.current = `${m}:${s}`;
                 this.updateCounter(this.current);

             }, 1000)

         },
         stop: function () {
             clearInterval(this.t);
         },
         reset: function () {
             this.stop();
             this.updateCounter('00:00');
         }
     },
     
     //MOVES
     moves: {
         updateCounter: function (current) {
             document.querySelector('.moves_counter').innerHTML = current;
         },
         io: true,
         current: 0,
         add: function (i, reset_value) {
             this.current += i;
             if (this.io) {
                 this.updateCounter(this.current);
             } else {
                 this.updateCounter('-');
             }
         },
         reset: function () {
             this.current = 0;
             this.updateCounter(this.current);

             if (this.io) {
                 this.updateCounter(this.current);
             } else {
                 this.updateCounter('-');
             }
         }
     },
     
     //ACCURACY
     accuracy: {
         io: true,
         updateCounter: function (current) {
             document.querySelector('.accuracy_counter').innerHTML = current;
         },
         current: 0 + '%',
         start: function (moves, matches) {

             this.current = Math.trunc(matches / counterEvents.moves.current * 100);

             if (this.io) {

                 this.updateCounter(this.current + '%');
             } else {
                 this.updateCounter('-');
             }

         },
         reset: function () {
             this.current = 0 + '%';
             if (this.io) {
                 this.updateCounter(this.current);
             } else {
                 this.updateCounter('-');
             }
         }
     },
     resetCounters: function () {
         counterEvents.timer.reset();
         counterEvents.moves.reset();
         counterEvents.accuracy.reset();
     }
 }


// if a switch to hide the corresponding counter is toggled, the io property of the counter should change. 
 export const options_init = (fn) => {
     const inputs = document.querySelectorAll('.switch input');

     inputs.forEach(el => {
         el.addEventListener('click', (e) => {

             let type = e.target.classList[0];

             if (e.target.checked) {
                 counterEvents[type].io = true;
                 counterEvents[type].updateCounter(counterEvents[type].current);
             } else {
                 counterEvents[type].io = false;
                 if (type == 'timer') {
                     counterEvents[type].updateCounter('--:--');
                 } else {
                     counterEvents[type].updateCounter('-');
                 }
             }


         })
     });

     // triggers for which amount of cards is selected
     const cardAmount = document.querySelectorAll('.cardAmount');
     cardAmount.forEach(el => {
         el.addEventListener('click', (e) => {
             cardAmount.forEach(el => {
                 el.classList.remove('cardAmount_active')
             })
             e.target.classList.add('cardAmount_active');
         })
     });

     const btns = () => {

         const btn_restart = document.querySelectorAll('.restart');
         const btn_settings = document.querySelector('.settings');
         const options_overlay = document.querySelector('.options_overlay');
         const settings = document.querySelectorAll('.settings');
         const winner_overlay = document.querySelector('.winner_overlay');

         const close_btns = document.querySelectorAll('.close_btn_wrapper');

         btn_settings.addEventListener('click', function () {
             options_overlay.style.display = 'flex';

         });

         for (const close_btn of close_btns) {
             close_btn.addEventListener('click', () => {
                 options_overlay.style.display = 'none';
                 winner_overlay.style.display = 'none';
             });

         }


         btn_restart.forEach(el => {
             el.addEventListener('click', fn);
             
         })
     }
     btns();

 }

