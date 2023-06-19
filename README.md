# CELO EXTENSION WALLET

---

https://github.com/eliashezron/BWC_SocialSignIn/assets/60871378/d47a9f75-1262-4999-a9f8-3e0992c50f17

---

This project is a Chrome wallet extension built on the Celo blockchain, offering users the ability to sign into their accounts using either a phone number or a Twitter account. The extension leverages the @masa SDK for phone number sign-in and the @celo/identity SDK for Twitter sign-in. With this extension, users can securely manage their Celo accounts and interact with the blockchain seamlessly.

## Features

- **Phone Number Sign-In**: Users can sign into their Celo accounts using their phone numbers, leveraging the @masa SDK for secure authentication.
- **Twitter Sign-In**: The extension allows users to sign into their Celo accounts using their Twitter credentials, making the authentication process more accessible and convenient.
- **Wallet Management**: Users can securely store and manage their Celo wallets, view account balances, and initiate transactions within the extension.
- **Seamless User Experience**: The project prioritizes user-friendly design, providing intuitive navigation, clear instructions, and robust error handling.

## Getting Started

To get started with the Chrome wallet extension on the Celo blockchain, follow these steps:

1. **Clone the Repository**: Begin by cloning this repository to your local machine.

```
git clone https://github.com/eliashezron/BWC_SocialSignIn.git
```

2. **Install Dependencies**: Navigate to the project directory and install the necessary dependencies.

```
cd BWC_SocialSignIn
npm install
```

3. **Configure Environment Variables**: Create a `.env` file in the root of the project and provide the required environment variables. For example:

```
#TWITTER AUTH CREDENTIALS
TWITTER_ID=-your-twitter-id   
TWITTER_SECRET=your-twitter-secret

#SOCIAL CONNECT
NEXT_PUBLIC_ALFAJORES_RPC="https://alfajores-forno.celo-testnet.org"
NEXT_PUBLIC_ALFAJORES_ACCOUNT=
NEXT_PUBLIC_ALFAJORES_ACCOUNT_PK=
NEXT_PUBLIC_FA_PROXY_ADDRESS="0x70F9314aF173c246669cFb0EEe79F9Cfd9C34ee3"
NEXT_PUBLIC_ESCROW_PROXY_ADDRESS="0xb07E10c5837c282209c6B9B3DE0eDBeF16319a37"
NEXT_PUBLIC_ODIS_PAYMENTS_PROXY_ADDRESS="0x645170cdB6B5c1bc80847bb728dBa56C50a20a49"
NEXT_PUBLIC_ALFAJORES_CUSD_ADDRESS="0x765DE816845861e75A25fCA122bb6898B8B1282a"
NEXT_PUBLIC_ACCOUNTS_PROXY_ADDRESS="0xed7f51A34B4e71fbE69B3091FcF879cD14bD73A9"
NEXT_PUBLIC_ISSUER_PRIVATE_KEY=
NEXT_PUBLIC_DEK_PUBLIC_KEY=
NEXT_PUBLIC_DEK_PRIVATE_KEY=
```

4. **Run the Project**: Start the development server to run the Chrome wallet extension.

```
npm run dev
```

5. **Load the Extension**: Open Google Chrome and navigate to `chrome://extensions/`. Enable the "Developer mode" toggle and click on "Load unpacked" to load the extension from the project's `dist` directory / `build` directory.

6. **Explore and Test**: You can now explore and test the functionality of the Chrome wallet extension. Sign in using either your phone number or Twitter account and manage your Celo wallet seamlessly.

## Contributing

Contributions to this project are welcome. If you encounter any issues or have suggestions for improvements, please submit an issue or pull request on the project's GitHub repository.

## License

This project is licensed under the [MIT License](LICENSE).

## Acknowledgments

We would like to express our gratitude to the developers of the @masa SDK and the @celo/identity SDK for their excellent tools and documentation, which greatly contributed to the development of this Chrome wallet extension.