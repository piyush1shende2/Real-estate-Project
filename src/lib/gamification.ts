// Gamification System for Urban Nest Realty
// Coordinates point systems, level calculators, custom achievement unlock tracking,
// weekly challenges, daily streaks, wheel spins, and the competitive leaderboard.

export interface GamificationState {
  xp: number;
  viewedPropertiesCount: number;
  calculatorUsageCount: number;
  chatbotUsageCount: number;
  siteVisitsCount: number;
  referralsCount: number;
  hasSpinned: boolean;
  spinReward: string | null;
  lastLoginDate: string | null; // For streak tracking
  streakDays: number;
  lastClaimedXPDate: string | null; // To avoid infinite daily XP claims
  completedProfile: boolean;
  registered: boolean;
  badges: string[]; // List of badge IDs
  weeklyTargetCount: number; // For property discovery challenge: weekly explore 10 properties
  weeklyRewardClaimed: boolean;
}

export interface LevelThreshold {
  name: string;
  minXP: number;
  maxXP: number;
  badgeSymbol: string;
}

export const LEVEL_THRESHOLDS: LevelThreshold[] = [
  { name: 'Explorer', minXP: 0, maxXP: 499, badgeSymbol: '🌍' },
  { name: 'Property Hunter', minXP: 500, maxXP: 1499, badgeSymbol: '🔍' },
  { name: 'Investor', minXP: 1500, maxXP: 2999, badgeSymbol: '🏆' },
  { name: 'Expert Buyer', minXP: 3000, maxXP: 4999, badgeSymbol: '💼' },
  { name: 'Realty Master', minXP: 5000, maxXP: 999999, badgeSymbol: '👑' },
];

export interface AchievementBadge {
  id: string;
  title: string;
  description: string;
  metricLabel: string;
  currentValue: (state: GamificationState) => number;
  targetValue: number;
  icon: string;
  xpReward: number;
  colorClass: string;
}

export const ACHIEVEMENT_BADGES: AchievementBadge[] = [
  {
    id: 'first_search',
    title: 'First Search',
    description: 'Explore your first premium Nagpur property listing.',
    metricLabel: 'listings viewed',
    currentValue: (s) => s.viewedPropertiesCount,
    targetValue: 1,
    icon: '🔍',
    xpReward: 50,
    colorClass: 'from-emerald-400 to-teal-500',
  },
  {
    id: 'first_calc',
    title: 'First Calculator Use',
    description: 'Estimate your home mortgage, EMI or budget for the first time.',
    metricLabel: 'calculations run',
    currentValue: (s) => s.calculatorUsageCount,
    targetValue: 1,
    icon: '🧮',
    xpReward: 50,
    colorClass: 'from-amber-400 to-yellow-500',
  },
  {
    id: 'prop_explorer',
    title: 'Property Explorer',
    description: 'Explore at least 20 different property listings.',
    metricLabel: 'listings viewed',
    currentValue: (s) => s.viewedPropertiesCount,
    targetValue: 20,
    icon: '🧭',
    xpReward: 150,
    colorClass: 'from-cyan-400 to-blue-500',
  },
  {
    id: 'market_analyst',
    title: 'Market Analyst',
    description: 'Use the calculator 10 times to estimate EMI, budget or ROI.',
    metricLabel: 'calculations run',
    currentValue: (s) => s.calculatorUsageCount,
    targetValue: 10,
    icon: '📊',
    xpReward: 100,
    colorClass: 'from-purple-400 to-indigo-500',
  },
  {
    id: 'ai_enthusiast',
    title: 'AI Enthusiast',
    description: 'Chat with our AI companion 25 times.',
    metricLabel: 'chatbot queries',
    currentValue: (s) => s.chatbotUsageCount,
    targetValue: 25,
    icon: '🤖',
    xpReward: 200,
    colorClass: 'from-fuchsia-400 to-pink-500',
  },
  {
    id: 'site_hero',
    title: 'Site Visit Hero',
    description: 'Book 5 premium physical site inspections.',
    metricLabel: 'visits booked',
    currentValue: (s) => s.siteVisitsCount,
    targetValue: 5,
    icon: '🚀',
    xpReward: 300,
    colorClass: 'from-amber-400 to-orange-500',
  },
  {
    id: 'referral_king',
    title: 'Referral King',
    description: 'Refer 10 of your close friends or investors to Urban Nest.',
    metricLabel: 'referrals completed',
    currentValue: (s) => s.referralsCount,
    targetValue: 10,
    icon: '👑',
    xpReward: 500,
    colorClass: 'from-yellow-400 to-amber-500',
  },
  {
    id: 'streak_maker',
    title: 'Daily Devotee',
    description: 'Claim your daily connection check-in rewards for 3 consecutive days.',
    metricLabel: 'consecutive days',
    currentValue: (s) => s.streakDays,
    targetValue: 3,
    icon: '🔥',
    xpReward: 150,
    colorClass: 'from-orange-400 to-red-500',
  },
];

// Referral Badges (Bronze = 1, Silver = 5, Gold = 10)
export interface ReferralTier {
  referralsRequired: number;
  title: string;
  colorClass: string;
  icon: string;
}

export const REFERRAL_TIERS: ReferralTier[] = [
  { referralsRequired: 1, title: 'Bronze Referrer', colorClass: 'border-amber-600 bg-amber-950/40 text-amber-300', icon: '🥉' },
  { referralsRequired: 5, title: 'Silver Referrer', colorClass: 'border-slate-300 bg-slate-900/40 text-slate-300', icon: '🥈' },
  { referralsRequired: 10, title: 'Gold Referrer', colorClass: 'border-yellow-400 bg-yellow-950/40 text-yellow-300', icon: '🥇' },
];

export const DEFAULT_GAMIFICATION_STATE: GamificationState = {
  xp: 150, // Start with some initial points to feel welcome
  viewedPropertiesCount: 3,
  calculatorUsageCount: 1,
  chatbotUsageCount: 2,
  siteVisitsCount: 0,
  referralsCount: 0,
  hasSpinned: false,
  spinReward: null,
  lastLoginDate: null,
  streakDays: 1,
  lastClaimedXPDate: null,
  completedProfile: false,
  registered: false,
  badges: [],
  weeklyTargetCount: 3, // Out of 10
  weeklyRewardClaimed: false,
};

export function getGamificationState(): GamificationState {
  if (typeof window === 'undefined') return DEFAULT_GAMIFICATION_STATE;
  try {
    const saved = localStorage.getItem('urban_nest_gamification');
    if (saved) {
      const parsed = JSON.parse(saved);
      // Backwards compatibility safety patches:
      return { ...DEFAULT_GAMIFICATION_STATE, ...parsed };
    }
  } catch (err) {
    console.error('Failed to load gamification state from localStorage', err);
  }
  return DEFAULT_GAMIFICATION_STATE;
}

export function saveGamificationState(state: GamificationState) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('urban_nest_gamification', JSON.stringify(state));
    // Dispatch a custom event so other components receive updates in real time
    window.dispatchEvent(new CustomEvent('urban_nest_gamification_updated', { detail: state }));
  } catch (err) {
    console.error('Failed to save gamification state to localStorage', err);
  }
}

export interface XPActionResult {
  xpAdded: number;
  newXP: number;
  levelUpOccurred: boolean;
  oldLevelName: string;
  newLevelName: string;
  badgesUnlocked: string[]; // Badge Titles
}

export function getCurrentLevel(xp: number): LevelThreshold {
  const current = LEVEL_THRESHOLDS.find(th => xp >= th.minXP && xp <= th.maxXP);
  return current || LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1];
}

export function getNextLevel(xp: number): LevelThreshold | null {
  const currentIndex = LEVEL_THRESHOLDS.findIndex(th => xp >= th.minXP && xp <= th.maxXP);
  if (currentIndex === -1 || currentIndex === LEVEL_THRESHOLDS.length - 1) {
    return null;
  }
  return LEVEL_THRESHOLDS[currentIndex + 1];
}

/**
 * Core function to award XP for different actions,
 * checks for unlocked badges and level changes automatically.
 */
export function awardXPAction(
  action: 
    | 'create_account' 
    | 'complete_profile' 
    | 'view_property' 
    | 'save_property' 
    | 'share_property' 
    | 'use_calculator' 
    | 'chat_with_ai' 
    | 'book_site_visit' 
    | 'refer_friend'
    | 'weekly_challenge'
    | 'streak_bonus'
    | 'spin_wheel_xp'
  ,
  customAmount?: number
): XPActionResult {
  const state = getGamificationState();
  const oldXP = state.xp;
  const oldLevel = getCurrentLevel(oldXP);

  let xpAdded = 0;
  switch (action) {
    case 'create_account':
      if (!state.registered) {
        xpAdded = 50;
        state.registered = true;
      }
      break;
    case 'complete_profile':
      if (!state.completedProfile) {
        xpAdded = 100;
        state.completedProfile = true;
      }
      break;
    case 'view_property':
      xpAdded = 5;
      state.viewedPropertiesCount += 1;
      // Also update weekly discovery target
      if (state.weeklyTargetCount < 10) {
        state.weeklyTargetCount += 1;
      }
      break;
    case 'save_property':
      xpAdded = 10;
      break;
    case 'share_property':
      xpAdded = 20;
      break;
    case 'use_calculator':
      xpAdded = 15;
      state.calculatorUsageCount += 1;
      break;
    case 'chat_with_ai':
      xpAdded = 10;
      state.chatbotUsageCount += 1;
      break;
    case 'book_site_visit':
      xpAdded = 100;
      state.siteVisitsCount += 1;
      break;
    case 'refer_friend':
      xpAdded = 250;
      state.referralsCount += 1;
      break;
    case 'weekly_challenge':
      if (!state.weeklyRewardClaimed) {
        xpAdded = 200;
        state.weeklyRewardClaimed = true;
      }
      break;
    case 'streak_bonus':
      xpAdded = customAmount || 50;
      break;
    case 'spin_wheel_xp':
      xpAdded = customAmount || 50;
      break;
    default:
      break;
  }

  // Calculate new XP
  state.xp += xpAdded;
  const newXP = state.xp;
  const newLevel = getCurrentLevel(newXP);
  const levelUpOccurred = newLevel.name !== oldLevel.name;

  // Check achievement badges unlocking
  const newlyUnlockedBadgeTitles: string[] = [];
  ACHIEVEMENT_BADGES.forEach(badge => {
    if (!state.badges.includes(badge.id)) {
      const currentVal = badge.currentValue(state);
      if (currentVal >= badge.targetValue) {
        state.badges.push(badge.id);
        state.xp += badge.xpReward; // Award badge completion bonus on top!
        newlyUnlockedBadgeTitles.push(badge.title);
      }
    }
  });

  saveGamificationState(state);

  return {
    xpAdded,
    newXP: state.xp,
    levelUpOccurred,
    oldLevelName: oldLevel.name,
    newLevelName: newLevel.name,
    badgesUnlocked: newlyUnlockedBadgeTitles,
  };
}

/**
 * Handle checking daily login streak and awarding bonuses
 */
export function checkStreakProgress(): { streakUpdated: boolean; newDays: number; bonusClaimed: number } {
  const state = getGamificationState();
  const todayStr = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  
  if (state.lastLoginDate === todayStr) {
    return { streakUpdated: false, newDays: state.streakDays, bonusClaimed: 0 };
  }

  let bonusClaimed = 0;
  let newDays = state.streakDays;

  if (state.lastLoginDate) {
    const lastDate = new Date(state.lastLoginDate);
    const today = new Date(todayStr);
    const diffTime = Math.abs(today.getTime() - lastDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      // Consecutive login! Increment streak
      newDays = state.streakDays + 1;
      
      // Award streak checkpoint bonuses
      if (newDays === 3) {
        bonusClaimed = 50;
        state.xp += 50;
      } else if (newDays === 7) {
        bonusClaimed = 150;
        state.xp += 150;
      } else if (newDays === 30) {
        bonusClaimed = 500; // Premium Badge Reward style points
        state.xp += 500;
        // Unlock arbitrary premium level badge
        if (!state.badges.includes('streak_master')) {
          state.badges.push('streak_master');
        }
      }
    } else if (diffDays > 1) {
      // Streak broken. Reset back to day 1
      newDays = 1;
    }
  } else {
    // First ever logged in record
    newDays = 1;
  }

  state.streakDays = newDays;
  state.lastLoginDate = todayStr;
  saveGamificationState(state);

  return {
    streakUpdated: true,
    newDays,
    bonusClaimed,
  };
}

// Pre-filled Leaderboard users array for Phase 9 to compare/race against
export interface LeaderboardUser {
  rank: number;
  name: string;
  role: string;
  xp: number;
  avatar: string;
  isCurrentUser?: boolean;
}

export function getFullLeaderboard(currentUserXP: number, currentUserName: string, currentUserAvatar: string): LeaderboardUser[] {
  const rawList: Omit<LeaderboardUser, 'rank'>[] = [
    { name: 'Rahul Deshmukh', role: '👑 Realty Master', xp: 5800, avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Milo' },
    { name: 'Amit Sawant21', role: '💼 Expert Buyer', xp: 3500, avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Jack' },
    { name: 'Neha Kulkarni', role: '🏆 Investor', xp: 2800, avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Luna' },
    { name: 'Siddharth Roy', role: '🔍 Property Hunter', xp: 1200, avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Leo' },
    { name: 'Kunal Patil', role: '🔍 Property Hunter', xp: 850, avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Felix' },
  ];

  // Insert current user in correct location
  const currentLevelInfo = getCurrentLevel(currentUserXP);
  rawList.push({
    name: `${currentUserName} (You)`,
    role: `${currentLevelInfo.badgeSymbol} ${currentLevelInfo.name}`,
    xp: currentUserXP,
    avatar: currentUserAvatar,
    isCurrentUser: true,
  });

  // Sort by XP desc
  rawList.sort((a, b) => b.xp - a.xp);

  // Return list with populated ranks
  return rawList.map((usr, index) => ({
    ...usr,
    rank: index + 1,
  }));
}

/**
 * Calculates a match score (Phase 6) based on user's preferred location/budget vs. property details.
 * Offers standard 90%+ realistic outputs that feel intelligent!
 */
export function calculateMatchScore(
  propertyLocation: string,
  propertyPrice: string,
  userLocationPref?: string,
  userBudgetMax?: number
): number {
  // Normalize parameters
  let score = 85; // Solid baseline for matches

  if (userLocationPref) {
    const locLower = propertyLocation.toLowerCase();
    const prefLower = userLocationPref.toLowerCase();
    if (locLower.includes(prefLower) || prefLower.includes(locLower)) {
      score += 7;
    } else {
      score -= 5;
    }
  }

  if (userBudgetMax && userBudgetMax > 0) {
    // Extract property number (e.g., "₹ 75.0 Lacs" -> float 75)
    const matches = propertyPrice.match(/[\d.]+/);
    if (matches) {
      const propPriceVal = parseFloat(matches[0]);
      const isCr = propertyPrice.toLowerCase().includes('cr');
      const normalizedPropPrice = isCr ? propPriceVal * 100 : propPriceVal; // lac equivalents

      const diff = normalizedPropPrice - userBudgetMax;
      if (diff <= 0) {
        // Fits right under budget! Better score
        score += 6;
      } else if (diff <= userBudgetMax * 0.1) {
        // Slightly over budget (within 10%)
        score += 2;
      } else {
        // Over limit by quite a lot
        score -= 9;
      }
    }
  }

  // Clamp between 60% and 98% for realistic premium feel
  return Math.min(Math.max(Math.round(score), 60), 98);
}

/**
 * Dispatches an event to trigger a real-time gamified XP award from anywhere in the codebase.
 */
export function dispatchXPAward(
  action: Parameters<typeof awardXPAction>[0],
  customAmount?: number
) {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('urban_nest_award_xp_trigger', {
        detail: { action, customAmount },
      })
    );
  }
}

export interface DailyCheckInResult {
  success: boolean;
  message: string;
  xpEarned: number;
  streakDays: number;
  badgesUnlocked: string[];
}

export function claimDailyCheckIn(): DailyCheckInResult {
  const state = getGamificationState();
  const todayStr = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  
  if (state.lastClaimedXPDate === todayStr) {
    return {
      success: false,
      message: `Checked-in already today! Return tomorrow for Day ${state.streakDays + 1} rewards.`,
      xpEarned: 0,
      streakDays: state.streakDays,
      badgesUnlocked: [],
    };
  }

  let streakDays = state.streakDays;
  let message = '';
  
  if (state.lastClaimedXPDate) {
    const lastDate = new Date(state.lastClaimedXPDate);
    const today = new Date(todayStr);
    const diffTime = Math.abs(today.getTime() - lastDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
      // Consecutive login!
      streakDays += 1;
      message = `Excellent connection streak! Handshake completed safely for day ${streakDays}.`;
    } else if (diffDays > 1) {
      // Broken streak! Reset to 1
      streakDays = 1;
      message = `Daily streak broken! Connection restarted at Day 1. Keep checking in daily!`;
    } else {
      // Same day backup safeguards
      streakDays = Math.max(1, streakDays);
      message = `Handshake completed!`;
    }
  } else {
    // First ever check-in
    streakDays = 1;
    message = `Welcome to your premium Real Estate portal! Day 1 Check-In rewards claimed successfully.`;
  }

  // Calculate Base reward of 50 XP
  let xpEarned = 50;
  let bonusXP = 0;
  
  // Dynamic Streak Multiplier / Bonus rewards:
  if (streakDays === 2) {
    bonusXP = 25;
  } else if (streakDays === 3) {
    bonusXP = 50;
  } else if (streakDays === 4) {
    bonusXP = 75;
  } else if (streakDays === 5) {
    bonusXP = 100;
  } else if (streakDays === 6) {
    bonusXP = 150;
  } else if (streakDays >= 7) {
    bonusXP = 250; // Weekly perfect streak!
  }
  
  xpEarned += bonusXP;
  
  // Award XP
  state.xp += xpEarned;
  state.streakDays = streakDays;
  state.lastClaimedXPDate = todayStr;
  state.lastLoginDate = todayStr;
  
  if (bonusXP > 0) {
    message += ` Streak Bonus unlocked: +${bonusXP} XP! (Total earned: +${xpEarned} XP).`;
  } else {
    message += ` Earned +${xpEarned} XP.`;
  }

  // Check achievement badges unlocking
  const newlyUnlockedBadgeTitles: string[] = [];
  ACHIEVEMENT_BADGES.forEach(badge => {
    if (!state.badges.includes(badge.id)) {
      const currentVal = badge.currentValue(state);
      if (currentVal >= badge.targetValue) {
        state.badges.push(badge.id);
        state.xp += badge.xpReward; // Award badge completion bonus on top!
        newlyUnlockedBadgeTitles.push(badge.title);
      }
    }
  });

  saveGamificationState(state);

  return {
    success: true,
    message,
    xpEarned,
    streakDays,
    badgesUnlocked: newlyUnlockedBadgeTitles,
  };
}

/**
 * Simulates passing of 1 day to let users test consecutive login streaks interactively instantly.
 */
export function simulateNextDayCheckIn(): { success: boolean; message: string; yesterdayStr: string; state: GamificationState } {
  const state = getGamificationState();
  
  // Subtract 1 day from both claim date and login date to make "today" feel like "tomorrow"
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];
  
  state.lastClaimedXPDate = yesterdayStr;
  state.lastLoginDate = yesterdayStr;
  
  saveGamificationState(state);
  
  return {
    success: true,
    message: "Time-travel simulation complete! Shifted last login to yesterday. Click 'Claim Daily Check-In' to progress your consecutive daily streak!",
    yesterdayStr,
    state,
  };
}

