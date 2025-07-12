# 🎵 Spotify Clone

A web-based music player inspired by Spotify, allowing users to play and manage their music library with a responsive design. This project replicates core functionalities of Spotify's web player, such as browsing albums, playing songs, and controlling playback — all built using vanilla HTML, CSS, and JavaScript.

---

## ✨ Features

- **Browse and Play Songs:** View and play songs from a dynamic music library.
- **Search Functionality:** Filter songs in the library by title using the search bar.
- **Playback Controls:** Play, pause, skip to the next song, or return to the previous song.
- **Volume Control:** Adjust volume with a slider and toggle mute/unmute.
- **Responsive Design:** Adapts seamlessly to various screen sizes, with a hamburger menu for mobile navigation.
- **Dynamic Album Loading:** Loads albums and their metadata (title, description, cover image) from a server-side folder structure.

---

## 🛠️ Technologies Used

- **HTML:** Structure of the web application.
- **CSS:** Styling, including responsive design with media queries.
- **JavaScript:** Functionality for song playback, dynamic content loading, and user interactions.
- **Font Awesome:** Icons for playback controls and navigation (loaded via CDN).

---

## ⚙️ Setup Instructions

### 1. Clone the Repository:

bash
git clone https://github.com/HafizSyedAhmedAli/Spotify-Clone-HTML-CSS-JavaScript.git
2. Prepare the Songs Folder:
Create a songs/ folder in the project root.
Add subfolders for each album (e.g., songs/AOT).

Each album folder must contain:

🎵 Audio files (.mp3 or .m4a)

🖼️ A cover.jpeg image for the album artwork

📝 An info.json file with metadata:

json
Copy
Edit
{
  "title": "Album Title",
  "description": "Album Description"
}
3. Serve the Project:
Use a local server to serve the files. Recommended options:

VS Code Live Server extension

Python HTTP Server:

bash
Copy
Edit
python -m http.server 8000
Then open your browser and go to:
http://localhost:8000

📦 Dependencies
Font Awesome icons (via CDN).

Ensure an internet connection is available, or download the icons locally and update the link in index.html.

##🎮 Usage
Load an Album: Click an album card in the "Spotify Playlists" section to load its songs.

Play a Song: Click a song in the library to start playback.

Control Playback: Use the play/pause, next, and previous buttons.

Adjust Volume: Use the slider or mute/unmute icon.

Search Songs: Use the search bar to filter songs by title.

Mobile Navigation: On smaller screens, use the hamburger and close icons to toggle the library.

