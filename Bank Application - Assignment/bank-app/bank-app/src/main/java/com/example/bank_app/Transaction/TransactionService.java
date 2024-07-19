package com.example.bank_app.Transaction;

import com.example.bank_app.Account.Account;
import com.example.bank_app.Account.AccountRepository;
import com.example.bank_app.Balance.Balance;
import com.example.bank_app.Balance.BalanceRepository;
import com.example.bank_app.Transaction.Transaction;
import com.example.bank_app.Transaction.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class TransactionService {

    private final TransactionRepository transactionRepository;
    private final AccountRepository accountRepository;
    private final BalanceRepository balanceRepository;

    @Autowired
    public TransactionService(TransactionRepository transactionRepository, AccountRepository accountRepository, BalanceRepository balanceRepository) {
        this.transactionRepository = transactionRepository;
        this.accountRepository = accountRepository;
        this.balanceRepository = balanceRepository;
    }

    public List<Transaction> getAllTransactions() {
        return transactionRepository.findAll();
    }

    public Transaction getTransactionById(Long id) {
        return transactionRepository.findById(id).orElse(null);
    }
    public List<Transaction> getAllTransactionsByAccountId(Long accountId) {
        return transactionRepository.findByAccountId(accountId);
    }

    public Transaction saveTransaction(Transaction transaction) throws Exception {
        Account account = transaction.getAccount();
       // account = accountRepository.findById(account.getId()).orElseThrow(() -> new Exception("Account not found"));
        Balance balance = balanceRepository.findByAccount(account);

        if (balance == null) {
            throw new Exception("Balance not found for the account");
        }

        if ("DB".equals(transaction.getIndicator())) {
            if (balance.getAmount().compareTo(transaction.getAmount()) < 0) {
                throw new Exception("Insufficient balance for the transaction");
            }
            balance.setAmount(balance.getAmount().subtract(transaction.getAmount()));
        } else if ("CR".equals(transaction.getIndicator())) {
            balance.setAmount(balance.getAmount().add(transaction.getAmount()));
        } else {
            throw new Exception("Invalid transaction indicator");
        }

        // Handle transfer to another account
        if (transaction.getReceiver_account_number() != null) {
            Account receiverAccount = accountRepository.findByAccountNumber(transaction.getReceiver_account_number());
            if (receiverAccount == null) {
                throw new Exception("Receiver account not found");
            }
            Balance receiverBalance = balanceRepository.findByAccount(receiverAccount);
            if (receiverBalance == null) {
                throw new Exception("Balance not found for the receiver account");
            }
            receiverBalance.setAmount(receiverBalance.getAmount().add(transaction.getAmount()));
            balanceRepository.save(receiverBalance);

            // Save transaction for receiver with indicator "CR"
            Transaction receiverTransaction = new Transaction();
            receiverTransaction.setAccount(receiverAccount);
            receiverTransaction.setAmount(transaction.getAmount());
            receiverTransaction.setIndicator("CR");
            receiverTransaction.setReceiver_account_number(transaction.getAccount().getAccountNumber());
            receiverTransaction.setDescription(transaction.getDescription());
            receiverTransaction.setDate(LocalDateTime.now());
            transactionRepository.save(receiverTransaction);
        }

        balanceRepository.save(balance);

        // Save transaction for sender with indicator "DB"
        transaction.setDate(LocalDateTime.now());
        transactionRepository.save(transaction);

        return transaction;
    }


    public void deleteTransaction(Long id) {
        transactionRepository.deleteById(id);
    }
}
