import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
  return res.status(200).json({
    latestVersion: "1.0.0",
    minimumVersion: "1.0.0",
    message: "A new update is available with bug fixes and improvements.",
    iosUrl: "https://testflight.apple.com/join/svFrzVHd",
    androidUrl: "https://salesteamtracker.vercel.app/download/android",
  });
});

export default router;