import { useEffect, useRef, useState } from "react";
import socket from "../utils/socket";

// a custom hook to handle all drawing related functions on canvas
export const useDraw = (roomId) => {
  const canvasRef = useRef(null);
  const [context, setContext] = useState(null);
  const [isDrawing, setIsDrawing] = useState(false);

  const setColor = (value) => {
    context.strokeStyle = value;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    setContext(ctx);

    socket.on("image", (data) => {
      const image = new Image();
      image.src = data;
      image.addEventListener("load", () => {
        context?.drawImage(image, 0, 0, canvas.width, canvas.height);
      });
    });

    const startDrawing = (e) => {
      const { offsetX, offsetY } = e;
      setIsDrawing(true);
      context?.beginPath();
      context?.moveTo(offsetX, offsetY);
    };

    const draw = (e) => {
      if (!isDrawing) return;
      const { offsetX, offsetY } = e;
      context.lineWidth = 5;
      context.lineCap = "round";
      context.lineTo(offsetX, offsetY);
      context.stroke();
      const canvasImage = canvas.toDataURL();
      socket.emit("canvas:image", { roomId, data: canvasImage });
    };

    const stopDrawing = () => {
      context?.closePath();
      setIsDrawing(false);
    };

    canvas.addEventListener("mousedown", startDrawing);
    canvas.addEventListener("mousemove", draw);
    canvas.addEventListener("mouseup", stopDrawing);
    canvas.addEventListener("mouseleave", stopDrawing);

    return () => {
      canvas.removeEventListener("mousedown", startDrawing);
      canvas.removeEventListener("mousemove", draw);
      canvas.removeEventListener("mouseup", stopDrawing);
      canvas.removeEventListener("mouseleave", stopDrawing);
    };
  }, [isDrawing, context]);

  return { canvasRef, setColor };
};
