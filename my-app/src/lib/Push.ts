// client/src/lib/Push.ts
export function notificationUnsupported(): boolean {
  return (
    !("serviceWorker" in navigator) ||
    !("PushManager" in window) ||
    !("showNotification" in ServiceWorkerRegistration.prototype)
  );
}

export async function registerAndSubscribe(
  userId: number,
  onSubscribe: (subs: PushSubscription | null) => void
): Promise<void> {
  try {
    await navigator.serviceWorker.register("/sw.js");
    await subscribe(userId, onSubscribe);
  } catch (e) {
    console.error("فشل تسجيل Service Worker:", e);
  }
}

async function subscribe(
  userId: number,
  onSubscribe: (subs: PushSubscription | null) => void
): Promise<void> {
  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
    });
    await submitSubscription(subscription, userId);
    onSubscribe(subscription);
  } catch (e) {
    console.error("فشل الاشتراك في الإشعارات:", e);
    onSubscribe(null);
  }
}

async function submitSubscription(
  subscription: PushSubscription,
  userId: number
): Promise<void> {
  const res = await fetch("/api/suppliers/subscription", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ subscription, userId }),
  });
  const result = await res.json();
  console.log(result);
}

export function checkPermissionStateAndAct(
  userId: number,
  onSubscribe: (subs: PushSubscription | null) => void
): void {
  const state: NotificationPermission = Notification.permission;
  if (state === "granted") {
    registerAndSubscribe(userId, onSubscribe);
  }
}
