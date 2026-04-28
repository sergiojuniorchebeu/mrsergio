import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
function cn(...inputs) {
  return twMerge(clsx(inputs));
}
const easings = {
  // Doux et naturel — usage général, hero animations
  smooth: [0.23, 1, 0.32, 1]
};
export {
  cn as c,
  easings as e
};
