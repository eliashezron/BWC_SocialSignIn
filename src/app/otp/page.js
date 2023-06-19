"use client"

import React, { useEffect } from "react"
import {
  BulbOutlined,
  LeftCircleOutlined,
  ExclamationCircleOutlined,
  LoadingOutlined,
} from "@ant-design/icons"
import { Button, Input, Divider } from "antd"
// import { useNavigate } from "react-router-dom"
import { useState } from "react"
import { ethers, Wallet } from "ethers"
import { CHAINS_CONFIG } from "../../components/chains"
import { Masa } from "@masa-finance/masa-sdk"
import { toast, Toast } from "react-hot-toast"
import { useRouter } from "next/navigation"
import PageHeader from "@/components/PageHeader"
import { useWalletContext } from "../Context"
const { TextArea } = Input

function EnterCode() {
  const { selectedChain } = useWalletContext()
  const chain = CHAINS_CONFIG[selectedChain]
  const [seedPhrase, setSeedPhrase] = useState("")
  const [contact, setContact] = useState("")
  const [loading, setLoading] = useState(false)

  // const navigate = useNavigate()
  const router = useRouter()
  const [otp, setOtp] = useState("000000")
  useEffect(() => {
    let seedPhrase = localStorage.getItem("seedPhrase")
    let contact = localStorage.getItem("contact")
    // console.log("this is JSON.Parse", JSON.parse(seedPhrase))
    // console.log("this is seed phrase", seedPhrase)
    setSeedPhrase(JSON.parse(seedPhrase))
    setContact(contact)
  }, [])

  async function sendotp() {
    setLoading(true)
    const provider = new ethers.providers.JsonRpcProvider(chain.rpcUrl)
    console.log(chain.rpcUrl)
    console.log(provider)

    const privateKey = Wallet.fromMnemonic(seedPhrase).privateKey

    console.log(privateKey)

    const signer = new ethers.Wallet(privateKey, provider)

    console.log("this is signer", signer)
    console.log("this is signer chain name", chain.name)

    const masa = new Masa({
      signer,
      networkName: chain.name,
    })
    try {
      console.log("parameters", contact, "otp", otp)
      const verifyGreenResult = await masa.green.verify(contact, otp)

      console.log(verifyGreenResult)

      if (verifyGreenResult.success) {
        setLoading(false)
        toast.success("OTP verified successfully!")
        // console.log(`Minting Green on '${masa.config.networkName}'`)

        // const mintGreenResult = await masa.green.mint(
        //   "cUSD",
        //   verifyGreenResult.authorityAddress,
        //   verifyGreenResult.signatureDate,
        //   verifyGreenResult.signature
        // )
        // console.log(mintGreenResult)

        // if (mintGreenResult && mintGreenResult.tokenId) {
        //   console.log(
        //     `Green successfully minted on '${masa.config.networkName}' with token ID: '${mintGreenResult.tokenId}'`
        //   )
        //   toast.success("MASA Green successfully minted!")
        // }
        router.push("/yourwallet")
        // navigate("/yourWallet")
      }
    } catch (error) {
      setLoading(false)
      console.log(error.message)
      toast.error(error.message)
    }
  }

  return (
    <div className='App'>
      <PageHeader />
      <div className='content'>
        <div style={{ display: "flex", justifyContent: "space-evenly" }}>
          <Button
            onClick={() => router.push("/signInWithMasa")}
            style={{ marginRight: "60px" }}
          >
            <LeftCircleOutlined />
            Back
          </Button>
          <div>
            <span
              style={{
                color: "black",
                fontWeight: "700",
                fontSize: "1.5em",
                marginRight: "20px",
              }}
            >
              Enter OTP
            </span>
          </div>
        </div>
        <Divider />
        <div
          className='mnemonic'
          style={{ marginBottom: "30px", marginTop: "10px" }}
        >
          <ExclamationCircleOutlined style={{ fontSize: "20px" }} />
          <div>
            Enter the OTP sent to your {contact} number to access your wallet.
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Input
            style={{ width: "70%" }}
            placeholder='000000'
            maxLength={6}
            onChange={(e) => setOtp(e.target.value)}
          />
        </div>
        <Button
          className='frontPageButton'
          type='primary'
          disabled={otp < 6}
          onClick={sendotp}
          style={{ backgroundColor: "#1A0329", color: "white" }}
        >
          Access your Wallet
          {loading && <LoadingOutlined style={{ color: "white" }} />}
        </Button>
      </div>
    </div>
  )
}

export default EnterCode
