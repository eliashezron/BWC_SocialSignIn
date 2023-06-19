"use client"
import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Divider, Tooltip, Spin, Input, Button } from "antd"
import { LeftCircleOutlined, LoadingOutlined } from "@ant-design/icons"
import {
  ALFAJORES_CUSD_ADDRESS,
  FA_CONTRACT,
  FA_PROXY_ADDRESS,
  ODIS_PAYMENTS_CONTRACT,
  ODIS_PAYMENTS_PROXY_ADDRESS,
  STABLE_TOKEN_CONTRACT,
  ISSUER_PRIVATE_KEY,
  DEK_PRIVATE_KEY,
} from "../../utils/constants"
import { OdisUtils } from "@celo/identity"
import PageHeader from "@/components/PageHeader"
import {
  AuthenticationMethod,
  OdisContextName,
} from "@celo/identity/lib/odis/query"
import { ethers, Wallet } from "ethers"
import { WebBlsBlindingClient } from "../../utils/webBlindingClient"
import { useIsMounted } from "@/hooks/useIsMounted"
import { toast } from "react-hot-toast"
import { useWalletContext } from "../Context"
import { IdentifierPrefix } from "@celo/identity/lib/odis/identifier"

function Transfer() {
  const router = useRouter()

  const [amountToSend, setAmountToSend] = useState(null)
  const [sendToAddress, setSendToAddress] = useState(null)
  const [processing, setProcessing] = useState(false)
  const [hash, setHash] = useState(null)
  const [loading, setLoading] = useState(false)
  // eslint-disable-next-line no-unused-vars
  const [wallet, setWallet] = useState("")
  const [seedPhrase, setSeedPhrase] = useState("")
  const [sc, setSc] = useState({})
  const [twitterHandle, setTwitterHandle] = useState("")
  const [addressToSend, setAddressToSend] = useState("")
  let isMounted = useIsMounted()
  useEffect(() => {
    let wallet = localStorage.getItem("wallet")
    setWallet(wallet)
    let seedPhrase = localStorage.getItem("seedPhrase")
    setSeedPhrase(JSON.parse(seedPhrase))
  }, [])
  useEffect(() => {
    if (addressToSend.length > 0) {
      setSendToAddress(addressToSend)
    }
  }, [addressToSend])

  useEffect(() => {
    let provider = new ethers.providers.JsonRpcProvider(
      "https://alfajores-forno.celo-testnet.org"
    )

    let issuer = new Wallet(ISSUER_PRIVATE_KEY, provider)

    let serviceContext = OdisUtils.Query.getServiceContext(
      OdisContextName.ALFAJORES
    )
    let blindingClient = new WebBlsBlindingClient(serviceContext.odisPubKey)

    let quotaFee = ethers.utils.parseEther("0.01")
    console.log("quotaFee", quotaFee)
    console.log("auth", AuthenticationMethod.ENCRYPTION_KEY)
    let authSigner = {
      authenticationMethod: AuthenticationMethod.ENCRYPTION_KEY,
      rawKey: DEK_PRIVATE_KEY,
    }

    let federatedAttestationsContract = new ethers.Contract(
      FA_PROXY_ADDRESS,
      FA_CONTRACT.abi,
      issuer
    )

    let odisPaymentsContract = new ethers.Contract(
      ODIS_PAYMENTS_PROXY_ADDRESS,
      ODIS_PAYMENTS_CONTRACT.abi,
      issuer
    )
    let stableTokenContract = new ethers.Contract(
      ALFAJORES_CUSD_ADDRESS,
      STABLE_TOKEN_CONTRACT.abi,
      issuer
    )
    let vars = {
      issuerAdress: issuer.address,
      federatedAttestationsContract,
      odisPaymentsContract,
      stableTokenContract,
      authSigner,
      serviceContext,
      quotaFee,
      blindingClient,
    }
    console.log("vars", vars)
    setSc(vars)
  }, [])

  async function getObfuscatedIdentifier(identifier) {
    console.log(
      identifier,
      IdentifierPrefix.TWITTER,
      "0xdE620bce4c8a96A6268E5e3276eeE085Ccd62Cf7",
      sc.authSigner,
      sc.serviceContext,
      undefined,
      undefined,
      sc.blindingClient
    )
    await sc.blindingClient.init()
    let { obfuscatedIdentifier } =
      await OdisUtils.Identifier.getObfuscatedIdentifier(
        identifier,
        IdentifierPrefix.TWITTER,
        "0xdE620bce4c8a96A6268E5e3276eeE085Ccd62Cf7",
        sc.authSigner,
        sc.serviceContext,
        undefined,
        undefined,
        sc.blindingClient
      )
    console.log("obfuscatedIdentifier", obfuscatedIdentifier)
    return obfuscatedIdentifier
  }
  async function lookupAddress(identifier) {
    setLoading(true)
    try {
      let obfuscatedIdentifier = getObfuscatedIdentifier(identifier)
      let attestations =
        await sc.federatedAttestationsContract.lookupAttestations(
          obfuscatedIdentifier,
          ["0xdE620bce4c8a96A6268E5e3276eeE085Ccd62Cf7"]
        )
      let [latestAddress] = attestations.accounts
      setLoading(false)
      toast.success("Address found")
      setAddressToSend(latestAddress)
    } catch (error) {
      setLoading(false)
      toast.error(error.message)
    }
  }

  async function lookupAddressTwitterHandle() {
    console.log("lookingUpAddress")
    await lookupAddress(twitterHandle)
  }

  async function sendTransaction() {
    const provider = new ethers.providers.JsonRpcProvider(
      "https://alfajores-forno.celo-testnet.org"
    )
    const privateKey = Wallet.fromMnemonic(seedPhrase).privateKey
    const signer = new ethers.Wallet(privateKey, provider)

    const tx = {
      to: sendToAddress,
      value: ethers.utils.parseEther(amount.toString()),
    }

    setProcessing(true)
    try {
      const transaction = await signer.sendTransaction(tx)

      setHash(transaction.hash)
      const receipt = await transaction.wait()

      setHash(null)
      setProcessing(false)
      setAmountToSend(null)
      setSendToAddress(null)
      setAddressToSend(null)

      if (receipt.status === 1) {
        toast.success("Transaction successful")
        router.back()
      } else {
        toast.error("Transaction failed", error.message)
        console.log("failed")
      }
    } catch (err) {
      setHash(null)
      setProcessing(false)
      setAmountToSend(null)
      setSendToAddress(null)
    }
  }
  if (!isMounted) return null
  return (
    <div className='App'>
      <PageHeader />
      <div style={{ display: "flex", justifyContent: "space-evenly" }}>
        <Button
          onClick={() => router.push("/yourwallet")}
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
            Send
          </span>
        </div>
      </div>
      <Divider />
      <div className='sendRow'>
        {/* <p style={{ width: "90px", textAlign: "left" }}> To:</p> */}
        <Input
          placeholder='enter twitter handle'
          onChange={(e) => setTwitterHandle(e.target.value)}
        />
        <Button
          type='primary'
          style={{ backgroundColor: "#1C9BEF", color: "white" }}
          onClick={lookupAddressTwitterHandle}
        >
          Search
          {loading && <LoadingOutlined style={{ color: "white" }} />}
        </Button>
      </div>
      <div className='sendRow'>
        <p style={{ width: "90px", textAlign: "left" }}> Address:</p>
        <Input
          value={addressToSend.length > 0 ? addressToSend : sendToAddress}
          onChange={(e) => setSendToAddress(e.target.value)}
          placeholder='0x...'
        />
      </div>
      <div className='sendRow'>
        <p style={{ width: "90px", textAlign: "left" }}> Amount:</p>
        <Input
          value={amountToSend}
          onChange={(e) => setAmountToSend(e.target.value)}
          placeholder='Native tokens you wish to send...'
        />
      </div>
      <Button
        style={{
          width: "100%",
          marginTop: "20px",
          marginBottom: "20px",
          backgroundColor: "#1A0329",
          color: "white",
        }}
        type='primary'
        onClick={sendTransaction}
      >
        Send Tokens
      </Button>
      {processing && (
        <>
          <Spin />
          {hash && (
            <Tooltip title={hash}>
              <p>Hover For Tx Hash</p>
            </Tooltip>
          )}
        </>
      )}
    </div>
  )
}

export default Transfer
