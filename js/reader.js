// One timing entry will eventually look like:
// { sentenceId: 'b1-c1-s1', start: 0.0, end: 4.2 }
// Leave empty until timestamps have been created from the final narration.
const sentenceTimings = [];
const audio = document.querySelector('[data-audio]');

const formatTime = (seconds) => {
  if (!Number.isFinite(seconds)) return '0:00';
  return `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, '0')}`;
};

if (audio) {
  const playButton = document.querySelector('[data-play]');
  const playIcon = document.querySelector('[data-play-icon]');
  const progress = document.querySelector('[data-audio-progress]');
  const current = document.querySelector('[data-current-time]');
  const duration = document.querySelector('[data-duration]');
  const status = document.querySelector('[data-audio-status]');

  playButton.addEventListener('click', () => audio.paused ? audio.play().catch(() => { status.textContent = 'Narration has not been added yet.'; }) : audio.pause());
  audio.addEventListener('play', () => { playIcon.textContent = 'Ⅱ'; playButton.setAttribute('aria-label', 'Pause narration'); status.textContent = 'Now playing'; });
  audio.addEventListener('pause', () => { playIcon.textContent = '▶'; playButton.setAttribute('aria-label', 'Play narration'); });
  audio.addEventListener('loadedmetadata', () => { duration.textContent = formatTime(audio.duration); status.textContent = 'Ready to listen'; });
  audio.addEventListener('error', () => { status.textContent = 'Audio will be available soon.'; });
  audio.addEventListener('timeupdate', () => {
    current.textContent = formatTime(audio.currentTime);
    progress.value = audio.duration ? (audio.currentTime / audio.duration) * 100 : 0;
    updateSentenceHighlight(audio.currentTime);
  });
  progress.addEventListener('input', () => { if (audio.duration) audio.currentTime = (progress.value / 100) * audio.duration; });
  document.querySelectorAll('[data-skip]').forEach((button) => button.addEventListener('click', () => { audio.currentTime = Math.max(0, Math.min(audio.duration || 0, audio.currentTime + Number(button.dataset.skip))); }));
  document.querySelector('[data-speed]').addEventListener('change', (event) => { audio.playbackRate = Number(event.target.value); });
}

function updateSentenceHighlight(time) {
  if (!sentenceTimings.length) return; // Highlighting stays inactive until timing data exists.
  const active = sentenceTimings.find((item) => time >= item.start && time < item.end);
  document.querySelectorAll('.sentence').forEach((sentence) => sentence.classList.toggle('active-sentence', active && sentence.dataset.sentenceId === active.sentenceId));
  if (active) document.querySelector(`[data-sentence-id="${active.sentenceId}"]`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

const sidebarToggle = document.querySelector('.sidebar-toggle');
if (sidebarToggle) sidebarToggle.addEventListener('click', () => {
  const open = sidebarToggle.getAttribute('aria-expanded') === 'true';
  sidebarToggle.setAttribute('aria-expanded', String(!open));
  document.querySelector('.character-list').classList.toggle('open', !open);
  sidebarToggle.lastElementChild.textContent = open ? '＋' : '−';
});
