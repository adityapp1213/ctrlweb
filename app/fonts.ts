import localFont from "next/font/local";

export const monaSans = localFont({
  src: "../public/fonts/Mona_Sans/Mona_Sans/MonaSans-VariableFont_wdth,wght.ttf",
  display: "swap",
  variable: "--font-mona-sans",
});

export const instrumentSerif = localFont({
  src: [
    {
      path: "../public/fonts/Instrument_Serif/InstrumentSerif-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/Instrument_Serif/InstrumentSerif-Italic.ttf",
      weight: "400",
      style: "italic",
    },
  ],
  display: "swap",
  variable: "--font-instrument-serif",
});

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
