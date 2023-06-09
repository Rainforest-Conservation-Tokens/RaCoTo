import "@/styles/globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import type { AppProps } from "next/app";
import {
  RainbowKitProvider,
  getDefaultWallets,
  connectorsForWallets,
} from "@rainbow-me/rainbowkit";
import { Toaster } from "react-hot-toast";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { mainnet, polygon, polygonMumbai } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";
import React from "react";
import { MutatingDots } from "react-loader-spinner";

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [mainnet, polygon, polygonMumbai],
  [publicProvider()]
);

const projectId = "YOUR_PROJECT_ID";

const { wallets } = getDefaultWallets({
  appName: "Racoto",
  projectId,
  chains,
});

const demoAppInfo = {
  appName: "Racoto",
};

const connectors = connectorsForWallets([...wallets]);

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient,
});

export default function App({ Component, pageProps }: AppProps) {
  const [ready, setReady] = React.useState(false);
  React.useEffect(() => {
    setReady(true);
  }, []);
  return (
    <div>
      {ready ? (
        <WagmiConfig config={wagmiConfig}>
          <RainbowKitProvider
            appInfo={demoAppInfo}
            chains={chains}
            modalSize="compact"
          >
            <Toaster position="top-center" reverseOrder={false} />
            <Component {...pageProps} />
          </RainbowKitProvider>
        </WagmiConfig>
      ) : (
        <div className="flex h-screen w-screen justify-center items-center">
          <MutatingDots
            height="100"
            width="100"
            color="#48bb78"
            secondaryColor="#48bb78"
            radius="12.5"
            ariaLabel="mutating-dots-loading"
            wrapperStyle={{}}
            wrapperClass=""
            visible={true}
          />
        </div>
      )}
    </div>
  );
}
