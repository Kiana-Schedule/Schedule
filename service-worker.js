self.addEventListener("install", e => {
  e.waitUntil(
    caches.open("schedule-cache").then(cache =>
      cache.addAll([
        "./",
        "./index.html",
        "./styles.css",
        "./app.js"
      ])
    )
  );
});
