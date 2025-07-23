import webpush from "web-push";

webpush.setVapidDetails(
  "mailto:tarekelsayed.dev@gmail.com",
  process.env.VAPID_PUBLIC_KEY as string,
  process.env.VAPID_PRIVATE_KEY as string
);

export default webpush;
