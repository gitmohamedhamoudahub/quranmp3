// Surah Metadata (Juz' Amma: 78 - 114)
const surahs = [
    { number: 78, name: "النبأ" },
    { number: 79, name: "النازعات" },
    { number: 80, name: "عبس" },
    { number: 81, name: "التكوير" },
    { number: 82, name: "الانفطار" },
    { number: 83, name: "المطففين" },
    { number: 84, name: "الانشقاق" },
    { number: 85, name: "البروج" },
    { number: 86, name: "الطارق" },
    { number: 87, name: "الأعلى" },
    { number: 88, name: "الغاشية" },
    { number: 89, name: "الفجر" },
    { number: 90, name: "البلد" },
    { number: 91, name: "الشمس" },
    { number: 92, name: "الليل" },
    { number: 93, name: "الضحى" },
    { number: 94, name: "الشرح" },
    { number: 95, name: "التين" },
    { number: 96, name: "العلق" },
    { number: 97, name: "القدر" },
    { number: 98, name: "البينة" },
    { number: 99, name: "الزلزلة" },
    { number: 100, name: "العاديات" },
    { number: 101, name: "القارعة" },
    { number: 102, name: "التكاثر" },
    { number: 103, name: "العصر" },
    { number: 104, name: "الهمزة" },
    { number: 105, name: "الفيل" },
    { number: 106, name: "قريش" },
    { number: 107, name: "الماعون" },
    { number: 108, name: "الكوثر" },
    { number: 109, name: "الكافرون" },
    { number: 110, name: "النصر" },
    { number: 111, name: "المسد" },
    { number: 112, name: "الإخلاص" },
    { number: 113, name: "الفلق" },
    { number: 114, name: "الناس" }
];


// Reciter Metadata
const reciters = [
    { id: 99, name: "المصحف المعلم" },

];

// State
let currentReciterId = reciters[0].id;
let currentPlayingSurah = null;
let isRepeat = false;

// DOM Elements
const surahGrid = document.getElementById('surah-grid');
const reciterSelect = document.getElementById('reciter-select');
const surahSelect = document.getElementById('surah-select');
const mainAudio = document.getElementById('main-audio');
const playPauseBtn = document.getElementById('play-pause-btn');
const repeatBtn = document.getElementById('repeat-btn');
const progressBar = document.getElementById('progress-bar');
const currentTimeEl = document.getElementById('current-time');
const totalDurationEl = document.getElementById('total-duration');
const playerSurahName = document.getElementById('player-surah-name');
const playerReciterName = document.getElementById('player-reciter-name');
const schemaScript = document.getElementById('schema-json-ld');
const errorModal = document.getElementById('error-modal');
const modalMessage = document.getElementById('modal-message');
const closeModalBtn = document.getElementById('close-modal-btn');

// Initialize
function init() {
    populateReciters();
    populateSurahsSelect();

    // Check for query params
    const urlParams = new URLSearchParams(window.location.search);
    const surahParam = urlParams.get('surah');
    const reciterParam = urlParams.get('reciter');

    if (reciterParam) {
        currentReciterId = parseInt(reciterParam);
        reciterSelect.value = currentReciterId;
    }

    renderSurahs();

    if (surahParam) {
        const surahNum = parseInt(surahParam);
        const surah = surahs.find(s => s.number === surahNum);
        if (surah) {
            setupAudio(surah);
            updatePageSEO(surah);
            surahSelect.value = surah.number;
            renderSurahs(surah.number); // Filter to this surah if in URL
        }
    }

    setupEventListeners();
}

function populateReciters() {
    reciters.forEach(reciter => {
        const option = document.createElement('option');
        option.value = reciter.id;
        option.textContent = reciter.name;
        reciterSelect.appendChild(option);
    });
}

function populateSurahsSelect() {
    surahSelect.innerHTML = '<option value="">الكل (جميع السور)</option>';
    // In a real app, you might filter 'surahs' based on 'currentReciterId' here
    surahs.forEach(surah => {
        const option = document.createElement('option');
        option.value = surah.number;
        option.textContent = surah.name;
        surahSelect.appendChild(option);
    });
}

function renderSurahs(filterNumber = null) {
    surahGrid.innerHTML = '';

    const surahsToShow = filterNumber
        ? surahs.filter(s => s.number === parseInt(filterNumber))
        : surahs;

    surahsToShow.forEach(surah => {
        const surahNumStr = surah.number.toString().padStart(3, '0');
        const card = document.createElement('div');
        card.className = 'surah-card';
        card.innerHTML = `
            <div class="card-outer-frame"></div>
            <div class="card-inner-circle">
                <div class="card-number-plate">${toArabicNumerals(surah.number)}</div>
                <a href="/?surah=${surahNumStr}&reciter=${currentReciterId}" class="surah-name" data-surah="${surah.number}">
                    <span>${surah.name}</span>
                </a>
            </div>
            <div class="card-info">
                <button class="btn btn-artistic" onclick="playSurah(${surah.number})">
                    <span class="icon">▶</span> <span>استمع</span>
                </button>
                <a href="audio/${currentReciterId}/${surahNumStr}-${currentReciterId}.mp3"
                   class="btn-download-small"
                   download="سورة-${surah.name}.mp3">
                    <span>تحميل السورة</span>
                </a>
            </div>
            <div class="ornament-corner ornament-left">✦</div>
            <div class="ornament-corner ornament-right">✦</div>
        `;

        // Handle internal linking click
        card.querySelector('.surah-name').addEventListener('click', (e) => {
            e.preventDefault();
            const url = new URL(window.location);
            url.searchParams.set('surah', surahNumStr);
            url.searchParams.set('reciter', currentReciterId);
            window.history.pushState({}, '', url);

            playSurah(surah.number);
            updatePageSEO(surah);
        });

        surahGrid.appendChild(card);
    });
}

function playSurah(surahNumber) {
    const surah = surahs.find(s => s.number === surahNumber);
    if (!surah) return;

    setupAudio(surah);
    mainAudio.play()
        .then(() => {
            updatePlayPauseUI(true);
        })
        .catch(err => {
            console.error("Playback failed:", err);
            showModal("عذراً، تعذر تشغيل الملف الصوتي. تأكد من وجود الملف في المسار الصحيح.");
        });
}

function setupAudio(surah) {
    currentPlayingSurah = surah;
    const surahNumStr = surah.number.toString().padStart(3, '0');
    const audioPath = `audio/${currentReciterId}/${surahNumStr}-${currentReciterId}.mp3`;

    mainAudio.src = audioPath;
    playerSurahName.textContent = `سورة ${surah.name}`;
    const reciter = reciters.find(r => r.id === currentReciterId);
    playerReciterName.textContent = reciter ? reciter.name : '-';

    updateSchema(surah, reciter, audioPath);
}

function updatePlayPauseUI(isPlaying) {
    const icon = playPauseBtn.querySelector('span');
    if (isPlaying) {
        icon.textContent = '||'; // Pause icon
        playPauseBtn.ariaLabel = "إيقاف مؤقت";
    } else {
        icon.textContent = '▶'; // Play icon
        playPauseBtn.ariaLabel = "تشغيل";
    }
}

function setupEventListeners() {
    // Reciter change
    reciterSelect.addEventListener('change', (e) => {
        currentReciterId = parseInt(e.target.value);
        renderSurahs(surahSelect.value); // Keep current filter
    });

    // Surah filter change
    surahSelect.addEventListener('change', (e) => {
        const surahNum = e.target.value;
        renderSurahs(surahNum);
    });

    // Play/Pause button
    playPauseBtn.addEventListener('click', () => {
        if (!mainAudio.src) return;

        if (mainAudio.paused) {
            mainAudio.play();
            updatePlayPauseUI(true);
        } else {
            mainAudio.pause();
            updatePlayPauseUI(false);
        }
    });

    // Repeat mode toggle
    repeatBtn.addEventListener('click', () => {
        isRepeat = !isRepeat;
        repeatBtn.classList.toggle('active', isRepeat);
        mainAudio.loop = isRepeat;
    });

    // Progress bar
    mainAudio.addEventListener('timeupdate', () => {
        if (!mainAudio.duration) return;
        const percent = (mainAudio.currentTime / mainAudio.duration) * 100;
        progressBar.value = percent;
        currentTimeEl.textContent = formatTime(mainAudio.currentTime);
    });

    mainAudio.addEventListener('loadedmetadata', () => {
        totalDurationEl.textContent = formatTime(mainAudio.duration);
    });

    progressBar.addEventListener('input', (e) => {
        if (!mainAudio.duration) return;
        const time = (e.target.value / 100) * mainAudio.duration;
        mainAudio.currentTime = time;
    });

    // Handle end of audio
    mainAudio.addEventListener('ended', () => {
        if (!isRepeat) {
            updatePlayPauseUI(false);
        }
    });

    // Modal Close
    closeModalBtn.addEventListener('click', hideModal);
    errorModal.addEventListener('click', (e) => {
        if (e.target === errorModal) hideModal();
    });
}

function showModal(message) {
    modalMessage.textContent = message;
    errorModal.setAttribute('aria-hidden', 'false');
}

function hideModal() {
    errorModal.setAttribute('aria-hidden', 'true');
}

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function toArabicNumerals(n) {
    const chars = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
    return n.toString().replace(/\d/g, d => chars[d]);
}

// SEO Functions
function updatePageSEO(surah) {
    const reciter = reciters.find(r => r.id === currentReciterId);
    const title = `سورة ${surah.name} – استماع وتحميل بصوت ${reciter.name} | القرآن الكريم`;
    const description = `استمع وحمل سورة ${surah.name} بصوت ${reciter.name} بجودة عالية. القرآن الكريم كاملاً برواية حفص عن عاصم.`;

    document.title = title;
    document.querySelector('meta[name="description"]').setAttribute('content', description);
}

function updateSchema(surah, reciter, audioPath) {
    const schema = {
        "@context": "https://schema.org",
        "@type": "AudioObject",
        "name": `سورة ${surah.name}`,
        "inLanguage": "ar",
        "encodingFormat": "audio/mpeg",
        "contentUrl": window.location.origin + "/" + audioPath,
        "author": {
            "@type": "Person",
            "name": reciter.name
        }
    };
    schemaScript.textContent = JSON.stringify(schema);
}

// Start the app
init();
