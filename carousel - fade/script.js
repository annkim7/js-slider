function Carousel(selector){
    this.context = document.querySelector(selector);

    this.init = function(){

        // context의 overflow 스타일을 hidden으로 
        this.context.style.overflow = "hidden";

        var children = this.context.children; // context의 자식 HTML 태그들이 반환
        // Type : HTMLCollection -> Array 형식
        // children[0], children[1] ... HTML 태그를 가져옴
        // children.length => 전체 크기를 알아낼 수 있음

        this.slides = [];
        this.slideSize = children.length; // 슬라이드 페이지 개수

        
        this.calculateContext();

        // children 안에 있는 HTML 태그들을
        // slides 안에 저장한다.
        for(var i = 0; i < this.slideSize; ++i){
            var slide = children[i];
            this.slides.push(slide);
        }

        // 슬라이드 트랙 생성
        this.buildTrack();


        //이벤트 등록
        this.bindEvents();

        
    };

    this.calculateContext = function(){
        this.slideWidth = this.context.clientWidth;
    };

    this.buildTrack = function(){
        
        this.track = document.createElement("div");
        this.track.style.position = "relative";
        this.track.style.transform = "translate(0px, 0px)";
        this.track.style.transition = "transform 300ms, height 300ms";
        
        this.setSlidePositions(true);

        

        // track 을 context의 자식 요소로 배치
        this.context.appendChild(this.track);

        // track의 transform translate 값과
        // 현재 슬라이드에 해당하는 높이값을 계산해서
        this.setTrackPosition();
    };


    this.setSlidePositions = function(initialize){

        for(var i = 0; i < this.slideSize; ++i){
            var slide = this.slides[i]; // i 번째 slide HTML 요소

            this.setSlidePosition(slide, i);

            if(i == 0){
                // slide.style.opacity = "1";
                slide.style.display = "block";
            }else{
                // slide.style.opacity = "0";
                slide.style.display = "none";
            }
            


            if(initialize == true){
                // slide 를 track으로 이동
                this.track.appendChild(slide);
            }
            
        }
    }
    
    // 전체 슬라이드의 스타일 계산
    this.setSlidePosition = function(slide, i){
        slide.style.position = "absolute";
        slide.style.top = "0px";
        slide.style.left = "0px";
        // slide.style.width = this.slideWidth + "px";

        var boxSizing = css(slide, "box-sizing");
        if(boxSizing === 'border-box'){
            slide.style.width = this.slideWidth + "px";

        }else if(boxSizing === 'content-box'){
            // 슬라이드 가로 크기에서
            // padding left/right, border left/right width(pixel)
            // 값을 계산해서 빼야됨
            var padddingLeft = css(slide, "padding-left");
            var padddingRight = css(slide, "padding-right");
            var borderLeft = css(slide, "border-left-width");// 1px solid #000
            var borderRight = css(slide, "border-right-width")

            var width = this.slideWidth - (padddingLeft + padddingRight + borderLeft + borderRight );
            slide.style.width = width + "px";
        }
    }
    
    
    

    this.bindEvents = function(){
        var carousel = this;
        window.addEventListener('resize', function(){
            // 이 안에서 this와 밖에서 this가 달라서
            // 바깥의 this를 carousel 이라는 변수에 할당해서 사용
            carousel.calculateContext();  // 기준 값 재계산
            carousel.setSlidePositions();  // 슬라이드 전체 스타일 재계산
            carousel.setTrackPosition();  // cursor 값에 맞춰 Track 위치 재계산
        });

        var imgs = carousel.context.querySelectorAll("img"); // img 태그 전체
        var imgCount = 0;
        imgs.forEach(function(img){
            imgCount += img.complete ? 0 : 1;
            img.onload = function(){
                notifyImgLoaded();
            }
        });

        function notifyImgLoaded(){
            imgCount--;
            if(imgCount == 0){
                carousel.setTrackPosition();
            }
        }
    }

    // 현재 슬라이드 상태
    // 만약, 이 슬라이드 기능의 요구사항 중에
    // 현재 슬라이드 번호(cursor)가 뭔지 알 수 있게 해주세요.
    // 라는 요구사항이 있으면
    // 그때 cursor를 객체의 노출된 변수로 지정해야 될 필요가 생기는 것
    
    var cursor = 0;
    this.next = function(){
        cursor = Math.min(cursor + 1, this.slideSize - 1);
        // this.setTrackPosition();

        this.showHide();
    }

    this.previous = function(){
        cursor = Math.max(cursor - 1, 0);
        // this.setTrackPosition();

        this.showHide();
    }

    


    this.setTrackPosition = function(){
        this.track.style.transform = "translate(-"+(cursor*this.slideWidth)+"px, 0px)";
        this.track.style.height = this.getCurrentSlideHeight()+"px";

    };

    this.getCurrentSlideHeight = function(){
        console.log();
        return this.slides[cursor] // 현재 슬라이드
                   .clientHeight;

    };

    this.showHide = function(){

        for(var i = 0; i < this.slideSize; ++i){

            if( i == cursor){
                // this.slides[i].style.opacity = "1";
                this.slides[i].style.display = "block";
                this.track.style.height = this.getCurrentSlideHeight()+"px";
            }else{
                // this.slides[i].style.opacity = "0";
                this.slides[i].style.display = "none";
            }
            
        }
    };

    //cursor의 값만 알 수 있게 해주고
    //cursor를 임의로 바꿀 수 없게 해주세요.

    this.getSlideNumber = function(){
        return cursor;
    }

    this.init();
    
    function css(element, cssProperty){
        var cssValue = window.getComputedStyle(element)[cssProperty];
        // 예) cssValue <= "20px"
        // "20px", "-30px", "100.56px"
        // 정규식으로 숫자부분만 추출하기
    
        var match = cssValue.match(/^(-?[0-9]+(\.[0-9]+)?)px$/);
        if(match != null && match[1]){
            return Number(match[1])
        }
    
        return cssValue;
    }

   
}

