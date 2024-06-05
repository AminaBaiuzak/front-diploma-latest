import type { Metadata } from "next";
import { Outfit, Montserrat} from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Sidebar from "@/components/Sidebar";
import Provider from "@/components/Provider";
import { Bounce, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {Head} from "next/document";

const montserrat = Montserrat({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-montserrat",
});

const outfit = Outfit({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "Duken",
  description: "Duken is a platform for managing your business operations.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Provider>
        <body className={`${montserrat.variable} ${outfit.variable} flex flex-col min-h-screen`}>
          <Header />
          <section className="flex-1 flex flex-col relative">

            <Sidebar />
            <main className="flex flex-1">{children}</main>
            <ToastContainer
              position="top-center"
              autoClose={2000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="light"
              transition={Bounce}
            />
          </section>
          <Footer />
        </body>
      </Provider>
    </html>
  );
}
