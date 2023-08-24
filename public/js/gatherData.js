let songList = [];
(function () {

    //gets parameters from URL, stores them.
    let params = (function getHashParams() {
      let hashParams = {};
      let e, r = /([^&;=]+)=?([^&;]*)/g,
        q = window.location.hash.substring(1);
      while (e = r.exec(q)) {
        hashParams[e[1]] = decodeURIComponent(e[2]);
      }
      return hashParams;
    })();

    //stores each parameter separately
    let access_token = params.access_token,
      refresh_token = params.refresh_token,
      error = params.error;

    // gets data of the user profile, if there is a valid access token.
    if (error) {
      alert('There was an error during the authentication. Try again, or, if the issue persists, contact the developer.');
      console.log('Problem retrieving access token. Following error recieved: ', error);
    } else {
      if (access_token) {

        $.ajax({
          url: 'https://api.spotify.com/v1/me/top/tracks?time_range=short_term&limit=20&offset=1',
          headers: {
            'Authorization': 'Bearer ' + access_token
          },
          success: function (response) {
            //shows the user's data if the data is successfully retrieved.
            $('#homepage').hide();
            $('#logged-in').show();
            getSongList(response);

          }
        });
      } else {
        // render initial screen
        $('#logged-in').hide();
        $('#homepage').show();
      }
    }
  })();

  function getSongList(response) {
    // DEBUG
    console.log(response);

    response.items.forEach(song => {
      name = song.name;

      // get names of all song's artists
      artist = "";
      song.artists.forEach(a => {
        artist += a.name + ", ";
      });
      if (artist.endsWith(", ")) {
        artist = artist.slice(0, -2);
      }
      albumArtURL = song.album.images[1].url; // 300x300px

      songList.push({
        name: name,
        artist: artist,
        albumArtURL: albumArtURL
      });
    });
    //DEBUG
    console.log(songList);
    createSummaryLayout();
  }

  function createSummaryLayout() {


    //buttons for creating collage and logging out
    var collageButton = document.createElement('a');
    collageButton.classList.add('btn', 'btn-success');
    collageButton.innerText = 'Create collage';
    collageButton.href = "/generate";
    document.getElementById('logged-in').appendChild(collageButton);

    var logoutButton = document.createElement('a');
    logoutButton.classList.add('btn', 'btn-danger');
    logoutButton.innerText = 'Log out';
    logoutButton.addEventListener('click', function () {
      window.location.href = "/logout";
    });
    document.getElementById('logged-in').appendChild(logoutButton);

    //change page based on the amount of songs gathered
    var summaryPlaceholder = document.getElementById("user-data-summary");
    if (songList.length < 20) {
      summaryPlaceholder.innerHTML = "In the last 30 days, you have gathered a total of " + songList.length + " songs in your top. You need <b>at least 20 songs</b> to continue. Listen some more and come back tomorrow!<br>You can still view your top songs below.";
      collageButton.style.display = 'none';
    } else {
      summaryPlaceholder.innerHTML = "In the last 30 days, you have gathered a total of " + songList.length + " songs in your top. Good job! You can create a collage, and also, view your top songs below.";
    }

    //creates a layout for the song summary (desktop-optimised for 3 columns as of now)
    songList.forEach(element => {

      // creates a first row, since 0%3 = 0, and a new row every three songs. The songs are placed horizontally in the order they are in the array.
      if (songList.indexOf(element) % 3 == 0) {
        mainRow = document.createElement("div");
        mainRow.classList.add("row");
        document.getElementById("logged-in").appendChild(mainRow);
      }

      // each song overall represented by a column in a row
      songColumn = document.createElement("div");
      songColumn.classList.add("col-4", "mb-5", "text-primary");
      mainRow.appendChild(songColumn);

      // each song column contains a row, in which are contained two other columns - one for the album art, and one for the song name and artist name
      songRow = document.createElement("div");
      songRow.classList.add("row");
      songArtColumn = document.createElement("div");
      songArtColumn.classList.add("col-4", "mb-5");
      songRow.appendChild(songArtColumn);
      songColumn.appendChild(songRow);

      songCover = document.createElement("img");
      songCover.classList.add("img-fluid", "thumbnail");
      songCover.setAttribute('src', element.albumArtURL);
      songArtColumn.appendChild(songCover);

      songTextColumn = document.createElement("div");
      songTextColumn.classList.add("col-8", "mb-5", "text-primary", "text-start");
      songRow.appendChild(songTextColumn);

      songName = document.createElement("h3");
      songName.innerHTML = element.name;
      songTextColumn.appendChild(songName);

      artistName = document.createElement("p");
      artistName.innerHTML = element.artist;
      songTextColumn.appendChild(artistName);
    });

    function createCollage() {
      let layers = 2;
      let h = screen.availHeight;
      let w = screen.availWidth;

      document.getElementById('logged-in').innerHTML = "";

      let images = [];
      songList.forEach(song => {
        x = new Image(300, 300);
        x.src = `${song.albumArtURL}`;

        images.push(x);
      });
      document.getElementById('logged-in').appendChild(images[0]);

      let resText = "Your screen resolution is " + w + " px by " + h + " px."
      let res = document.createElement("p");
      res.innerHTML = resText;
      document.getElementById('logged-in').appendChild(res);
    }
  }
