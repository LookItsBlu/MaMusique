$(document).ready(function(){
    var url = "";
    var Song = 1;
    var songTotal = songNames.length - 1;
    var tweenSongs = 0;
    var songList = [];
    var songListNumber = 1;
    var PlayPauseState = 0;


    //Media Player Initialize & Misc. functions
    function listSongs() {
        $("#Musique").html("");
        url = "Musiques/" + Song + ".mp3";
        $("#Musique").attr("src", url);
        $(".mediaName span").html(songNames[Song]);
    }

    //Play/Pause
    $(".playBtn").on("mousedown", function (){
        if (PlayPauseState == 0) {
            Musique.playbackRate = audioSpeed;
            Musique.play();
            PlayPauseState = 1;
        }
        else {
            Musique.pause();
            PlayPauseState = 0;
        }
    });

    //Volume Slider
    $(".mediaVolume").slider({
        orientation: "horizontal",
        range: "min",
        min: 0,
        max: 100,
        value: 100,
        step: 2,
        animate: true,
        slide: function (event, ui) {
            Musique.volume = ui.value / 100;
            console.log("test");
        }
    });

    $(".mediaVolume .ui-slider-handle").dblclick(function(){
        $(".mediaVolume").slider({ value: 100 });
        Musique.volume = 1;
    });

    //TimeLine
    $("#Musique").bind("timeupdate", function (){
        var mediaTime = 0;
        if (Musique.currentTime > 0) {
            mediaTime = (100 / Musique.duration) * Musique.currentTime;
        }
        $(".mediaTimelineInner").css("width", mediaTime + "%");

        /*
        var currentTimeSeconds = "00";
        var totalTimeSeconds = "00";

        if (Musique.currentTime%60 < 1){ currentTimeSeconds = "00" }
        else if (Musique.currentTime%60 < 10){ currentTimeSeconds = "0" +parseInt((Musique.currentTime%60)) }
        else { currentTimeSeconds = parseInt((Musique.currentTime%60)) }

        if (Musique.duration%60 < 1){ totalTimeSeconds = "00" }
        else if (Musique.duration%60 < 10){ totalTimeSeconds = "0" +parseInt((Musique.duration%60)) }
        else { totalTimeSeconds = parseInt((Musique.duration%60)) }

        var currentTime = Math.floor(Musique.currentTime/60)+ ":" +currentTimeSeconds;
        var totalTime = Math.floor(Musique.duration/60)+ ":" +totalTimeSeconds;
        $("#mediaCurrentTime").html(currentTime);
        $("#mediaTotalTime").html(totalTime);
        $("#mediaTime").html(currentTime+ " / " +totalTime);
        */
    });

    $(".mediaTimelineOuter").click(function(e){
        var clickPos = (e.pageX - 7) - this.offsetLeft;
        var maxWidth = $(this).width();
        var percentage = clickPos / maxWidth * 100;
        $(".mediaTimelineInner").css("width", percentage + "%");
        Musique.currentTime = (percentage * Musique.duration)/100;
    });
    $(".mediaTimelineOuter").mousedown(function(e){
        //$(".mediaTimelineOuter").animate({paddingTop: "10px"}, 200);

        $(".mediaTimelineOuter").mousemove(function(e){
            var clickPos = (e.pageX) - this.offsetLeft;
            var maxWidth = $(this).width();
            var percentage = clickPos / maxWidth * 100;
            $(".mediaTimelineInner").css("width", percentage + "%");
            $(".mediaTimelineInnerSmall").css("width", percentage + "%");
            Musique.currentTime = (percentage * Musique.duration)/100;
        });
    });
    $(document).mouseup(function(){
        $(".mediaTimelineOuter").animate({paddingTop: "0px"}, 200);
        $(".mediaTimelineOuter").off("mousemove");
    });

    //AutoPlay Next Track
    $("#Musique").bind("ended", function (){
        //Play random track
        Song++
        listSongs();
        Musique.play();
    });


    //Launch Media Player Initialisation
    listSongs();
});
