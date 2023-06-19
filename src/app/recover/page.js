"use client"

import React from "react"
import { BulbOutlined, LoadingOutlined } from "@ant-design/icons"
import { Button, Input } from "antd"
// import { useNavigate } from "react-router-dom"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Wallet } from "ethers"
import PageHeader from "@/components/PageHeader"
import { useWalletContext } from "../Context"

const { TextArea } = Input

function RecoverAccount() {
  const { setSeedPhrase, setWallet } = useWalletContext()
  // const navigate = useNavigate()
  const router = useRouter()
  const [typedSeed, setTypedSeed] = useState("")
  const [nonValid, setNonValid] = useState(false)
  const [loading, setLoading] = useState(false)

  function seedAdjust(e) {
    setNonValid(false)
    setTypedSeed(e.target.value)
  }

  function recoverWallet() {
    setLoading(true)
    let recoveredWallet
    try {
      recoveredWallet = Wallet.fromMnemonic(typedSeed)
    } catch (err) {
      setNonValid(true)
      return
    }

    setSeedPhrase(typedSeed)
    setWallet(recoveredWallet.address)
    localStorage.setItem("seedPhrase", JSON.stringify(typedSeed))
    localStorage.setItem("wallet", Wallet.fromMnemonic(typedSeed).address)
    setLoading(false)
    router.push("/socialSignIn")
    return
  }

  return (
    <div className='App'>
      <PageHeader />
      <div className='content'>
        <div className='mnemonic'>
          <BulbOutlined style={{ fontSize: "20px" }} />
          <div>
            Type your seed phrase in the field below to recover your wallet (it
            should include 12 words seperated with spaces)
          </div>
        </div>

        <TextArea
          value={typedSeed}
          onChange={seedAdjust}
          rows={4}
          className='seedPhraseContainer'
          placeholder='Type your seed phrase here...'
          style={{ margin: "15px 0px 0px 0px" }}
        />

        <Button
          disabled={
            typedSeed.split(" ").length !== 12 || typedSeed.slice(-1) === " "
          }
          className='frontPageButton'
          type='primary'
          onClick={() => recoverWallet()}
          style={{ backgroundColor: "#1A0329", color: "white" }}
        >
          Recover Wallet
          {loading && <LoadingOutlined style={{ color: "white" }} />}
        </Button>
        {nonValid && <p style={{ color: "red" }}> Invalid Seed Phrase</p>}
        <p className='frontPageBottom' onClick={() => router.back()}>
          <span>Back Home</span>
        </p>
      </div>
    </div>
  )
}

export default RecoverAccount
