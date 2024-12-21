function loadScenarios() {
    const scenarioContainer = document.querySelector('.scenario-images');
    const paginationContainer = document.querySelector('.scenario-pagination');

    scenarioContainer.innerHTML = '';
    paginationContainer.innerHTML = '';

    const basePath = '/assets/pictures/scenarios/';
    const fileNames = [
        'Baustelle.jpg',
        'Blaulicht.jpg',
        'Fahrbahnverengung.jpg',
        'Fahrradfahrer.jpg',
        'Geschwindigkeitsreduktion.jpg',
        'Kreisverkehr.jpg',
        'Pannenfahrzeug.jpg',
        'Stau.jpg',
        'Verkehrszeichen.jpg',
        'Zebrastreifen.jpg',
    ];

    const scenarios = fileNames.map(fileName => ({
        img: `${basePath}${fileName}`,
        name: fileName.replace('.jpg', ''),
    }));

    for (let i = 0; i < Math.ceil(scenarios.length / 4); i++) {
        const page = document.createElement('div');
        page.className = 'scenario-page';

        for (let j = i * 4; j < Math.min((i * 4) + 4, scenarios.length); j++) {
            const scenarioItem = document.createElement('div');
            scenarioItem.className = 'scenario-item';

            const img = document.createElement('img');
            img.src = scenarios[j].img;
            img.alt = scenarios[j].name;

            const text = document.createElement('p');
            text.textContent = scenarios[j].name;

            scenarioItem.appendChild(img);
            scenarioItem.appendChild(text);
            page.appendChild(scenarioItem);
        }

        scenarioContainer.appendChild(page);

        const dot = document.createElement('div');
        dot.className = 'dot' + (i === 0 ? ' active' : '');
        paginationContainer.appendChild(dot);
    }

    scenarioContainer.addEventListener('scroll', () => {
        const index = Math.round(scenarioContainer.scrollLeft / scenarioContainer.offsetWidth);
        document.querySelectorAll('.scenario-pagination .dot').forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
    });
}