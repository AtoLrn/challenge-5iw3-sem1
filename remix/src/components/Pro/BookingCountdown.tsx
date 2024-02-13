import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const BookingCountdown: React.FC<{ time: string }> = ({ time }) => {
  const [countdown, setCountdown] = useState('');
  const { t } = useTranslation();

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date().getTime();
      const distance = new Date(time).getTime() - now;
      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      if (distance < 0) {
        setCountdown(t("bookingCountdown.expired"));
      } else if (days >= 1) {
        setCountdown(t("bookingCountdown.days", { count: days }));
      } else if (hours >= 1) {
        setCountdown(t("bookingCountdown.hoursMinutes", { hours, minutes }));
      } else {
        setCountdown(t("bookingCountdown.minutesSeconds", { minutes, seconds }));
      }
    };

    const interval = setInterval(updateCountdown, 1000);
    updateCountdown();

    return () => clearInterval(interval);
  }, [time, t]);

  return <span>{countdown}</span>;
};

export default BookingCountdown;
