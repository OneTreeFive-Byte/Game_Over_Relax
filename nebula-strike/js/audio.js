// ============================================
// Sistema de Audio Procedural
// ============================================

const AudioCtx = window.AudioContext || window.webkitAudioContext;
let audioCtx;

function initAudio() {
  if (!audioCtx) audioCtx = new AudioCtx();
}

function playSound(freq, type, duration, vol = 0.15) {
  if (!audioCtx) return;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(freq * 0.5, audioCtx.currentTime + duration);
  gain.gain.setValueAtTime(vol, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start();
  osc.stop(audioCtx.currentTime + duration);
}

function shootSound() { playSound(800, 'square', 0.08, 0.08); }
function explosionSound() { playSound(100, 'sawtooth', 0.3, 0.12); }
function powerupSound() { 
  playSound(600, 'sine', 0.2, 0.1); 
  setTimeout(() => playSound(900, 'sine', 0.3, 0.1), 100);
}
function bossSound() { playSound(60, 'sawtooth', 0.5, 0.15); }
function hitSound() { playSound(200, 'square', 0.1, 0.1); }
function superSound() { 
  playSound(400, 'sawtooth', 0.5, 0.15); 
  setTimeout(() => playSound(800, 'square', 0.6, 0.1), 150);
}
