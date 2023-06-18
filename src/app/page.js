"use client"
// import "./App.css"
import Image from "next/image"
import { useState, useEffect } from "react"
import { celo } from "@/assets"
import { Select } from "antd"
// import { Routes, Route, Navigate } from "react-router-dom"
import Home from "@/components/Home"
import CreateAccount from "@/app/create/page"
import RecoverAccount from "@/app/recover/page"
import WalletView from "@/app/yourwallet/page"
import Transfer from "@/app/transfer/page"
import Receive from "@/app/receive/page"
import EnterCode from "@/app/otp/page"
import { Toaster } from "react-hot-toast"
import SignInWithMasa from "@/app/signInWithMasa/page"
import SocialSignIn from "@/app/socialSignIn/page"
import { useSession } from "next-auth/react"
import LinkToWallet from "./link/page"
import PageHeader from "@/components/PageHeader"
// import { useRouter } from "next/router"
function Page() {
  const [wallet, setWallet] = useState(null)
  const [seedPhrase, setSeedPhrase] = useState(null)
  const [selectedChain, setSelectedChain] = useState("44787")
  const [contact, setContact] = useState(null)
  // const { data: session } = useSession()
  const [user, setUser] = useState(null)
  // const { query } = useRouter()

  // useEffect(() => {
  //   if (session?.user) {
  //     setUser(session.user)
  //     // const { wallet, seedPhrase, selectedChain } = query
  //   }
  // }, [session])
  return (
    <div className='App'>
      <PageHeader />
      <Home />
    </div>
  )
}

export default Page
