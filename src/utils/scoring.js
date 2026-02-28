import { applyWeights, generatePersonalizedInsights, getContextualBiases } from './engine';

export const CRITERIA = [
  "Time to Competence",
  "Income Potential",
  "Difficulty",
  "Risk Level",
  "Long-Term Growth"
];

const BIASES = [
  "Analysis Paralysis",
  "Shiny Object Syndrome",
  "Fear-Based Avoidance",
  "Comfort Zone Bias",
  "Sunk Cost Fallacy",
  "Status Quo Bias",
  "Confirmation Bias"
];

// Simple deterministic string hash for pseudo-randomness
function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

// Generate deterministic score based on category and option name
function generateScore(optionName, categoryName) {
  const seedStr = `${optionName.toLowerCase().trim()}-${categoryName}`;
  const hash = hashString(seedStr);
  // We want scores mostly between 40 and 95 to look realistic
  return 40 + (hash % 56);
}

export function parseOptions(input) {
  let separator = " vs ";
  if (!input.toLowerCase().includes(separator)) {
    separator = " vs. ";
  }
  if (!input.toLowerCase().includes(separator)) {
    separator = " or ";
  }

  const parts = input.split(new RegExp(separator, 'i'));

  if (parts.length < 2) {
    return null; // Not enough options parsed
  }

  return {
    optionA: parts[0].trim(),
    optionB: parts[1].trim()
  };
}

export function analyzeDecision(optionA, optionB, answers = null) {
  const baseScoresA = {};
  const baseScoresB = {};

  CRITERIA.forEach(criterion => {
    baseScoresA[criterion] = generateScore(optionA, criterion);
    baseScoresB[criterion] = generateScore(optionB, criterion);
  });

  let finalScoresA = { ...baseScoresA };
  let finalScoresB = { ...baseScoresB };

  if (answers) {
    const { modA, modB } = applyWeights(baseScoresA, baseScoresB, optionA, optionB, answers);
    finalScoresA = modA;
    finalScoresB = modB;
  }

  let totalA = 0;
  let totalB = 0;

  CRITERIA.forEach(criterion => {
    totalA += finalScoresA[criterion];
    totalB += finalScoresB[criterion];
  });

  const maxPossible = CRITERIA.length * 100;
  const normalizedTotalA = Math.round((totalA / maxPossible) * 100);
  const normalizedTotalB = Math.round((totalB / maxPossible) * 100);

  const clarityScore = Math.abs(normalizedTotalA - normalizedTotalB);

  let recommendation = "";
  let riskLevel = "Medium";
  let winner = "";

  if (normalizedTotalA > normalizedTotalB) {
    recommendation = optionA;
    winner = "A";
  } else if (normalizedTotalB > normalizedTotalA) {
    recommendation = optionB;
    winner = "B";
  } else {
    recommendation = "It's a tie. Flip a coin.";
    winner = "Tie";
  }

  // Determine risk level based on the average "Risk Level" score of the winner
  const winnerRiskScore = winner === "A" ? finalScoresA["Risk Level"] : (winner === "B" ? finalScoresB["Risk Level"] : 50);
  if (winnerRiskScore > 75) riskLevel = "High";
  else if (winnerRiskScore < 45) riskLevel = "Low";

  // Pick default random biases based on the combined string hash
  const combinedHash = hashString(optionA + optionB);
  const defaultBiases = [];
  const biasCopy = [...BIASES];
  for (let i = 0; i < 2; i++) {
    const index = (combinedHash + i) % biasCopy.length;
    defaultBiases.push(biasCopy.splice(index, 1)[0]);
  }

  const selectedBiases = getContextualBiases(clarityScore, answers, defaultBiases);
  const insights = generatePersonalizedInsights(answers, recommendation);

  // Generate radar chart data
  const radarData = CRITERIA.map(criterion => ({
    subject: criterion,
    A: finalScoresA[criterion],
    B: finalScoresB[criterion],
    fullMark: 100,
  }));

  return {
    scoresA: finalScoresA,
    scoresB: finalScoresB,
    totalA: normalizedTotalA,
    totalB: normalizedTotalB,
    clarityScore,
    recommendation,
    riskLevel,
    winner,
    biases: selectedBiases,
    insights,
    radarData
  };
}

export function generateActionPlan(recommendation) {
  // A generic but professional 7-day structure
  return [
    { day: 1, title: "Define Specific Scope", desc: `Clarify your exact goals within ${recommendation}.` },
    { day: 2, title: "Resource Gathering", desc: "Collect the tools, courses, or materials needed." },
    { day: 3, title: "Foundation Building", desc: "Dedicate 2 hours to initial conceptual setup." },
    { day: 4, title: "First Iteration", desc: "Build a minimal prototype or complete the first module." },
    { day: 5, title: "Review & Adjust", desc: "Evaluate your progress and refine your approach." },
    { day: 6, title: "Deep Work", desc: "Execute a focused 4-hour sprint on the hardest part." },
    { day: 7, title: "Commitment Check", desc: "Reflect on the past week. Commit to a 30-day timeline." }
  ];
}

export function generateFallbackPreMortem(selectedRisks) {
  const strategyMap = {
    "Distraction / Lack of Focus": "Implement extreme time-blocking. Isolate 120-minute daily deep work windows without network connectivity.",
    "Financial Stress": "Cap out-of-pocket experimentation budget. Set explicit revenue-validation milestones before sinking further capital.",
    "Skill Gap": "Shift from passive consumption to aggressive output. Build one ugly prototype weekly to force learning through friction.",
    "Burnout": "Enforce a strict 5 PM hard-stop on decision-related output. Substitute weekend hustle with mandatory cognitive rest.",
    "Lack of Mentorship": "Stop waiting for external validation. Rely on established open-source roadmaps or publicly validated frameworks.",
    "Overconfidence": "Assume your initial estimates are wrong by a factor of 3. Force peer-review on your first major deliverable.",
    "Inconsistent Execution": "Automate accountability through public commitment or financial penalties for missed weekly sprint goals.",
    "Fear of Failure": "Rename 'failure' to 'data acquisition'. Limit initial exposure to low-stakes sandbox environments."
  };

  return {
    identifiedRisks: selectedRisks,
    preventiveStrategies: selectedRisks.map(risk => ({
      risk,
      strategy: strategyMap[risk] || "Implement strict systematic tracking of inputs vs. outputs."
    })),
    weeklySafeguards: [
      "Sunday Review: Log exact hours spent specifically on the recommended path.",
      "Wednesday Calibration: Rate friction and frustration levels (1-10) to catch early burnout.",
      "Friday Audit: Measure actual output against projected estimates."
    ],
    accountabilityMechanism: "Set a calendar alert 30 days from now requesting a binary response: 'Did you execute 80% of your plan?' If No, pivot."
  };
}
