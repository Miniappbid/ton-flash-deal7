const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Данные аукциона
let auction = {
  currentPriceUsdt: 20.0,
  views: 0
};

// Получить текущую цену
app.get("/api/auction", (req, res) => {
  res.json(auction);
});

// Просмотр — снижает цену
app.post("/api/auction/view", (req, res) => {
  auction.views += 1;
  auction.currentPriceUsdt -= 0.5;
  res.json({
    newPrice: auction.currentPriceUsdt,
    views: auction.views
  });
});

// Запуск сервера
const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`✅ Сервер запущен на порту ${port}`);
});