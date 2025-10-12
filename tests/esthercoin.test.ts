import { describe, expect, it } from "vitest";

const accounts = simnet.getAccounts();
const deployer = accounts.get("deployer")!;
const wallet1 = accounts.get("wallet_1")!;
const wallet2 = accounts.get("wallet_2")!;

describe("EstherCoin Token Tests", () => {
  it("ensures simnet is well initialised", () => {
    expect(simnet.blockHeight).toBeDefined();
  });

  describe("Token Metadata", () => {
    it("should return correct token name", () => {
      const { result } = simnet.callReadOnlyFn(
        "esthercoin",
        "get-name",
        [],
        deployer
      );
      expect(result).toBeOk(Cl.stringAscii("EstherCoin"));
    });

    it("should return correct token symbol", () => {
      const { result } = simnet.callReadOnlyFn(
        "esthercoin",
        "get-symbol",
        [],
        deployer
      );
      expect(result).toBeOk(Cl.stringAscii("ESTH"));
    });

    it("should return correct decimals", () => {
      const { result } = simnet.callReadOnlyFn(
        "esthercoin",
        "get-decimals",
        [],
        deployer
      );
      expect(result).toBeOk(Cl.uint(6));
    });

    it("should return initial total supply of 0", () => {
      const { result } = simnet.callReadOnlyFn(
        "esthercoin",
        "get-total-supply",
        [],
        deployer
      );
      expect(result).toBeOk(Cl.uint(0));
    });

    it("should return initial balance of 0 for any address", () => {
      const { result } = simnet.callReadOnlyFn(
        "esthercoin",
        "get-balance",
        [Cl.principal(wallet1)],
        deployer
      );
      expect(result).toBeOk(Cl.uint(0));
    });

    it("should return none for initial token URI", () => {
      const { result } = simnet.callReadOnlyFn(
        "esthercoin",
        "get-token-uri",
        [],
        deployer
      );
      expect(result).toBeOk(Cl.none());
    });
  });

  describe("Minting", () => {
    it("should allow owner to mint tokens", () => {
      const mintAmount = 1000000000; // 1000 tokens with 6 decimals
      
      const { result } = simnet.callPublicFn(
        "esthercoin",
        "mint",
        [Cl.uint(mintAmount), Cl.principal(wallet1)],
        deployer
      );
      expect(result).toBeOk(Cl.bool(true));

      // Check balance after minting
      const { result: balance } = simnet.callReadOnlyFn(
        "esthercoin",
        "get-balance",
        [Cl.principal(wallet1)],
        deployer
      );
      expect(balance).toBeOk(Cl.uint(mintAmount));

      // Check total supply
      const { result: supply } = simnet.callReadOnlyFn(
        "esthercoin",
        "get-total-supply",
        [],
        deployer
      );
      expect(supply).toBeOk(Cl.uint(mintAmount));
    });

    it("should not allow non-owner to mint tokens", () => {
      const mintAmount = 1000000000;
      
      const { result } = simnet.callPublicFn(
        "esthercoin",
        "mint",
        [Cl.uint(mintAmount), Cl.principal(wallet1)],
        wallet1 // Non-owner trying to mint
      );
      expect(result).toBeErr(Cl.uint(100)); // err-owner-only
    });

    it("should not allow minting zero tokens", () => {
      const { result } = simnet.callPublicFn(
        "esthercoin",
        "mint",
        [Cl.uint(0), Cl.principal(wallet1)],
        deployer
      );
      expect(result).toBeErr(Cl.uint(103)); // err-invalid-amount
    });
  });

  describe("Transfers", () => {
    it("should allow token holder to transfer tokens", () => {
      // First mint some tokens
      const mintAmount = 1000000000;
      simnet.callPublicFn(
        "esthercoin",
        "mint",
        [Cl.uint(mintAmount), Cl.principal(wallet1)],
        deployer
      );

      // Transfer tokens
      const transferAmount = 500000000; // 500 tokens
      const { result } = simnet.callPublicFn(
        "esthercoin",
        "transfer",
        [
          Cl.uint(transferAmount),
          Cl.principal(wallet1),
          Cl.principal(wallet2),
          Cl.none()
        ],
        wallet1
      );
      expect(result).toBeOk(Cl.bool(true));

      // Check balances after transfer
      const { result: balance1 } = simnet.callReadOnlyFn(
        "esthercoin",
        "get-balance",
        [Cl.principal(wallet1)],
        deployer
      );
      expect(balance1).toBeOk(Cl.uint(mintAmount - transferAmount));

      const { result: balance2 } = simnet.callReadOnlyFn(
        "esthercoin",
        "get-balance",
        [Cl.principal(wallet2)],
        deployer
      );
      expect(balance2).toBeOk(Cl.uint(transferAmount));
    });

    it("should not allow unauthorized transfers", () => {
      // Mint tokens to wallet1
      const mintAmount = 1000000000;
      simnet.callPublicFn(
        "esthercoin",
        "mint",
        [Cl.uint(mintAmount), Cl.principal(wallet1)],
        deployer
      );

      // Try to transfer from wallet1 as wallet2 (unauthorized)
      const transferAmount = 500000000;
      const { result } = simnet.callPublicFn(
        "esthercoin",
        "transfer",
        [
          Cl.uint(transferAmount),
          Cl.principal(wallet1),
          Cl.principal(wallet2),
          Cl.none()
        ],
        wallet2 // Unauthorized sender
      );
      expect(result).toBeErr(Cl.uint(101)); // err-not-token-owner
    });
  });

  describe("Burning", () => {
    it("should allow token holder to burn tokens", () => {
      // First mint some tokens
      const mintAmount = 1000000000;
      simnet.callPublicFn(
        "esthercoin",
        "mint",
        [Cl.uint(mintAmount), Cl.principal(wallet1)],
        deployer
      );

      // Burn tokens
      const burnAmount = 300000000; // 300 tokens
      const { result } = simnet.callPublicFn(
        "esthercoin",
        "burn",
        [Cl.uint(burnAmount), Cl.principal(wallet1)],
        wallet1
      );
      expect(result).toBeOk(Cl.bool(true));

      // Check balance after burning
      const { result: balance } = simnet.callReadOnlyFn(
        "esthercoin",
        "get-balance",
        [Cl.principal(wallet1)],
        deployer
      );
      expect(balance).toBeOk(Cl.uint(mintAmount - burnAmount));

      // Check total supply
      const { result: supply } = simnet.callReadOnlyFn(
        "esthercoin",
        "get-total-supply",
        [],
        deployer
      );
      expect(supply).toBeOk(Cl.uint(mintAmount - burnAmount));
    });

    it("should not allow unauthorized burning", () => {
      // Mint tokens to wallet1
      const mintAmount = 1000000000;
      simnet.callPublicFn(
        "esthercoin",
        "mint",
        [Cl.uint(mintAmount), Cl.principal(wallet1)],
        deployer
      );

      // Try to burn from wallet1 as wallet2 (unauthorized)
      const burnAmount = 300000000;
      const { result } = simnet.callPublicFn(
        "esthercoin",
        "burn",
        [Cl.uint(burnAmount), Cl.principal(wallet1)],
        wallet2 // Unauthorized sender
      );
      expect(result).toBeErr(Cl.uint(101)); // err-not-token-owner
    });

    it("should not allow burning zero tokens", () => {
      const { result } = simnet.callPublicFn(
        "esthercoin",
        "burn",
        [Cl.uint(0), Cl.principal(wallet1)],
        wallet1
      );
      expect(result).toBeErr(Cl.uint(103)); // err-invalid-amount
    });
  });

  describe("Administrative Functions", () => {
    it("should allow owner to set token URI", () => {
      const tokenUri = "https://example.com/esthercoin-metadata.json";
      
      const { result } = simnet.callPublicFn(
        "esthercoin",
        "set-token-uri",
        [Cl.some(Cl.stringUtf8(tokenUri))],
        deployer
      );
      expect(result).toBeOk(Cl.bool(true));

      // Check if URI was set
      const { result: uri } = simnet.callReadOnlyFn(
        "esthercoin",
        "get-token-uri",
        [],
        deployer
      );
      expect(uri).toBeOk(Cl.some(Cl.stringUtf8(tokenUri)));
    });

    it("should not allow non-owner to set token URI", () => {
      const tokenUri = "https://example.com/esthercoin-metadata.json";
      
      const { result } = simnet.callPublicFn(
        "esthercoin",
        "set-token-uri",
        [Cl.some(Cl.stringUtf8(tokenUri))],
        wallet1 // Non-owner
      );
      expect(result).toBeErr(Cl.uint(100)); // err-owner-only
    });
  });
});
