import { GymLocation } from '@/types/gamification';

const GYM_LOCATIONS_KEY = 'gymquest-gym-locations';
const CHECKIN_KEY_PREFIX = 'gymquest-checkins-';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function todayKey(): string {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${CHECKIN_KEY_PREFIX}${yyyy}-${mm}-${dd}`;
}

// ---------------------------------------------------------------------------
// Distance – Haversine formula
// ---------------------------------------------------------------------------

/**
 * Calculate the distance in **meters** between two lat/lon pairs using the
 * Haversine formula.
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6_371_000; // Earth radius in meters
  const toRad = (deg: number) => (deg * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

// ---------------------------------------------------------------------------
// Proximity check
// ---------------------------------------------------------------------------

/**
 * Check whether the user is within range of any saved gym.
 * Returns the nearest gym together with the distance (meters).
 */
export function isNearGym(
  userLat: number,
  userLon: number,
  gyms: GymLocation[]
): { isNear: boolean; nearestGym: GymLocation | null; distance: number } {
  if (gyms.length === 0) {
    return { isNear: false, nearestGym: null, distance: Infinity };
  }

  let nearestGym: GymLocation | null = null;
  let minDistance = Infinity;

  for (const gym of gyms) {
    const dist = calculateDistance(userLat, userLon, gym.latitude, gym.longitude);
    if (dist < minDistance) {
      minDistance = dist;
      nearestGym = gym;
    }
  }

  const isNear = nearestGym !== null && minDistance <= nearestGym.radius;

  return { isNear, nearestGym, distance: minDistance };
}

// ---------------------------------------------------------------------------
// Browser geolocation (Promise wrapper)
// ---------------------------------------------------------------------------

/**
 * Get the device's current position as a Promise.
 */
export function getCurrentPosition(): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation stöds inte av din webbläsare'));
      return;
    }
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 60000,
    });
  });
}

// ---------------------------------------------------------------------------
// Gym location persistence (localStorage)
// ---------------------------------------------------------------------------

/** Save the full list of gym locations. */
export function saveGymLocations(gyms: GymLocation[]): void {
  localStorage.setItem(GYM_LOCATIONS_KEY, JSON.stringify(gyms));
}

/** Load all saved gym locations. */
export function loadGymLocations(): GymLocation[] {
  const raw = localStorage.getItem(GYM_LOCATIONS_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as GymLocation[];
  } catch {
    return [];
  }
}

/** Add a single gym location (appends to existing list). */
export function addGymLocation(gym: GymLocation): void {
  const gyms = loadGymLocations();
  gyms.push(gym);
  saveGymLocations(gyms);
}

/** Remove a gym location by id. */
export function removeGymLocation(id: string): void {
  const gyms = loadGymLocations().filter((g) => g.id !== id);
  saveGymLocations(gyms);
}

// ---------------------------------------------------------------------------
// Save current device location as a new gym
// ---------------------------------------------------------------------------

/**
 * Use the device GPS to capture the current position and persist it as a new
 * gym location with the given name. Returns the created GymLocation.
 */
export async function saveCurrentLocationAsGym(
  name: string
): Promise<GymLocation> {
  const position = await getCurrentPosition();

  const gym: GymLocation = {
    id: crypto.randomUUID(),
    name,
    latitude: position.coords.latitude,
    longitude: position.coords.longitude,
    radius: 100, // default 100 m check-in radius
  };

  addGymLocation(gym);
  return gym;
}

// ---------------------------------------------------------------------------
// Check-in logic
// ---------------------------------------------------------------------------

/**
 * Returns true if the user has **not** already checked in at `gymId` today.
 */
export function canCheckIn(gymId: string): boolean {
  const checkins = getTodayCheckins();
  return !checkins.includes(gymId);
}

/**
 * Record a check-in for the given gym, storing the gym ID and XP earned in
 * today's localStorage entry.
 */
export function recordCheckIn(gymId: string, xpEarned: number): void {
  const key = todayKey();
  const raw = localStorage.getItem(key);

  let entries: { gymId: string; xpEarned: number; timestamp: string }[] = [];
  if (raw) {
    try {
      entries = JSON.parse(raw);
    } catch {
      entries = [];
    }
  }

  entries.push({
    gymId,
    xpEarned,
    timestamp: new Date().toISOString(),
  });

  localStorage.setItem(key, JSON.stringify(entries));
}

/**
 * Returns the gym IDs the user has checked in at today.
 */
export function getTodayCheckins(): string[] {
  const key = todayKey();
  const raw = localStorage.getItem(key);
  if (!raw) return [];

  try {
    const entries: { gymId: string }[] = JSON.parse(raw);
    return entries.map((e) => e.gymId);
  } catch {
    return [];
  }
}
