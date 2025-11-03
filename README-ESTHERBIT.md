# EstherBit (ESTB)

Fungible token smart contract for EstherBit on Stacks using Clarity and Clarinet.

## Contract

- Path: `contracts/estherbit.clar`
- Decimals: 6
- Symbol: `ESTB`
- Owner: set once via `set-owner`

## Key functions

- `set-owner(new-owner)` — set owner once
- `mint(recipient, amount)` — owner mints tokens
- `transfer(sender, recipient, amount)` — move tokens
- Views: `get-balance(who)`, `get-total-supply()`, `get-name()`, `get-symbol()`, `get-decimals()`, `get-owner()`

## Quickstart

1) Check contracts
```sh
clarinet check
```

2) Console examples
```sh
clarinet console
```
In the console:
```clarity
;; set owner to wallet_1
(contract-call? .estherbit set-owner wallets.wallet_1.address)

;; mint 1,000 ESTB (6 decimals) to wallet_2
(contract-call? .estherbit mint wallets.wallet_2.address u1000000000)

;; transfer 10 ESTB from wallet_2 to wallet_3 (run as wallet_2)
(as-contract (ok true)) ;; switch signer in Clarinet UI or use:
(tx-sender wallets.wallet_2)
(contract-call? .estherbit transfer wallets.wallet_2.address wallets.wallet_3.address u10000000)

;; read balances
(contract-call? .estherbit get-balance wallets.wallet_2.address)
(contract-call? .estherbit get-balance wallets.wallet_3.address)
```

## Notes

- Only the designated owner can call `mint`.
- Error codes: `u100` owner already set, `u101` unauthorized, `u102` insufficient balance, `u103` self-transfer, `u104` zero amount.
