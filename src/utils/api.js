export async function fetchAnalysisFromAPI(dilemma, userProfile = null) {
    try {
        const response = await fetch('http://localhost:3001/analyze', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ dilemma, userProfile })
        });

        if (!response.ok) {
            throw new Error('API request failed');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Frontend API fetch error:', error);
        throw error;
    }
}

export async function fetchPreMortemFromAPI(dilemma, recommendation, userProfile = null, selectedRisks) {
    try {
        const response = await fetch('http://localhost:3001/pre-mortem', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ dilemma, recommendation, userProfile, selectedRisks })
        });

        if (!response.ok) {
            throw new Error('Pre-Mortem API request failed');
        }

        return await response.json();
    } catch (error) {
        console.error('Frontend API fetch error:', error);
        throw error;
    }
}
