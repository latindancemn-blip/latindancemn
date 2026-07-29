document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const body = document.body;
    const canvasContainer = document.getElementById('canvasContainer');
    const bgVideo = document.getElementById('bgVideo');
    const fallbackGradient = document.getElementById('fallbackGradient');
    // Control Buttons
    const btnRecordMode = document.getElementById('btnRecordMode');
    const btnPlayPause = document.getElementById('btnPlayPause');
    const btnMute = document.getElementById('btnMute');
    const zoomButtons = document.querySelectorAll('.btn-zoom');
    
    let currentZoom = 0.4;
    let isRecordMode = false;

    // ==========================================================================
    // 1. ZOOM / PREVIEW SCALING
    // ==========================================================================
    function setZoom(scale) {
        if (isRecordMode) return;
        currentZoom = parseFloat(scale);
        canvasContainer.style.transform = `scale(${currentZoom})`;
        
        // Update active buttons
        zoomButtons.forEach(btn => {
            if (parseFloat(btn.dataset.zoom) === currentZoom) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }

    zoomButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            setZoom(btn.dataset.zoom);
        });
    });

    // ==========================================================================
    // 2. VIDEO PLAY/PAUSE
    // ==========================================================================
    let isVideoPlaying = true;
    btnPlayPause.addEventListener('click', () => {
        if (isVideoPlaying) {
            bgVideo.pause();
            btnPlayPause.innerHTML = '<i data-lucide="play"></i><span>Play Background Video</span>';
        } else {
            bgVideo.play().catch(err => console.log("Video play blocked:", err));
            btnPlayPause.innerHTML = '<i data-lucide="pause"></i><span>Pause Background Video</span>';
        }
        isVideoPlaying = !isVideoPlaying;
        lucide.createIcons(); // re-render icon
    });

    // Handle video load error (e.g. file missing)
    bgVideo.addEventListener('error', () => {
        console.warn("Background video failed to load. Displaying animated gradient fallback.");
        bgVideo.style.opacity = 0;
        fallbackGradient.style.zIndex = 3; // Put gradient on top of video
    });

    // ==========================================================================
    // 3. BACKGROUND VIDEO AUDIO (UNMUTE/MUTE)
    // ==========================================================================
    btnMute.addEventListener('click', () => {
        if (bgVideo.muted) {
            bgVideo.volume = 1.0;
            bgVideo.muted = false;
            btnMute.innerHTML = '<i data-lucide="volume-2"></i><span>Mute Video Audio</span>';
            btnMute.classList.add('active');
            console.log("Audio Unmuted. Volume:", bgVideo.volume, "Muted:", bgVideo.muted);
        } else {
            bgVideo.muted = true;
            btnMute.innerHTML = '<i data-lucide="volume-x"></i><span>Unmute Video Audio</span>';
            btnMute.classList.remove('active');
            console.log("Audio Muted. Muted:", bgVideo.muted);
        }
        lucide.createIcons();
    });

    // ==========================================================================
    // 4. RECORD MODE (FULLSCREEN FIT)
    // ==========================================================================
    function enterRecordMode() {
        isRecordMode = true;
        body.classList.add('record-mode');
        
        // Auto-calculate scale to perfectly fit window height
        const scale = window.innerHeight / 1920;
        canvasContainer.style.transform = `scale(${scale})`;
        
        // Unmute video audio for recording and set volume to 100%
        bgVideo.volume = 1.0;
        bgVideo.muted = false;
        btnMute.innerHTML = '<i data-lucide="volume-2"></i><span>Mute Video Audio</span>';
        btnMute.classList.add('active');
        lucide.createIcons();
        
        console.log("Record Mode entered. Video sound unmuted. Volume:", bgVideo.volume);
        
        // Ensure video is playing
        if (bgVideo && isVideoPlaying) {
            bgVideo.play().catch(e => console.error("Play error in Record Mode:", e));
        }
    }

    function exitRecordMode() {
        isRecordMode = false;
        body.classList.remove('record-mode');
        // Restore standard zoom
        setZoom(currentZoom);
        
        // Mute video audio again for peaceful previewing
        bgVideo.muted = true;
        btnMute.innerHTML = '<i data-lucide="volume-x"></i><span>Unmute Video Audio</span>';
        btnMute.classList.remove('active');
        lucide.createIcons();
    }

    btnRecordMode.addEventListener('click', enterRecordMode);

    // Escape key to exit Record Mode
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && isRecordMode) {
            exitRecordMode();
        }
    });

    // Adjust scale when resizing window in Record Mode
    window.addEventListener('resize', () => {
        if (isRecordMode) {
            const scale = window.innerHeight / 1920;
            canvasContainer.style.transform = `scale(${scale})`;
        }
    });
});
