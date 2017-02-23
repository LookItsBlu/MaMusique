$(document).ready(function(){
    var url = "";
    var currentAlbum = 1;
    var SongIndex = 1;
    var songTotal = 1;
    var tweenSongs = 0;
    var songList = [];
    var songListNumber = 1;
    var PlayPauseState = 0;

    //Media Player Initialize & Misc. functions
    function listSongs() {
        $("#Musique").html("");
        url = "Musiques/"+ SONGS[currentAlbum][0] +"/"+ SONGS[currentAlbum][1][SongIndex-1] +".mp3";
        $("#Musique").attr("src", url);
        $(".mediaName span").html(SONGS[currentAlbum][0]+" - "+SONGS[currentAlbum][1][SongIndex-1]);

        songTotal = SONGS[currentAlbum][1].length;
    }

    //Play/Pause
    $(".playBtn").on("click", function (){
        console.log(PlayPauseState);
        if (PlayPauseState == 0) {
            $(this).addClass("playBtnON");
            $("#Musique").get(0).play();
            PlayPauseState = 1;
        }
        else {
            $(this).removeClass("playBtnON");
            $("#Musique").get(0).pause();
            PlayPauseState = 0;
        }
    });

    //Volume Slider
    $(".mediaVolume").slider({
        orientation: "horizontal",
        range: "min",
        min: 0,
        max: 100,
        value: 50,
        step: 2,
        animate: true,
        slide: function (event, ui) {
            $("#Musique").get(0).volume = ui.value / 100;
            console.log("test");
        }
    });

    $(".mediaVolume .ui-slider-handle").dblclick(function(){
        $(".mediaVolume").slider({ value: 100 });
        $("#Musique").get(0).volume = 1;
    });

    //TimeLine
    $("#Musique").bind("timeupdate", function (){
        var mediaTime = 0;
        if ($("#Musique").get(0).currentTime > 0) {
            mediaTime = (100 / $("#Musique").get(0).duration) * $("#Musique").get(0).currentTime;
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
        var clickPos = (e.pageX) - this.offsetLeft;
        var maxWidth = $(this).width();
        var percentage = clickPos / maxWidth * 100;
        $(".mediaTimelineInner").css("width", percentage + "%");
        $("#Musique").get(0).currentTime = (percentage * $("#Musique").get(0).duration)/100;
    });
    $(".mediaTimelineOuter").mousedown(function(e){
        //$(".mediaTimelineOuter").animate({paddingTop: "10px"}, 200);
        $("body").css("user-select", "none");
        $("html").mousemove(function(e){
            var clickPos = (e.pageX + 1) - this.offsetLeft;
            var maxWidth = $(this).width();
            var percentage = clickPos / maxWidth * 100;
            $(".mediaTimelineInner").css("width", percentage + "%");
            $(".mediaTimelineInnerSmall").css("width", percentage + "%");
            $("#Musique").get(0).currentTime = (percentage * $("#Musique").get(0).duration)/100;
        });
    });
    $(document).mouseup(function(){
        $("html").off("mousemove");
    });

    //AutoPlay Next Track
    $("#Musique").bind("ended", function (){
        //Play random track
        if(SongIndex==songTotal) {
            $(".playBtn").click();
            $("#Musique").stop();
        } else {
            SongIndex++;
            listSongs();
            $("#Musique").get(0).play();
        }
    });


    //Launch Media Player Initialisation
    $("#Musique").get(0).volume = 0.5;
    listSongs();
});
