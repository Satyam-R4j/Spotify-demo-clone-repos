

let currentSong = new Audio()
let songs

function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "Invalid input"
    }

    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = Math.floor(seconds % 60)

    const formattedMinutes = String(minutes).padStart(2, '0')
    const formattedSeconds = String(remainingSeconds).padStart(2, '0')

    return `${formattedMinutes}:${formattedSeconds}`
}



async function getSongs() {
    let a = await fetch("http://127.0.0.1:5500/music")
    let response = await a.text()
    // console.log(response)
    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
    let songs = []
    for (let index = 3; index < as.length; index++) {
        const element = as[index];
        songs.push(element.href.split("/music")[1])

    }
    return songs

}

const playMusic = (track, pause = false) => {

    currentSong.src = "/music" + track
    if (!pause) {

        currentSong.play()
        play.src = "/harry/img/pause.svg"
    }

    document.querySelector(".songinfo").innerHTML = decodeURI(track)
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00"


}

async function main() {



    songs = await getSongs()
    // console.log(songs)
    playMusic(songs[0], true)

    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0]
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `
        <li>
                            <img class="invert" src="/harry/img/music.svg" alt="">
                            <div class="info">
                                <div> ${song.replaceAll("%20", " ")} </div>
                                <div>:- kai</div>
                            </div>
                            <div class="playNow">
                                <span>Play Now</span>
                                <img  class="invert" src="/harry/img/play.svg" alt="">
                            </div>
                        </li>`;
        // ${song.replaceAll("%20", " ").replaceAll("/", " ").replaceAll("%2C", " ").replaceAll("%26", " ")} 
    }

    // Attach an event listener to each song
    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", () => {

            // console.log(e.querySelector(".info").firstElementChild.innerHTML)
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())

            var playImg = document.getElementById("play")
            playImg.hidden = false
            var pauseImg = document.getElementById("previous")
            pauseImg.hidden = false
            var nextImg = document.getElementById("next")
            nextImg.hidden = false


        })

    })

    //Attach an event listener to next, play, previous
    play.addEventListener("click", () => {

        if (currentSong.paused) {
            currentSong.play()
            play.src = "/harry/img/pause.svg"
        }
        else {

            currentSong.pause()
            play.src = "/harry/img/play.svg"


        }
    })

    //listen for timeupdate event
    currentSong.addEventListener("timeupdate", () => {
        // console.log(currentSong.currentTime, currentSong.duration)
        document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)} : ${secondsToMinutesSeconds(currentSong.duration)}`
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%"
    })


    //Add event listener to seekbar
    document.querySelector(".seekbar").addEventListener("click", e => {
        console.log(e)
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100
        document.querySelector("circle").style.left = percent + "%"
        currentSong.currentTime = ((currentSong.duration) * percent) / 100

    })

    document.querySelector(".hamburger").addEventListener("click", () => {

        document.querySelector(".left").style.left = "0"

    })

    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-120%"
        // document.querySelector("")
    })

    document.querySelector(".prevClass").addEventListener("click", () => {
        console.log("Previous clicked")
        console.log(currentSong)

         let desongs = songs.map(song => decodeURIComponent(song));

        console.log(desongs);
        // console.log(songs)
        let index = songs.indexOf(currentSong.src.trim("/").split(-1)[0])
        // console.log(songs, index);
         
        if((index - 1) >= 0){

            playMusic(songs[index - 1])
        }

    })
    document.querySelector(".nextClass").addEventListener("click", () => {
        console.log("next  clicked")
        // console.log(currentSong)
        // let desongs = songs.map(song => decodeURIComponent(song));
        let index = songs.indexOf(currentSong.src.trim("/").split(-1)[0])
        // console.log(songs, index);
         
        if((index + 1) < songs.length){

            playMusic(songs[index + 1])
        }
    })

    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change",(e)=>{
        console.log("Setting Volume to ", e.target.value)
        currentSong.volume = parseInt(e.target.value)/100
        if (currentSong.volume > 0) {
            document.querySelector(".volume>img").src = document.querySelector(".volume>img").src.replace("mute.svg", "volume.svg")
            
        }
    })



    // Add event listener to mute the track
    document.querySelector(".volume>img").addEventListener("click", e=>{
        if (e.target.src.includes("volume.svg")) {
            e.target.src = e.target.src.replace("volume.svg","mute.svg")
            currentSong.volume = 0
            document.querySelector(".range").getElementsByTagName("input")[0].value = 0
        }
        else{
            e.target.src = e.target.src.replace("mute.svg","volume.svg")
            currentSong.volume = .10
            document.querySelector(".range").getElementsByTagName("input")[0].value = 20
        }
    })
}
main()