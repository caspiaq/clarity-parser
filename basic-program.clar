(define-map deposits principal uint)

(define-read-only (get-total-deposit (who principal))
    (default-to u0 (map-get? deposits who))
)

(define-public (deposit (amount uint))
    (begin
        (map-set deposits tx-sender (+ (get-total-deposit tx-sender) amount))
        (stx-transfer? amount tx-sender (as-contract tx-sender))
    )
)

(define-public (withdraw (amount uint))
    (let ((current-deposit (get-total-deposit tx-sender)))
        (if (<= amount current-deposit)
            (begin
                ;; Update deposit balance after withdrawal
                (map-set deposits tx-sender (- current-deposit amount))
                ;; Transfer the withdrawn amount back to the user
                (stx-transfer? amount (as-contract tx-sender) tx-sender)
            )
            (err u100) ;; Return an error code if the user tries to withdraw more than their balance
        )
    )
)
