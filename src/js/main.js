// плавный скролл
// $("a[href='#main'], .nav__list a").mPageScroll2id();

var swiper = new Swiper('.swiper', {
    slidesPerView: 2,
    spaceBetween: 0,
});

var swiper2 = new Swiper('.swiper-2', {
    slidesPerView: 2,
    loop: true,
    spaceBetween: 0
});

var swiper = new Swiper('.swiper-container', {
    spaceBetween: 20,
    slidesPerView: 8,
    autoplay: {
        delay: 200
    },
});

var pause = false;
var placed_elements = new Array();

var exportShapesMap = function() {
    if (pause) {
        return 0;
    }
    var map = '';
    $('.wrapper .back-shapes img, .wrapper .back-shapes em').each(function(e) {
        var icon = $(this).attr('src');
        var top = $(this).css('top');
        var left = $(this).css('left');
        top = ((100 * parseInt(top)) / window.innerHeight) + '%';
        left = ((100 * parseInt(left)) / window.innerWidth) + '%';
        var ti = (5 * parseInt($(this).attr('data-ti'))) / 100;
        if (this.tagName == 'IMG') {
            map += '<img src="' + $(this).attr('src') + '" class="floating" style="top:' + top + ';left:' + left + ';animation-delay:-' + ti + 's;"/>' + "\n";
        } else {
            map += '<em class="' + $(this).attr('class') + '" style="top:' + top + ';left:' + left + ';animation-delay:-' + ti + 's;"></em>' + "\n";
        }
    });
    $('#shape-spawner-map').val(map);
}

$('.shape-spawner div img').click(function() {
    $(this).parent().find('img').each(function() {
        $(this).removeClass('active');
    });
    $(this).parent().next().find('em').each(function() {
        $(this).removeClass('active');
    });
    $(this).addClass('active');
});

$('.shape-spawner div em').click(function() {
    $(this).parent().prev().find('img').each(function() {
        $(this).removeClass('active');
    });
    $(this).parent().find('em').each(function() {
        $(this).removeClass('active');
    });
    $(this).addClass('active');
});

$('.wrapper').click(function(e) {
    var offset = {
        x: e.pageX - $(this).offset().left,
        y: e.pageY - $(this).offset().top
    };

    placed_elements.push($('.shape-spawner div .active').clone()
        .css({ left: offset.x - 19.5, top: offset.y - 19.5 })
        .addClass('floating')
        .attr('data-ti', 0)
        .appendTo('.wrapper .back-shapes'));
    var elem = placed_elements[placed_elements.length - 1];
    elem.css({
        left: ((100 * parseInt(elem.css('left'))) / window.innerWidth) + '%',
        top: ((100 * parseInt(elem.css('top'))) / window.innerHeight) + '%'
    });
});

$('#export-map').click(function() {
    $('#shape-spawner-map').toggle(300);
});

$('#pause-refleshing').click(function() {
    if (pause == false) {
        pause = true;
        $(this).html('Resume map refleshing');
    } else {
        pause = false;
        $(this).html('Pause map refleshing');
    }
});

$('#remove-last-placed').click(function() {
    $(placed_elements.pop()).remove();
});

$('#remove-all').click(function() {
    placed_elements = new Array();
    $('.wrapper .back-shapes > *').each(function() {
        $(this).remove();
    });
});

$('#icon-selector-show').click(function() {
    $('.icon-selector').toggle(300);
});

$('#icon-selector-close').click(function() {
    $(this).parent().toggle(300);
});

$('.icon-selector #selectable-icon').click(function() {
    $('.shape-spawner .active').removeClass('active');
    $('#icon-placeholder > em').attr('class', 'active epic-icon ' + $(this).attr('class'));
});

setInterval(exportShapesMap, 100);
setInterval(function() {

    $('.wrapper .back-shapes img, .wrapper .back-shapes em').each(function() {
        var ti = parseFloat($(this).attr('data-ti'));
        if (ti == 100) {
            $(this).attr('data-ti', '0');
        } else {
            $(this).attr('data-ti', ti + 1);
        }
    });

}, (5000 / 100));

// set and cache variables
var w, container, carousel, item, radius, itemLength, rY, ticker, fps;
var mouseX = 0;
var mouseY = 0;
var mouseZ = 0;
var addX = 0;


// fps counter created by: https://gist.github.com/sharkbrainguy/1156092,
// no need to create my own :)
var fps_counter = {

    tick: function() {
        // this has to clone the array every tick so that
        // separate instances won't share state 
        this.times = this.times.concat(+new Date());
        var seconds, times = this.times;

        if (times.length > this.span + 1) {
            times.shift(); // ditch the oldest time
            seconds = (times[times.length - 1] - times[0]) / 1000;
            return Math.round(this.span / seconds);
        } else return null;
    },

    times: [],
    span: 20
};
var counter = Object.create(fps_counter);



$(document).ready(init)

function init() {
    w = $(window);
    container = $('#contentContainer');
    carousel = $('#carouselContainer');
    item = $('.carouselItem');
    itemLength = $('.carouselItem').length;
    fps = $('#fps');
    rY = 360 / itemLength;
    radius = Math.round((250) / Math.tan(Math.PI / itemLength));

    // set container 3d props
    TweenMax.set(container, { perspective: 5000 })
    TweenMax.set(carousel, { z: -(radius) })

    // create carousel item props

    for (var i = 0; i < itemLength; i++) {
        var $item = item.eq(i);
        var $block = $item.find('.carouselItemInner');

        //thanks @chrisgannon!        
        TweenMax.set($item, { rotationY: rY * i, z: radius, transformOrigin: "50% 50% " + -radius + "px" });

        animateIn($item, $block)
    }

    // set mouse x and y props and looper ticker
    window.addEventListener("mousemove", onMouseMove, false);
    ticker = setInterval(looper, 1000 / 60);
}

function animateIn($item, $block) {
    var $nrX = 360 * getRandomInt(2);
    var $nrY = 360 * getRandomInt(2);

    var $nx = -(2000) + getRandomInt(4000)
    var $ny = -(2000) + getRandomInt(4000)
    var $nz = -4000 + getRandomInt(4000)

    var $s = 3.5 + (getRandomInt(10) * .1)
    var $d = 1 - (getRandomInt(8) * .1)

    TweenMax.set($item, { autoAlpha: 1, delay: $d })
    TweenMax.set($block, { z: $nz, rotationY: $nrY, x: $nx, y: $ny, autoAlpha: 0 })
    TweenMax.to($block, $s, { delay: $d, rotationY: 0, z: 0, ease: Expo.easeInOut })
    TweenMax.to($block, $s - .5, { delay: $d, x: 0, y: 0, autoAlpha: 1, ease: Expo.easeInOut })
}

function onMouseMove(event) {
    mouseX = -(-(window.innerWidth * .5) + event.pageX) * .0005;
    mouseY = -(-(window.innerHeight * .5) + event.pageY) * .0005;
}

// loops and sets the carousel 3d properties
function looper() {
    addX += mouseX
    TweenMax.to(carousel, 1, { rotationY: addX, ease: Quint.easeOut })
    TweenMax.set(carousel, { z: mouseZ })
    fps.text('Framerate: ' + counter.tick() + '/60 FPS')
}

function getRandomInt($n) {
    return Math.floor((Math.random() * $n) + 1);
}