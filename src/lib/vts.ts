export interface TrackedAction {
  id: string;
  visitorId: string;
  actionType: string;
  details: string;
  timestamp: string;
  url: string;
  consent: 'Accepted' | 'Rejected' | 'Pending';
  sessionId: string;
}

// Generate a random visitor/session ID helper
export function generateId(prefix: string = 'usr_'): string {
  return prefix + Math.random().toString(36).substring(2, 10);
}

// Get session ID (stays in memory, refreshes on page reload)
let sessionVal = '';
export function getSessionId(): string {
  if (!sessionVal) {
    sessionVal = generateId('sess_');
  }
  return sessionVal;
}

// Cookies helper
function setCookie(name: string, value: string, days: number = 30) {
  try {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = "; expires=" + date.toUTCString();
    document.cookie = name + "=" + (value || "") + expires + "; path=/; SameSite=Lax";
  } catch (e) {
    console.warn("Could not set cookie in this environment:", e);
  }
}

function getCookie(name: string): string | null {
  try {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
  } catch (e) {
    console.warn("Could not read cookie in this environment:", e);
  }
  return null;
}

function deleteCookie(name: string) {
  document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

// Core VTS methods
export function getConsent(): 'Accepted' | 'Rejected' | 'Pending' {
  const localConsent = localStorage.getItem('nest_vts_consent');
  if (localConsent === 'Accepted') return 'Accepted';
  if (localConsent === 'Rejected') return 'Rejected';

  const cookieConsent = getCookie('visitor_tracking_consent');
  if (cookieConsent === 'true') return 'Accepted';
  if (cookieConsent === 'false') return 'Rejected';

  return 'Pending';
}

export function getVisitorId(): string {
  const consent = getConsent();
  if (consent === 'Accepted') {
    // Return persistent ID
    let rid = localStorage.getItem('nest_vts_visitor_id') || getCookie('visitor_id');
    if (!rid) {
      rid = generateId('usr_');
      localStorage.setItem('nest_vts_visitor_id', rid);
      setCookie('visitor_id', rid, 30);
    }
    return rid;
  } else {
    // Rejected or pending -> return generic/blank session-only id so they are completely unlinked on repeat visits
    return getSessionId(); // fall back to session
  }
}

export function setConsent(status: 'Accepted' | 'Rejected') {
  localStorage.setItem('nest_vts_consent', status);
  setCookie('visitor_tracking_consent', status === 'Accepted' ? 'true' : 'false', 30);

  if (status === 'Accepted') {
    // Initialize persistent visitor ID
    const rid = generateId('usr_');
    localStorage.setItem('nest_vts_visitor_id', rid);
    setCookie('visitor_id', rid, 30);
  } else {
    // Clear persistent tracking parameters
    localStorage.removeItem('nest_vts_visitor_id');
    deleteCookie('visitor_id');
  }
  
  // Dispatch event so other components know consent has changed
  window.dispatchEvent(new Event('vts_consent_updated'));
}

export function trackAction(actionType: string, details: string) {
  const consent = getConsent();
  const sessionId = getSessionId();
  const visitorId = getVisitorId();
  const timestamp = new Date().toISOString();
  const url = window.location.pathname + window.location.hash;

  let trackVisitorId = visitorId;
  let trackSessionId = sessionId;

  if (consent === 'Rejected') {
    // If Cookies are Rejected, track basic anonymous activity but DO NOT link those actions together.
    // Each action gets its own fresh random ID and session is unlinked so journey cannot be reconstructed
    trackVisitorId = 'Anonymous (Cookies Rejected)';
    trackSessionId = 'anonymous_' + generateId('');
  } else if (consent === 'Pending') {
    trackVisitorId = 'Pending Consent';
  }

  const action: TrackedAction = {
    id: generateId('act_'),
    visitorId: trackVisitorId,
    actionType,
    details,
    timestamp,
    url,
    consent,
    sessionId: trackSessionId
  };

  try {
    const stored = localStorage.getItem('nest_vts_actions');
    const actions = stored ? JSON.parse(stored) : [];
    actions.unshift(action);
    if (actions.length > 200) actions.pop();
    localStorage.setItem('nest_vts_actions', JSON.stringify(actions));

    // Update chatbot memory if user is actively searching
    if (consent === 'Accepted') {
      const storedInterests = localStorage.getItem('nest_vts_interests') || '[]';
      const interests = JSON.parse(storedInterests);
      
      // Look for key details inside the logged action
      if (details.toLowerCase().includes('bhk') || details.toLowerCase().includes('lakh') || details.toLowerCase().includes('crore')) {
        interests.push(details);
        if (interests.length > 10) interests.shift();
        localStorage.setItem('nest_vts_interests', JSON.stringify(interests));
      }
    }

    // Trigger storage event so admin and components update live
    window.dispatchEvent(new Event('vts_action_tracked'));
  } catch (e) {
    console.error("VTS storage write error:", e);
  }
}

export function getTrackedActions(): TrackedAction[] {
  try {
    const stored = localStorage.getItem('nest_vts_actions');
    return stored ? JSON.parse(stored) : [];
  } catch (_) {
    return [];
  }
}

export function clearTrackedActions() {
  try {
    localStorage.removeItem('nest_vts_actions');
    window.dispatchEvent(new Event('vts_action_tracked'));
  } catch (_) {}
}

export function getPersonalizedGreetingContext(): string | null {
  const consent = getConsent();
  if (consent !== 'Accepted') return null;

  try {
    const storedInterests = localStorage.getItem('nest_vts_interests');
    if (storedInterests) {
      const interests: string[] = JSON.parse(storedInterests);
      if (interests.length > 0) {
        return interests[interests.length - 1]; // return the most recent interest detail
      }
    }
  } catch (_) {}
  return null;
}
