import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Secure server-side proxy endpoint to bypass CORS and reliably fetch Wingo histories
  app.get("/api/history", async (req, res) => {
    try {
      let mode = "WinGo_30S";
      const qMode = req.query.mode;
      if (qMode === "1m") {
        mode = "WinGo_1M";
      } else {
        mode = "WinGo_30S";
      }
      
      // Force freshness on the Wingo API by using a dynamic cache-buster timestamp
      const apiEndpoint = `https://draw.ar-lottery01.com/WinGo/${mode}/GetHistoryIssuePage.json?t=${Date.now()}`;

      const response = await fetch(apiEndpoint, {
        headers: {
          "Accept": "application/json",
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          "Referer": "https://bdgwinmy.cc/",
          "Cache-Control": "no-cache",
          "Pragma": "no-cache"
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Set explicit non-caching headers on the proxy response
      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
      res.setHeader('Surrogate-Control', 'no-store');
      
      res.json(data);
    } catch (error: any) {
      console.error("Proxy error:", error.message);
      res.status(500).json({ error: "Failed to fetch lottery history", details: error.message });
    }
  });

  // Vite middleware setup
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Wingo VIP Injector server running on port ${PORT}`);
  });
}

startServer();
