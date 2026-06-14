// Pure math calculations — no AI calls inside these functions

const calculateReadinessScore = ({ skills }) => {
  if (!skills || skills.length === 0) return 0;
  const total = skills.reduce((sum, s) => sum + (s.value || 0), 0);
  return Math.round(total / skills.length);
};

const rankCareerMatches = ({ skills, roles }) => {
  if (!skills || !roles) return [];

  const skillMap = {};
  skills.forEach((s) => {
    skillMap[s.name.toLowerCase()] = s.value;
  });

  const matches = roles.map((role) => {
    const required = role.requiredSkills || [];
    if (required.length === 0) return { title: role.title, matchPercentage: 0 };

    let totalScore = 0;
    let maxScore = required.length * 100;

    required.forEach((skill) => {
      const key = skill.toLowerCase();
      // Fuzzy match: check if any user skill name contains the required skill
      const matchedValue = Object.keys(skillMap).find(
        (k) => k.includes(key) || key.includes(k)
      );
      totalScore += matchedValue ? skillMap[matchedValue] : 20; // 20 base if not explicitly listed
    });

    return {
      title: role.title,
      matchPercentage: Math.min(100, Math.round((totalScore / maxScore) * 100)),
      requiredSkills: role.requiredSkills,
    };
  });

  return matches.sort((a, b) => b.matchPercentage - a.matchPercentage);
};

const calculateScoreTrend = ({ sessions }) => {
  if (!sessions || sessions.length < 2) {
    return { trend: "stable", trendPercent: 0 };
  }

  // Group by week
  const sorted = [...sessions].sort((a, b) => new Date(a.date) - new Date(b.date));
  const firstHalf = sorted.slice(0, Math.floor(sorted.length / 2));
  const secondHalf = sorted.slice(Math.floor(sorted.length / 2));

  const firstAvg = firstHalf.reduce((s, sess) => s + (sess.score || 0), 0) / firstHalf.length;
  const secondAvg = secondHalf.reduce((s, sess) => s + (sess.score || 0), 0) / secondHalf.length;

  const diff = secondAvg - firstAvg;
  const trendPercent = Math.abs(Math.round(diff));

  return {
    trend: diff > 2 ? "improving" : diff < -2 ? "declining" : "stable",
    trendPercent,
    firstAvg: Math.round(firstAvg),
    secondAvg: Math.round(secondAvg),
  };
};

const identifyWeakCategories = ({ sessions }) => {
  if (!sessions || sessions.length === 0) return [];

  const categoryMap = {};
  sessions.forEach((sess) => {
    if (!categoryMap[sess.type]) categoryMap[sess.type] = { total: 0, count: 0 };
    categoryMap[sess.type].total += sess.score || 0;
    categoryMap[sess.type].count += 1;
  });

  const categories = Object.entries(categoryMap).map(([type, data]) => ({
    type,
    avgScore: Math.round(data.total / data.count),
  }));

  categories.sort((a, b) => a.avgScore - b.avgScore);

  return {
    weak: categories.filter((c) => c.avgScore < 70).map((c) => c.type),
    strong: categories.filter((c) => c.avgScore >= 70).map((c) => c.type),
    breakdown: categories,
  };
};

const buildWeeklyVelocity = ({ sessions }) => {
  if (!sessions || sessions.length === 0) return [];

  // Group sessions by ISO week
  const weekMap = {};
  sessions.forEach((sess) => {
    const date = new Date(sess.date);
    const weekStart = new Date(date);
    weekStart.setDate(date.getDate() - date.getDay());
    const weekKey = weekStart.toISOString().split("T")[0];

    if (!weekMap[weekKey]) weekMap[weekKey] = { sessions: [], scores: [] };
    weekMap[weekKey].sessions.push(sess);
    if (sess.score) weekMap[weekKey].scores.push(sess.score);
  });

  return Object.entries(weekMap)
    .sort(([a], [b]) => new Date(a) - new Date(b))
    .map(([weekKey, data], idx) => ({
      week: `Week ${idx + 1}`,
      weekDate: weekKey,
      sessions: data.sessions.length,
      avgScore: data.scores.length
        ? Math.round(data.scores.reduce((s, v) => s + v, 0) / data.scores.length)
        : 0,
      hoursEquivalent: Math.round(data.sessions.length * 1.5 * 10) / 10,
    }));
};

module.exports = {
  calculateReadinessScore,
  rankCareerMatches,
  calculateScoreTrend,
  identifyWeakCategories,
  buildWeeklyVelocity,
};
