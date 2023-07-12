'use strict';
let gameTime = 60;
let firstMove = true;
let compl = false;
let path = 'img/energy.png';

let rand = (max) => {
    return Math.round(Math.random() * max)
}

function addZero(param) {
    return param < 10 ? '0' + param : param;
}

function shuffle() {
    let cont = $('.source');
    let boxs = cont.children();
    while (boxs.length) {
        cont.append(boxs.splice(rand(boxs.length), 1)[0])
    }
}

function start() {
    $('#start').attr('disabled', true);
    $('#selPic').attr('disabled', true);
    $('#check').attr('disabled', false);
    gameTime = 60;
    let st = setInterval(() => {
        gameTime -= 1;

        if (gameTime <= 0 && compl === false) {
            $('#check').attr('disabled', true);
            $('#mess').text(`It's a pity, but you lost`);
            $('.modal-box')[0].classList.add('showf');
            clearInterval(st);
        }
        if (compl) clearInterval(st);

        gameTime < 0 ? $('.time').html(`00:${addZero(0)}`) : $('.time').html(`00:${addZero(gameTime)}`);

        if (firstMove && gameTime <= 0) $('.time').html('01:00');
    }, 1000);
}

function reset() {
    $('.sort').sortable({
        connectWith: '.dest-box',
        containment: '.pole',
        revert: true,
        activate: function () {
            if (firstMove) { start(); firstMove = false; }
        },
        stop: function (event, ui) {
            if (ui.item[0].parentNode.children.length > 1) {
                $('.dest-box').each(function (ind, elem) {
                    if (elem.children.length == 0) {
                        elem.append(ui.item[0]);
                        return false
                    }
                });
            }
        }
    });

    $('.dest-box').sortable({
        connectWith: '.dest-box',
        containment: '.dest',
        revert: false,
    });

    $('.source-box-img').each(function (ind, elem) {
        let offX = 0, offY = 0;
        if (ind >= 0 && ind <= 3) { offX = -1 * ind * 100 }
        else if (ind >= 4 && ind <= 7) { offX = -1 * ((ind - 4) * 100); offY = -100; }
        else if (ind >= 8 && ind <= 11) { offX = -1 * ((ind - 8) * 100); offY = -200; }
        else if (ind >= 12 && ind <= 15) { offX = -1 * ((ind - 12) * 100); offY = -300; }
        elem.style.background = `url(${path})`;
        elem.style.backgroundRepeat = 'no-repeat';
        elem.style.backgroundPosition = `${offX}px ${offY}px`;
    });

    $('#check').attr('disabled', true);
    $('#realcheck')[0].classList.add('hide');
    shuffle();
}
/*------------------------------------------------------------------------------------------- */
$(document).ready(function () {
    $('.modal-wind').draggable({
        revert: true,
        containment: '.container'
    })
    reset()
});/*docReady */

/*------------------------------------------------------------------------------------------- */

$('#selPic').on('change', function () {
    switch (this.selectedIndex) {
        case 0: path = 'img/energy.png'; break;
        case 1: path = 'img/mario.jpeg'; break;
        case 2: path = 'img/naruto.jpg'; break;
    }
    $('.source-box').each(function (ind, elem) {
        elem.innerHTML = `<div class="source-box-img" id="${ind}"></div>`;
    });
    $('.dest-box').each(function (ind, elem) {
        elem.innerHTML = ``;
    });
    reset()
});/*select picture */

/*------------------------------------------------------------------------------------------- */
$('#close').on('click', function () {
    $('.modal-box')[0].classList.remove('showf');
    $('#realcheck')[0].classList.add('hide');
});/*close inside modal */

/*------------------------------------------------------------------------------------------- */
$('#realcheck').on('click', function () {
    compl = true;
    $('.source-box-img').each(function (ind, elem) {
        if (elem.id != ind) {
            gameTime = 0;
            $('#realcheck')[0].classList.add('hide');
            compl = false;
        }
    });
    if (compl) {
        gameTime = 0;
        $('#realcheck')[0].classList.add('hide');
        $('#check').attr('disabled', true);
        $('#mess').text(`Woohoo, well done, you did it!`);
        $('.modal-box')[0].classList.add('showf');
    }
});/*check inside modal */

/*------------------------------------------------------------------------------------------- */
$('#check').on('click', function () {
    $('.modal-box')[0].classList.add('showf');
    if (gameTime >= 1) {
        $('#realcheck')[0].classList.remove('hide');
        if (!compl) $('#mess').text(`You still have time, you sure? ${$('.time').text()}`);
        let ch = setInterval(() => {

            if (gameTime <= 1) {
                clearInterval(ch);
                $('#realcheck')[0].classList.add('hide');
            }
            else if (!compl) $('#mess').text(`You still have time, you sure? ${$('.time').text()}`);
        }, 1000);
    }
});/*check result button */

/*------------------------------------------------------------------------------------------- */
$('#new').on('click', function () {
    firstMove = true;
    gameTime = 0;
    compl = false;
    $('.time').text('01:00');
    $('#start').attr('disabled', false);
    $('#selPic').attr('disabled', false);
    $('.source-box').each(function (ind, elem) {
        elem.innerHTML = `<div class="source-box-img" id="${ind}"></div>`;
    });
    $('.dest-box').each(function (ind, elem) {
        elem.innerHTML = ``;
    });

    reset()
});/*new game button */

/*------------------------------------------------------------------------------------------- */
$('#start').on('click', function () {
    gameTime = 60;
    firstMove = false;
    start()
});/*start game button */

/*------------------------------------------------------------------------------------------- */
$('#grid').on('click', function () {
    if (this.checked) {
        $('.source-box').css({
            outline: '0.5px dashed red'
        });
        $('.dest-box').css({
            outline: '0.5px dashed red'
        });
    }
    else {
        $('.source-box').css({
            outline: 'none'
        });
        $('.dest-box').css({
            outline: 'none'
        });
    }
});/*make grid checkbox */

/*------------------------------------------------------------------------------------------- */
$('#help').on('click', function () {
    if (this.checked) {
        $('.help').css({
            background: `url(${path})`,
            backgroundSize: 'cover'
        });
        this.checked = false;
        this.disabled = true;
        setTimeout(() => {
            this.disabled = false;
        }, 20000)
        setTimeout(() => {
            $('.help').css({
                background: 'none'
            });

        }, 1500)
    }

});/*make help checkbox */