# DuskDove: A Proof of Concept

DuskDove is an open-source Proof of Concept (PoC) exploring how ENS (Ethereum Name Service) domains can seamlessly integrate with Bluesky as user handles. This project showcases the potential of decentralized systems to empower users with greater control over their digital identities while fostering an open and censorship-resistant internet.

## Features
- **Wallet Connection**: Supports MetaMask and Coinbase wallets.
- **ENS Domain Resolution**: Resolves ENS domains and verifies ownership.
- **ENS Metadata Fetching**: Fetches ENS metadata, including standard fields like avatar, email, and Twitter, as well as custom fields such as Bluesky handles and GitHub profiles.
- **Mock Handle Integration**: Demonstrates how ENS domains can be set as Bluesky handles in a mock profile.
- **No Gas Fees**: Proves that ENS metadata can be leveraged for verification and identity without requiring on-chain gas fees.
- **Custom Field Support**: Easily extendable to include user-defined custom metadata fields.

## Usage
1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open your browser at [http://localhost:3000](http://localhost:3000).

## Deployment
This PoC is optimized for deployment on platforms like [Vercel](https://vercel.com/) and [Netlify](https://www.netlify.com/).

## Environment Variables
Create a `.env` file in the root directory with your Infura project URL:
```plaintext
NEXT_PUBLIC_INFURA_URL=https://mainnet.infura.io/v3/your-infura-project-id
```

## License
This project is licensed under the [Apache License 2.0](LICENSE).

---

## Vision Statement
The intent of DuskDove is to align with Bluesky’s mission of decentralizing social media to ensure the future of free speech on the internet is protected. By leveraging ENS domains, this project demonstrates a pathway to more user-centric identity systems that respect autonomy, openness, and security.

DuskDove also highlights the efficiency of using ENS metadata for identity verification without incurring gas fees. This approach reinforces accessibility and sustainability, aligning with the ethos of decentralization by minimizing barriers for adoption.

DuskDove is a call for unity and collaboration in advancing technologies that strengthen the open web. We believe that decentralized systems should not divide us but unite us in the pursuit of a more inclusive and censorship-resistant internet.

Together, we can build tools that empower individuals while maintaining a collaborative spirit across the tech community.

---

## Contributing
Contributions, feedback, and discussions are welcome! Please adhere to the [Code of Conduct](CODE_OF_CONDUCT.md) and submit issues or pull requests via the [GitHub repository](https://github.com/metanube/duskdove).

## Disclaimer
This Proof of Concept is provided "as is" without warranty of any kind. It is an experimental project designed to demonstrate potential integration pathways and may not reflect production-level implementations.

---

Thank you for your interest in DuskDove! Let’s work together to shape the future of decentralized internet systems.
