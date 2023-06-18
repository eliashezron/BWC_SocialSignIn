"use client"
import React from "react"
import { Button, Card } from "antd"
import { ExclamationCircleOutlined } from "@ant-design/icons"
// import { useNavigate } from "react-router-dom"
import { useState } from "react"
import { ethers, Wallet } from "ethers"
import { useRouter } from "next/navigation"
import Header from "../../components/PageHeader"
import { useWalletContext } from "../Context"
// import { useCookies } from 'react-cookie';
function CreateAccount() {
  const { seedPhrase, setSeedPhrase, setWallet } = useWalletContext()
  // const [cookies, setCookie, removeCookie] = useCookies(['user']);

  // const navigate = useNavigate()
  const router = useRouter()

  function generateWallet() {
    const mnemonic = ethers.Wallet.createRandom().mnemonic.phrase
    setSeedPhrase(mnemonic)
  }

  function setWalletAndMnemonic() {
    setSeedPhrase(seedPhrase)
    setWallet(Wallet.fromMnemonic(seedPhrase).address)
    localStorage.setItem("seedPhrase", JSON.stringify(seedPhrase))
    localStorage.setItem("wallet", Wallet.fromMnemonic(seedPhrase).address)

    router.push("/socialSignIn")
  }

  return (
    <div className='App'>
      <Header />
      <div className='content'>
        <div className='mnemonic'>
          <ExclamationCircleOutlined style={{ fontSize: "20px" }} />
          <div>
            Once you generate the seed phrase, save it securely in order to
            recover your wallet in the future.
          </div>
        </div>
        <Button
          className='frontPageButton'
          type='primary'
          onClick={() => generateWallet()}
          style={{ backgroundColor: "#1A0329", color: "white" }}
        >
          Generate Seed Phrase
        </Button>
        <Card className='seedPhraseContainer'>
          {seedPhrase && (
            <pre style={{ whiteSpace: "pre-wrap" }}>{seedPhrase}</pre>
          )}
        </Card>
        <Button
          className='frontPageButton'
          type='default'
          disabled={!seedPhrase}
          onClick={() => setWalletAndMnemonic()}
        >
          Open Your New Wallet
        </Button>
        <p className='frontPageBottom' onClick={() => router.back()}>
          Back Home
        </p>
      </div>
    </div>
  )
}

export default CreateAccount
