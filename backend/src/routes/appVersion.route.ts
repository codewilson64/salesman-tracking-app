import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
  return res.status(200).json({
    latestVersion: "1.0.1",
    minimumVersion: "1.0.0",
    message: "A new update is available with bug fixes and improvements.",
    iosUrl: "https://apps.apple.com/app/your-app-id",
    androidUrl: "https://play.google.com/store/apps/details?id=com.codewilson64.salesteamtracker",
  });
});

export default router;