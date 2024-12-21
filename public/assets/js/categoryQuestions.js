(function(root) {
    const categoryQuestions = {
        aktivierung: [
            {
                question: "Frage 1 Aktivierung",
                options: [
                    { text: "Richtig", correct: true },
                    { text: "Falsch 1", correct: false },
                    { text: "Falsch 2", correct: false },
                    { text: "Falsch 3", correct: false }
                ]
            },
            {
                question: "Frage 2 Aktivierung",
                options: [
                    { text: "Falsch 1", correct: false },
                    { text: "Richtig", correct: true },
                    { text: "Falsch 2", correct: false },
                    { text: "Falsch 3", correct: false }
                ]
            },
            {
                question: "Frage 3 Aktivierung",
                options: [
                    { text: "Falsch 1", correct: false },
                    { text: "Falsch 2", correct: false },
                    { text: "Richtig", correct: true },
                    { text: "Falsch 3", correct: false }
                ]
            }
        ],
        verkehrszeichen: [
            {
                question: "Frage 1 Verkehrszeichenerkennung",
                options: [
                    { text: "Richtig", correct: true },
                    { text: "Falsch 1", correct: false },
                    { text: "Falsch 2", correct: false },
                    { text: "Falsch 3", correct: false }
                ]
            },
            {
                question: "Frage 2 Verkehrszeichenerkennung",
                options: [
                    { text: "Falsch 1", correct: false },
                    { text: "Richtig", correct: true },
                    { text: "Falsch 2", correct: false },
                    { text: "Falsch 3", correct: false }
                ]
            },
            {
                question: "Frage 3 Verkehrszeichenerkennung",
                options: [
                    { text: "Falsch 1", correct: false },
                    { text: "Falsch 2", correct: false },
                    { text: "Richtig", correct: true },
                    { text: "Falsch 3", correct: false }
                ]
            }
        ],
        geschwindigkeit: [
            {
                question: "Frage 1 Geschwindigkeitsassistent",
                options: [
                    { text: "Richtig", correct: true },
                    { text: "Falsch 1", correct: false },
                    { text: "Falsch 2", correct: false },
                    { text: "Falsch 3", correct: false }
                ]
            },
            {
                question: "Frage 2 Geschwindigkeitsassistent",
                options: [
                    { text: "Falsch 1", correct: false },
                    { text: "Richtig", correct: true },
                    { text: "Falsch 2", correct: false },
                    { text: "Falsch 3", correct: false }
                ]
            },
            {
                question: "Frage 3 Geschwindigkeitsassistent",
                options: [
                    { text: "Falsch 1", correct: false },
                    { text: "Falsch 2", correct: false },
                    { text: "Richtig", correct: true },
                    { text: "Falsch 3", correct: false }
                ]
            }
        ],
        stau: [
            {
                question: "Frage 1 Stauassistent",
                options: [
                    { text: "Richtig", correct: true },
                    { text: "Falsch 1", correct: false },
                    { text: "Falsch 2", correct: false },
                    { text: "Falsch 3", correct: false }
                ]
            },
            {
                question: "Frage 2 Stauassistent",
                options: [
                    { text: "Falsch 1", correct: false },
                    { text: "Richtig", correct: true },
                    { text: "Falsch 2", correct: false },
                    { text: "Falsch 3", correct: false }
                ]
            },
            {
                question: "Frage 3 Stauassistent",
                options: [
                    { text: "Falsch 1", correct: false },
                    { text: "Falsch 2", correct: false },
                    { text: "Richtig", correct: true },
                    { text: "Falsch 3", correct: false }
                ]
            }
        ],
        ampelerkennung: [
            {
                question: "Frage 1 Ampelerkennung",
                options: [
                    { text: "Richtig", correct: true },
                    { text: "Falsch 1", correct: false },
                    { text: "Falsch 2", correct: false },
                    { text: "Falsch 3", correct: false }
                ]
            },
            {
                question: "Frage 2 Ampelerkennung",
                options: [
                    { text: "Falsch 1", correct: false },
                    { text: "Richtig", correct: true },
                    { text: "Falsch 2", correct: false },
                    { text: "Falsch 3", correct: false }
                ]
            },
            {
                question: "Frage 3 Ampelerkennung",
                options: [
                    { text: "Falsch 1", correct: false },
                    { text: "Falsch 2", correct: false },
                    { text: "Richtig", correct: true },
                    { text: "Falsch 3", correct: false }
                ]
            }
        ],
        spurführung: [
            {
                question: "Frage 1 Spurführung",
                options: [
                    { text: "Richtig", correct: true },
                    { text: "Falsch 1", correct: false },
                    { text: "Falsch 2", correct: false },
                    { text: "Falsch 3", correct: false }
                ]
            },
            {
                question: "Frage 2 Spurführung",
                options: [
                    { text: "Falsch 1", correct: false },
                    { text: "Richtig", correct: true },
                    { text: "Falsch 2", correct: false },
                    { text: "Falsch 3", correct: false }
                ]
            },
            {
                question: "Frage 3 Spurführung",
                options: [
                    { text: "Falsch 1", correct: false },
                    { text: "Falsch 2", correct: false },
                    { text: "Richtig", correct: true },
                    { text: "Falsch 3", correct: false }
                ]
            }
        ],
        spurwechsel: [
            {
                question: "Frage 1 Spurwechselassistent",
                options: [
                    { text: "Richtig", correct: true },
                    { text: "Falsch 1", correct: false },
                    { text: "Falsch 2", correct: false },
                    { text: "Falsch 3", correct: false }
                ]
            },
            {
                question: "Frage 2 Spurwechselassistent",
                options: [
                    { text: "Falsch 1", correct: false },
                    { text: "Richtig", correct: true },
                    { text: "Falsch 2", correct: false },
                    { text: "Falsch 3", correct: false }
                ]
            },
            {
                question: "Frage 3 Spurwechselassistent",
                options: [
                    { text: "Falsch 1", correct: false },
                    { text: "Falsch 2", correct: false },
                    { text: "Richtig", correct: true },
                    { text: "Falsch 3", correct: false }
                ]
            }
        ],
        notbrems: [
            {
                question: "Frage 1 Notbremsassistent",
                options: [
                    { text: "Richtig", correct: true },
                    { text: "Falsch 1", correct: false },
                    { text: "Falsch 2", correct: false },
                    { text: "Falsch 3", correct: false }
                ]
            },
            {
                question: "Frage 2 Notbremsassistent",
                options: [
                    { text: "Falsch 1", correct: false },
                    { text: "Richtig", correct: true },
                    { text: "Falsch 2", correct: false },
                    { text: "Falsch 3", correct: false }
                ]
            },
            {
                question: "Frage 3 Notbremsassistent",
                options: [
                    { text: "Falsch 1", correct: false },
                    { text: "Falsch 2", correct: false },
                    { text: "Richtig", correct: true },
                    { text: "Falsch 3", correct: false }
                ]
            }
        ],
        deaktivierung: [
            {
                question: "Frage 1 Deaktivierung",
                options: [
                    { text: "Richtig", correct: true },
                    { text: "Falsch 1", correct: false },
                    { text: "Falsch 2", correct: false },
                    { text: "Falsch 3", correct: false }
                ]
            },
            {
                question: "Frage 2 Deaktivierung",
                options: [
                    { text: "Falsch 1", correct: false },
                    { text: "Richtig", correct: true },
                    { text: "Falsch 2", correct: false },
                    { text: "Falsch 3", correct: false }
                ]
            },
            {
                question: "Frage 3 Deaktivierung",
                options: [
                    { text: "Falsch 1", correct: false },
                    { text: "Falsch 2", correct: false },
                    { text: "Richtig", correct: true },
                    { text: "Falsch 3", correct: false }
                ]
            }
        ],
        risiken: [
            {
                question: "Frage 1 Risiken",
                options: [
                    { text: "Richtig", correct: true },
                    { text: "Falsch 1", correct: false },
                    { text: "Falsch 2", correct: false },
                    { text: "Falsch 3", correct: false }
                ]
            },
            {
                question: "Frage 2 Risiken",
                options: [
                    { text: "Falsch 1", correct: false },
                    { text: "Richtig", correct: true },
                    { text: "Falsch 2", correct: false },
                    { text: "Falsch 3", correct: false }
                ]
            },
            {
                question: "Frage 3 Risiken",
                options: [
                    { text: "Falsch 1", correct: false },
                    { text: "Falsch 2", correct: false },
                    { text: "Richtig", correct: true },
                    { text: "Falsch 3", correct: false }
                ]
            }
        ]
    };

    // Node.js environment
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = categoryQuestions;
    } 
    // Browser environment
    else {
        root.categoryQuestions = categoryQuestions;
    }
})(typeof self !== 'undefined' ? self : this);