function getCurrentPageType() {
    return window.location.href.includes('tutorial') ? 'tutorial' : 'overview';
}

async function initializeBookmark() {
    const bookmarkBtn = document.querySelector('.bookmark-btn');
    const identificationCode = localStorage.getItem('userCode');
    const currentPage = getCurrentPage();
    const pageType = getCurrentPageType();

    if (!currentPage) return;

    try {
        const response = await fetch(`/api/users/${identificationCode}/saved-pages?pageType=${pageType}`);
        const data = await response.json();

        if (data.success &&
            data.savedPages[currentPage.page] &&
            data.savedPages[currentPage.page].includes(currentPage.slideIndex)) {
            bookmarkBtn.classList.add('saved');
        } else {
            bookmarkBtn.classList.remove('saved');
        }
    } catch (error) {
        console.error('Error checking saved status:', error);
    }
}

async function toggleBookmark() {
    const bookmarkBtn = document.querySelector('.bookmark-btn');
    const identificationCode = localStorage.getItem('userCode');
    const currentPage = getCurrentPage();
    const pageType = getCurrentPageType();

    if (!currentPage) return;

    try {
        if (bookmarkBtn.classList.contains('saved')) {
            const response = await fetch(`/api/users/${identificationCode}/delete-slide`, {
                method: 'DELETE',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    page: currentPage.page,
                    slideIndex: currentPage.slideIndex,
                    pageType: pageType
                })
            });

            if (response.ok) {
                bookmarkBtn.classList.remove('saved');
            }
        } else {
            const response = await fetch(`/api/users/${identificationCode}/save-page`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    page: currentPage.page,
                    slideIndex: currentPage.slideIndex,
                    pageType: pageType
                })
            });

            if (response.ok) {
                bookmarkBtn.classList.add('saved');
            }
        }
    } catch (error) {
        console.error('Error toggling bookmark:', error);
    }
}

function getCurrentPage() {
    const pageType = getCurrentPageType();

    if (pageType === 'tutorial') {
        const activeContent = document.querySelector('.content.active');
        if (!activeContent) return null;

        const activeSlide = activeContent.querySelector('.slide[style*="display: block"]');
        if (!activeSlide) return null;

        return {
            page: activeContent.id,
            displayName: 'Detailliertes Tutorial: ' + activeContent.id,
            slideIndex: Array.from(activeContent.querySelectorAll('.slide')).indexOf(activeSlide)
        };
    } else {
        const pages = document.querySelectorAll('.content-container .page');
        const currentPage = Array.from(pages).find(page => page.classList.contains('page-active'));
        if (!currentPage) return null;

        return {
            page: 'overview',
            displayName: 'Schnellüberblick',
            slideIndex: Array.from(pages).indexOf(currentPage)
        };
    }
}

async function showSavedPages() {
    const savedPagesContainer = document.querySelector('.saved-pages');
    const identificationCode = localStorage.getItem('userCode');

    if (!identificationCode) {
        savedPagesContainer.innerHTML = `
            <div class="no-content">
                <p>Melden Sie sich an, um Ihre gespeicherten Seiten zu sehen.</p>
            </div>
        `;
        return;
    }

    try {
        const tutorialResponse = await fetch(`/api/users/${identificationCode}/saved-pages?pageType=tutorial`);
        const overviewResponse = await fetch(`/api/users/${identificationCode}/saved-pages?pageType=overview`);

        const tutorialData = await tutorialResponse.json();
        const overviewData = await overviewResponse.json();

        if (!tutorialData.success || !overviewData.success) {
            console.error('Failed to fetch saved pages');
            return;
        }

        const categoryTitles = {
            'aktivierung': 'Aktivierung',
            'verkehrszeichen': 'Verkehrszeichenassistent',
            'geschwindigkeit': 'Geschwindigkeitsassistent',
            'stau': 'Stauassistent',
            'ampelerkennung': 'Ampelerkennung',
            'spurführung': 'Spurführungsassistent',
            'spurwechsel': 'Spurwechselassistent',
            'notbrems': 'Notbremsassistent',
            'deaktivierung': 'Deaktivierung',
            'risiken': 'Risiken und Verantwortung'
        };

        const savedPagesHTML = [];

        for (const [category, slideIndices] of Object.entries(tutorialData.savedPages)) {
            for (const index of slideIndices) {
                const contentResponse = await fetch(`/api/slide-content/${category}/${index}`);
                const contentData = await contentResponse.json();

                if (contentData.success) {
                    savedPagesHTML.push(createSavedPageHTML(
                        category,
                        index,
                        'tutorial',
                        categoryTitles[category] || category,
                        contentData.content.heading,
                        contentData.content.text,
                        'Detailliertes Tutorial: ' + categoryTitles[category]
                    ));
                }
            }
        }

        /*
        const container = document.querySelector('.saved-pages');
        new PerfectScrollbar(container, {
            wheelSpeed: 1,
            wheelPropagation: true,
            suppressScrollX: true,
            minScrollbarLength: 40,
            scrollbarYMargin: 0,
            railYVisible: true
        });

         */

        for (const [category, slideIndices] of Object.entries(overviewData.savedPages)) {
            for (const index of slideIndices) {
                const contentResponse = await fetch(`/api/slide-content/${category}/${index}?pageType=overview`);
                const contentData = await contentResponse.json();

                if (contentData.success) {
                    savedPagesHTML.push(createSavedPageHTML(
                        category,
                        index,
                        'overview',
                        categoryTitles[category] || category,
                        contentData.content.heading,
                        contentData.content.text,
                        'Schnellüberblick: ' + contentData.content.heading
                    ));
                }
            }
        }

        if (savedPagesHTML.length === 0) {
            savedPagesContainer.innerHTML = `
                <div class="no-content">
                    <p>Sie haben noch keine Seiten gespeichert.</p>
                </div>
            `;
        } else {
            savedPagesContainer.innerHTML = savedPagesHTML.join('');
        }
    } catch (error) {
        console.error('Error loading saved pages:', error);
    }
}

function createSavedPageHTML(category, index, pageType, categoryTitle, heading, text, displayName) {
    const truncatedText = text.substring(0, 100) + (text.length > 100 ? '...' : '');

    return `
        <div class="saved-page-item" onclick="navigateToSlide('${category}', ${index}, '${pageType}')">
            <div class="saved-page-content">
                <div class="saved-page-header">
                    <span class="saved-page-category">${displayName || categoryTitle}</span>
                    <button class="delete-btn" 
                        onclick="event.stopPropagation(); deleteSavedPage('${category}', ${index}, '${pageType}')">
                        <img src="../../assets/icons/profile/Trash.svg" alt="Delete" class="delete-icon">
                    </button>
                </div>
                <h3 class="saved-page-title">${heading}</h3>
                <p class="saved-page-preview">${truncatedText}</p>
            </div>
        </div>
    `;
}

function navigateToSlide(category, index, pageType) {
    localStorage.setItem('selectedCategory', category);
    localStorage.setItem('selectedSlide', index);

    if (pageType === 'tutorial') {
        window.location.href = '../../views/tutorial';
    } else {
        localStorage.setItem('selectedOverviewPage', index + 1);
        window.location.href = '../../views/overview';
    }
}

async function deleteSavedPage(category, slideIndex, pageType = 'tutorial') {
    const identificationCode = localStorage.getItem('userCode');

    try {
        const response = await fetch(`/api/users/${identificationCode}/delete-slide`, {
            method: 'DELETE',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                page: category,
                slideIndex: slideIndex,
                pageType: pageType
            })
        });

        const data = await response.json();

        if (data.success) {
            showSavedPages();
        } else {
            console.error(`Failed to delete page: ${data.error}`);
        }
    } catch (error) {
        console.error('Error deleting saved page:', error);
    }
}

document.addEventListener('DOMContentLoaded', function () {
    const bookmarkBtn = document.querySelector('.bookmark-btn');
    if (bookmarkBtn) {
        bookmarkBtn.addEventListener('click', toggleBookmark);
        initializeBookmark();
    }

    const selectedPage = localStorage.getItem('selectedOverviewPage');
    if (selectedPage) {
        currentPage = parseInt(selectedPage);
        updateDots();
        updatePages();
        initializeBookmark();
        localStorage.removeItem('selectedOverviewPage');
    } else {
        if (window.location.pathname.includes('/views/overview')) {
            currentPage = 1;
            updateDots();
            updatePages();
        }
    }
});
