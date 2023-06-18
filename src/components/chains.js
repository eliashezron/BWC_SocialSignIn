const CeloMainnet = {
  hex: "42220",
  name: "celo",
  rpcUrl: "https://celo-mainnet.infura.io/v3/a22b6958cc5449a6a5bc6dc4e2c26a7a",
  ticker: "CELO",
}
const AlfajoresTestnet = {
  hex: "44787",
  name: "alfajores",
  rpcUrl: "https://alfajores-forno.celo-testnet.org",
  ticker: "CELO",
}
const BaklavaTestnet = {
  hex: "62320",
  name: "alfajores",
  rpcUrl: "https://baklava-forno.celo-testnet.org",
  ticker: "CELO",
}

export const CHAINS_CONFIG = {
  42220: CeloMainnet,
  44787: AlfajoresTestnet,
  62320: BaklavaTestnet,
}
