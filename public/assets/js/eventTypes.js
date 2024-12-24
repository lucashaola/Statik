(function (root) {
    const eventTypes = {
        welcome: {
            score: 80,
            message: "Willkommen zum Bonusprogramm! <br> Sie haben Punkte für das Erstellen eines neuen Profils erhalten."
        },
        assist_engaged_10km: {
            score: 2,
            message: "Perfektes Fahren mit Assistenzfunktion: kumulierte 10km"
        },
        assist_disengaged_unsafe: {
            score: -5,
            message: "Häufig die Hände vom Lenkrad nehmen bei Fahrassistenz"
        }
    };

    // Node.js environment
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = eventTypes;
    }
    // Browser environment
    else {
        root.eventTypes = eventTypes;
    }
})(typeof self !== 'undefined' ? self : this);