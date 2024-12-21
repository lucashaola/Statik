// Footer
let temperature = localStorage.getItem('temperature') ? parseInt(localStorage.getItem('temperature')) : 20;

function changeTemperature(change) {
    temperature += change;
    localStorage.setItem('temperature', temperature);
    document.getElementById("temperature-left").textContent = temperature + "°";
    document.getElementById("temperature-right").textContent = temperature + "°";
}

document.addEventListener('DOMContentLoaded', function () {
    preventDoubleTapZoom();
    updateTemperatureDisplay();
    initializeFooterIcons();
    initializeCloseButtons();
    
    initializeWelcomeScreen();


    if (window.location.pathname.includes('/views/profile')) {
        initializeProfileScreen();
    }
});

function preventDoubleTapZoom() {
    document.addEventListener('touchstart', function (event) {
        if (event.touches.length > 1) {
            event.preventDefault();
        }
    }, { passive: false });

    document.addEventListener('touchend', function (event) {
        const now = (new Date()).getTime();
        if (this.lastTouchEnd && (now - this.lastTouchEnd) < 300) {
            event.preventDefault();
        }
        this.lastTouchEnd = now;
    }, { passive: false });
}

function updateTemperatureDisplay() {
    document.getElementById("temperature-left").textContent = temperature + "°";
    document.getElementById("temperature-right").textContent = temperature + "°";
}

function initializeFooterIcons() {
    const profileIcon = document.getElementById("profileIcon");
    if (profileIcon) {
        profileIcon.addEventListener("click", function () {
            const name = localStorage.getItem('userName');
            if (name) {
                const currentPath = window.location.pathname;
                if (currentPath.includes('/views/profile')) {
                    return;
                }
                window.location.href = `/views/profile`;
            }
        });
    }

    const homeIcon = document.getElementById("homeIcon");
    if (homeIcon) {
        homeIcon.addEventListener("click", function () {
            const currentPath = window.location.pathname;
            if (currentPath.includes('/views/welcome')) {
                return;
            }
            window.location.href = `/views/welcome`;
        });
    }
}

function initializeCloseButtons() {
    const closeButton = document.getElementById("closeButton");
    if (closeButton) {
        closeButton.addEventListener("click", function () {
            window.history.back();
        });
    }

    const arrowBackToWelcome = document.getElementById("arrowBackToWelcome");
    if (arrowBackToWelcome) {
        arrowBackToWelcome.addEventListener("click", function () {
            window.location.href = '/views/welcome';
        });
    }

    const closeBackToWelcome = document.getElementById("closeBackToWelcome");
    if (closeBackToWelcome) {
        closeBackToWelcome.addEventListener("click", function () {
            window.location.href = '/views/welcome';
        });
    }

}

function initializeWelcomeScreen() {
    const welcomeHeading = document.querySelector('.welcome h1');
    if (welcomeHeading) {
        const username = localStorage.getItem('userName');;
        if (username) {
            welcomeHeading.innerHTML = `<img src="../../assets/icons/welcome/Profile.svg" class="welcome-icon"> Willkommen ${username}!`;
        }

        showProgressOverview();
        loadScenarios();
    }

    const userSwitch = document.getElementById("userSwitch");
    if (userSwitch) {
        userSwitch.addEventListener("click", checkForExistingProfile);
    }

    const overview = document.querySelector('#tutorial .overview-button');
    if (overview) {
        overview.addEventListener('click', function () {
            window.location.href = '/views/overview';
        });
    }

    const tutorialButton = document.querySelector('#tutorial .start-button');
    if (tutorialButton) {
        tutorialButton.addEventListener('click', function () {
            window.location.href = `/views/tutorial`;
        });
    }

}

function initializeProfileScreen() {
    const profileName = document.getElementById('profileName');
    const username = localStorage.getItem('userName');
    if (username) {
        profileName.textContent = username;
    }
    
    const buttons = {
        overview: {
            button: document.querySelector('.overview-btn'),
            overview: document.querySelector('.progress-overview'),
            callback: typeof showProgressOverview === 'function' ? showProgressOverview : null
        },
        bonus: {
            button: document.querySelector('.bonus-btn'),
            overview: document.querySelector('.bonus-overview'),
            callback: typeof showBonusOverview === 'function' ? showBonusOverview : null
        },
        test: {
            button: document.querySelector('.test-btn'),
            overview: document.querySelector('.test-overview'),
            callback: typeof showTestOverview === 'function' ? showTestOverview : null
        },
        saved: {
            button: document.querySelector('.saved-btn'),
            overview: document.querySelector('.saved-pages'),
            callback: typeof showSavedPages === 'function' ? showSavedPages : null
        }
    };

    const setActiveView = (activeKey) => {
        const newUrl = new URL(window.location.href);
        newUrl.searchParams.set('view', activeKey);
        history.replaceState({}, '', newUrl);

        Object.keys(buttons).forEach((key) => {
            const { button, overview, callback } = buttons[key];
            const isActive = key === activeKey;

            button?.classList.toggle('selected', isActive);
            overview.style.display = isActive ? 'flex' : 'none';

            if (isActive && callback) {
                callback();
            }
        });
    };

    Object.keys(buttons).forEach((key) => {
        const { button } = buttons[key];
        button?.addEventListener('click', () => setActiveView(key));
    });

    const urlParams = new URLSearchParams(window.location.search);
    const viewParam = urlParams.get('view');
    
    setActiveView(viewParam || 'overview');
}