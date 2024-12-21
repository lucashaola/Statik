const progressTracker = {
    verifyUser: async function () {
        const userCode = localStorage.getItem('userCode');
        if (!userCode) return false;

        try {
            const response = await fetch(`/api/users/${userCode}/verify`);
            const data = await response.json();

            if (!data.exists) {
                this.clearUserData();
                return false;
            }

            return true;
        } catch (error) {
            console.error('Error verifying user:', error);
            return false;
        }
    },

    isUserLoggedIn: function () {
        return !!localStorage.getItem('userCode');
    },

    clearUserData: function () {
        localStorage.removeItem('userCode');
    },

    handleResponse: async function (response) {
        if (response.status === 401) {
            const data = await response.json();
            if (data.action === 'CLEAR_LOCAL_STORAGE') {
                this.clearUserData();
            }
            return null;
        }
        return response;
    },

    getViewedSlides: async function (category) {
        if (!this.isUserLoggedIn()) {
            return [];
        }

        const userCode = localStorage.getItem('userCode');
        try {
            const response = await fetch(`/api/users/${userCode}/viewed-slides/${category}`);
            const handledResponse = await this.handleResponse(response);
            if (!handledResponse) return [];

            const data = await handledResponse.json();
            return data.viewedSlides || [];
        } catch (error) {
            console.error('Error getting viewed slides:', error);
            return [];
        }
    },

    markSlideAsViewed: async function (category, slideIndex) {
        if (!this.isUserLoggedIn()) {
            return;
        }

        const userCode = localStorage.getItem('userCode');
        try {
            await fetch(`/api/users/${userCode}/viewed-slides/${category}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({slideIndex})
            });

            const viewedSlides = await this.getViewedSlides(category);
            const totalSlides = document.querySelectorAll(`#${category} .slide`).length;
            const progress = Math.round((viewedSlides.length / totalSlides) * 100);

            await this.updateProgress(category, progress);
        } catch (error) {
            console.error('Error marking slide as viewed:', error);
        }
    },

    calculateProgress: async function (category, totalSlides) {
        if (!this.isUserLoggedIn()) {
            return 0;
        }

        const viewedSlides = await this.getViewedSlides(category);
        return Math.round((viewedSlides.length / totalSlides) * 100);
    },

    updateProgress: async function (category, progress) {
        if (!this.isUserLoggedIn()) {
            return;
        }

        const userCode = localStorage.getItem('userCode');
        try {
            const response = await fetch(`/api/users/${userCode}/progress`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    category: category,
                    progress: progress
                })
            });

            await this.handleResponse(response);

            if (progress === 100) {
                await unlockCategory(category);
            }
        } catch (error) {
            console.error('Error updating progress:', error);
        }
    }
};

function updateProgressCircle(element, progress) {
    const circle = element.querySelector('.progress-ring-progress');
    const circumference = 2 * Math.PI * 12; // 2πr where r=8
    const offset = circumference - (progress / 100) * circumference;
    circle.style.strokeDasharray = `${circumference} ${circumference}`;
    circle.style.strokeDashoffset = offset;

    if (progress === 100) {
        element.classList.add('completed');
    } else {
        element.classList.remove('completed');
    }
}

async function showProgressOverview() {
    const identificationCode = localStorage.getItem('userCode');

    if (!identificationCode) {
        return;
    }

    try {
        const verifyResponse = await fetch(`/api/users/${identificationCode}/verify`);
        const verifyData = await verifyResponse.json();

        if (!verifyData.exists) {
            localStorage.removeItem('userCode');
            return;
        }

        const response = await fetch(`/api/users/${identificationCode}/progress`);
        const progressData = await response.json();

        const categories = [
            {key: 'aktivierung', name: 'Aktivierung'},
            {key: 'verkehrszeichen', name: 'Verkehrszeichenassistent'},
            {key: 'geschwindigkeit', name: 'Adaptiver Geschwindigkeitsassistent'},
            {key: 'stau', name: 'Stauassistent'},
            {key: 'ampelerkennung', name: 'Ampelerkennung'},
            {key: 'spurführung', name: 'Spurführungsassistent'},
            {key: 'spurwechsel', name: 'Spurwechselassistent'},
            {key: 'notbrems', name: 'Notbremsassistent'},
            {key: 'deaktivierung', name: 'Deaktivierung'},
            {key: 'risiken', name: 'Risiken und Verantwortung'}
        ].map(category => ({
            ...category,
            icon: `../../assets/icons/tutorial/${category.name}.svg`
        }));

        const totalProgress = progressData.total_progress || 0;
        const progressFill = document.querySelector('.progress-fill');
        const progressText = document.querySelector('.progress-text');
        progressFill.style.width = `${totalProgress}%`;
        progressText.textContent = `${totalProgress}%`;

        const isWelcomeScreen = document.querySelector('#tutorial') !== null;

        const renderCategoryItem = (category, progress) => {
            const categoryName = isWelcomeScreen ?
                category.name.replace('Adaptiver Geschwindigkeitsassistent', 'Adaptiver <br>Geschwindigkeitsassistent') :
                category.name;

            return `
                <div class="progress-circle-item">
                    <img src="${category.icon}" class="progress-icon">
                    <div class="category-info">
                        <div class="category-name">${categoryName}</div>
                    </div>
                    <div class="progress-circle">
                        <div class="circle-icon">✓</div>
                        <svg class="progress-ring">
                            <circle class="progress-ring-bg" cx="16" cy="16" r="12" />
                            <circle class="progress-ring-progress" cx="16" cy="16" r="12" />
                        </svg>
                    </div>
                </div>
            `;
        };

        if (isWelcomeScreen) {
            const slider = document.querySelector('.progress-slider');
            const paginationContainer = document.querySelector('.pagination-dots');

            if (slider && paginationContainer) {
                slider.innerHTML = '';
                paginationContainer.innerHTML = '';

                for (let i = 0; i < Math.ceil(categories.length / 2); i++) {
                    const page = document.createElement('div');
                    page.className = 'progress-page';

                    for (let j = i * 2; j < Math.min((i * 2) + 2, categories.length); j++) {
                        const category = categories[j];
                        const progress = progressData[`${category.key}_progress`] || 0;

                        page.insertAdjacentHTML('beforeend', renderCategoryItem(category, progress));
                        const lastItem = page.lastElementChild;
                        updateProgressCircle(lastItem, progress);
                    }

                    slider.appendChild(page);

                    const dot = document.createElement('div');
                    dot.className = 'dot' + (i === 0 ? ' active' : '');
                    paginationContainer.appendChild(dot);
                }

                slider.addEventListener('scroll', () => {
                    const index = Math.round(slider.scrollLeft / slider.offsetWidth);
                    paginationContainer.querySelectorAll('.dot').forEach((dot, i) => {
                        dot.classList.toggle('active', i === index);
                    });
                });
            }
        } else {
            // Profile Screen
            document.querySelector('.progress-overview').style.display = 'block';
            const circlesContainer = document.querySelector('.progress-circles');
            circlesContainer.innerHTML = '';

            categories.forEach(category => {
                const progress = progressData[`${category.key}_progress`] || 0;
                circlesContainer.insertAdjacentHTML('beforeend', renderCategoryItem(category, progress));
                const lastItem = circlesContainer.lastElementChild;
                updateProgressCircle(lastItem, progress);
            });

            const container = document.querySelector('.progress-circle-item');
            new PerfectScrollbar(container, {
                wheelSpeed: 1,
                wheelPropagation: true,
                suppressScrollX: true,
                minScrollbarLength: 40,
                scrollbarYMargin: 0,
                railYVisible: true
            });
        }

        document.querySelectorAll('.progress-circle-item').forEach(item => {
            item.addEventListener('click', () => {
                const categoryName = item.querySelector('.category-name').textContent;
                const selectedCategory = categories.find(category => category.name === categoryName);

                if (selectedCategory) {
                    localStorage.setItem('selectedCategory', selectedCategory.key);
                    window.location.href = '../../views/tutorial';
                } else {
                    console.error(`Category not found for name: ${categoryName}`);
                }
            });
        });
    } catch (error) {
        console.error('Error fetching progress:', error);
    }
}
