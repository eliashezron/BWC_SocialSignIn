"use client"
import React from "react"
// import { useNavigate } from "react-router-dom"
import { useRouter } from "next/navigation"
import {
  LeftCircleOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons"
import { Button, Divider } from "antd"
import { useSession, signIn, signOut } from "next-auth/react"
import {
  ALFAJORES_CUSD_ADDRESS,
  ALFAJORES_RPC,
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
  AuthSigner,
  OdisContextName,
} from "@celo/identity/lib/odis/query"
import { ethers, Wallet } from "ethers"
import { WebBlsBlindingClient } from "../../utils/webBlindingClient"
import { useIsMounted } from "@/hooks/useIsMounted"
import { useEffect, useState } from "react"
import { CHAINS_CONFIG } from "../../components/chains"

import { useWalletContext } from "../Context"

function SocialSignIn(
  // wallet,
  setWallet,
  // eslint-disable-next-line
  // seedPhrase,
  setSeedPhrase,
  selectedChain
) {
  const { seedPhrase, wallet } = useWalletContext()
  // const navigate = useNavigate()
  const router = useRouter()
  const chain = CHAINS_CONFIG[selectedChain]
  let isMounted = useIsMounted()
  const { data: session, status } = useSession()
  let [socialIdentifier, setSocialIdentifier] = useState("")
  const [isLoaded, setIsLoaded] = useState(false)
  const [lookupValue, setLookupValue] = useState("")
  const [lookupResult, setLookupResult] = useState([])
  const [sc, setSc] = useState({})

  useEffect(() => {
    if (wallet) {
      console.log("seedPhrase", seedPhrase)
      console.log("wallet", wallet)
    }

    let provider = new ethers.providers.JsonRpcProvider(
      "https://alfajores-forno.celo-testnet.org"
    )
    let issuer = new Wallet(ISSUER_PRIVATE_KEY, provider)
    let serviceContext = OdisUtils.Query.getServiceContext(
      OdisContextName.ALFAJORES
    )
    let blindingClient = new WebBlsBlindingClient(serviceContext.odisPubKey)
    let quotaFee = ethers.utils.parseEther("0.01")
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
    setSc(vars)
  }, [chain])
  useEffect(() => {
    // @ts-ignore: session was customized
    session && session?.username && setSocialIdentifier(session?.username)
  }, [session])

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
