// list music
const list_music = [
    {
        name: 'Thích Em Hơi Nhiều',
        artist: 'Wren Evans',
        img: 'thich-em-hoi-nhieu',
        src: 'thich-em-hoi-nhieu',
    },
    {
        name: 'Muộn Rồi Mà Sao Còn',
        artist: 'Sơn Tùng M-TP',
        img: 'muon-roi-ma-sao-con',
        src: 'muon-roi-ma-sao-con',
    },
    {
        name: 'Ép Duyên',
        artist: 'Long Nón Lá, KayDee',
        img: 'ep-duyen',
        src: 'ep-duyen',
    },
    {
        name: 'Yếu Đuối',
        artist: 'Hoàng Dũng',
        img: 'yeu-duoi',
        src: 'yeu-duoi',
    },
    {
        name: 'Sao Em Nỡ',
        artist: 'JayKii - Hiền Hồ',
        img: 'sao-em-no',
        src: 'sao-em-no',
    },
    {
        name: 'Bỏ Em vào Balo',
        artist: 'Tân Trần; Freak D',
        img: 'bo-em-vao-balo',
        src: 'bo-em-vao-balo',
    },
];

const wrapper = document.querySelector('.wrapper'),
musicImg = wrapper.querySelector('.song-thumb img'),
musicName = wrapper.querySelector('.song-details .name'),
musicArtist = wrapper.querySelector('.song-details .artist'),
mainAudio = wrapper.querySelector('#main_audio'),
playPauseBtn = wrapper.querySelector('.js-play-pause'),
prevBtn = wrapper.querySelector('#prev'),
nextBtn = wrapper.querySelector('#next'),
progress_bar = wrapper.querySelector('.progress-bar'),
progress_area = wrapper.querySelector('.progress-area'),
more_list_music =  wrapper.querySelector('.js-show-list-music'),
hide_list_music = wrapper.querySelector('.js-hide-list-music'),
music_list = wrapper.querySelector(".music-list"),
prevBtsssn = wrapper.querySelector('#prevss');

// let musicIndex = Math.floor((Math.random() * list_music.length) + 1);
let musicIndex = 1;

function load_music(indexNumb) {
    musicName.innerText = list_music[indexNumb - 1].name;
    musicArtist.innerText = list_music[indexNumb - 1].artist;
    musicImg.src = `images/${list_music[indexNumb - 1].img}.jpg`;
    mainAudio.src = `songs/${list_music[indexNumb - 1].src}.mp3`;
}
load_music(musicIndex);

//play music function
function play_music() {
    wrapper.classList.add('paused');
    playPauseBtn.querySelector('i').innerText = 'pause';
    mainAudio.play();
}

//pause music function
function pause_music() {
    wrapper.classList.remove('paused');
    playPauseBtn.querySelector('i').innerText = 'play_arrow';
    mainAudio.pause();
}

// prev musci function
function prev_music() {
    musicIndex--;
    // nếu musicIdex < 1 thì music = độ dài của mảng
    musicIndex < 1 ? (musicIndex = list_music.length) : (musicIndex = musicIndex);
    load_music(musicIndex);
    play_music();
    playingSong();
}

// next music funciton
function next_music() {
    musicIndex++;
    // nếu music index > mảng list_music thì quay lại 1
    musicIndex > list_music.length ? (musicIndex = 1) : (musicIndex = musicIndex);
    load_music(musicIndex);
    play_music();
    playingSong();
}

// play or pause button event
playPauseBtn.addEventListener('click', () => {
    const isMusicPlay = wrapper.classList.contains('paused');
    //nếu isPlayMusic là true thì gọi pause_music còn lại gọi play_music
    isMusicPlay ? pause_music() : play_music();
    playingSong();
});

prevBtn.addEventListener('click', () => {
    prev_music();
});

nextBtn.addEventListener('click', () => {
    next_music();
});

// update progress bar width according to music current time
mainAudio.addEventListener('timeupdate', (e) => {
    // console.log(e); ktra target scrElement

    const currentTime = e.target.currentTime;
    const duration = e.target.duration;
    let progressWidth = (currentTime / duration) * 100;
    progress_bar.style.width = `${progressWidth}%`;

    // update time song
    let musicCurrentTime = wrapper.querySelector('.current-time'),
        musicDuartion = wrapper.querySelector('.max-duration');
    mainAudio.addEventListener('loadeddata', () => {
        // update song total duration
        let main_duration = mainAudio.duration;
        let totalMin = Math.floor(main_duration / 60);
        let totalSec = Math.floor(main_duration % 60);
        if (totalSec < 10) {
            //if sec is less than 10 then add 0 before it
            totalSec = `0${totalSec}`;
        }
        musicDuartion.innerText = `${totalMin}:${totalSec}`;
    });
    // update playing song current time
    let currentMin = Math.floor(currentTime / 60);
    let currentSec = Math.floor(currentTime % 60);
    if (currentSec < 10) {
        //if sec is less than 10 then add 0 before it
        currentSec = `0${currentSec}`;
    }
    musicCurrentTime.innerText = `${currentMin}:${currentSec}`;
});

// update playing song currentTime on according to the progress bar width
progress_area.addEventListener('click', (e) => {
    let progressWidth = progress_area.clientWidth; //getting width of progress bar
    let clickedOffsetX = e.offsetX; //getting offset x value
    let songDuration = mainAudio.duration; //getting song total duration

    mainAudio.currentTime = (clickedOffsetX / progressWidth) * songDuration;
    playMusic();
    playingSong();
});

//change loop, shuffle, repeat icon onclick
const repeatBtn = wrapper.querySelector('#repeat-plist');
repeatBtn.addEventListener('click', () => {
    let getText = repeatBtn.innerText; //getting this tag innerText
    switch (getText) {
        case 'repeat':
            repeatBtn.innerText = 'repeat_one';
            repeatBtn.setAttribute('title', 'Song looped');
            break;
        case 'repeat_one':
            repeatBtn.innerText = 'shuffle';
            repeatBtn.setAttribute('title', 'Playback shuffled');
            break;
        case 'shuffle':
            repeatBtn.innerText = 'repeat';
            repeatBtn.setAttribute('title', 'Playlist looped');
            break;
    }
});

//code for what to do after song end
mainAudio.addEventListener("ended", ()=>{
    let getText = repeatBtn.innerText;
    switch(getText) {
        case "repeat":
            next_music();
            break;
        case "repeat_one": 
            mainAudio.currentTime = 0;
            load_music(musicIndex);
            play_music();
            break;
        case "shuffle":
            let randIndex = Math.floor(Math.random() * list_music.length + 1);
            do {
                randIndex = Math.floor(Math.random() * list_music.length + 1);
            }while(musicIndex == randIndex);//this loop run until the next random number won't be the same of current musicIndex
            musicIndex = randIndex;
            load_music(musicIndex);
            play_music();
            playingSong();
            break;
    }
})

more_list_music.addEventListener("click",()=>{
    music_list.classList.toggle("show");
    playingSong();
})

hide_list_music.addEventListener("click", ()=>{
    more_list_music.click();
})

// add list music into html
const render_list = wrapper.querySelector(".music-list .content");
for(let i = 0; i < list_music.length; i++) {
    let rows = `<div class="rows" rows-index=${i + 1}>
                    <div class="song-info">
                        <p class="txt-ellipsis">${list_music[i].name}</p>
                        <p class="txt-ellipsis">${list_music[i].artist}</p>
                    </div>
                    <div id="${list_music[i].src}" class="audio-duration">3:40</div>
                    <audio class="${list_music[i].src}" src="songs/${list_music[i].src}.mp3"></audio>
                </div>`;
    render_list.insertAdjacentHTML("beforeend", rows);

    let rowsAudioDurationTag = render_list.querySelector(`#${list_music[i].src}`);
    let rowsAudioTag = render_list.querySelector(`.${list_music[i].src}`);
    rowsAudioTag.addEventListener("loadeddata", ()=>{
        let duration = rowsAudioTag.duration;
        let totalMin = Math.floor(duration / 60);
        let totalSec = Math.floor(duration % 60);
        if(totalSec < 10){ //if sec is less than 10 then add 0 before it
            totalSec = `0${totalSec}`;
        };
        rowsAudioDurationTag.innerText = `${totalMin}:${totalSec}`;
        rowsAudioDurationTag.setAttribute("t-duration", `${totalMin}:${totalSec}`);
    })
}

//play particular song from the list onclick of rows
function playingSong() {
    const elm_list_music = render_list.querySelectorAll(".music-list .content .rows");
    for(let j = 0; j < elm_list_music.length; j++) {
        let audioTag = elm_list_music[j].querySelector(".audio-duration");

        if(elm_list_music[j].classList.contains("playing")){
            elm_list_music[j].classList.remove("playing");
            let adDuration = audioTag.getAttribute("t-duration");
            audioTag.innerText = adDuration;
        }
        //if the rows index is equal to the musicIndex then add playing class in it
        if(elm_list_music[j].getAttribute("rows-index") == musicIndex){
            elm_list_music[j].classList.add("playing");
            audioTag.innerText = "Playing";
        }
        elm_list_music[j].setAttribute("onclick", "clicked(this)");
    }
}

//particular rows clicked function
function clicked(element){
    let getRowsIndex = element.getAttribute("rows-index");
    musicIndex = getRowsIndex; 
    load_music(musicIndex);
    play_music();
    playingSong();
}