/**
 * matchVolunteers — Smart scoring algorithm
 * skill match: 50pts | availability: 30pts | proximity: 20pts
 */
export function matchVolunteers(need, volunteers) {
  return volunteers
    .map((volunteer) => {
      let score = 0;

      // Skill match — fuzzy (case-insensitive includes)
      const hasSkill = (volunteer.skills || []).some((skill) =>
        skill.toLowerCase().includes(need.need_type.toLowerCase()) ||
        need.need_type.toLowerCase().includes(skill.toLowerCase())
      );
      if (hasSkill) score += 50;

      // Availability
      if (volunteer.available === true) score += 30;

      // Proximity — same location string
      if (
        volunteer.location &&
        need.village &&
        volunteer.location.toLowerCase() === need.village.toLowerCase()
      ) score += 20;

      return { ...volunteer, matchScore: score };
    })
    .filter((v) => v.matchScore > 0)
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 3);
}

/** Convert numeric score (0–100) to a percentage string */
export function scoreToPercent(score) {
  return `${score}%`;
}
