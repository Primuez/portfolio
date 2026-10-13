export function trackEvent(eventName: string, properties?: Record<string, any>) {
  if (typeof window !== 'undefined') {
    if ('gtag' in window) {
      (window as any).gtag('event', eventName, properties);
    }
    if ('posthog' in window) {
      (window as any).posthog?.capture(eventName, properties);
    }
    console.log(`[Analytics] Tracked: ${eventName}`, properties || {});
  }
}
