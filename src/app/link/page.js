"use client"
import { Button } from "antd"
import React, { useEffect } from "react"
import { useRouter } from "next/navigation"
import { ExclamationCircleOutlined } from "@ant-design/icons"
import PageHeader from "@/components/PageHeader"
import { useWalletContext } from "../Context"

function LinkToWallet() {
  const { seedPhrase, wallet } = useWalletContext()

  const router = useRouter()
  useEffect(() => {
    console.log("items from link page.")
    console.log("wallet", wallet, "seedphrase", seedPhrase)
  }, [])

  return (
    <div className='App'>
      <PageHeader />
      <div className='content'>
        <div
          className='mnemonic'
          style={{ marginBottom: "30px", marginTop: "10px" }}
        >
          <ExclamationCircleOutlined style={{ fontSize: "20px" }} />
          <div>
            Link your wallet so as to be able to transfer and recieve funds
            using your twitter handle.
          </div>
        </div>
        <Button
          className='frontPageButton'
          style={{ backgroundColor: "#1A0329", color: "white" }}
          onClick={() => router.push("/yourwallet")}
        >
          page
        </Button>
      </div>
    </div>
  )
}

export default LinkToWallet
