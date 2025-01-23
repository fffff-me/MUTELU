
document.getElementById("startProgramBtn").addEventListener("click", async () => {
  const startDay = document.getElementById("startDay").value;
  const startMonth = document.getElementById("startMonth").value;
  const startYear = document.getElementById("startYear").value;
  const location = document.getElementById("location").value;

  if (!startDay || !startMonth || !startYear || !location) {
    alert("กรุณาเลือกวันที่เริ่มใช้สินค้าและสถานที่ให้ครบถ้วน");
    return;
  }

  // แปลง พ.ศ. → ค.ศ.
  const startYearCE = parseInt(startYear) - 543;
  const startDate = new Date(startYearCE, parseInt(startMonth) - 1, parseInt(startDay));
  const currentDate = new Date();

  if (startDate > currentDate) {
    alert("วันที่เริ่มต้นการย่อยสลายเกินกว่าวันที่ปัจจุบันไม่ได้!");
    return;
  }

  // เรียกฟังก์ชัน mock ดึงข้อมูลสภาพอากาศ (สุ่ม)
  const weatherData = await getMockWeatherData(location, startDate, currentDate);

  // คำนวณเปอร์เซ็นต์การย่อยสลาย
  const decompositionPercent = calculateDecomposition(weatherData);

  // แสดงผล
  showResult(decompositionPercent);
});

// ฟังก์ชันจำลอง ดึงข้อมูลสภาพอากาศ (mock)
async function getMockWeatherData(location, startDate, currentDate) {
  const data = [];
  const dayInMs = 24 * 60 * 60 * 1000;

  for (
    let d = new Date(startDate);
    d <= currentDate;
    d = new Date(d.getTime() + dayInMs)
  ) {
    const randomWeather = getRandomWeather();
    data.push({
      date: new Date(d),
      weather: randomWeather,
    });
  }
  return data;
}

// สุ่ม weather
function getRandomWeather() {
  const weatherOptions = ["Sunny", "Rainy", "Cloudy", "Storm", "Hot", "Cold"];
  const randIndex = Math.floor(Math.random() * weatherOptions.length);
  return weatherOptions[randIndex];
}

// คำนวณเปอร์เซ็นต์ (ตัวอย่างสมมติ)
function calculateDecomposition(weatherData) {
  let totalScore = 0;
  const weatherScores = {
    Sunny: 2,
    Hot: 3,
    Rainy: 4,
    Cloudy: 1,
    Storm: 5,
    Cold: 1,
  };

  weatherData.forEach((day) => {
    const w = day.weather;
    totalScore += weatherScores[w] || 1;
  });

  // สมมติสูตรแบบง่าย
  let decomposition = Math.floor(totalScore / 2);
  if (decomposition > 100) decomposition = 100;

  return decomposition;
}

// ฟังก์ชันแสดงผล
function showResult(decompositionPercent) {
  const resultContainer = document.getElementById("resultContainer");
  const resultPercentage = document.getElementById("resultPercentage");
  const resultMessage = document.getElementById("resultMessage");
  const tarotSection = document.getElementById("tarotSection");
  const tarotResult = document.getElementById("tarotResult");
  const resultImage = document.getElementById("resultImage"); // <img>

  // โชว์ block ของ result
  resultContainer.style.display = "block";

  // แสดงตัวเลข %
  resultPercentage.textContent = `เปอร์เซ็นต์การย่อยสลาย: ${decompositionPercent}%`;

  // เลือกข้อความตามช่วง %
  let message = "";
  if (decompositionPercent >= 1 && decompositionPercent <= 20) {
    message = "ยังไม่ค่อยจะย่อยเลย รอน้องอีกหน่อยนะ";
  } else if (decompositionPercent >= 21 && decompositionPercent <= 40) {
    message = "น้องกำลังพยายามอยู่ เกือบครึ่งทางแล้ว ไปกันต่อออ";
  } else if (decompositionPercent >= 41 && decompositionPercent <= 60) {
    message = "เกินครึ่งทางแล้ว น้องฮึบๆ";
  } else if (decompositionPercent >= 61 && decompositionPercent <= 80) {
    message = "รอหน่อยนะๆๆ น้องจะรีบย่อยให้ไวๆ";
  } else if (decompositionPercent >= 81 && decompositionPercent <= 99) {
    message = "อีกนิดเดียว จะย่อยเสร็จแล้ววว!!!";
  } else if (decompositionPercent === 100) {
    message = "น้องย่อยสำเร็จแล้ว!!! ขอบคุณที่เลือกใช้MUTELUค่ะ/ครับ";
  } else {
    // รวมถึง 0% หรือน้อยกว่า
    message = "ยังไม่เริ่มย่อยเลยนะ อาจต้องรอเวลาอีกนิด!";
  }
  resultMessage.textContent = message;

  // แสดงรูปภาพตามช่วง %
  // คุณปรับเงื่อนไขหรือไฟล์รูปได้ตามต้องการ
  let imageUrl = "";
  if (decompositionPercent >= 1 && decompositionPercent <= 20) {
    imageUrl = "images/pic1.jpg";
  } else if (decompositionPercent >= 21 && decompositionPercent <= 40) {
    imageUrl = "images/pic2.jpg";
  } else if (decompositionPercent >= 41 && decompositionPercent <= 60) {
    imageUrl = "images/pic3.jpg";
  } else if (decompositionPercent >= 61 && decompositionPercent <= 80) {
    imageUrl = "images/pic4.jpg";
  } else if (decompositionPercent >= 81 && decompositionPercent <= 99) {
    imageUrl = "images/pic5.jpg";
  } else if (decompositionPercent === 100) {
    imageUrl = "images/pic6.jpg";
  }

  if (imageUrl) {
    resultImage.style.display = "block";
    resultImage.src = imageUrl;
  } else {
    // ถ้าเปอร์เซ็นต์ยังไม่อยู่ในช่วงที่กำหนด หรือ = 0
    resultImage.style.display = "none";
    resultImage.src = "";
  }

  // ถ้า % = 100 ให้โชว์ปุ่มสุ่มไพ่
  if (decompositionPercent === 100) {
    tarotSection.style.display = "block";
    tarotResult.textContent = "";
    document.getElementById("drawTarotBtn").onclick = drawTarotCard;
  } else {
    tarotSection.style.display = "none";
  }
}

function drawTarotCard() {
 const tarotResult = document.getElementById("tarotResult");
 const tarotCardImage = document.getElementById("tarotCardImage");

 // ตัวอย่างไพ่ 5 ใบ (สามารถเพิ่มได้)
 // ใส่ path ของรูปไพ่ในฟิลด์ img
 const tarotDeck = [
   { 
     name: "The Fool", 
     meaning: "การเริ่มต้นใหม่, อิสระ, สัญชาตญาณ",
     img: "images/tarot/fool.jpg"
   },
   {
     name: "The Magician",
     meaning: "พลังสร้างสรรค์, ความตั้งใจแน่วแน่",
     img: "images/tarot/magician.jpg"
   },
   {
     name: "The High Priestess",
     meaning: "ความลึกลับ, สัญชาตญาณภายใน",
     img: "images/tarot/highpriestess.jpg"
   },
   {
     name: "The Lovers",
     meaning: "ความรัก, การเลือก, ความใกล้ชิด",
     img: "images/tarot/lovers.jpg"
   },
   {
     name: "The Chariot",
     meaning: "ชัยชนะ, ความมุ่งมั่น, ความสำเร็จ",
     img: "images/tarot/chariot.jpg"
   },
   {
    name: "The Hermit",
    meaning: "การค้นหาตัวเอง ความสันโดษ",
    img: "images/tarot/hermit.jpg"
  },
  {
    name: "The Emperor",
    meaning: "ความมั่นคง ชัยชนะ การควบคุม",
    img: "images/tarot/emperor.jpg"
  },
  {
    name: "The Empress",
    meaning: "ความอุดมสมบูรณ์ ความรัก ความอบอุ่น",
    img: "images/tarot/empress.jpg"
  },
  {
    name: "The Hierophant",
    meaning: "ประเพณี ความศรัทธา การเรียนรู้",
    img: "images/tarot/hierophant.jpg"
  },
  {
    name: "The Hanged Man",
    meaning: "การหยุดชั่วคราว การเปลี่ยนมุมมอง การเสียสละ",
    img: "images/tarot/hangedman.jpg"
  },
  {
    name: "The Devil",
    meaning: "การยึดติด การล่อลวง ความหลงไหล",
    img: "images/tarot/devil.jpg"
  },
  {
    name: "The Tower",
    meaning: "การค้นหาตัวเอง ความสันโดษ",
    img: "images/tarot/tower.jpg"
  },
  {
    name: "The Star",
    meaning: "ความหวัง การรักษา ความศรัทธา",
    img: "images/tarot/star.jpg"
  },
  {
    name: "The World",
    meaning: "ความสำเร็จ การบรรลุเป้าหมาย วัฏจักรที่สมบูรณ์",
    img: "images/tarot/world.jpg"
  },
  {
    name: "The Moon",
    meaning: "ความไม่แน่นอน ความกลัว จินตนาการ",
    img: "images/tarot/moon.jpg"
  },
  {
    name: "The Sun",
    meaning: "ความสุข ความสำเร็จ การเติบโต",
    img: "images/tarot/sun.jpg"
  },
  {
    name: "Strength",
    meaning: "ความกล้าหาญ ความอดทน การควบคุมตัวเอง",
    img: "images/tarot/strength.jpg"
  },
  {
    name: "Wheel of Fortune",
    meaning: "โชคชะตา การเปลี่ยนแปลง วัฏจักรชีวิต",
    img: "images/tarot/wheeloffortune.jpg"
  },
  {
    name: "Justice",
    meaning: "ความยุติธรรม การตัดสินใจ ความสมดุล",
    img: "images/tarot/justice.jpg"
  },
  {
    name: "Judgement",
    meaning: "การปลุกชีวิตใหม่ การตื่นรู้ การตัดสินใจ",
    img: "images/tarot/judgement.jpg"
  },
  {
    name: "Temperance",
    meaning: "ความสมดุล การกลมกลืน การพอประมาณ",
    img: "images/tarot/temperance.jpg"
  },
  {
    name: "Death",
    meaning: "การสิ้นสุด การเปลี่ยนแปลง การเริ่มต้นใหม่",
    img: "images/tarot/death.jpg"
  },
  
 ];

 // สุ่มไพ่ 1 ใบ
 const randomIndex = Math.floor(Math.random() * tarotDeck.length);
 const card = tarotDeck[randomIndex];

 // แสดงชื่อไพ่ + ความหมาย
 tarotResult.textContent = `ไพ่ที่ได้: ${card.name} → ${card.meaning}`;

 // แสดงรูปไพ่
 tarotCardImage.src = card.img;
 tarotCardImage.style.display = "block";
}