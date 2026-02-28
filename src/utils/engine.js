export function detectDecisionType(input) {
    const keywords = ['career', 'learn', 'skill', 'job', 'engineer', 'develop', 'tech', 'code', 'program', 'stack', 'frontend', 'backend', 'fullstack', 'data', 'ai'];
    const lowerInput = input.toLowerCase();
    return keywords.some(kw => lowerInput.includes(kw));
}

export function applyWeights(scoresA, scoresB, optionA, optionB, answers) {
    let modA = { ...scoresA };
    let modB = { ...scoresB };

    const aLower = optionA.toLowerCase();
    const bLower = optionB.toLowerCase();

    const applyToMatch = (regex, category, adjustment) => {
        if (regex.test(aLower)) modA[category] = Math.max(0, Math.min(100, modA[category] + adjustment));
        if (regex.test(bLower)) modB[category] = Math.max(0, Math.min(100, modB[category] + adjustment));
    };

    if (answers) {
        // 1. Skill Level
        if (answers.skillLevel === 'Beginner') {
            modA['Difficulty'] += 10;
            modB['Difficulty'] += 10;
            modA['Time to Competence'] += 15;
            modB['Time to Competence'] += 15;
        } else if (answers.skillLevel === 'Advanced') {
            modA['Difficulty'] -= 10;
            modB['Difficulty'] -= 10;
            modA['Time to Competence'] -= 15;
            modB['Time to Competence'] -= 15;
        }

        // 2. DSA Strength
        if (answers.dsaStrength < 4) {
            applyToMatch(/back[\s-]?end|software|engineer/i, 'Difficulty', 15);
            applyToMatch(/back[\s-]?end|software|engineer/i, 'Long-Term Growth', -10);
            applyToMatch(/ai|data/i, 'Difficulty', -5); // AI gets slight relative boost by reducing difficulty
        } else if (answers.dsaStrength > 7) {
            applyToMatch(/back[\s-]?end|software|engineer/i, 'Income Potential', 10);
            applyToMatch(/back[\s-]?end|software|engineer/i, 'Difficulty', -10);
        }

        // 3. Math Comfort
        if (answers.mathComfort > 7) {
            applyToMatch(/ai|data|machine|quant/i, 'Long-Term Growth', 15);
            applyToMatch(/ai|data|machine|quant/i, 'Income Potential', 10);
            applyToMatch(/ai|data|machine|quant/i, 'Difficulty', -15);
        } else if (answers.mathComfort < 4) {
            applyToMatch(/ai|data|machine|quant/i, 'Difficulty', 20);
            applyToMatch(/ai|data|machine|quant/i, 'Time to Competence', 15);
        }

        // 4. Financial Pressure
        if (answers.financialPressure === 'High') {
            modA['Time to Competence'] += 10;
            modB['Time to Competence'] += 10;
            modA['Risk Level'] += 15;
            modB['Risk Level'] += 15;
        } else if (answers.financialPressure === 'Low') {
            modA['Risk Level'] -= 10;
            modB['Risk Level'] -= 10;
        }

        // 5. Work Style
        if (answers.workStyle === 'Research') {
            applyToMatch(/ai|data|machine|research/i, 'Long-Term Growth', 15);
            applyToMatch(/product|front/i, 'Long-Term Growth', -10);
        } else if (answers.workStyle === 'Infrastructure') {
            applyToMatch(/back[\s-]?end|cloud|infra|devops/i, 'Long-Term Growth', 15);
            applyToMatch(/front|ui|ux/i, 'Long-Term Growth', -10);
        } else if (answers.workStyle === 'Security') {
            applyToMatch(/cyber|security|hack/i, 'Long-Term Growth', 15);
        } else if (answers.workStyle === 'Product Development') {
            applyToMatch(/front|ui|ux|full|product/i, 'Long-Term Growth', 15);
        }
    }

    return { modA, modB };
}

export function generatePersonalizedInsights(answers, recommendation) {
    const insights = [];
    if (!answers) return insights;

    const recLower = recommendation.toLowerCase();

    // Math logic
    if (answers.mathComfort > 7 && /ai|data|machine/.test(recLower)) {
        insights.push("Your high math comfort significantly increases your long-term advantage in this path.");
    } else if (answers.mathComfort <= 4 && /ai|data|machine/.test(recLower)) {
        insights.push("Although math-heavy, your other strengths edge this option forward slightly.");
    }

    // Finance logic
    if (answers.financialPressure === 'High') {
        insights.push("High financial pressure influenced a lower risk tolerance, preferring faster competence paths.");
    } else if (answers.financialPressure === 'Low') {
        insights.push("Low financial pressure allowed long-term growth and higher-risk options to score better.");
    }

    // DSA logic
    if (answers.dsaStrength < 4 && /back|software|engineer/.test(recLower)) {
        insights.push("Your current DSA level increases the difficulty curve, but the recommendation holds based on overall traits.");
    }

    // Skill Level logic
    if (answers.skillLevel === 'Intermediate') {
        insights.push("Your intermediate baseline provides sufficient adaptability for this transition.");
    } else if (answers.skillLevel === 'Beginner') {
        insights.push("As a beginner, expect a steep learning curve; we weighted 'Time to Competence' heavily.");
    } else if (answers.skillLevel === 'Advanced') {
        insights.push("Since you are advanced, difficulty penalties were significantly reduced across the board.");
    }

    // Work Style logic
    if (answers.workStyle === 'Product Development' && /front|product|web|full/.test(recLower)) {
        insights.push("This path perfectly aligns with your preference for product development and visible user impact.");
    } else if (answers.workStyle === 'Infrastructure' && /back|cloud|infra/.test(recLower)) {
        insights.push("Matches your indicated preference for robust foundational architecture and infrastructure.");
    } else if (answers.workStyle === 'Research' && /ai|data|research/.test(recLower)) {
        insights.push("Strong alignment detected with your preference for research and deep technical exploration.");
    }

    // Fallback defaults if no conditionals hit perfectly
    if (insights.length < 2) {
        insights.push("The structural profile of this option cleanly matches your risk tolerance baseline.");
        if (insights.length < 2) {
            insights.push("Projected long-term growth outweighed immediate competence hurdles.");
        }
    }

    return insights;
}

export function getContextualBiases(clarityScore, answers, defaultBiases) {
    if (!answers) return defaultBiases;

    const biases = [];

    if (clarityScore < 10) {
        biases.push("Analysis Paralysis");
    } else if (clarityScore > 25) {
        biases.push("Overconfidence Bias");
    } else {
        biases.push("Status Quo Bias");
    }

    if (answers.financialPressure === 'High') {
        biases.push("Fear-Based Avoidance");
    } else if (answers.financialPressure === 'Low' && clarityScore > 15) {
        biases.push("Shiny Object Syndrome");
    } else if (answers.skillLevel === 'Beginner') {
        biases.push("Dunning-Kruger Effect (Early Peak)");
    }

    // Deduplicate and return max 2
    return Array.from(new Set(biases)).slice(0, 2);
}
