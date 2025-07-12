const play = document.querySelector("#play");
const next = document.querySelector("#next");
const previous = document.querySelector("#previous");
const circle = document.querySelector(".circle");
const songInfo = document.querySelector(".song-info");
const songTime = document.querySelector(".song-time");
const seekbar = document.querySelector(".seekbar");
const hamburger = document.querySelector(".fa-bars");
const left = document.querySelector(".left");
const close = document.querySelector(".fa-xmark");
const range = document.querySelector(".range").getElementsByTagName("input")[0];
const cardContainer = document.querySelector(".card-container");
const maxVolume = document.querySelector("#max-volume");
const searchBar = document.querySelector(".search-bar input");

let currentSong = new Audio();
let songs;
let currFolder;
let cleanTitle;

// Show all the songs in the playlist
let songsUl = document.querySelector(".song-list").getElementsByTagName("ul")[0];

function formatTitle(title) {
    return title
        .replace(/\.mp3$/, '') // Remove .mp3
        .replace(/(\s*(\[[^\]]*\]|\([^\)]*\))\s*)+$/, '') // Remove trailing tags
        .trim();
}

function formatTime(inputSeconds) {
    // 1) Make sure we’re working with a number
    const secsTotal = Number(inputSeconds);
    if (isNaN(secsTotal) || secsTotal < 0) {
        return "00:00"; // or throw an error
    }

    // 2) Drop any fractional part
    const total = Math.floor(secsTotal);

    // 3) Compute minutes + seconds
    const minutes = Math.floor(total / 60);
    const seconds = total % 60;

    // 4) Zero‑pad to 2 digits
    const mm = String(minutes).padStart(2, "0");
    const ss = String(seconds).padStart(2, "0");

    return `${mm}:${ss}`;
}

function displaySongs() {
    for (const song of songs) {

        let decode = decodeURIComponent(song);

        // Remove .mp3 extension and trailing tags (e.g., [Epic Cover], (MP3_160K))
        cleanTitle = formatTitle(decode);
        songsUl.innerHTML += `
            <li data-track="${song}">
                <i class="fa-solid fa-music"></i>
                <div class="info">
                    <div>${cleanTitle}</div>
                    <div>Junior Dream</div>
                </div>
                <div class="playnow">
                    <span>Play Now</span>
                    <i class="fa-solid fa-circle-play"></i>
                </div>
            </li>
        `;
    }
}

async function getSongs(folder) {
    currFolder = folder;
    let a = await fetch(`/${currFolder}`);
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;

    let as = div.getElementsByTagName("a");
    songs = [];

    for (let index = 0; index < as.length; index++) {
        const element = as[index];

        if (element.href.endsWith(".mp3") || element.href.endsWith(".m4a")) {
            songs.push(element.href.split(`/${currFolder}/`)[1]);
        }

    }

    songsUl.innerHTML = "";

    displaySongs();

    // Attach an event listner to each song
    Array.from(songsUl.children).forEach(li => {
        li.addEventListener("click", () => {
            const track = decodeURIComponent(li.dataset.track);
            playMusic(track);
        });
    });

    return songs;
}

const playMusic = (track, pause = false) => {
    currentSong.src = `/${currFolder}/` + track;

    if (!pause) {
        currentSong.play();
        play.classList.remove("fa-play");
        play.classList.add("fa-pause");
    }

    let decode = decodeURIComponent(track);
    songInfo.innerHTML = formatTitle(decode);
    songTime.innerHTML = "00:00 / 00:00";
}

async function main() {
    // Get the lists of all the songs
    songs = await getSongs("songs/AOT");
    playMusic(songs[0], true);

    // Display all the albums on the page
    let a = await fetch(`/songs/`);
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let anchors = div.getElementsByTagName("a");
    let array = Array.from(anchors)
    for (let index = 0; index < array.length; index++) {
        const e = array[index];
        if (e.href.includes("/songs/")) {
            let folder = (e.href.split("/").slice(-1)[0]);
            // Get the metadata of the folder
            let a = await fetch(`/songs/${folder}/info.json`);
            let response = await a.json();
            cardContainer.innerHTML += `
             <div data-folder="${folder}" class="card">
                <div class="play">
                    <img src="img/playButton.svg" alt="">
                </div>
                <div class="card-img">
                    <img src="/songs/${folder}/cover.jpeg" alt="cover.com">
                </div>
                <h3>${response.title}</h3>
                <p>${response.description}</p>
            </div>
            `
        }
    }

    // Attach an event listner to play, next, previous
    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play();
            play.classList.remove("fa-play");
            play.classList.add("fa-pause");
        }
        else {
            currentSong.pause();
            play.classList.remove("fa-pause");
            play.classList.add("fa-play");
        }
    });

    // Listen for time update event
    currentSong.addEventListener("timeupdate", () => {
        songTime.innerHTML = `${formatTime(currentSong.currentTime)}/${formatTime(currentSong.duration)}`;
        circle.style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
    });

    // Add an event listner to seekbar
    seekbar.addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        circle.style.left = percent + "%";
        currentSong.currentTime = ((currentSong.duration) * percent) / 100;
    });

    // Add an event listner for hamburger
    hamburger.addEventListener("click", () => {
        left.style.left = "0";
    });

    // Add an event listner for close button
    close.addEventListener("click", () => {
        left.style.left = "-120%";
    });

    // Add an event listner to previous and next
    previous.addEventListener("click", () => {
        console.log("Previous Clicked.");
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
        if (index - 1 >= 0) {
            playMusic(songs[index - 1]);
        }
    });

    next.addEventListener("click", () => {
        console.log("Next Clicked.");
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
        if (index + 1 < songs.length) {
            playMusic(songs[index + 1]);
        }
    });

    // Add an event to volume
    range.addEventListener("change", (e) => {
        if (maxVolume.classList.contains("fa-volume-high")) {
            console.log("Setting volume to", e.target.value, "/ 100");
            currentSong.volume = parseInt(e.target.value) / 100;
        }
    });

    const card = Array.from(document.querySelectorAll(".card"));

    // Load the playlist whenever card is clicked
    card.forEach(e => {
        e.addEventListener("click", async (item) => {
            await getSongs(`songs/${item.currentTarget.dataset.folder}`);
            playMusic(songs[0]);
        });
    });

    // Open the playlist whenever a card is clicked
    card.forEach(e => {
        e.addEventListener("click", (item) => {
            left.style.left = "0"
        })
    });

    // Add event listner to mute the track
    maxVolume.addEventListener("click", (e) => {
        let currVolume = range.value / 100;
        if (maxVolume.classList.contains("fa-volume-high")) {
            maxVolume.classList.remove("fa-volume-high");
            maxVolume.classList.add("fa-volume-xmark");
            currentSong.volume = 0;
        }
        else {
            maxVolume.classList.remove("fa-volume-xmark");
            maxVolume.classList.add("fa-volume-high");
            currentSong.volume = currVolume;
        }
    });

    
    // Add event listner to search for songs
    searchBar.addEventListener("input", (e) => {
        const term = e.target.value.trim().toLowerCase();
        let songItems = Array.from(document.querySelectorAll(".song-list ul li"));
        songItems.forEach(li => {
            const title = li.querySelector(".info > div:first-child").textContent.toLowerCase();
            if(title.includes(term)) {
                li.style.display = "";
            } else {
                li.style.display = "none";
            }
        });
    });
    
}

main();