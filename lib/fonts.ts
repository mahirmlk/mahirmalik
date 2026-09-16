import { Inter, JetBrains_Mono, Sora, Playfair_Display, Montserrat, Space_Grotesk, Gochi_Hand, VT323, Schoolbell } from "next/font/google";

export const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
  variable: "--font-mono",
  display: "swap",
});

export const sora = Sora({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-heading",
  display: "swap",
});

export const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["800", "900"],
  variable: "--font-display",
  display: "swap",
});

export const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-section",
  display: "swap",
});

export const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

export const gochiHand = Gochi_Hand({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-hand",
  display: "swap",
});

export const pixelMono = VT323({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-pixel",
  display: "swap",
});

export const schoolbell = Schoolbell({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-schoolbell",
  display: "swap",
});
