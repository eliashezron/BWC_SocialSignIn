"use client"
import React, { useEffect } from "react"
import {
  BulbOutlined,
  LeftCircleOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons"
import { Button, Input, Divider } from "antd"
// import { useNavigate } from "react-router-dom"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { ethers, Wallet } from "ethers"
import { CHAINS_CONFIG } from "../../components/chains"
import { Masa } from "@masa-finance/masa-sdk"
import { toast, Toast } from "react-hot-toast"
import PageHeader from "@/components/PageHeader"
import { useWalletContext } from "../Context"

function SignInWithMasa() {
  const [phoneNumber, setPhoneNumber] = useState("")
  const { selectedChain } = useWalletContext()
  const [seedPhrase, setSeedPhrase] = useState("")
  // const navigate = useNavigate()
  const router = useRouter()
  const chain = CHAINS_CONFIG[selectedChain]
  useEffect(() => {
    let seedPhrase = localStorage.getItem("seedPhrase")
    // console.log("this is JSON.Parse", JSON.parse(seedPhrase))
    // console.log("this is seed phrase", seedPhrase)
    setSeedPhrase(JSON.parse(seedPhrase))
  }, [])

  async function sendotp() {
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

    const { user } = await masa.client.session.check()

    console.log("logged in user", user)

    // if (user) {
    //   toast.success("You are already logged in")
    //   router.push("/yourwallet")
    // } else {
    let phone = "+256" + phoneNumber

    console.log(`Creating Green for phone number: '${phone}'`)

    try {
      const xy = await masa.green.generate(phone)
      if (xy.success) {
        localStorage.setItem("contact", phone)
        toast.success("OTP sent to your phone number")
        console.log(xy)
        router.push("/otp")
      }
    } catch (error) {
      toast.error(error.message)
      console.log(error)
    }
    // }

    await masa.session.login()
  }

  return (
    <div className='App'>
      <PageHeader />
      <div className='content'>
        <div style={{ display: "flex", justifyContent: "space-evenly" }}>
          <Button onClick={() => router.back()} style={{ marginRight: "60px" }}>
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
              SignIn
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
            Your Phone Number is used as your wallet address identifier. Enter a
            valid Phone Number to continue.
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Input
            style={{ width: "20%", fontWeight: "700", color: "black" }}
            defaultValue='+256'
            disabled
          />
          <Input
            style={{ width: "70%" }}
            placeholder='700000000'
            onChange={(e) => setPhoneNumber(e.target.value)}
            maxLength={9}
            value={phoneNumber}
          />
        </div>
        <Button
          className='frontPageButton'
          disabled={phoneNumber.length < 9}
          type='primary'
          onClick={sendotp}
          style={{ backgroundColor: "#1A0329", color: "white" }}
        >
          SEND OTP
        </Button>
      </div>
    </div>
  )
}

export default SignInWithMasa
