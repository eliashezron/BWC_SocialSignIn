"use client"
import "./globals.css"
// import { Inter } from "next/font/google"
import { WalletProvider } from "../app/Context"
import { SessionProvider } from "next-auth/react"
import { CookiesProvider } from "react-cookie"
// const inter = Inter({ subsets: ["latin"] })

// export const metadata = {
//   title: "Create Next App",
//   description: "Generated by create next app",
// }

export default function RootLayout({ children }) {
  return (
    <CookiesProvider>
      <WalletProvider>
        <SessionProvider>
          <html lang='en'>
            <body>{children}</body>
          </html>
        </SessionProvider>
      </WalletProvider>
    </CookiesProvider>
  )
}
