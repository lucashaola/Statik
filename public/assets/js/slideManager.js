const slideIndex = {
    'aktivierung': 0,
    'verkehrszeichen': 0,
    'geschwindigkeit': 0,
    'stau': 0,
    'ampelerkennung': 0,
    'spurführung': 0,
    'spurwechsel': 0,
    'notbrems': 0,
    'deaktivierung': 0,
    'risiken': 0
};

function changeSlide(sectionId, direction) {
    const slides = document.querySelectorAll(`#${sectionId} .slide`);
    const totalSlides = slides.length;

    let currentIndex = 0;
    slides.forEach((slide, index) => {
        if (slide.style.display === 'block') {
            currentIndex = index;
        }
    });

    let newIndex;
    if (direction === 1 || direction === -1) {
        newIndex = currentIndex + direction;
        if (newIndex >= totalSlides) newIndex = 0;
        if (newIndex < 0) newIndex = totalSlides - 1;
    } else {
        newIndex = parseInt(direction);
    }

    slideIndex[sectionId] = newIndex;

    slides.forEach(slide => {
        slide.style.display = 'none';
    });

    if (slides[newIndex]) {
        slides[newIndex].style.display = 'block';

        progressTracker.markSlideAsViewed(sectionId, newIndex);
        const progress = progressTracker.calculateProgress(sectionId, totalSlides);
        progressTracker.updateProgress(sectionId, progress);
    }

    const indicators = document.querySelectorAll(`#${sectionId} .pagination .page-indicator`);
    indicators.forEach((indicator, index) => {
        indicator.classList.toggle('active', index === newIndex);
    });

    initializeBookmark();
}

function showContent(contentId, selectFirstSlide = true) {
    const previousSelected = document.querySelector('.sidebar-item.selected');
    if (previousSelected) {
        previousSelected.classList.remove('selected');
    }

    const selectedItem = document.querySelector(`.sidebar-item[onclick="showContent('${contentId}')"]`);
    if (selectedItem) {
        selectedItem.classList.add('selected');

        const sidebarContent = document.querySelector('.sidebar-content');
        const ps = sidebarContent._ps;  // get PerfectScrollbar instance
        if (ps) {
            const itemTop = selectedItem.offsetTop;
            const containerTop = sidebarContent.scrollTop;
            const containerHeight = sidebarContent.clientHeight;

            if (itemTop < containerTop || itemTop > containerTop + containerHeight) {
                ps.scrollTop = itemTop - (containerHeight / 2);
            }
        }
    }

    const contents = document.querySelectorAll('.content');
    contents.forEach(content => content.classList.remove('active'));

    const targetContent = document.getElementById(contentId);
    if (targetContent) {
        targetContent.classList.add('active');

        if (selectFirstSlide) {
            const slides = targetContent.querySelectorAll('.slide');
            if (slides.length > 0) {
                progressTracker.markSlideAsViewed(contentId, 0);
                const progress = progressTracker.calculateProgress(contentId, slides.length);
                progressTracker.updateProgress(contentId, progress);
            }
        }
    }
    initializeBookmark();
}

function filterResults() {
    const searchInput = document.querySelector('.search');
    const resultsDiv = document.getElementById('results');
    if (!searchInput || !resultsDiv) return;

    const searchTerm = searchInput.value.toLowerCase().trim();

    if (searchTerm.length < 2) {
        resultsDiv.style.display = 'none';
        return;
    }

    const tutorialContent = JSON.parse(localStorage.getItem('tutorialContent') || '{}');
    let searchResults = [];

    Object.entries(tutorialContent).forEach(([contentId, content]) => {
        content.slides.forEach((slide, index) => {
            const title = slide.title || '';
            const paragraph = slide.text || '';

            if (title.toLowerCase().includes(searchTerm) ||
                paragraph.toLowerCase().includes(searchTerm)) {
                searchResults.push({
                    title: title,
                    text: paragraph,
                    contentId: contentId,
                    slideIndex: index
                });
            }
        });
    });

    if (searchResults.length > 0) {
        resultsDiv.style.display = 'block';
        resultsDiv.innerHTML = searchResults.map(result => `
        <div class="result-item" onclick="${window.location.pathname.includes('tutorial') ?
            `showSearchResult('${result.contentId}', ${result.slideIndex})` :
            `localStorage.setItem('selectedCategory', '${result.contentId}'); 
             localStorage.setItem('selectedSlide', '${result.slideIndex}'); 
             window.location.href='/views/tutorial'`}">
            <strong>${tutorialContent[result.contentId].sidebarTitle}</strong><br>
            <small>${result.text ? result.text.substring(0, 100) + '...' : ''}</small>
        </div>
    `).join('');
    } else {
        resultsDiv.style.display = 'block';
        resultsDiv.innerHTML = '<div class="result-item">Keine Ergebnisse gefunden</div>';
    }
}
function showSearchResult(contentId, slideIndex) {
    const contents = document.querySelectorAll('.main-content .content');
    contents.forEach(content => {
        content.classList.remove('active');
    });

    const selectedContent = document.getElementById(contentId);
    if (selectedContent) {
        selectedContent.classList.add('active');

        const slides = selectedContent.querySelectorAll('.slide');
        slides.forEach(slide => {
            slide.style.display = 'none';
        });

        const selectedSlide = slides[slideIndex];
        if (selectedSlide) {
            selectedSlide.style.display = 'block';
        }

        // Mark slide as viewed and update progress
        progressTracker.markSlideAsViewed(contentId, slideIndex);
        const progress = progressTracker.calculateProgress(contentId, slides.length);
        progressTracker.updateProgress(contentId, progress);
        initializeBookmark();
    }

    const indicators = selectedContent.querySelectorAll('.pagination .page-indicator');
    indicators.forEach((indicator, index) => {
        indicator.classList.toggle('active', index === parseInt(slideIndex));
    });

    const sidebarItems = document.querySelectorAll('.sidebar-item');
    sidebarItems.forEach(item => {
        item.classList.remove('selected');
    });

    const matchingSidebarItem = document.querySelector(`.sidebar-item[onclick="showContent('${contentId}')"]`);
    if (matchingSidebarItem) {
        matchingSidebarItem.classList.add('selected');

        const sidebarContent = document.querySelector('.sidebar-content');
        matchingSidebarItem.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest'
        });
    }

    const resultsDiv = document.getElementById('results');
    resultsDiv.style.display = 'none';
    document.querySelector('.search').value = '';
}

window.onload = function() {
    if (window.location.pathname.includes('tutorial')) {
        const tutorialContent = {};
        document.querySelectorAll('.content').forEach(content => {
            const id = content.id;
            const sidebarTitle = document.querySelector(`.sidebar-item[onclick="showContent('${id}')"]`)?.textContent.trim();
            tutorialContent[id] = {
                sidebarTitle: sidebarTitle,
                slides: Array.from(content.querySelectorAll('.slide')).map((slide, index) => ({
                    title: slide.querySelector('h2')?.textContent || '',
                    text: slide.querySelector('p')?.textContent || '',
                    index: index
                }))
            };
        });
        localStorage.setItem('tutorialContent', JSON.stringify(tutorialContent));
    }

    if (window.location.hash) {
        const [contentId, slideIndex] = window.location.hash.slice(1).split('-');
        showSearchResult(contentId, parseInt(slideIndex));
    }
}

document.addEventListener('DOMContentLoaded', function () {
    const searchInput = document.querySelector('.search');
    if (searchInput) searchInput.value = '';

    const sidebarContent = document.querySelector('.sidebar-content');
    if (sidebarContent) {
        new PerfectScrollbar(sidebarContent, {
            wheelSpeed: 1,
            wheelPropagation: true,
            suppressScrollX: true,
            minScrollbarLength: 40,
            scrollbarYMargin: 0,
            railYVisible: true
        });

        Object.keys(slideIndex).forEach(sectionId => {
            const slides = document.querySelectorAll(`#${sectionId} .slide`);
            if (slides.length > 0) slides[0].style.display = 'block';
        });

       closeResultsOnOutsideClick();

        // Preselect Aktivierung on page load
        showContent('aktivierung');
    }


    const selectedCategory = localStorage.getItem('selectedCategory');
    const selectedSlide = localStorage.getItem('selectedSlide');

    if (selectedCategory) {
        showContent(selectedCategory);
        if (selectedSlide !== null) {
            changeSlide(selectedCategory, parseInt(selectedSlide));
            localStorage.removeItem('selectedSlide');
        }
        localStorage.removeItem('selectedCategory');
    }
});

function closeResultsOnOutsideClick(){
    const searchContainer = document.querySelector('.search-container');
    if (searchContainer) {
        const results = document.querySelector('.results');
        if (results) {
            results.addEventListener('click', function (event) {
                event.stopPropagation();
            });
        }

        document.addEventListener('click', function (event) {
            if (searchContainer && !searchContainer.contains(event.target)) {
                const results = document.getElementById('results');
                if (results) {
                    results.style.display = 'none';
                }
            }
        });
    }
}