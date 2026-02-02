// Surah Metadata (Juz' Amma: 78 - 114)
const surahs = [
    { number: 78, name: "النبأ", nameEn: "An-Naba" },
    { number: 79, name: "النازعات", nameEn: "An-Nazi'at" },
    { number: 80, name: "عبس", nameEn: "'Abasa" },
    { number: 81, name: "التكوير", nameEn: "At-Takwir" },
    { number: 82, name: "الانفطار", nameEn: "Al-Infitar" },
    { number: 83, name: "المطففين", nameEn: "Al-Mutaffifin" },
    { number: 84, name: "الانشقاق", nameEn: "Al-Inshiqaq" },
    { number: 85, name: "البروج", nameEn: "Al-Buruj" },
    { number: 86, name: "الطارق", nameEn: "At-Tariq" },
    { number: 87, name: "الأعلى", nameEn: "Al-A'la" },
    { number: 88, name: "الغاشية", nameEn: "Al-Ghashiyah" },
    { number: 89, name: "الفجر", nameEn: "Al-Fajr" },
    { number: 90, name: "البلد", nameEn: "Al-Balad" },
    { number: 91, name: "الشمس", nameEn: "Ash-Shams" },
    { number: 92, name: "الليل", nameEn: "Al-Layl" },
    { number: 93, name: "الضحى", nameEn: "Ad-Duhaa" },
    { number: 94, name: "الشرح", nameEn: "Ash-Sharh" },
    { number: 95, name: "التين", nameEn: "At-Tin" },
    { number: 96, name: "العلق", nameEn: "Al-'Alaq" },
    { number: 97, name: "القدر", nameEn: "Al-Qadr" },
    { number: 98, name: "البينة", nameEn: "Al-Bayyinah" },
    { number: 99, name: "الزلزلة", nameEn: "Az-Zalzalah" },
    { number: 100, name: "العاديات", nameEn: "Al-'Adiyat" },
    { number: 101, name: "القارعة", nameEn: "Al-Qari'ah" },
    { number: 102, name: "التكاثر", nameEn: "At-Takathur" },
    { number: 103, name: "العصر", nameEn: "Al-'Asr" },
    { number: 104, name: "الهمزة", nameEn: "Al-Humazah" },
    { number: 105, name: "الفيل", nameEn: "Al-Fil" },
    { number: 106, name: "قريش", nameEn: "Quraish" },
    { number: 107, name: "الماعون", nameEn: "Al-Ma'un" },
    { number: 108, name: "الكوثر", nameEn: "Al-Kawthar" },
    { number: 109, name: "الكافرون", nameEn: "Al-Kafirun" },
    { number: 110, name: "النصر", nameEn: "An-Nasr" },
    { number: 111, name: "المسد", nameEn: "Al-Masad" },
    { number: 112, name: "الإخلاص", nameEn: "Al-Ikhlas" },
    { number: 113, name: "الفلق", nameEn: "Al-Falaq" },
    { number: 114, name: "الناس", nameEn: "An-Nas" }
];

// Reciter Metadata
const reciters = [
    { id: 99, name: "المصحف المعلم", nameEn: "Al-Mus'haf Al-Mu'allam" }
];

const translations = {
    ar: {
        site_title: "القرآن الكريم – سور جزء عم",
        site_subtitle: "تلاوات مختارة بجودة عالية",
        select_reciter: "اختر القارئ:",
        select_surah: "اختر السورة:",
        all_surahs: "الكل (جميع السور)",
        loading: "جاري تحميل السور...",
        listen: "استمع",
        download: "تحميل السورة",
        surah: "سورة",
        error_title: "تنبيه",
        error_message: "عذراً، تعذر تشغيل الملف الصوتي. تأكد من وجود الملف في المسار الصحيح.",
        ok: "موافق",
        lang: "English"
    },
    en: {
        site_title: "Noble Quran – Juz' Amma",
        site_subtitle: "Selected Recitations in High Quality",
        select_reciter: "Choose Reciter:",
        select_surah: "Choose Surah:",
        all_surahs: "All (Full List)",
        loading: "Loading Surahs...",
        listen: "Listen",
        download: "Download Surah",
        surah: "Surah",
        error_title: "Notice",
        error_message: "Sorry, audio playback failed. Please ensure the file exists.",
        ok: "OK",
        lang: "العربية"
    }
};

// State
let currentReciterId = reciters[0].id;
let currentPlayingSurah = null;
let isRepeat = false;
let currentLang = 'ar';

// DOM Elements
const surahGrid = document.getElementById('surah-grid');
const reciterSelect = document.getElementById('reciter-select');
const surahSelect = document.getElementById('surah-select');
const mainAudio = document.getElementById('main-audio');
const playPauseBtn = document.getElementById('play-pause-btn');
const repeatBtn = document.getElementById('repeat-btn');
const langBtn = document.getElementById('lang-btn');
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
    updateUI();
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
            renderSurahs(surah.number);
        }
    }

    setupEventListeners();
}

function updateUI() {
    document.documentElement.lang = currentLang;
    document.documentElement.dir = currentLang === 'ar' ? 'rtl' : 'ltr';

    // Update translatable elements
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[currentLang][key]) {
            el.textContent = translations[currentLang][key];
        }
    });

    if (langBtn) {
        langBtn.textContent = translations[currentLang === 'ar' ? 'en' : 'ar'].lang;
    }
}

function toggleLanguage() {
    currentLang = currentLang === 'ar' ? 'en' : 'ar';
    updateUI();
    populateReciters();
    populateSurahsSelect();
    renderSurahs(surahSelect.value);

    if (currentPlayingSurah) {
        const t = translations[currentLang];
        const sName = currentLang === 'ar' ? currentPlayingSurah.name : currentPlayingSurah.nameEn;
        playerSurahName.textContent = `${t.surah} ${sName}`;
        const reciter = reciters.find(r => r.id === currentReciterId);
        playerReciterName.textContent = reciter ? (currentLang === 'ar' ? reciter.name : reciter.nameEn) : '-';
    }
}

function populateReciters() {
    reciterSelect.innerHTML = '';
    reciters.forEach(reciter => {
        const option = document.createElement('option');
        option.value = reciter.id;
        option.textContent = currentLang === 'ar' ? reciter.name : reciter.nameEn;
        reciterSelect.appendChild(option);
    });
    reciterSelect.value = currentReciterId;
}

function populateSurahsSelect() {
    const t = translations[currentLang];
    const prevVal = surahSelect.value;
    surahSelect.innerHTML = `<option value="">${t.all_surahs}</option>`;
    surahs.forEach(surah => {
        const option = document.createElement('option');
        option.value = surah.number;
        option.textContent = currentLang === 'ar' ? surah.name : surah.nameEn;
        surahSelect.appendChild(option);
    });
    surahSelect.value = prevVal;
}

function renderSurahs(filterNumber = null) {
    surahGrid.innerHTML = '';
    const t = translations[currentLang];

    const surahsToShow = filterNumber
        ? surahs.filter(s => s.number === parseInt(filterNumber))
        : surahs;

    surahsToShow.forEach(surah => {
        const surahNumStr = surah.number.toString().padStart(3, '0');
        const sName = currentLang === 'ar' ? surah.name : surah.nameEn;
        const card = document.createElement('div');
        card.className = 'surah-card';
        card.innerHTML = `
            <div class="card-outer-frame"></div>
            <div class="card-inner-circle">
                <div class="card-number-plate">${currentLang === 'ar' ? toArabicNumerals(surah.number) : surah.number}</div>
                <a href="/?surah=${surahNumStr}&reciter=${currentReciterId}" class="surah-name" data-surah="${surah.number}">
                    <span style="font-size: ${currentLang === 'en' ? '1.4rem' : '1.8rem'}">${sName}</span>
                </a>
            </div>
            <div class="card-info">
                <button class="btn btn-artistic" onclick="playSurah(${surah.number})">
                    <span class="icon">▶</span> <span>${t.listen}</span>
                </button>
                <a href="audio/${currentReciterId}/${surahNumStr}-${currentReciterId}.mp3" 
                   class="btn-download-small" 
                   download="${t.surah}-${sName}.mp3">
                    <span>${t.download}</span>
                </a>
            </div>
            <div class="ornament-corner ornament-left">✦</div>
            <div class="ornament-corner ornament-right">✦</div>
        `;

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
            showModal(translations[currentLang].error_message);
        });
}

function setupAudio(surah) {
    currentPlayingSurah = surah;
    const t = translations[currentLang];
    const surahNumStr = surah.number.toString().padStart(3, '0');
    const audioPath = `audio/${currentReciterId}/${surahNumStr}-${currentReciterId}.mp3`;

    mainAudio.src = audioPath;
    const sName = currentLang === 'ar' ? surah.name : surah.nameEn;
    playerSurahName.textContent = `${t.surah} ${sName}`;
    const reciter = reciters.find(r => r.id === currentReciterId);
    playerReciterName.textContent = reciter ? (currentLang === 'ar' ? reciter.name : reciter.nameEn) : '-';

    updateSchema(surah, reciter, audioPath);
}

function updatePlayPauseUI(isPlaying) {
    const icon = playPauseBtn.querySelector('span');
    if (isPlaying) {
        icon.textContent = '||';
        playPauseBtn.ariaLabel = currentLang === 'ar' ? "إيقاف مؤقت" : "Pause";
    } else {
        icon.textContent = '▶';
        playPauseBtn.ariaLabel = currentLang === 'ar' ? "تشغيل" : "Play";
    }
}

function setupEventListeners() {
    reciterSelect.addEventListener('change', (e) => {
        currentReciterId = parseInt(e.target.value);
        renderSurahs(surahSelect.value);
    });

    surahSelect.addEventListener('change', (e) => {
        const surahNum = e.target.value;
        renderSurahs(surahNum);
    });

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

    repeatBtn.addEventListener('click', () => {
        isRepeat = !isRepeat;
        repeatBtn.classList.toggle('active', isRepeat);
        mainAudio.loop = isRepeat;
    });

    if (langBtn) {
        langBtn.addEventListener('click', toggleLanguage);
    }

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

    mainAudio.addEventListener('ended', () => {
        if (!isRepeat) {
            updatePlayPauseUI(false);
        }
    });

    closeModalBtn.addEventListener('click', hideModal);
    errorModal.addEventListener('click', (e) => {
        if (e.target === errorModal) hideModal();
    });
}

function showModal(message) {
    modalMessage.textContent = message;
    const t = translations[currentLang];
    document.getElementById('modal-title').textContent = t.error_title;
    closeModalBtn.textContent = t.ok;
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

function updatePageSEO(surah) {
    const reciter = reciters.find(r => r.id === currentReciterId);
    const sName = currentLang === 'ar' ? surah.name : surah.nameEn;
    const rName = currentLang === 'ar' ? reciter.name : reciter.nameEn;

    let title, description;
    if (currentLang === 'ar') {
        title = `سورة ${sName} – استماع وتحميل بصوت ${rName} | القرآن الكريم`;
        description = `استمع وحمل سورة ${sName} بصوت ${rName} بجودة عالية. القرآن الكريم كاملاً برواية حفص عن عاصم.`;
    } else {
        title = `Surah ${sName} – Listen & Download by ${rName} | Noble Quran`;
        description = `Listen and download Surah ${sName} recited by ${rName} in high quality. The Noble Quran.`;
    }

    document.title = title;
    document.querySelector('meta[name="description"]').setAttribute('content', description);
}

function updateSchema(surah, reciter, audioPath) {
    const sName = currentLang === 'ar' ? surah.name : surah.nameEn;
    const rName = currentLang === 'ar' ? reciter.name : reciter.nameEn;
    const t = translations[currentLang];

    const schema = {
        "@context": "https://schema.org",
        "@type": "AudioObject",
        "name": `${t.surah} ${sName}`,
        "inLanguage": currentLang,
        "encodingFormat": "audio/mpeg",
        "contentUrl": window.location.origin + "/" + audioPath,
        "author": {
            "@type": "Person",
            "name": rName
        }
    };
    schemaScript.textContent = JSON.stringify(schema);
}

init();
