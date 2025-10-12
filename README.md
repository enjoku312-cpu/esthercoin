# EstherCoin 🪙

EstherCoin is a SIP-010 compliant fungible token built on the Stacks blockchain using Clarity smart contracts.

## Overview

EstherCoin (ESTH) is a fungible token that implements the SIP-010 fungible token standard, providing a secure and decentralized way to create, transfer, and manage digital tokens on the Stacks blockchain.

## Features

- ✅ **SIP-010 Compliant**: Fully compatible with the Stacks Improvement Proposal 010 standard
- 🔒 **Secure**: Built with Clarity smart contracts ensuring predictable and secure execution
- 🏭 **Minting**: Contract owner can mint new tokens
- 🔥 **Burning**: Token holders can burn their tokens to reduce supply
- 📊 **Standard Functions**: Transfer, balance checking, and metadata retrieval
- 🎯 **6 Decimals**: Supports fractional tokens with 6 decimal places

## Token Details

- **Name**: EstherCoin
- **Symbol**: ESTH
- **Decimals**: 6
- **Standard**: SIP-010
- **Blockchain**: Stacks

## Smart Contract Functions

### Public Functions

#### `transfer`
Transfers tokens from sender to recipient.
```clarity
(transfer (amount uint) (sender principal) (recipient principal) (memo (optional (buff 34))))
```

#### `mint`
Mints new tokens to a recipient (owner only).
```clarity
(mint (amount uint) (recipient principal))
```

#### `burn`
Burns tokens from a sender's balance.
```clarity
(burn (amount uint) (sender principal))
```

#### `set-token-uri`
Sets the token metadata URI (owner only).
```clarity
(set-token-uri (value (optional (string-utf8 256))))
```

### Read-Only Functions

#### `get-name`
Returns the token name.
```clarity
(get-name) -> (response (string-ascii 32) none)
```

#### `get-symbol`
Returns the token symbol.
```clarity
(get-symbol) -> (response (string-ascii 10) none)
```

#### `get-decimals`
Returns the number of decimal places.
```clarity
(get-decimals) -> (response uint none)
```

#### `get-balance`
Returns the token balance of a principal.
```clarity
(get-balance (who principal)) -> (response uint none)
```

#### `get-total-supply`
Returns the total token supply.
```clarity
(get-total-supply) -> (response uint none)
```

#### `get-token-uri`
Returns the token metadata URI.
```clarity
(get-token-uri) -> (response (optional (string-utf8 256)) none)
```

## Error Codes

- `u100`: Owner only operation
- `u101`: Not token owner
- `u102`: Insufficient balance
- `u103`: Invalid amount

## Development Setup

### Prerequisites

- [Clarinet](https://docs.hiro.so/clarinet) - Clarity development environment
- [Node.js](https://nodejs.org/) - For running tests
- [Git](https://git-scm.com/) - Version control

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/esthercoin.git
cd esthercoin
```

2. Install dependencies:
```bash
npm install
```

### Testing

Run the test suite:
```bash
npm test
```

Run specific tests:
```bash
npx vitest run tests/esthercoin.test.ts
```

### Contract Validation

Check contract syntax:
```bash
clarinet check
```

Validate all contracts:
```bash
clarinet check --all
```

### Local Development

Start local testnet:
```bash
clarinet integrate
```

Deploy to local network:
```bash
clarinet deploy --local
```

## Deployment

### Testnet Deployment

1. Configure your testnet settings in `settings/Testnet.toml`
2. Deploy to testnet:
```bash
clarinet deploy --testnet
```

### Mainnet Deployment

1. Configure your mainnet settings in `settings/Mainnet.toml`
2. Deploy to mainnet:
```bash
clarinet deploy --mainnet
```

⚠️ **Warning**: Mainnet deployments are irreversible and cost real STX tokens.

## Usage Examples

### Minting Tokens

Only the contract owner can mint new tokens:

```clarity
;; Mint 1000 ESTH tokens to a recipient
(contract-call? .esthercoin mint u1000000000 'SP1HHKX4ZF5J7ZC4YK9GXZP1HHKX4ZF5J7ZC4YK9GXZ)
```

### Transferring Tokens

```clarity
;; Transfer 10 ESTH tokens
(contract-call? .esthercoin transfer u10000000 tx-sender 'SP1HHKX4ZF5J7ZC4YK9GXZP1HHKX4ZF5J7ZC4YK9GXZ none)
```

### Checking Balance

```clarity
;; Check balance of an address
(contract-call? .esthercoin get-balance 'SP1HHKX4ZF5J7ZC4YK9GXZP1HHKX4ZF5J7ZC4YK9GXZ)
```

### Burning Tokens

```clarity
;; Burn 5 ESTH tokens
(contract-call? .esthercoin burn u5000000 tx-sender)
```

## Project Structure

```
esthercoin/
├── contracts/
│   └── esthercoin.clar          # Main token contract
├── tests/
│   └── esthercoin.test.ts       # Contract tests
├── settings/
│   ├── Devnet.toml             # Development network settings
│   ├── Testnet.toml            # Testnet settings
│   └── Mainnet.toml            # Mainnet settings
├── Clarinet.toml               # Project configuration
├── package.json                # Node.js dependencies
├── tsconfig.json               # TypeScript configuration
├── vitest.config.js            # Test configuration
└── README.md                   # This file
```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Development Guidelines

- Follow Clarity best practices
- Write comprehensive tests for new features
- Update documentation for any API changes
- Ensure all tests pass before submitting PR

## Security Considerations

- The contract owner has minting privileges - ensure proper key management
- Token transfers require proper authorization
- All public functions include appropriate safety checks
- Consider multi-sig solutions for production deployments

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Resources

- [Stacks Documentation](https://docs.stacks.co/)
- [Clarity Language Reference](https://docs.stacks.co/clarity/)
- [SIP-010 Fungible Token Standard](https://github.com/stacksgov/sips/blob/main/sips/sip-010/sip-010-fungible-token-standard.md)
- [Clarinet Documentation](https://docs.hiro.so/clarinet)

## Support

If you encounter any issues or have questions, please:

1. Check the [documentation](https://docs.stacks.co/)
2. Search existing [issues](https://github.com/yourusername/esthercoin/issues)
3. Create a new issue if needed

---

**EstherCoin** - Building the future of decentralized finance on Stacks 🚀
 
