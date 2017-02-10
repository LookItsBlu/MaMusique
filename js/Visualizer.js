var canvas, ctx, source, context, analyser, fbc_array, bar_x, bar_height, Musique;
function initVisualizer() {
    context = new AudioContext();
    analyser = context.createAnalyser();
    canvas = document.getElementById("visualizer");
    ctx = canvas.getContext('2d');
    ctx.fillStyle = "#3f3f3f";
    Musique = $("#Musique1").contentDocument;
    console.log(Musique);
    /*analyser.smoothingTimeConstant = 0.8;

    source = context.createMediaElementSource(Musique);
    source.connect(analyser);
    analyser.connect(context.destination);

    framelooper()*/
}

var fps = 60;
var now;
var then = Date.now();
var interval = 1000/fps;
var delta;

function framelooper() {

    window.requestAnimationFrame(framelooper);

    now = Date.now();
    delta = now - then;

    if (delta > interval) {
        then = now - (delta % interval);

        fbcArray = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(fbcArray);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (i=0; i < bars; i++) {
            bar_x = i * bar_x_spaces + 0.5;
            bar_height = -(fbcArray[i] / bar_height_sensibility);

            ctx.fillRect(bar_x, canvas.height/2, bar_width, bar_height/2);
            ctx.fillRect(bar_x, canvas.height/2, bar_width, -bar_height/2);
        }
    }
}

$("document").ready(function(){
    iframe = document.getElementById("Musique1");
    iframe.src = "https://bandcamp.com/EmbeddedPlayer/album=3008457164/size=large/bgcol=ffffff/linkcol=0687f5/minimal=true/transparent=true/";
    if (navigator.userAgent.indexOf("MSIE") > -1 && !window.opera) {
      iframe.onreadystatechange = function(){
        if (iframe.readyState == "complete"){
            initVisualizer();
        }
      };
    } else {
      iframe.onload = function(){
        initVisualizer();
      };
    }
});
