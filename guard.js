// Защита веб-админки (crm.avail.asia). Грузится из <head> раньше
// приложения; встроенным в страницу скриптом быть не может — их
// запрещает CSP в index.html.
(function () {
  // 1. Только https. На http браузер не даёт WebCrypto, и вход через
  //    Apple (PKCE) не работает. GitHub Pages и сам уводит на https
  //    («Enforce HTTPS»), это — запасной вариант.
  if (location.protocol === "http:" &&
      !/^(localhost|127\.|\[::1\])/.test(location.hostname)) {
    location.replace("https:" + location.href.slice(5));
    return;
  }

  // 2. Не открываемся внутри чужой страницы (рамки, iframe): иначе
  //    нажатия в админке можно подсунуть обманом. Заголовок, который
  //    запрещает рамки, GitHub Pages ставить не умеет, а в мета-теге CSP
  //    браузер его не понимает. Поэтому: уводим всё окно на админку, а
  //    если не дали (sandbox) — прячем страницу. Само приложение в рамке
  //    не стартует (проверка и в flutter_bootstrap.js).
  if (top !== self) {
    try { top.location = self.location; } catch (e) { /* не дали */ }
    document.documentElement.style.display = "none";
    return;
  }

  // 3. Экран загрузки убираем после первого кадра приложения.
  window.addEventListener("flutter-first-frame", function () {
    var l = document.getElementById("avail-loader");
    if (l) {
      l.classList.add("done");
      setTimeout(function () { l.remove(); }, 600);
    }
  });
})();
