export const PLAN_CONFIG = {
  free:    { monthlyLimit: 100,   ratePerMinute: 10,  allowOverage: false },
  starter: { monthlyLimit: 1000,  ratePerMinute: 60,  allowOverage: true  },
  growth:  { monthlyLimit: 5000,  ratePerMinute: 120, allowOverage: true  },
  scale:   { monthlyLimit: 20000, ratePerMinute: 120, allowOverage: true  },
} as const;

export type PlanName = keyof typeof PLAN_CONFIG;

export function getPlanConfig(plan: string) {
  if (plan in PLAN_CONFIG) {
    return PLAN_CONFIG[plan as PlanName];
  }
  return PLAN_CONFIG.free;
}
