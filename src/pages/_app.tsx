import type { AppProps } from "next/app";
import { Lora, Roboto } from "next/font/google";
import "../styles.css";

const roboto = Roboto({ subsets: ["latin"], weight: ["400", "500"] });
const lora = Lora({ subsets: ["latin"], weight: ["500"], style: ["italic"] });

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      {/* On :root, so the language menu, which renders outside the page,
          gets the fonts too. */}
      <style jsx global>{`
        :root {
          --font-roboto: ${roboto.style.fontFamily};
          --font-lora: ${lora.style.fontFamily};
        }
      `}</style>
      <Component {...pageProps} />
    </>
  );
}
