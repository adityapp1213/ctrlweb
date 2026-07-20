import localFont from "next/font/local";

export const palatino = localFont({
  src: "../public/fonts/Palatino/palr45w.ttf",
  display: "swap",
  variable: "--font-palatino",
});

export const shadowsIntoLight = localFont({
  src: "../public/fonts/ShadowsIntoLight/shadows-into-light-v22.ttf",
  display: "swap",
  weight: "400",
  style: "normal",
  variable: "--font-shadows-into-light",
});
