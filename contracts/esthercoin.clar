;; title: EstherCoin
;; version: 1.0.0
;; summary: A fungible token implementation for EstherCoin
;; description: EstherCoin is a SIP-010 compliant fungible token with minting, burning, and transfer capabilities

;; SIP-010 compliant token implementation
;; This contract implements the SIP-010 fungible token standard

;; token definitions
(define-fungible-token esthercoin)

;; constants
(define-constant contract-owner tx-sender)
(define-constant err-owner-only (err u100))
(define-constant err-not-token-owner (err u101))
(define-constant err-insufficient-balance (err u102))
(define-constant err-invalid-amount (err u103))

;; data vars
(define-data-var token-name (string-ascii 32) "EstherCoin")
(define-data-var token-symbol (string-ascii 10) "ESTH")
(define-data-var token-uri (optional (string-utf8 256)) none)
(define-data-var token-decimals uint u6)

;; data maps

;; public functions

;; SIP-010 Standard Functions
(define-public (transfer (amount uint) (sender principal) (recipient principal) (memo (optional (buff 34))))
  (begin
    (asserts! (or (is-eq tx-sender sender) (is-eq contract-caller sender)) err-not-token-owner)
    (ft-transfer? esthercoin amount sender recipient)
  )
)

(define-public (mint (amount uint) (recipient principal))
  (begin
    (asserts! (is-eq tx-sender contract-owner) err-owner-only)
    (asserts! (> amount u0) err-invalid-amount)
    (ft-mint? esthercoin amount recipient)
  )
)

(define-public (burn (amount uint) (sender principal))
  (begin
    (asserts! (or (is-eq tx-sender sender) (is-eq contract-caller sender)) err-not-token-owner)
    (asserts! (> amount u0) err-invalid-amount)
    (ft-burn? esthercoin amount sender)
  )
)

;; Administrative functions
(define-public (set-token-uri (value (optional (string-utf8 256))))
  (begin
    (asserts! (is-eq tx-sender contract-owner) err-owner-only)
    (var-set token-uri value)
    (ok true)
  )
)

;; read only functions
(define-read-only (get-name)
  (ok (var-get token-name))
)

(define-read-only (get-symbol)
  (ok (var-get token-symbol))
)

(define-read-only (get-decimals)
  (ok (var-get token-decimals))
)

(define-read-only (get-balance (who principal))
  (ok (ft-get-balance esthercoin who))
)

(define-read-only (get-total-supply)
  (ok (ft-get-supply esthercoin))
)

(define-read-only (get-token-uri)
  (ok (var-get token-uri))
)

;; private functions

