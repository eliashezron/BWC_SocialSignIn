"use client"
import { createContext, useContext, useState } from "react"

const Context = createContext({
  seedPhrase: "",
  setSeedPhrase: () => {},
  wallet: "",
  setWallet: () => {},
  selectedChain: "44787",
  setSelectedChain: () => {},
  contact: "",
  setContact: () => {},
})

export function WalletProvider({ children }) {
  const [seedPhrase, setSeedPhrase] = useState("")
  const [wallet, setWallet] = useState("")
  const [selectedChain, setSelectedChain] = useState("44787")
  const [contact, setContact] = useState()
  return (
    <Context.Provider
      value={{
        seedPhrase,
        setSeedPhrase,
        wallet,
        setWallet,
        selectedChain,
        setSelectedChain,
        contact,
        setContact,
      }}
    >
      {children}
    </Context.Provider>
  )
}

export function useWalletContext() {
  return useContext(Context)
}
