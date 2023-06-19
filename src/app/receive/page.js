"use client"
import { useEffect, useState } from "react"
import { Button, Divider, Tooltip } from "antd"
import { LeftCircleOutlined, CopyOutlined } from "@ant-design/icons"
// import { useNavigate } from "react-router-dom"
import { useRouter } from "next/navigation"
import QRCode from "qrcode.react"
import { CopyToClipboard } from "react-copy-to-clipboard"
import PageHeader from "@/components/PageHeader"
import { useSession } from "next-auth/react"
const Receive = () => {
  const [wallet, setWallet] = useState("")
  const { data: session } = useSession()
  const [name, setName] = useState("")

  useEffect(() => {
    let wallet = localStorage.getItem("wallet")
    setWallet(wallet)
  }, [])
  // const navigate = useNavigate()
  const router = useRouter()
  const [copied, setCopied] = useState(false)
  useEffect(() => {
    if (copied) {
      setTimeout(() => {
        setCopied(false)
      }, 3000)
    }
  }, [copied])
  useEffect(() => {
    // @ts-ignore: session was customized
    session && setName(session.username.toLowerCase())
  }, [session])
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
            Receive
          </span>
        </div>
      </div>
      <Divider />
      <div
        style={{ marginTop: "10px", display: "flex", flexDirection: "column" }}
      >
        <p style={{ marginTop: "10px", fontWeight: "700" }}>Scan to receive</p>
        <QRCode
          style={{
            border: "1px solid #FBFE53",
            padding: "5px",
            width: "250px",
            height: "250px",
          }}
          value={wallet}
          bgColor={"#ffffff"} // The QR Background Color
          //   fgColor={invalidAddress ? "#EF233C" : "#000000"} // The Qr Color
          level={"Q"} // Levels Can be L,M,Q,H Default is L
          includeMargin={false}
          renderAs={"svg"}
          // Uncomment the Line to add Image to the QR CODE
          imageSettings={{
            src: "celo.png",
            x: null,
            y: null,
            height: 40,
            width: 40,
            excavate: true,
          }}
        />
        <div style={{ marginTop: "10px" }}>
          {copied ? (
            <Tooltip title='Copied!' color='green'>
              <CopyToClipboard text={wallet} onCopy={() => setCopied(true)}>
                <div>
                  {wallet.slice(0, 10)}...{wallet.slice(32, 42)}{" "}
                  <CopyOutlined />
                </div>
              </CopyToClipboard>
            </Tooltip>
          ) : (
            <Tooltip title='Copy to clipboard'>
              <CopyToClipboard text={wallet} onCopy={() => setCopied(true)}>
                <div
                  style={{
                    border: "1px solid black",
                    borderRadius: "5px",
                    height: "1.5em",
                    fontSize: "1em",
                    fontWeight: "700",
                    alignItems: "center",
                  }}
                >
                  {wallet.slice(0, 10)}...{wallet.slice(32, 42)}{" "}
                  <CopyOutlined />
                </div>
              </CopyToClipboard>
            </Tooltip>
          )}
        </div>
        <div style={{ marginTop: "10px" }}>
          {copied ? (
            <Tooltip title='Copied!' color='green'>
              <CopyToClipboard text={name} onCopy={() => setCopied(true)}>
                <div>
                  {name}
                  <CopyOutlined />
                </div>
              </CopyToClipboard>
            </Tooltip>
          ) : (
            <Tooltip title='Copy to clipboard'>
              <CopyToClipboard text={name} onCopy={() => setCopied(true)}>
                <div
                  style={{
                    border: "1px solid black",
                    borderRadius: "5px",
                    height: "1.5em",
                    fontSize: "1em",
                    fontWeight: "700",
                    alignItems: "center",
                  }}
                >
                  {name} <CopyOutlined />
                </div>
              </CopyToClipboard>
            </Tooltip>
          )}
        </div>
      </div>
    </div>
  )
}

export default Receive
