;; EstherBit Fungible Token Contract
;; Minimal SIP-010-like interface (not fully implementing the trait)

(define-constant ERR_OWNER_ALREADY_SET u100)
(define-constant ERR_UNAUTHORIZED u101)
(define-constant ERR_INSUFFICIENT_BALANCE u102)
(define-constant ERR_SELF_TRANSFER u103)
(define-constant ERR_ZERO_AMOUNT u104)

(define-data-var owner (optional principal) none)
(define-data-var total-supply uint u0)
(define-map balances { account: principal } { balance: uint })

;; Read-only views
(define-read-only (get-name)
  "EstherBit")

(define-read-only (get-symbol)
  "ESTB")

(define-read-only (get-decimals)
  u6)

(define-read-only (get-total-supply)
  (var-get total-supply))

(define-read-only (get-balance (who principal))
  (default-to u0 (get balance (map-get? balances { account: who }))))

(define-read-only (get-owner)
  (var-get owner))

;; Internal helpers
(define-private (credit (who principal) (amount uint))
  (let ((current (default-to u0 (get balance (map-get? balances { account: who })))))
    (begin
      (map-set balances { account: who } { balance: (+ current amount) })
      true)))

(define-private (debit (who principal) (amount uint))
  (let ((current (default-to u0 (get balance (map-get? balances { account: who })))))
    (if (>= current amount)
        (begin
          (map-set balances { account: who } { balance: (- current amount) })
          true)
        false)))

;; Set the contract owner once
(define-public (set-owner (new-owner principal))
  (if (is-none (var-get owner))
      (begin (var-set owner (some new-owner)) (ok true))
      (err ERR_OWNER_ALREADY_SET)))

;; Mint new tokens to a recipient (only owner)
(define-public (mint (recipient principal) (amount uint))
  (let ((maybe-owner (var-get owner)))
    (if (<= amount u0)
        (err ERR_ZERO_AMOUNT)
        (if (and (is-some maybe-owner)
                 (is-eq tx-sender (unwrap-panic maybe-owner)))
            (begin
              (credit recipient amount)
              (var-set total-supply (+ (var-get total-supply) amount))
              (ok true))
            (err ERR_UNAUTHORIZED)))))

;; Transfer tokens from sender to recipient. Caller must be the sender.
(define-public (transfer (sender principal) (recipient principal) (amount uint))
  (if (<= amount u0)
      (err ERR_ZERO_AMOUNT)
      (if (not (is-eq tx-sender sender))
          (err ERR_UNAUTHORIZED)
          (if (is-eq sender recipient)
              (err ERR_SELF_TRANSFER)
              (if (not (debit sender amount))
                  (err ERR_INSUFFICIENT_BALANCE)
                  (begin
                    (credit recipient amount)
                    (ok true)))))))
