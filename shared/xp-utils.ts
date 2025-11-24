// Shared XP thresholds for all 4 levels
export const XP_THRESHOLDS = [0, 200, 500, 800];

/**
 * Calculate the current level based on total XP
 * @param totalXP - The user's total XP
 * @returns The current level (1-4)
 */
export function calculateLevel(totalXP: number): number {
  if (totalXP >= 800) return 4;
  if (totalXP >= 500) return 3;
  if (totalXP >= 200) return 2;
  return 1;
}

/**
 * Get the XP required for the next level
 * @param currentLevel - The user's current level (1-4)
 * @returns The XP threshold for the next level, or the max threshold if already at max level
 */
export function getNextLevelXP(currentLevel: number): number {
  const nextLevelIndex = currentLevel; // currentLevel is 1-based, array is 0-based
  return XP_THRESHOLDS[nextLevelIndex] || XP_THRESHOLDS[XP_THRESHOLDS.length - 1];
}
