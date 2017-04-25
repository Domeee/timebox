var toggle = false;
var timer;
var clockIntervalId;
var visualIntervalId;
var audio;
var toggleTimer = document.querySelector('#toggleTimer');
var togglePause = document.querySelector('#togglePause');
var clock = document.querySelector('#clock');
var pause = false;
var pad = "00";
var visualToggle = false;
var mode;

document.addEventListener('DOMContentLoaded', function () {
  toggleTimer.onclick = toggleTimerClicked;
  togglePause.onclick = togglePauseClicked;
  document.onclick = function () {
    visualToggle = false;
    clearInterval(visualIntervalId);
    updateVisual();
  }

  var i = 1;
  var timeTable = document.querySelector('#timeTable');
  while (i < 60) {
    var data = document.createElement('div');
    data.classList.add('timeData');
    data.innerText = i;
    data.onclick = timeSelected;
    timeTable.appendChild(data);
    if (i % 10 === 0) {
      timeTable.appendChild(document.createElement('br'));
    }
    i++;
  }
});

function updateTimer() {
  if (!pause) {
    if (timer > 0) {
      timer = timer - 1;
      updateClock(timer);
    } else {
      visualIntervalId = setInterval(updateVisual, 500);

      // Stop the visual after 10 secs
      setTimeout(function () {
        clearInterval(visualIntervalId);
        clock.style.backgroundColor = '#000';
      }, 10000);
      clearInterval(clockIntervalId);
      var sound = getSound();
      if (sound !== 'silent.mp3') {
        audio = new Audio(sound);
        audio.play();
      }
      initValues();
    }
  }
}

function timeSelected(event) {
  if (mode === 'Minutes') {
    timer = event.target.innerText * 60;
  } else {
    timer = event.target.innerText;
  }

  updateClock(timer);
  $('#timePicker').modal('hide');
}

function toggleTimerClicked() {
  toggle = !toggle;
  if (toggle) {
    toggleTimer.innerHTML = 'Stop';
    clockIntervalId = setInterval(updateTimer, 1000);
  } else {
    clearInterval(clockIntervalId);
    resetPause();
    initValues();
  }
}

function togglePauseClicked() {
  pause = !pause;
  if (pause) {
    togglePause.innerHTML = 'Unpause';
  } else {
    resetPause();
  }
}

function resetPause() {
  pause = false;
  togglePause.innerHTML = 'Pause';
}

function getSound() {
  var sounds = document.getElementsByName('sound');
  for (var i = 0; i < sounds.length; i++) {
    var element = sounds[i];
    if (element.checked) {
      return element.value + '.mp3';
    }
  }
}

function updateClock(seconds) {
  var mins = Math.floor(seconds / 60);
  var secs = seconds - (mins * 60);
  var m = document.querySelector('#min');
  m.innerText = padLeft(mins);
  var s = document.querySelector('#second');
  s.innerText = padLeft(secs);
}

function padLeft(value) {
  var str = '' + value;
  return pad.substring(0, pad.length - str.length) + str;
}

function initValues() {
  toggleTimer.innerHTML = 'Start';
  updateClock(0);
  timer = 0;
  toggle = false;
}

function playSound(event) {
  var sound = getSound();
  audio = new Audio(sound);
  audio.play();
}

function updateVisual() {
  if (visualToggle) {
    clock.style.backgroundColor = 'red';
  } else {
    clock.style.backgroundColor = '#000';
  }
  visualToggle = !visualToggle;
}

function debugClock(seconds) {
  timer = seconds;
  updateClock(seconds);
  toggle = false;
  toggleTimerClicked();
}

// Update time picker source
$('#timePicker').on('show.bs.modal', function (event) {
  var button = $(event.relatedTarget);
  mode = button.data('mode');
  var modal = $(this);
  modal.find('#modalTitle').text(mode);
})