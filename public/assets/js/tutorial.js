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
let sidebarPS, mainPS;

function showContent(contentId) {
    // Handle sidebar selection
    const previousSelected = document.querySelector('.sidebar-item.selected');
    if (previousSelected) {
        previousSelected.classList.remove('selected');
    }

    const selectedItem = document.querySelector(`.sidebar-item[onclick="showContent('${contentId}')"]`);
    if (selectedItem) {
        selectedItem.classList.add('selected');

        // Handle sidebar scroll position
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

    // Show selected content
    const contents = document.querySelectorAll('.content');
    contents.forEach(content => content.classList.remove('active'));

    const targetContent = document.getElementById(contentId);
    if (targetContent) {
        targetContent.classList.add('active');

        // Reset scroll position of main content
        const mainContent = document.querySelector('.main-content');
        if (mainContent) {
            mainContent.scrollTop = 0; // This will reset the scroll position

            // If you're using PerfectScrollbar, also update it
            if (mainContent._ps) {
                mainContent._ps.scrollTop = 0;
                mainContent._ps.update();
            }
        }
        unlockCategory(contentId);
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

    let searchResults = [];

    Object.entries(tutorialContent).forEach(([contentId, content]) => {
        content.content.forEach((slide, index) => {
            const text = slide.text || '';
            const subtext = slide.subtext || '';

            if (text.toLowerCase().includes(searchTerm) ||
                subtext.toLowerCase().includes(searchTerm) ||
                content.title.toLowerCase().includes(searchTerm)) {
                searchResults.push({
                    title: content.title,
                    text: text,
                    subtext: subtext,
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
            `showSearchResult('${result.contentId}')` :
            `localStorage.setItem('selectedCategory', '${result.contentId}'); 
                 localStorage.setItem('selectedSlide', '${result.slideIndex}'); 
                 window.location.href='/views/tutorial'`}">
                <strong>${tutorialContent[result.contentId].title}</strong><br>
                <small>${result.text ? result.text.substring(0, 100) + '...' : ''}</small>
                ${result.subtext ? `<br><small>${result.subtext}</small>` : ''}
            </div>
        `).join('');
    } else {
        resultsDiv.style.display = 'block';
        resultsDiv.innerHTML = '<div class="result-item">Keine Ergebnisse gefunden</div>';
    }
}

function showSearchResult(contentId) {
    showContent(contentId);
    unlockCategory(contentId);

    // Clean up search
    const resultsDiv = document.getElementById('results');
    const searchTerm = document.querySelector('.search').value.toLowerCase();
    resultsDiv.style.display = 'none';
    document.querySelector('.search').value = '';

    // Scroll sidebar to selected item
    const sidebarContent = document.querySelector('.sidebar-content');
    const selectedItem = document.querySelector(`.sidebar-item[onclick="showContent('${contentId}')"]`);

    if (sidebarContent && selectedItem) {
        sidebarContent.scrollTop = selectedItem.offsetTop - 100;
    }

    initializeBookmark();
}

document.addEventListener('DOMContentLoaded', function () {
    // Generate content for each section
    const mainContent = document.querySelector('.main-content');
    Object.keys(tutorialContent).forEach(sectionId => {
        const contentDiv = document.createElement('div');
        contentDiv.className = 'content';
        contentDiv.id = sectionId;
        contentDiv.innerHTML = renderContent(sectionId);
        mainContent.appendChild(contentDiv);
    });

    const searchInput = document.querySelector('.search');
    if (searchInput) searchInput.value = '';

    // Initialize PerfectScrollbar
    const sidebarContent = document.querySelector('.sidebar-content');
    if (sidebarContent) {
        sidebarPS = new PerfectScrollbar(sidebarContent, {
            wheelSpeed: 1,
            wheelPropagation: true,
            suppressScrollX: true,
            minScrollbarLength: 40,
            scrollbarYMargin: 0,
            railYVisible: true
        });

        closeResultsOnOutsideClick();
        showContent('aktivierung'); // Preselect Aktivierung on page load
    }

    if (mainContent) {
        mainPS = new PerfectScrollbar(mainContent, {
            wheelSpeed: 1,
            suppressScrollX: true,
            wheelPropagation: false,
            swipeEasing: true,
        });
    }

    // Handle selected category from localStorage
    const selectedCategory = localStorage.getItem('selectedCategory');
    if (selectedCategory) {
        showContent(selectedCategory);
        localStorage.removeItem('selectedCategory');
    }
});