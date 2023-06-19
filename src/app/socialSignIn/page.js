"use client"
import React from "react"
import { useRouter } from "next/navigation"
import {
  LeftCircleOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons"
import { Button, Divider } from "antd"
import { signIn } from "next-auth/react"
import PageHeader from "@/components/PageHeader"

function SocialSignIn() {
  const router = useRouter()
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
              SocialSignIn
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
            Use either your phoneNumber or twitter account to sign in into your
            wallet.
          </div>
        </div>
        <Button
          onClick={() =>
            signIn("twitter", {
              callbackUrl: `/yourwallet`,
            })
          }
          className='frontPageButton'
          style={{ backgroundColor: "#1C9BEF", color: "white" }}
        >
          Sign In With Twitter
        </Button>
        <Button
          onClick={() => router.push("/signInWithMasa")}
          className='frontPageButton'
          type='default'
        >
          Sign In With Phone Number
        </Button>
        <p className='frontPageBottom'>
          Get faucet tokens from the{" "}
          <a
            href='https://faucet.celo.org/alfajores'
            target='_blank'
            rel='noreferrer'
            style={{ color: "#12655F" }}
          >
            Celo Faucet
          </a>
        </p>
      </div>
    </div>
  )
}

export default SocialSignIn
