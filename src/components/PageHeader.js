"use client"
import Image from "next/image"
import { celo } from "@/assets"
import { Select } from "antd"
// import { useState } from "react"
import { Toaster } from "react-hot-toast"
import { useWalletContext } from "../app/Context"

function PageHeader() {
  const { selectedChain, setSelectedChain } = useWalletContext()
  return (
    <>
      <header>
        <Image src={celo} className='headerLogo' alt='logo' />
        <Select
          style={{ marginRight: "20px" }}
          onChange={(val) => setSelectedChain(val)}
          value={selectedChain}
          options={[
            {
              label: "Alfajores Testnet",
              value: "44787",
            },
            {
              label: "Baklava Testnet",
              value: "62320",
            },
            {
              label: "Celo Mainnet",
              value: "42220",
            },
          ]}
          className='dropdown'
        ></Select>
      </header>
      <Toaster
        position='top-right'
        reverseOrder={false}
        gutter={8}
        containerClassName=''
        containerStyle={{}}
        toastOptions={{
          // Define default options
          className: "border border-primary-green",
          duration: 5000,
          style: {
            background: "#15171A",
            color: "#65B3AD",
          },
        }}
      />
    </>
  )
}

export default PageHeader
