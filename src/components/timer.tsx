import { useEffect, useState } from "react";

interface CountdownTimerProps {
  targetDateTime: Date; // The target date and time for the countdown
}

export default function CountdownTimer({
  targetDateTime,
}: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<string>("");

  useEffect(() => {
    const updateTimer = () => {
      const now = new Date().getTime();
      const targetTime = targetDateTime.getTime();
      const distance = targetTime - now;

      if (distance < 0) {
        setTimeLeft("00:00:00");
        return;
      }

      const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
      );
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft(
        `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`,
      );
    };

    updateTimer(); // Initial call to set time immediately

    const interval = setInterval(updateTimer, 1000); // Update every second

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, [targetDateTime]);

  return (
    <span>
      {timeLeft === "00:00:00" ? "Event will start shortly" : `${timeLeft}`}
    </span>
  );
}
