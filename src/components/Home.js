"use client"
import React from "react"
import { Button } from "antd"
import { useRouter } from "next/navigation"
// import { useNavigate } from "react-router-dom"

function Home() {
  // const navigate = useNavigate()
  const router = useRouter()

  return (
    <>
      <div className='content'>
        <h2> Hey There 👋 </h2>
        <h4 className='h4'> Welcome to your Celo Wallet</h4>
        <Button
          onClick={() => router.push("/create")}
          className='frontPageButton'
          style={{ backgroundColor: "#1A0329", color: "white" }}
        >
          Create A Wallet
        </Button>
        <Button
          onClick={() => router.push("/recover")}
          className='frontPageButton'
          type='default'
        >
          Sign In With Seed Phrase
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
    </>
  )
}

export default Home
