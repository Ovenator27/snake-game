import { useEffect, useRef, useState } from "react";

const GamePieces = ({ score, setScore, onGameOver }) => {
  const canvasRef = useRef();
  const SNAKE_SPEED = 20;
  const [apple, setApple] = useState({ x: 180, y: 100 });
  const [snake, setSnake] = useState([
    { x: 100, y: 60 },
    { x: 80, y: 60 },
  ]);
  const [direction, setDirection] = useState(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const drawSnake = () => {
      snake.forEach((snakePart) => {
        ctx.beginPath();
        ctx.rect(snakePart.x, snakePart.y, 20, 20);
        ctx.fillStyle = "#90EE90";
        ctx.fill();
        ctx.closePath();
      });
    };

    const drawApple = () => {
      ctx.beginPath();
      ctx.rect(apple.x, apple.y, 20, 20);
      ctx.fillStyle = "#FF0000";
      ctx.fill();
      ctx.closePath();
    };

    const moveSnake = () => {
      if (direction) {
        setSnake((prevSnake) => {
          const newSnake = [...prevSnake];
          const snakeHead = { x: newSnake[0].x, y: newSnake[0].y };

          for (let i = newSnake.length - 1; i > 0; i--) {
            newSnake[i].x = newSnake[i - 1].x;
            newSnake[i].y = newSnake[i - 1].y;
          }

          switch (direction) {
            case "right":
              snakeHead.x += SNAKE_SPEED;
              break;

            case "left":
              snakeHead.x -= SNAKE_SPEED;
              break;

            case "down":
              snakeHead.y += SNAKE_SPEED;
              break;

            case "up":
              snakeHead.y -= SNAKE_SPEED;
              break;

            default:
              break;
          }

          newSnake[0] = snakeHead;
          handleAppleCollision(newSnake);
          handleWallCollision(snakeHead);

          return newSnake;
        });
      }
    };

    const handleWallCollision = (snakeHead) => {
      if (snakeHead.x > canvas.width || snakeHead.x + SNAKE_SPEED < 0) {
        onGameOver("wall");
      }
      if (snakeHead.y > canvas.height || snakeHead.y + SNAKE_SPEED < 0) {
        onGameOver("wall");
      }
    };

    const handleAppleCollision = (newSnake) => {
      const snakeHead = newSnake[0];

      if (snakeHead.x === apple.x && snakeHead.y === apple.y) {
        setScore(() => {
          const newScore = score + 1;
          return newScore;
        });

        setApple({
          x:
            Math.floor((Math.random() * canvas.width) / SNAKE_SPEED) *
            SNAKE_SPEED,
          y:
            Math.floor((Math.random() * canvas.height) / SNAKE_SPEED) *
            SNAKE_SPEED,
        });
        
        console.log(newSnake[newSnake.length-1]);
        newSnake.push({
          x: newSnake[newSnake.length - 1],
          y: newSnake[newSnake.length - 1],
        });
      }
    };

    const handleKeyPress = (e) => {
      switch (e.key) {
        case "ArrowRight":
          setDirection("right");
          break;

        case "ArrowLeft":
          setDirection("left");
          break;

        case "ArrowDown":
          setDirection("down");
          break;

        case "ArrowUp":
          setDirection("up");
          break;

        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyPress);

    const interval = setInterval(() => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawSnake();
      drawApple();
      moveSnake();
    }, 100);

    return () => {
      clearInterval(interval);
    };
  }, [snake, direction]);

  return (
    <div>
      <canvas className="gameCanvas" ref={canvasRef} width={600} height={600} />
    </div>
  );
};

export default GamePieces;
