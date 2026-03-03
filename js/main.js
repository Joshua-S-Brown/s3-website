document.addEventListener('DOMContentLoaded', () => {
  // Highlight active nav link
  const navLinks = document.querySelectorAll('.site-nav a');
  const path = window.location.pathname;
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href && href !== '/' && path.includes(href)) link.classList.add('active');
  });

  // Audio player
  document.querySelectorAll('.audio-bar').forEach(bar => {
    const src = bar.dataset.src;
    if (!src) return;
    const playBtn = bar.querySelector('.audio-bar__play');
    const progress = bar.querySelector('.audio-bar__progress');
    const dur = bar.querySelector('.audio-bar__duration');
    let audio = null, playing = false;
    playBtn.addEventListener('click', () => {
      if (!audio) {
        audio = new Audio(src);
        audio.addEventListener('timeupdate', () => {
          if (audio.duration) progress.style.width = (audio.currentTime / audio.duration * 100) + '%';
        });
        audio.addEventListener('loadedmetadata', () => {
          const m = Math.floor(audio.duration / 60);
          const s = Math.floor(audio.duration % 60).toString().padStart(2, '0');
          dur.textContent = m + ':' + s;
        });
        audio.addEventListener('ended', () => { playing = false; progress.style.width = '0%'; });
      }
      if (playing) { audio.pause(); } else { audio.play(); }
      playing = !playing;
    });
  });
});
