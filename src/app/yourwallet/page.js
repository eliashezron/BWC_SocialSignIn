"use client"
import Image from "next/image"
import React, { useEffect, useState } from "react"
import { Divider, Tooltip, List, Avatar, Spin, Tabs, Button } from "antd"
import {
  DoubleRightOutlined,
  DoubleLeftOutlined,
  CopyOutlined,
  SettingOutlined,
  LoadingOutlined,
} from "@ant-design/icons"
// import { useNavigate } from "react-router-dom"
import { useRouter } from "next/navigation"
import axios from "axios"
import { celo, cusd, logo } from "../../assets"
import { CopyToClipboard } from "react-copy-to-clipboard"
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
import { useSession, signOut } from "next-auth/react"
import {
  AuthenticationMethod,
  AuthSigner,
  OdisContextName,
} from "@celo/identity/lib/odis/query"
import { ethers, Wallet } from "ethers"
import { WebBlsBlindingClient } from "../../utils/webBlindingClient"
import { useIsMounted } from "@/hooks/useIsMounted"
import { CHAINS_CONFIG } from "../../components/chains"
import { toast } from "react-hot-toast"
import { useWalletContext } from "../Context"
import { IdentifierPrefix } from "@celo/identity/lib/odis/identifier"

const abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "balanceOf",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
]
const nfts = null
const TestnetCoins = [
  {
    name: "CELO Token",
    symbol: "CELO",
    address: "",
    logo: celo,
  },
  {
    name: "CELO Dollar",
    symbol: "cUSD",
    address: "0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1",
    logo: cusd,
  },
]

function WalletView() {
  // const navigate = useNavigate()
  const { selectedChain } = useWalletContext()
  const router = useRouter()
  const [balance, setBalance] = useState(0)
  const [cusdBalance, setCusdBalance] = useState(0)
  const [copied, setCopied] = useState(false)
  const chain = CHAINS_CONFIG[selectedChain]
  let isMounted = useIsMounted()

  // eslint-disable-next-line
  const [fetching, setFetching] = useState(false)

  const [txs, setTxs] = useState([])
  const { data: session, status } = useSession()
  // console.log("session", session)
  let [socialIdentifier, setSocialIdentifier] = useState("")
  const [loading, setLoading] = useState(false)
  const [loading2, setLoading2] = useState(false)
  const [lookupValue, setLookupValue] = useState("")
  const [lookupResult, setLookupResult] = useState([])
  const [sc, setSc] = useState({})
  const [wallet, setWallet] = useState("")
  const [seedPhrase, setSeedPhrase] = useState("")
  const [registered, setRegistered] = useState(false)

  useEffect(() => {
    let wallet = localStorage.getItem("wallet")
    setWallet(wallet)
    let seedPhrase = localStorage.getItem("seedPhrase")
    setSeedPhrase(seedPhrase)
  }, [])

  const tokens = [
    {
      name: "CELO",
      symbol: "CELO",
      balance: balance,
      logo: celo,
    },
    {
      name: "CELO Dollar",
      symbol: "cUSD",
      balance: cusdBalance,
      logo: cusd,
    },
  ]

  const items = [
    {
      key: "3",
      label: `Tokens`,
      children: (
        <>
          {tokens ? (
            <div style={{ padding: "0 5px" }}>
              <List
                bordered
                itemLayout='horizontal'
                dataSource={tokens}
                renderItem={(item, index) => (
                  <List.Item style={{ textAlign: "left" }}>
                    <List.Item.Meta
                      avatar={
                        <Image
                          src={item.logo || logo}
                          className='viewLogo'
                          alt='logo'
                        />
                      }
                      title={item.symbol}
                      description={item.name}
                    />
                    <div style={{ fontWeight: "700" }}>
                      <span
                        style={{
                          color: "black",
                          fontWeight: "700",
                          fontSize: "1.5em",
                          marginRight: "0.1em",
                        }}
                      >
                        {" "}
                        {item.balance}
                      </span>
                      {item.symbol}
                    </div>
                  </List.Item>
                )}
              />
            </div>
          ) : (
            <div style={{ padding: "0 5px" }}>
              <List bordered />
            </div>
          )}
        </>
      ),
    },
    {
      key: "2",
      label: `NFTs`,
      children: (
        <>
          {nfts ? (
            <div style={{ padding: "0 5px" }}>
              <List
                bordered
                itemLayout='horizontal'
                dataSource={nfts}
                renderItem={(item, index) => (
                  <List.Item style={{ textAlign: "left" }}>
                    <List.Item.Meta
                      avatar={<Avatar src={item.logo || logo} />}
                      // title={item.symbol}
                      // description={item.name}
                    />
                    <div>{item.value}</div>
                  </List.Item>
                )}
              />
            </div>
          ) : (
            <div style={{ padding: "0 5px" }}>
              <List bordered />
            </div>
          )}
        </>
      ),
    },
    {
      key: "1",
      label: `Activity`,
      children: (
        <>
          {txs ? (
            <div style={{ padding: "0 5px" }}>
              <List
                bordered
                itemLayout='horizontal'
                dataSource={txs}
                renderItem={(item, index) => {
                  const date = new Date(
                    parseInt(item.timeStamp) * 1000
                  ).toLocaleString()
                  return (
                    <List.Item style={{ textAlign: "left" }}>
                      <List.Item.Meta title={item.Input} description={date} />
                      <div style={{ fontWeight: "700" }}>
                        <span
                          style={{
                            color: "black",
                            fontWeight: "700",
                            fontSize: "1.5em",
                            marginRight: "0.1em",
                          }}
                        >
                          {" "}
                          {ethers.utils.formatEther(item.value)}
                        </span>
                        CELO
                      </div>
                    </List.Item>
                  )
                }}
              />
            </div>
          ) : (
            <div style={{ padding: "0 5px" }}>
              <List bordered />
            </div>
          )}
        </>
      ),
    },
  ]

  useEffect(() => {
    if (!wallet) return
    const provider = new ethers.providers.JsonRpcProvider(
      "https://alfajores-forno.celo-testnet.org"
    )

    async function getBalance() {
      const balance = await provider.getBalance(wallet)
      setBalance(Number(ethers.utils.formatEther(balance)).toFixed(2))
      const cusdContract = new ethers.Contract(
        TestnetCoins[1].address,
        abi,
        provider
      )
      const balance2 = await cusdContract.balanceOf(wallet)
      setCusdBalance(Number(ethers.utils.formatEther(balance2)).toFixed(2))
    }
    getBalance()
    // eslint-disable-next-line
  }, [balance, wallet])

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

  function logout() {
    localStorage.removeItem("seedPhrase")
    localStorage.removeItem("wallet")
    if (registered) {
      localStorage.removeItem("username")
      deregisterIdentifier(session.username.toLowerCase())
    }
    toast.success("Logging out")
    router.push("/")
  }

  async function checkAndTopUpODISQuota() {
    console.log(
      "checkAndTopUpODISQuota",
      "0xdE620bce4c8a96A6268E5e3276eeE085Ccd62Cf7",
      sc.authSigner,
      sc.serviceContext
    )
    const { remainingQuota } = await OdisUtils.Quota.getPnpQuotaStatus(
      "0xdE620bce4c8a96A6268E5e3276eeE085Ccd62Cf7",
      sc.authSigner,
      sc.serviceContext
    )
    console.log("remainingQuota", remainingQuota)
    if (remainingQuota < 1) {
      let currentAllowance = await sc.stableTokenContract.allowance(
        "0xdE620bce4c8a96A6268E5e3276eeE085Ccd62Cf7",
        sc.odisPaymentsContract.address
      )
      console.log("currentAllowance", currentAllowance)
      let enoughAllowance = false
      if (sc.quotaFee.gt(currentAllowance)) {
        let approvalTxReceipt = await sc.stableTokenContract.increaseAllowance(
          sc.odisPaymentsContract.address,
          sc.quotaFee
        )
        console.log("approvalTxReceipt", approvalTxReceipt)
        enoughAllowance = approvalTxReceipt.status
      } else {
        enoughAllowance = true
        console.log("enoughAllowance", enoughAllowance)
      }
      if (enoughAllowance) {
        let odisPayment = await sc.odisPaymentsContract.payInCUSD(
          "0xdE620bce4c8a96A6268E5e3276eeE085Ccd62Cf7",
          sc.quotaFee
        )
        console.log("odis payment tx status:", odisPayment.status)
        console.log("odis payment tx hash:", odisPayment.transactionHash)
      } else {
        throw "ODIS => cUSD approval failed"
      }
    }
  }

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

  async function registerAttestation(identifier, account) {
    setLoading(true)
    console.log("registerAttestation", identifier, account)
    // check and top up ODIS quota
    await checkAndTopUpODISQuota()
    let nowTimestamp = Math.floor(new Date().getTime() / 1000)
    let obfuscatedIdentifier = getObfuscatedIdentifier(identifier)
    const x =
      await sc.federatedAttestationsContract.registerAttestationAsIssuer(
        obfuscatedIdentifier,
        account,
        nowTimestamp
      )
    x && setRegistered(true)
    setLoading(false)
    toast.success(
      "Address registered. you can now receive funds using your twitter handle."
    )
  }

  async function lookupAddress(identifier) {
    let obfuscatedIdentifier = getObfuscatedIdentifier(identifier)
    let attestations =
      await sc.federatedAttestationsContract.lookupAttestations(
        obfuscatedIdentifier,
        ["0xdE620bce4c8a96A6268E5e3276eeE085Ccd62Cf7"]
      )
    let [latestAddress] = attestations.accounts
    return latestAddress
  }

  async function deregisterIdentifier(identifier) {
    setLoading2(true)
    try {
      let obfuscatedIdentifier = getObfuscatedIdentifier(identifier)
      await sc.federatedAttestationsContract.revokeAttestation(
        obfuscatedIdentifier,
        "0xdE620bce4c8a96A6268E5e3276eeE085Ccd62Cf7",
        wallet
      )
      setRegistered(false)
      toast.success("Address unlinked from Twitter handle.")
      setLoading2(false)
    } catch (error) {
      setLoading2(false)
      toast.error("Something went wrong")
    }
  }

  useEffect(() => {
    if (!session) return
    let user = localStorage.getItem("username")
    if (!user) return
    async function lookUp() {
      const lookup = await lookupAddress(user)
      lookup && setRegistered(true)
    }
    lookUp()
  }, [session])

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(
          "https://api-alfajores.celoscan.io/api",
          {
            params: {
              module: "account",
              action: "txlist",
              address: wallet,
              startblock: 0,
              endblock: 99999999,
              page: 1,
              offset: 100,
              sort: "desc",
              apikey: "KWZPE29INCYFKYE31H9KDA91FPVGTYTAJS",
            },
          }
        )
        // Handle the response data
        setTxs(response.data.result)
        // console.log(response.data)
      } catch (error) {
        // Handle any errors
        console.error("Error fetching data:", error)
      }
    }

    // Call the fetchData function
    fetchData()
    if (copied) {
      setTimeout(() => {
        setCopied(false)
      }, 2000)
    }
  }, [txs, balance, copied, wallet])

  async function linkAccount() {
    console.log("registerAttestation")
    localStorage.setItem("username", session.username.toLowerCase())
    console.log(session.username.toLowerCase())
    console.log(wallet.toString())
    await registerAttestation(session.username.toLowerCase(), wallet.toString())
  }
  async function unlinkAccount() {
    console.log("unLinkingAttestation")
    console.log(session.username.toLowerCase())
    console.log(wallet.toString())
    localStorage.removeItem("username")
    await deregisterIdentifier(session.username.toLowerCase())
  }
  if (!isMounted) return null

  return (
    <div className='App'>
      <PageHeader />
      <div className='content' style={{ marginTop: "-20px" }}>
        <div className='logoutButton' onClick={logout}>
          <SettingOutlined style={{ fontSize: "30px", color: "#08c" }} />
        </div>

        <div className='walletName'>Account</div>

        {copied ? (
          <Tooltip title='Copied!' color='green'>
            <CopyToClipboard text={wallet} onCopy={() => setCopied(true)}>
              <div>
                {wallet.slice(0, 7)}...{wallet.slice(37, 42)} <CopyOutlined />
              </div>
            </CopyToClipboard>
          </Tooltip>
        ) : (
          <Tooltip title='Copy to clipboard'>
            <CopyToClipboard text={wallet} onCopy={() => setCopied(true)}>
              <div>
                {wallet.slice(0, 7)}...{wallet.slice(37, 42)} <CopyOutlined />
              </div>
            </CopyToClipboard>
          </Tooltip>
        )}

        <div
          className='walletName'
          style={{ marginTop: "10px", fontSize: "2em" }}
        >
          {balance} {CHAINS_CONFIG[selectedChain].ticker}
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "10px",
          }}
        >
          <Button
            style={{ marginRight: "10px" }}
            onClick={() => router.push("/transfer")}
          >
            send
            <DoubleRightOutlined />
          </Button>
          <Button onClick={() => router.push("/receive")}>
            Receive
            <DoubleLeftOutlined />
          </Button>
        </div>
        <div>
          {registered ? (
            <Button onClick={unlinkAccount}>
              UNLinK Account{loading2 && <LoadingOutlined />}
            </Button>
          ) : (
            <Button onClick={linkAccount}>
              LinK Account{loading && <LoadingOutlined />}
            </Button>
          )}
        </div>

        <Divider />
        {fetching ? (
          <Spin />
        ) : (
          <Tabs
            centered
            defaultActiveKey='3'
            items={items}
            className='walletView'
          />
        )}
      </div>
    </div>
  )
}

export default WalletView
