import { getToken } from "firebase/messaging";
import { messagingPromise } from "./firebase";

const API = "http://localhost:8080/api";

export async function registerFCM(
  employeeId: number | string,
  jwt: string,
) {
  const messaging = await messagingPromise;

  if (!messaging) {
    console.log("Firebase Messaging tidak didukung");
    return;
  }

  const permission = await Notification.requestPermission();

  if (permission !== "granted") {
    console.log("Izin notifikasi ditolak");
    return;
  }

  const fcmToken = await getToken(messaging, {
    vapidKey:
      "BLMNh119CRH_LqcqLqSFB_SBWxn7y-TRaJS59adH5gLcdnqXFNzcvh01JTMzZokw0V31vvBjWG4BvJ47X-xVFG0",
  });

  if (!fcmToken) {
    console.log("Gagal mendapatkan FCM Token");
    return;
  }

  console.log("🔥 FCM TOKEN:", fcmToken);

  const body = {
    employee_id: Number(employeeId), // WAJIB ANGKA
    installation_id: crypto.randomUUID(),
    registration_token: fcmToken,
    device_type: "web",
    device_name: navigator.userAgent,
  };

  console.log("BODY:", body);

  const response = await fetch(`${API}/fcm/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${jwt}`,
    },
    body: JSON.stringify(body),
  });

  const data = await response.json();

  console.log("BACKEND:", data);
}