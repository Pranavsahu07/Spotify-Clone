console.log('Welcome to Spotify');

let songIndex = 0;
let isShuffle = false;
let audioElement = new Audio();
let masterPlay = document.getElementById('masterPlay');
let myProgressBar = document.getElementById('myProgressBar');
let gif = document.getElementById('gif');
let masterSongName = document.getElementById('masterSongName');
let songItemContainer = document.getElementById('songItemContainer');
let currentTimeSpan = document.getElementById('currentTime');
let totalDurationSpan = document.getElementById('totalDuration');
let shuffleBtn = document.getElementById('shuffleBtn');
let searchBox = document.getElementById('searchBox');

let songs = [
  {
    songName: 'Warriyo - Mortals [NCS Release]',
    filePath: 'songs/1.mp3',
    coverPath: 'covers/1.jpg',
  },
  {
    songName: 'Cielo - Huma-Huma',
    filePath: 'songs/2.mp3',
    coverPath: 'covers/2.jpg',
  },
  {
    songName: 'DEAF KEV - Invincible',
    filePath: 'songs/3.mp3',
    coverPath: 'covers/3.jpg',
  },
  {
    songName: 'Different Heaven & EH!DE - My Heart',
    filePath: 'songs/4.mp3',
    coverPath: 'covers/4.jpg',
  },
  {
    songName: 'Janji - Heroes Tonight',
    filePath: 'songs/5.mp3',
    coverPath: 'covers/5.jpg',
  },
  {
    songName: 'Rabba - Salam-e-Ishq',
    filePath: 'songs/6.mp3',
    coverPath: 'covers/6.jpg',
  },
  {
    songName: 'Sakhiyaan - Maninder Buttar',
    filePath: 'songs/7.mp3',
    coverPath: 'covers/7.jpg',
  },
  {
    songName: 'Bhula Dena - Aashiqui 2',
    filePath: 'songs/8.mp3',
    coverPath: 'covers/8.jpg',
  },
  {
    songName: 'DJ Assasian - Frag Out',
    filePath: 'songs/9.mp3',
    coverPath: 'covers/9.jpg',
  },
  {
    songName: 'Tvari - Hawaii Vacation',
    filePath: 'songs/10.mp3',
    coverPath: 'covers/10.jpg',
  },
];

function generateSongList(filteredSongs = songs) {
  songItemContainer.innerHTML = '';
  filteredSongs.forEach((song, i) => {
    let songItem = document.createElement('div');
    songItem.classList.add('songItem');
    songItem.innerHTML = `
      <img src="${song.coverPath}" alt="${i}" />
      <span class="songName">${song.songName}</span>
      <span class="timestamp"> <i id="${i}" class="far songItemPlay fa-play-circle"></i></span>
    `;
    songItemContainer.appendChild(songItem);
  });
  attachPlayListeners();
}

function attachPlayListeners() {
  Array.from(document.getElementsByClassName('songItemPlay')).forEach(
    (element) => {
      element.addEventListener('click', (e) => {
        playSong(parseInt(e.target.id));
      });
    }
  );
}

function playSong(index) {
  songIndex = index;
  audioElement.src = songs[songIndex].filePath;
  masterSongName.innerText = songs[songIndex].songName;
  audioElement.currentTime = 0;
  audioElement.play();
  updateUIOnPlay();
}

function updateUIOnPlay() {
  masterPlay.classList.remove('fa-play-circle');
  masterPlay.classList.add('fa-pause-circle');
  gif.style.opacity = 1;
  highlightActiveSong();
}

function highlightActiveSong() {
  Array.from(document.getElementsByClassName('songItem')).forEach((el, idx) => {
    el.classList.toggle('active', idx === songIndex);
    let icon = el.querySelector('.songItemPlay');
    icon.classList.remove('fa-pause-circle');
    icon.classList.add('fa-play-circle');
    if (idx === songIndex) {
      icon.classList.remove('fa-play-circle');
      icon.classList.add('fa-pause-circle');
    }
  });
}

masterPlay.addEventListener('click', () => {
  if (audioElement.paused || audioElement.currentTime <= 0) {
    audioElement.play();
    updateUIOnPlay();
  } else {
    audioElement.pause();
    masterPlay.classList.remove('fa-pause-circle');
    masterPlay.classList.add('fa-play-circle');
    gif.style.opacity = 0;
  }
});

audioElement.addEventListener('timeupdate', () => {
  let progress = (audioElement.currentTime / audioElement.duration) * 100;
  myProgressBar.value = progress || 0;
  currentTimeSpan.innerText = formatTime(audioElement.currentTime);
  totalDurationSpan.innerText = formatTime(audioElement.duration);
});

myProgressBar.addEventListener('change', () => {
  audioElement.currentTime =
    (myProgressBar.value / 100) * audioElement.duration;
});

document.getElementById('next').addEventListener('click', () => {
  nextSong();
});

document.getElementById('previous').addEventListener('click', () => {
  songIndex = songIndex > 0 ? songIndex - 1 : 0;
  playSong(songIndex);
});

audioElement.addEventListener('ended', () => {
  nextSong();
});

function nextSong() {
  if (isShuffle) {
    let nextIndex;
    do {
      nextIndex = Math.floor(Math.random() * songs.length);
    } while (nextIndex === songIndex);
    playSong(nextIndex);
  } else {
    songIndex = (songIndex + 1) % songs.length;
    playSong(songIndex);
  }
}

shuffleBtn.addEventListener('click', () => {
  isShuffle = !isShuffle;
  shuffleBtn.textContent = isShuffle ? 'Shuffle: ON' : 'Shuffle';
});

searchBox.addEventListener('input', (e) => {
  const searchTerm = e.target.value.toLowerCase();
  const filtered = songs.filter((song) =>
    song.songName.toLowerCase().includes(searchTerm)
  );
  generateSongList(filtered);
});

function formatTime(seconds) {
  if (isNaN(seconds)) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60)
    .toString()
    .padStart(2, '0');
  return `${mins}:${secs}`;
}

// Initial setup
generateSongList();
