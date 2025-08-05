import { useEffect, useState } from "react";

function App() {
  const [price, setPrice] = useState<number | null>(null);
  const [views, setViews] = useState<number>(0);
  const [timer, setTimer] = useState<number>(0);

  useEffect(() => {
    // Инициализация Telegram WebApp
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.ready();
      window.Telegram.WebApp.expand();
    }

    // Загрузка текущего состояния аукциона
    fetch("https://ton-flash-deal7.onrender.com")
      .then((res) => {
        if (!res.ok) throw new Error("Network error");
        return res.json();
      })
      .then((data) => {
        setPrice(data.currentPriceUsdt);
        setViews(data.views);
      })
      .catch((err) => {
        console.error("Failed to load auction:", err);
        setPrice(20.0); // fallback цена
      });
  }, []);

  const viewPrice = () => {
    // 🔒 Проверяем, что мы в Telegram
    if (!window.Telegram || !window.Telegram.WebApp) {
      alert("Ошибка: откройте приложение в Telegram");
      return;
    }

    const WebApp = window.Telegram.WebApp;

    // Спрашиваем подтверждение
    const confirmed = WebApp.showConfirm("Посмотреть цену? Стоимость: 100 Stars");
    if (!confirmed) return;

    // Отправляем запрос на сервер
    fetch("https://ton-flash-deal7.onrender.com", {
      method: "POST",
    })
      .then((res) => res.json())
      .then((data) => {
        setPrice(data.newPrice);
        setViews(data.views);
        setTimer(10); // запускаем таймер

        // Уменьшаем таймер каждую секунду
        const interval = setInterval(() => {
          setTimer((prev) => {
            if (prev <= 1) {
              clearInterval(interval);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      })
      .catch((err) => {
        console.error("Ошибка при просмотре:", err);
        alert("Не удалось посмотреть цену");
      });
  };

  const buy = () => {
    if (price === null) return;

    // 🔒 Проверка Telegram
    if (!window.Telegram || !window.Telegram.WebApp) {
      alert("Ошибка: откройте приложение в Telegram");
      return;
    }

    const WebApp = window.Telegram.WebApp;

    const message = `Вы уверены, что хотите купить 10 TON за ${price.toFixed(2)} USDT?`;
    const confirmed = WebApp.showConfirm(message);
    if (!confirmed) return;

    // 🎉 Покупка успешна (в будущем — оплата через TON)
    alert(`🎉 Поздравляем! Вы купили 10 TON за ${price.toFixed(2)} USDT!`);
    // Здесь можно: отправить запрос на бэкенд, выдать ваучер и т.д.
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif", maxWidth: "500px", margin: "0 auto" }}>
      <h1 style={{ textAlign: "center", color: "#2c3e50" }}>🎁 TON Flash Deal</h1>

      <div
        style={{
          backgroundColor: "#f8f9fa",
          padding: "15px",
          borderRadius: "10px",
          marginBottom: "20px",
          fontSize: "14px",
          color: "#555",
        }}
      >
        <p>📈 Рыночная цена: 20.00 USDT</p>
        <p>👀 Просмотров: {views}</p>
      </div>

      {timer > 0 ? (
        <div
          style={{
            backgroundColor: "#e6f7ff",
            padding: "20px",
            borderRadius: "12px",
            textAlign: "center",
            border: "2px solid #0088cc",
          }}
        >
          <h2 style={{ color: "#d35400", margin: "0 0 10px 0" }}>
            🔥 Цена: {price?.toFixed(2)} USDT
          </h2>
          <p style={{ margin: "10px 0", fontSize: "16px" }}>
            ⏳ Осталось: <strong>{timer}</strong> сек
          </p>
          <button
            onClick={buy}
            style={{
              fontSize: "18px",
              padding: "12px 30px",
              backgroundColor: "#27ae60",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            Купить сейчас
          </button>
        </div>
      ) : (
        <button
          onClick={viewPrice}
          style={{
            fontSize: "18px",
            padding: "16px",
            backgroundColor: "#0088cc",
            color: "white",
            border: "none",
            borderRadius: "12px",
            width: "100%",
            fontWeight: "bold",
            cursor: "pointer",
            marginBottom: "20px",
          }}
        >
          Посмотреть цену 💎 100 Stars
        </button>
      )}

      <p
        style={{
          fontSize: "12px",
          color: "#7f8c8d",
          textAlign: "center",
          marginTop: "20px",
        }}
      >
        Цена снижается на 0.50 USDT за каждый просмотр.
      </p>
    </div>
  );
}

export default App;
