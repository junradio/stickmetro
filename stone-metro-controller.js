class MetronomeController extends Stimulus.Controller {
  static targets = ["bpm", "measure", "nextPattern", "startButton", "stopButton", "cycle", "resumeButton", "resetButton", "part1", "part2", "part3", "part4"];

  initialize() {
    this.isPlaying = false;
    this.isCountingDown = true;
    this.beatCount = 0;
    this.measureCount = 0;
    this.countdownBeats = 4;
    this.currentPattern = "";
    this.nextPattern = "";
    this.patterns = [
      "RLRL RLRL RLRL RLRL", "LRLR LRLR LRLR LRLR", "RRLL RRLL RRLL RRLL", "LLRR LLRR LLRR LLRR", "RLRR LRLL RLRR LRLL", "RLLR LRRL RLLR LRRL", "RRLR LLRL RRLR LLRL", "RLRL LRLR RLRL LRLR", "RRRL RRRL RRRL RRRL", "LLLR LLLR LLLR LLLR", "RLLL RLLL RLLL RLLL", "LRRR LRRR LRRR LRRR", "RRRR LLLL RRRR LLLL", "RLRL RRLL RLRL RRLL", "LRLR LLRR LRLR LLRR", "RLRL RLRR LRLR LRLL", "RLRL RLLR LRLR LRRL", "RLRL RRLR LRLR LLRL", "RLRL RRRL RLRL RRRL", "LRLR LLLR LRLR LLLR", "RLRL RLLL RLRL RLLL", "LRLR LRRR LRLR LRRR", "RLRL RRRR LRLR LLLL", "RRLL RLRR LLRR LRLL", "RRLL RLLR LLRR LRRL", "RRLL RRLR LLRR LLRL", "RRLL LLRR RRLL LLRR", "RRLL RRRL RRLL RRRL", "LLRR LLLR LLRR LLLR", "RRLL RLLL RRLL RLLL", "LLRR LRRR LLRR LRRR", "RRLL RRRR LLRR LLLL", "RLRR LRRL RLRR LRRL", "LRLL RLLR LRLL RLLR", "RLRR LLRL RLRR LLRL", "LRLL RRLR LRLL RRLR", "RLRR RLRR RLRR RLRR", "LRLL LRLL LRLL LRLL", "RLRR LLLR LRLL RRRL", "RLRR LRRR LRLL RLLL", "RLRR LLLL RLRR LLLL", "LRLL RRRR LRLL RRRR", "RLLR LLRL RLLR LLRL", "LRRL RRLR LRRL RRLR", "RLLR RLLR RLLR RLLR", "LRRL LRRL LRRL LRRL", "RLLR LLLR LRRL RRRL", "RLLR LRRR LRRL RLLL", "RLLR LLLL RLLR LLLL", "LRRL RRRR LRRL RRRR", "RRLR RRLR RRLR RRLR", "LLRL LLRL LLRL LLRL", "RRLR LLLR LLRL RRRL", "RRLR LRRR LLRL RLLL", "RRLR LLLL RRLR LLLL", "LLRL RRRR LLRL RRRR", "RRRL LLLR RRRL LLLR", "RRRL RLLL RRRL RLLL", "LLLR LRRR LLLR LRRR", "RRRL RRRR LLLR LLLL", "RLLL LRRR RLLL LRRR", "RLLL RRRR LRRR LLLL", "RRRL LLRR RLLL RRRL", "LLLR RRLL LRRR LLLR", "RRLR RLRR LRRL RLRL", "LLRL LRLL RLLR LRLR", "RLLR LLRL LRLL RLRL", "LRRL RRLR RLRR LRLR", "RLRR LLLL RRRR LRLL", "RRLL RLRR LLLL RRRR", "LLRR LRLL RRRR LLLL", "RRRR LLRR LRRL RLRL",
    ];
  }


  connect() {
    this.reset();
  }

 startOrStop() {
    if (this.isPlaying) {
      this.stop();
    } else {
      if(this.measureCount == 0) {
        this.start();
      } else {
        this.resume();
      }
    }
  }


  start() {

    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }

    if (!this.isPlaying) {
      this.audioContext.resume().then(() => {
        this.isPlaying = true;
        this.isCountingDown = true;
        this.isPlaying = true;
        this.isCountingDown = true;
        this.measureTarget.textContent = this.measureCount % 20;
        this.toggleButtons();

        this.startMetronome();
      });
    }
  }

  startMetronome() {
    this.playMetronomeSound();
    let bpm = parseInt(this.bpmTarget.value);
    if (bpm <= 1 || bpm > 200) {
      bpm = 200;
      this.bpmTarget.value = 200;
    }
    this.saveBpm(bpm);

    const interval = 60000 / bpm;
    this.intervalId = setInterval(() => this.playMetronomeSound(), interval);
  }

  saveBpm(bpm) {
    document.cookie = `bpm=${bpm}; expires=Fri, 31 Dec 2099 23:59:59 UTC; path=/`;
  }


  resume() {
    this.startMetronome();
    this.isPlaying = true;
    this.toggleButtons();
  }

  stop() {
    if (this.isPlaying) {
      clearInterval(this.intervalId);
      this.isPlaying = false;
      this.isCountingDown = false;
      this.toggleButtons();
    }
  }

  reset() {
    this.prepareBpmField();

    this.stop();
    this.beatCount = 0;
    this.measureCount = 0;
    this.measureTarget.textContent = 0;
    this.cycleTarget.textContent = 0

    this.selectNextPattern();
    this.currentPattern = this.nextPattern;
    this.selectNextPattern();
    this.updatePatternDisplay(this.currentPattern);
    this.updateNextPatternDisplay(this.nextPattern);
    this.toggleButtons();
  }

  playMetronomeSound() {
    this.beep();




    if (this.isCountingDown) {
      if (this.beatCount < this.countdownBeats - 1) {
        this.beatCount++;
      } else {
        this.beatCount = 0;
        this.isCountingDown = false;
      }
    } else {

      if (this.measureCount > 0 && this.measureCount % 20 == 0 && this.beatCount == 0) {
        this.currentPattern = this.nextPattern;
        this.selectNextPattern();
        this.updateNextPatternDisplay(this.nextPattern);

      }

      let pattern = this.currentPattern;

      if (this.measureCount % 20 == 19) {
        this.updatePatternDisplay(this.mixedPattern());
      }
      else {
        this.updatePatternDisplay(this.currentPattern);
      }

      this.measureTarget.textContent = this.measureCount % 20 + 1;
      this.cycleTarget.textContent = parseInt(this.measureCount / 20) + 1;


      this.beatCount++;


      if (this.beatCount == 8) {
        this.measureCount++;
        this.beatCount = 0;
      }

    }

  }

  mixedPattern() {
    const nextParts = this.nextPattern.split(' ');
    const currentParts = this.currentPattern.split(' ');
    const highlightPosition = parseInt(this.beatCount / 2);

    let patterns = [];
    for (let i = 0; i < highlightPosition; i++) {
      patterns.push(nextParts[i]);
    }
    for (let i = highlightPosition; i < 4; i++) {
      patterns.push(currentParts[i]);
    }
    return patterns.join(' ');
  }


  selectNextPattern() {
    const randomPattern = this.patterns[Math.floor(Math.random() * this.patterns.length)];
    this.nextPattern = randomPattern;
  }

  beep() {
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);


    gainNode.gain.value = 0.4;
    oscillator.type = 'sine';

    if (this.isCountingDown)  {
      oscillator.frequency.value = 200;
    }
    else {
      if (this.beatCount === 0) {
        gainNode.gain.value = 0.8;
      }

      if (this.measureCount > 0 && (this.measureCount + 1) % 20 === 0) {
        gainNode.gain.value = 0.8;
        oscillator.frequency.value = 800;
      }
      else {
        oscillator.frequency.value = this.beatCount % 8 == 0 ? 800 : 400;
      }
    }


    oscillator.start();
    oscillator.stop(this.audioContext.currentTime + 0.05);
  }


  updatePatternDisplay(pattern) {
    const parts = pattern.split(' ');
    parts.forEach((part, index) => {
      const partElement = this[`part${index + 1}Target`];
      partElement.textContent = part;

      if (this.isCountingDown) {
        partElement.classList.remove('highlight');
      } else {
        const highlightIndex = Math.floor(this.beatCount / 2);
        partElement.classList.toggle('highlight', index === highlightIndex);
      }
    });
  }

  updateNextPatternDisplay(pattern) {
    const parts = pattern.split(' ');

    this.nextPatternTarget.innerHTML = pattern;
  }

  toggleButtons() {
    if (this.isPlaying) {
      this.resumeButtonTarget.style.display = "none";
      this.startButtonTarget.style.display = "none";
      this.resetButtonTarget.style.display = "none";
      this.stopButtonTarget.style.display = "block";
    } else {
      if(this.measureCount == 0 && this.beatCount == 0) {
        this.startButtonTarget.style.display = "block";
        this.resetButtonTarget.style.display = "none";
        this.resumeButtonTarget.style.display = "none";
      }
      else {
        this.resumeButtonTarget.style.display = "block";
        this.resetButtonTarget.style.display = "block";
      }
      this.stopButtonTarget.style.display = "none";
    }
  }

  storedBpm() {
    let cookies = document.cookie.split(';');
    for(let i = 0; i < cookies.length; i++) {
      let cookie = cookies[i];
      let parts = cookie.split('=');
      if(parts[0].trim() === "bpm") {
        let num =  parseInt(parts[1]);
        if (num == 0) { num = 120; }
        return num;
      }
    }

    return 120; // default
  }

  prepareBpmField() {
    this.bpmTarget.value = this.storedBpm();
  }
}


Stimulus.Application.start().register("metronome", MetronomeController);
