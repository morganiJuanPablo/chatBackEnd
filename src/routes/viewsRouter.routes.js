import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
  res.render("home", { style: "home.css" });
});

export { router as viewsRouter };
