const canvas = document.getElementById("gravityCanvas");
const ctx = canvas.getContext("2d");
canvas.height = window.innerHeight;

window.addEventListener('resize', () => {
    canvas.height = window.innerHeight;
  });

const balls = [];
const catcher = {
  x: canvas.width / 2 - 50,
  y: canvas.height - 20,
  width: 100,
  height: 30,
  color: "green",
  lives: 3, // Tambah properti untuk nyawa
  healthyFoodCount: 0 // Tambah properti untuk menghitung makanan sehat yang diambil
};

const numOfBalls = 1; // Jumlah bola yang ingin dibuat

function generateBalls() {
    let sehat = ['s1', 's2', 's3'];
    let tidak = ['g1', 'g2', 'g3'];
    let rands = Math.floor(Math.random() * sehat.length);
    let randt = Math.floor(Math.random() * tidak.length);
    for (let i = 0; i < numOfBalls; i++) {
      const isHealthy = Math.random() < 0.5;
      const ballImage = new Image();
      ballImage.src = isHealthy ? `game-3/${sehat[rands]}.png` : `game-3/${tidak[randt]}.png`;
      let color = isHealthy ? "yellow" : "red";
      const radius = 10 + Math.random() * 20;
      balls.push({
        x: Math.random() * canvas.width,
        y: -radius, // Mengatur posisi y di atas layar
        radius: radius,
        color: color,
        image: ballImage,
        velocityY: 1 + Math.random() * 3,
        gravity: 0.0001 + Math.random() * 0.2,
        isCaught: false,
        isHealthy: isHealthy,
      });
    }
  }

  
  setInterval(generateBalls, 1000);

  function drawCatcher() {
    const catcherImage = document.getElementById('catcherImage');
    ctx.drawImage(catcherImage, catcher.x, catcher.y, catcher.width, catcher.height);
  }
  

function moveCatcherLeft() {
  catcher.x -= 10; // Mengurangi posisi x objek penangkap
  if (catcher.x < 0) {
    catcher.x = 0; // Mencegah objek penangkap keluar dari batas kiri canvas
  }
}

function moveCatcherRight() {
  catcher.x += 10; // Menambah posisi x objek penangkap
  if (catcher.x + catcher.width > canvas.width) {
    catcher.x = canvas.width - catcher.width; // Mencegah objek penangkap keluar dari batas kanan canvas
  }
}

document.addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft") {
    moveCatcherLeft(); // Jika tombol kiri ditekan, geser objek penangkap ke kiri
  } else if (event.key === "ArrowRight") {
    moveCatcherRight(); // Jika tombol kanan ditekan, geser objek penangkap ke kanan
  }
});

let touchStartX = null;

canvas.addEventListener('touchstart', (event) => {
  touchStartX = event.touches[0].clientX;
});

canvas.addEventListener('touchmove', (event) => {
  if (touchStartX !== null) {
    const touchX = event.touches[0].clientX;
    const diffX = touchX - touchStartX;

    if (diffX > 0) {
      moveCatcherRight(); // Geser ke kanan jika pergerakan ke kanan terdeteksi
    } else if (diffX < 0) {
      moveCatcherLeft(); // Geser ke kiri jika pergerakan ke kiri terdeteksi
    }

    touchStartX = touchX;
  }
});

canvas.addEventListener('touchend', () => {
  touchStartX = null;
});

function drawBall(ball) {
  ctx.drawImage(ball.image, ball.x - ball.radius, ball.y - ball.radius, ball.radius * 2, ball.radius * 2);
}

function applyGravity(ball) {
    if (!ball.isCaught) {
      if (ball.y + ball.radius < canvas.height) {
        const maxVelocityY = 5; // Batas maksimum kecepatan Y yang diizinkan
        ball.velocityY = Math.min(ball.velocityY + ball.gravity, maxVelocityY);
        ball.y += ball.velocityY;
      }
    } else {
      // Jika bola sudah tertangkap, posisikan di atas objek penangkap
      ball.x = catcher.x + catcher.width / 2;
      ball.y = catcher.y - ball.radius;
    }
  }
  

function removeUncaughtBalls() {
    for (let i = 0; i < balls.length; i++) {
      if (!balls[i].isCaught && balls[i].y + balls[i].radius > canvas.height) {
        balls.splice(i, 1);
        i--;
      }
    }
  }

function checkCollision(ball) {
    if (
      ball.x > catcher.x &&
      ball.x < catcher.x + catcher.width &&
      ball.y + ball.radius > catcher.y &&
      ball.y - ball.radius < catcher.y + catcher.height
    ) {
      if (ball.isHealthy) {
        catcher.healthyFoodCount++; // Tambah skor makanan sehat jika bola yang bisa dimakan diambil
        if (catcher.healthyFoodCount == 10) {
          alert('Game Finish'); // Tambahkan logika jika nyawa habis
          // Lakukan sesuatu, misalnya restart permainan
          // Di sini kamu bisa tambahkan logika untuk mengulang permainan
        }
      } else {
        catcher.lives--; // Kurangi nyawa jika bola yang tidak bisa dimakan diambil
        if (catcher.lives <= 0) {
          alert('Game Over'); // Tambahkan logika jika nyawa habis
          // Lakukan sesuatu, misalnya restart permainan
          // Di sini kamu bisa tambahkan logika untuk mengulang permainan
        }
      }
      ball.isCaught = true;
    }
  }

function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function updateCountDisplay() {
    document.getElementById('healthyCount').innerText = catcher.healthyFoodCount;
    document.getElementById('livesCount').innerText = catcher.lives;
  }

  function restartGame() {
    catcher.lives = 3;
    catcher.healthyFoodCount = 0;
    balls.length = 0; // Mengosongkan array bola
    generateBalls(); // Membuat bola baru setelah mereset permainan
  }

  document.getElementById('restartButton').addEventListener('click', restartGame);

  function draw() {
    clearCanvas();
    drawCatcher();
    balls.forEach((ball) => {
      drawBall(ball);
      applyGravity(ball);
      checkCollision(ball);
    });
    removeUncaughtBalls();
    updateCountDisplay(); // Perbarui tampilan count setiap kali terjadi perubahan
    requestAnimationFrame(draw);
  }

draw();
