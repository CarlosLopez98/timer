let content = document.getElementsByClassName("content")[0];
let controlPanel = document.getElementsByClassName("control-panel")[0];

let btnTimer = document.getElementById("setTimer");
let btnStopwatch = document.getElementById("setStopwatch");

// Timer conf
let timerState = 'setting';  // setting, running
let timerInterval;
let timerPlaying = false;
let timerMin = 0;
let timerSeg = 0;

function updateTimer() {
    const time = getStringTime(timerMin, timerSeg);
    let timeA = time.split(":");
    if (timerState == 'setting'){
        document.getElementById("min").innerHTML = timeA[0];
        document.getElementById("seg").innerHTML = timeA[1];
    }else if (timerState == 'running'){
        document.getElementById("timer-left").innerHTML = time;
    }
}

function timerSetting() {
    timerMin = 0;
    timerSeg = 0;
    content.innerHTML = `<div class="title">
                            <h2>Timer</h2>
                        </div>

                        <div class="time">
                            <div class="timeSetter">
                                <a id="min-up">
                                    <i class="bx bx-chevron-up"></i>
                                </a>
                                <p id="min">00</p>
                                <a id="min-down">
                                    <i class="bx bx-chevron-down"></i>
                                </a>
                            </div>
                            <p>:</p>
                            <div class="timeSetter">
                                <a id="seg-up">
                                    <i class="bx bx-chevron-up"></i>
                                </a>
                                <p id="seg">00</p>
                                <a id="seg-down">
                                    <i class="bx bx-chevron-down"></i>
                                </a>
                            </div>
                        </div>`;
    controlPanel.innerHTML = `<button type="button" class="btn-action" id="btn-play"><i class="bx bx-play"></i></button>`;
    updateTimer();

    // Eventlisteners
    let minUp = document.getElementById("min-up");
    let minDown = document.getElementById("min-down");
    let segUp = document.getElementById("seg-up");
    let segDown = document.getElementById("seg-down");

    let playBtn = document.getElementById("btn-play");
    playBtn.addEventListener("click", () => {
        if (timerMin > 0 || timerSeg > 0){
            timerState = 'running';
            timerRunning();
        }
    });

    minUp.addEventListener("click", () => {
        timerMin = timerMin + (timerMin < 60 ? 1 : -60);
        updateTimer();
    });

    minDown.addEventListener("click", () => {
        timerMin = timerMin + (timerMin > 0 ? -1 : 60);
        updateTimer();
    });

    segUp.addEventListener("click", () => {
        timerSeg = timerSeg + (timerSeg < 59 ? 1 : -59);
        updateTimer();
    });

    segDown.addEventListener("click", () => {
        timerSeg = timerSeg + (timerSeg > 0 ? -1 : 59);
        updateTimer();
    });

}

function timerRunning() {
    content.innerHTML = `<div class="title">
                            <h2>Timer</h2>
                        </div>

                        <div class="time">
                            <p id="timer-left">${getStringTime(timerMin, timerSeg)}</p>
                        </div>`;
    controlPanel.innerHTML = `<button type="button" class="btn-action" id="btn-cancel"><i class="bx bx-x"></i></button>
                              <button type="button" class="btn-action" id="btn-pause"><i class="bx bx-pause"></i></button>
                              <button type="button" class="btn-action hidden" id="btn-play"><i class="bx bx-play"></i></button>`;

    let cancelBtn = document.getElementById("btn-cancel");
    let pauseBtn = document.getElementById("btn-pause");
    let playBtn = document.getElementById("btn-play");

    cancelBtn.addEventListener("click", () => {
        clearInterval(timerInterval);
        timerState = "setting";
        timerPlaying = false;
        timerSetting();
    });

    pauseBtn.addEventListener("click", () => {
        clearInterval(timerInterval);
        pauseBtn.classList.add("hidden");
        playBtn.classList.remove("hidden");
    });

    playBtn.addEventListener("click", () => {
        timerPlaying = true;
        playBtn.classList.add("hidden");
        pauseBtn.classList.remove("hidden");

        timerInterval = setInterval(() => {
            if (timerSeg == 0) {
                if (timerMin > 0){
                   timerSeg = 59;
                   timerMin--;
                }
            }else{
                timerSeg--;
            }
            updateTimer();

            if(timerMin == 0 && timerSeg == 0){
                clearInterval(timerInterval);
                pauseBtn.classList.add("hidden");
                // Play sound
            }
        }, 1000);
    });

    if(!timerPlaying)
        playBtn.click();
}

function timer() {
    console.log("Timer!");
    // Set the selected class
    btnTimer.classList.add("selected");
    btnStopwatch.classList.remove("selected");

    if (timerState == 'setting')
        timerSetting();
    else if (timerState == 'running')
        timerRunning();
}

// Stopwatch conf
let stopState = "clear";  // clear, running, pause, stop
let stopInterval;
let stopMin = 0;
let stopSeg = 0;
let stopMili = 0;

function updateStopwatch(){
    const time = getStringTime(stopMin, stopSeg);
    document.getElementById("stop-time").innerHTML = time;
    document.getElementById("stop-mili").innerHTML = stopMili < 10 ? "0" + stopMili.toString() : stopMili.toString();
}

function stopwatch() {
    console.log("Stopwatch");
    // Set the selected class
    btnTimer.classList.remove("selected");
    btnStopwatch.classList.add("selected");

    content.innerHTML = `<div class="title">
                            <h2>Stopwatch</h2>
                        </div>

                        <div class="time stopwatch">
                            <p id="stop-time">${getStringTime(stopMin, stopSeg)}</p>
                            <p id="stop-mili">00</p>
                        </div>`;
    let controlRender = "";
    switch(stopState){
        case "clear":
            controlRender = `<button type="button" class="btn-action hidden" id="btn-cancel"><i class="bx bx-x"></i></button>
                             <button type="button" class="btn-action hidden" id="btn-pause"><i class="bx bx-pause"></i></button>
                             <button type="button" class="btn-action" id="btn-play"><i class="bx bx-play"></i></button>
                             <button type="button" class="btn-action hidden" id="btn-stop"><i class="bx bx-stop"></i></button>`;
            break;
        case "running":
            controlRender = `<button type="button" class="btn-action hidden" id="btn-cancel"><i class="bx bx-x"></i></button>
                             <button type="button" class="btn-action" id="btn-pause"><i class="bx bx-pause"></i></button>
                             <button type="button" class="btn-action hidden" id="btn-play"><i class="bx bx-play"></i></button>
                             <button type="button" class="btn-action" id="btn-stop"><i class="bx bx-stop"></i></button>`;
            break;
        case "pause":
            controlRender = `<button type="button" class="btn-action hidden" id="btn-cancel"><i class="bx bx-x"></i></button>
                             <button type="button" class="btn-action hidden" id="btn-pause"><i class="bx bx-pause"></i></button>
                             <button type="button" class="btn-action" id="btn-play"><i class="bx bx-play"></i></button>
                             <button type="button" class="btn-action" id="btn-stop"><i class="bx bx-stop"></i></button>`;
            break;
        case "stop":
            controlRender = `<button type="button" class="btn-action" id="btn-cancel"><i class="bx bx-x"></i></button>
                             <button type="button" class="btn-action hidden" id="btn-pause"><i class="bx bx-pause"></i></button>
                             <button type="button" class="btn-action hidden" id="btn-play"><i class="bx bx-play"></i></button>
                             <button type="button" class="btn-action hidden" id="btn-stop"><i class="bx bx-stop"></i></button>`;
            break;
    }
    controlPanel.innerHTML = controlRender;

    let cancelBtn = document.getElementById("btn-cancel");
    let pauseBtn = document.getElementById("btn-pause");
    let stopBtn = document.getElementById("btn-stop");
    let playBtn = document.getElementById("btn-play");

    cancelBtn.addEventListener("click", () => {
        playBtn.classList.remove("hidden");
        cancelBtn.classList.add("hidden");

        stopMin = 0;
        stopSeg = 0;
        stopMili = 0;
        updateStopwatch();
        stopState = "clear";
    });

    pauseBtn.addEventListener("click", () => {
        pauseBtn.classList.add("hidden");
        playBtn.classList.remove("hidden");

        clearInterval(stopInterval);
        stopState = "pause";
    });

    stopBtn.addEventListener("click", () => {
        cancelBtn.classList.remove("hidden");
        playBtn.classList.add("hidden");
        pauseBtn.classList.add("hidden");
        stopBtn.classList.add("hidden");

        clearInterval(stopInterval);
        stopState = "stop";
    });

    playBtn.addEventListener("click", () => {
        playBtn.classList.add("hidden");
        pauseBtn.classList.remove("hidden");
        stopBtn.classList.remove("hidden");

        stopInterval = setInterval(() => {
            if (stopMili == 99) {
                stopMili = 0;
                if (stopSeg == 59) {
                    stopSeg = 0;
                    stopMin++;
                }else{
                    stopSeg++;
                }
            }else{
                stopMili++;
            }
            updateStopwatch();
        }, 10);

        stopState = "running";
    });
}


function getStringTime(min, seg) {
    let minStr = min.toString();
    let segStr = seg.toString();

    if (min < 10)
        minStr = "0" + minStr;
    if (seg < 10)
        segStr = "0" + segStr;

    return minStr + ":" + segStr;
}

document.addEventListener("DOMContentLoaded", () => {
    console.log("Ready!");
    timer();

    // Events to change between timer and stopwatch functionality
    btnTimer.addEventListener('click', timer);
    btnStopwatch.addEventListener('click', stopwatch);
});