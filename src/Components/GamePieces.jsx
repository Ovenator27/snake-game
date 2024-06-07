import { useEffect, useRef, useState } from "react";

const GamePieces = ({ score, setScore, onGameOver }) => {
  const canvasRef = useRef();
  const SNAKE_SPEED = 20;
  const columns = 600;
  const rows = 600;
  const [apple, setApple] = useState({
    x: Math.floor((Math.random() * columns) / SNAKE_SPEED) * SNAKE_SPEED + 10,
    y: Math.floor((Math.random() * rows) / SNAKE_SPEED) * SNAKE_SPEED + 10,
  });
  const [snake, setSnake] = useState([
    { x: 150, y: 70 },
    { x: 130, y: 70 },
    { x: 110, y: 70 },
  ]);
  const [direction, setDirection] = useState(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const drawSnake = () => {
      snake.forEach((snakePart, index) => {
        ctx.beginPath();
        ctx.arc(snakePart.x, snakePart.y, 10, 0, 2 * Math.PI);
        if (index === 0) {
          ctx.fillStyle = "#004000";
        } else {
          ctx.fillStyle = "#008000";
        }
        ctx.fill();
        ctx.closePath();
      });
    };

    const drawApple = () => {
      ctx.beginPath();
      ctx.arc(apple.x, apple.y, 10, 0, 2 * Math.PI);
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
            newSnake[i] = newSnake[i - 1];
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
          handleBodyCollision(newSnake);
          return newSnake;
        });
      }
    };
    const handleKeyPress = (e) => {
      setDirection((prevDirection) => {
        if (
          (e.key === "ArrowRight" || e.key === "d") &&
          prevDirection !== "left"
        ) {
          return "right";
        } else if (
          (e.key === "ArrowLeft" || e.key === "a") &&
          prevDirection !== "right"
        ) {
          return "left";
        } else if (
          (e.key === "ArrowUp" || e.key === "w") &&
          prevDirection !== "down"
        ) {
          return "up";
        } else if (
          (e.key === "ArrowDown" || e.key === "s") &&
          prevDirection !== "up"
        ) {
          return "down";
        } else {
          return prevDirection;
        }
      });
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
            Math.floor((Math.random() * columns) / SNAKE_SPEED) * SNAKE_SPEED +
            10,
          y:
            Math.floor((Math.random() * rows) / SNAKE_SPEED) * SNAKE_SPEED + 10,
        });
        newSnake.push({
          x: newSnake[newSnake.length - 1],
          y: newSnake[newSnake.length - 1],
        });
      }
    };

    const handleBodyCollision = (newSnake) => {
      const snakeHead = newSnake[0];
      for (let i = 1; i < newSnake.length; i++) {
        if (snakeHead.x === newSnake[i].x && snakeHead.y === newSnake[i].y) {
          onGameOver("body");
        }
      }
    };
    const handleWallCollision = (snakeHead) => {
      if (
        snakeHead.x > canvas.width ||
        snakeHead.x < 0 ||
        snakeHead.y > canvas.height ||
        snakeHead.y < 0
      ) {
        onGameOver("wall");
      }
    };

    window.addEventListener("keydown", handleKeyPress);

    const interval = setInterval(() => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawSnake();
      drawApple();
      moveSnake();
    }, 75);

    return () => {
      clearInterval(interval);
    };
  }, [snake, direction, apple.x, apple.y, onGameOver, score, setScore]);

  return (
    <div>
      <canvas
        className="gameCanvas"
        ref={canvasRef}
        width={columns}
        height={rows}
      />
    </div>
  );
};

export default GamePieces;
