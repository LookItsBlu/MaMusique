var requestIdVisualizer, requestIdVisualizerIdle;

var canvas, ctx, source, context, analyser, fbc_array, bar_x, bar_height, Musique;
function initVisualizer() {


    context = new AudioContext();
    analyser = context.createAnalyser();
    canvas = document.getElementById("visualizer");
    ctx = canvas.getContext('2d');
    ctx.fillStyle = visualizerColor;
    Musique = document.getElementById("Musique");
    analyser.smoothingTimeConstant = 0.5;
    source = context.createMediaElementSource(Musique);
    source.connect(analyser);
    analyser.connect(context.destination);

    //if(Musique.paused==false){visualizerStart();}
    visualizerStart();
}

var fps = 60;
var now;
var then = Date.now();
var interval = 1000/fps;
var delta;

function framelooper() {
    now = Date.now();
    delta = now - then;

    if (delta > interval) {
        then = now - (delta % interval);

        fbcArray = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(fbcArray);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (i=0; i < bars; i++) {
            bar_x = i * bar_x_spaces + 0.5;

            if(fbcArray[i]<10){fbcArray[i]=10;}

            bar_height = -(fbcArray[i] / bar_height_sensibility);

            ctx.fillRect(bar_x, canvas.height/2, bar_width, bar_height/2);
            ctx.fillRect(bar_x, canvas.height/2, bar_width, -bar_height/2);
        }
    }

    if(Musique.paused==true){
        var allMuted = true;
        for (i=0; i < bars; i++) {
            if(fbcArray[i]>11){
                allMuted = false;
            }
        }
        if(allMuted){ visualizerStop(); return; }
    }

    requestIdVisualizer = window.requestAnimationFrame(framelooper);
}

function visualizerStart() {
    if (!requestIdVisualizer) {
        visualizerIdleStop();
        framelooper();
    }
}

function visualizerStop() {
    if (requestIdVisualizer) {
        window.cancelAnimationFrame(framelooper);
        requestIdVisualizer = undefined;
    }
    visualizerIdleStart();
}




var counter, y, increase;
counter = 0, y=0;
function framelooperIdle() {
    now = Date.now();
    delta = now - then;

    if (delta > interval) {
        then = now - (delta % interval);

        fbcArray = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(fbcArray);
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (i=0; i < 359; i++) {
            bar_x = i * bar_x_spaces + 0.5;

            if(Musique.paused==true){
                idleSine(i);
            }

            bar_height = -(fbcArray[i] / bar_height_sensibility);

            ctx.fillRect(bar_x, canvas.height/2, bar_width, bar_height/2);
            ctx.fillRect(bar_x, canvas.height/2, bar_width, -bar_height/2);
        }
    }

    if(Musique.paused==false){
        var allMuted = true;
        for (i=0; i < bars; i++) {
            if(fbcArray[i]>11){
                allMuted = false;
            }
        }
        if(allMuted){ visualizerIdleStop(); return; }
    }

    requestIdVisualizerIdle = window.requestAnimationFrame(framelooperIdle);
}

function idleSine(i){
    increase = 90/180*Math.PI / 90;
    y = Math.sin(counter) * 175;
    if(y<0){ y = -y; }
    counter += increase;
    fbcArray[i]=y;
}

function visualizerIdleStart() {
    if (!requestIdVisualizerIdle) {
        framelooperIdle();
    }
}

function visualizerIdleStop() {
    if (requestIdVisualizerIdle) {
        window.cancelAnimationFrame(framelooperIdle);
        requestIdVisualizerIdle = undefined;
    }
}

/*

var counter = 0, y=0;

var increase = 90/180*Math.PI / 9;
for(i=0; i<=360; i+=10){
    y = Math.sin(counter) * 120;
    counter += increase;
    console.log(y);
}

*/

$("document").ready(function(){
    $("#visualizer").attr("width", window.innerWidth);
    bars = Math.floor(window.innerWidth/(bar_width+(bar_x_spaces-bar_width)));

    $(window).resize(function(){
        $("#visualizer").attr("width", window.innerWidth);
        bars = Math.floor(window.innerWidth/(bar_width+(bar_x_spaces-bar_width)));
    });

    initVisualizer();
});
