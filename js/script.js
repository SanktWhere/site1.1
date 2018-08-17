$(function (){

    var $body = $('body');
    var nav = $('nav'); 
    var navItems = $('ul li', nav);
    var menuBtn = $('#menu-btn');
    var phoneBtn = $('#phone-btn');
    var navbar = $("#navbar");
    var sections = $('section');
    var popup = $('.popup');

    $('.wrapper').height(window.innerHeight);
    $(window).on('resize', function(){
        $('.wrapper').height(window.innerHeight);
    });

    var c = 0;
    var interval = null;

    function addClass(ob, classname){
        $(ob).addClass(classname);
    }

    function setBg(ob, src){
        $(ob).css({
            background: 'url('+ src +') center no-repeat'
        });
    }

    function navAnimate(d){
        nav.css({
            transition: 'all 0.5s',
            transform: 'translateX('+d+')'
        });
    }

    function navbarInit() {
        for(var i = 0; i < max - 1; i++) {
            navbar.append($('<li>').addClass('navbar__item'));
        }
        $('li', navbar).eq(0).addClass('active');
        $('li', navbar).on('click', function(){
            var li = $(this);
            var index = li.index();
            current = index+1;
            setPosition(current);
        });
    }

    phoneBtn.on('click', function(e){
        e.preventDefault();
        $(this).toggleClass('opened');
        $('.popup').toggleClass('opened').toggleClass('fadeIn');
        menuBtn.toggleClass('hidden');
    });

    menuBtn.on('click', function(e){
        e.preventDefault();
        $(this).toggleClass('opened');
        if($(this).hasClass('opened')){            
            navAnimate('0');
            phoneBtn.addClass('hidden');
            navItems.each(function(i, el){
                setTimeout(function(){
                    addClass(el, 'fromLeft');
                }, i*100);
            });
        } else {            
            navAnimate('100%');
            phoneBtn.removeClass('hidden');
            setTimeout(function(){
                navItems.removeClass('fromLeft');
            }, 500);
        }
    });

    $('.section__bg').each(function(){
        var imgs = $('img', this);
        if(imgs.length == 1) {
            setBg(this, imgs.get(0).src);
            $(this).parent().addClass('one')                         
        } else {
            setBg(this, imgs.eq(0).get(0).src);
            $(this).parent().addClass('multi');                            
        }
    });

    function setPosition(cur) {

        var li = $('li.active', navbar);
        var activeIndex = li.index();
        var active = sections.eq(activeIndex);

        popup.removeClass('opened').removeClass('fadeIn');
        phoneBtn.removeClass('opened')
        menuBtn.removeClass('hidden');

        li.removeClass('active');
        $('li', navbar).eq(current-1).addClass('active');

        if(current > 1) {
            navItems.removeClass('active');
            navItems.eq(current-2).addClass('active');
        }

        sections.each(function(){
            var $this = $(this);
            var index = $(this).index();
            var bg = $('.section__bg', this);
            var content = $('.section__content', this);

            if(index == current) {
                content.find('.animated').addClass('fadeUp');
                // content.find('.animated').each(function(i, el){
                //     setTimeout(function(){
                //         addClass(el, 'fadeUp');
                //     }, i*300);
                // });
                if($this.hasClass('one')) bg.addClass('scaleDown-one');
                else {
                    var imgs = bg.find('img');                                                
                    bg.addClass('scaleDown-multi');
                    if(!interval) {
                        interval = setInterval(function(){
                            ++c < imgs.length ? setBg(bg, imgs.eq(c).get(0).src) : (c=0, setBg(bg, imgs.eq(c).get(0).src));
                        }, 7000);
                    }                    
                }
            } else content.find('.animated').css('visibility', 'hidden');

            $this.css({
                transition: 'all 0s',
                transform: 'translateY('+ ($this.index() < current ? -100 : 100) +'%)'
            });

            switch (index) {
                case current:
                    $this.css({
                        transition: 'all 1s',
                        transform: 'translateY(0%)'
                    });
                break;
                case activeIndex+1:
                    $this.css({
                        transition: 'all 1s',
                        transform: 'translateY('+ (activeIndex < current ? -100 : 100) +'%)'
                    });
                break;
            }

            setTimeout(function(){
                $body.removeClass('move');
                if(index != current) {                   
                    content.find('.animated').removeClass('fadeUp');
                }
            }, 1000);
        });
    }

    var current = 1;
    var max = $('section').length;
    navbarInit();
    setPosition(current);

    $(window).on('wheel', function(e){
        if(!$body.hasClass('move') && !popup.hasClass('opened')) 
        {
            var y = e.originalEvent.deltaY;
            if(y < 0 && current==1) return false;
            else 
                if(y > 0 && current==max) return false;
                else {
                    $body.addClass('move');
                    y < 0 ? setPosition(--current) : setPosition(++current);                                                         
                }
        }
    });

    var touchObject = {
        startPointY: 0,
        endPointY: 0,
        time: null
    };

    $(document).on('touchstart', function(event){
        var o = $('section.screen-1').find('.section__content').find('p');
        var touch = event.originalEvent.touches[0] || event.originalEvent.changedTouches[0];
        touchObject.startPointY = touch.clientY;
        touchObject.time = (new Date()).getTime();
    });

    $(document).on('touchend', function(event){
        var o = $('section.screen-1').find('.section__content').find('p');
        var touch = event.originalEvent.touches[0] || event.originalEvent.changedTouches[0];
        touchObject.endPointY = touch.clientY;
        if(!popup.hasClass('opened')) { 
            if( Math.abs(touchObject.startPointY - touchObject.endPointY) > 50
                    && !$body.hasClass('move')
                    && (new Date).getTime() - touchObject.time < 1000) 
                {
                    if(touchObject.startPointY < touchObject.endPointY && current==1) return false;
                    else 
                        {
                            if(touchObject.startPointY > touchObject.endPointY && current==max) return false;
                            else 
                                {
                                    $body.addClass('move');
                                    touchObject.startPointY < touchObject.endPointY ? setPosition(--current) : setPosition(++current);
                                }                   
                        }
                }
        }
    });

    sections.on('click', function(){
        navAnimate('100%');
        menuBtn.removeClass('opened');
        phoneBtn.removeClass('hidden');
        navItems.removeClass('fromLeft');        
    });

    $('a.nav__item-link[data-target]', nav).on('click', function(e){
        e.preventDefault();
        if(['target'] in this.dataset) {
            e.preventDefault();
            var name = this.dataset['target'];
            var index = $('section[name="'+name+'"]').index();
            current = index;
            navAnimate('100%');
            phoneBtn.removeClass('hidden');
            setPosition(current);
            menuBtn.removeClass('opened');
            navItems.removeClass('fromLeft');
        }
    });

    $('a.nav__item-link[data-popup]', nav).on('click', function(e){
        e.preventDefault();
        phoneBtn.addClass('opened').removeClass('hidden');
        $('.popup').addClass('opened').addClass('fadeIn');
        menuBtn.addClass('hidden');
        navAnimate('100%');
        menuBtn.removeClass('opened');
        navItems.removeClass('fromLeft');
    });

    $('#scroll-down').on('click', function(){
        current < max && setPosition(++current); 
    });
    
    let prevImg;
    let prevList;
    $('.section-list').on('click', function(e){
        if  (e.target.firstElementChild === prevImg) {
            e.target.firstElementChild.classList.toggle("show");
            return;
        }
        if (e.target.classList.contains("section-list__item")) {
            if (prevImg) {
                prevImg.classList.remove('show');
            }
            e.target.firstElementChild.classList.toggle('show');
            prevImg = e.target.firstElementChild;
        }
        if (!e.target.classList.contains("section-list")) {
            return;
        } 
        let listLi = this.children;
        if (prevList) {
            for (let i = 0; i < prevList.children.length; i++) {
                prevList.children[i].classList.toggle('show');
            } 
            prevList.classList.toggle('section-list__tytle');
            if (prevList === e.target) {
                prevList = undefined;
                return;
            }
        }
        this.classList.toggle('section-list__tytle');
        for (let i = 0; i < listLi.length; i++) {
            listLi[i].classList.toggle('show');
            
        }     
        prevList = e.target;
    });
}());