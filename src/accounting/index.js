#!/usr/bin/env node

/**
 * Account Management System
 * 
 * Node.js implementation of the legacy COBOL Account Management System
 * Preserves original business logic, data flow, and menu structure
 * 
 * Architecture:
 * - DataProgram: Manages persistent storage (READ/WRITE operations)
 * - Operations: Implements business logic (TOTAL, CREDIT, DEBIT)
 * - MainProgram: Menu-driven user interface
 */

const prompt = require('prompt-sync')({ sigint: true });

// ============================================================================
// DATA PROGRAM MODULE: Handles persistent storage and data access
// Equivalent to: data.cob (DataProgram)
// ============================================================================

const DataProgram = (() => {
  // Storage: Replaces COBOL STORAGE-BALANCE variable
  let storageBalance = 1000.00;

  return {
    /**
     * READ operation: Retrieve current balance
     * @returns {number} Current balance with 2 decimal precision
     */
    read() {
      return parseFloat(storageBalance.toFixed(2));
    },

    /**
     * WRITE operation: Update stored balance
     * @param {number} balance - New balance to store
     */
    write(balance) {
      storageBalance = parseFloat(balance.toFixed(2));
    },

    /**
     * Reset balance to initial value (useful for testing)
     */
    reset() {
      storageBalance = 1000.00;
    }
  };
})();

// ============================================================================
// OPERATIONS MODULE: Implements business logic
// Equivalent to: operations.cob (Operations program)
// ============================================================================

const Operations = (() => {
  /**
   * TOTAL operation: View current balance
   * Equivalent to COBOL: IF OPERATION-TYPE = 'TOTAL '
   */
  const viewBalance = () => {
    const finalBalance = DataProgram.read();
    console.log(`Current balance: ${formatBalance(finalBalance)}`);
  };

  /**
   * CREDIT operation: Add amount to account
   * Equivalent to COBOL: IF OPERATION-TYPE = 'CREDIT'
   * - Prompts user for amount
   * - Adds amount to balance
   * - Persists change to DataProgram
   * - Displays confirmation
   */
  const creditAccount = () => {
    console.log('Enter credit amount: ');
    const amount = parseFloat(prompt());

    let finalBalance = DataProgram.read();
    finalBalance += amount;
    DataProgram.write(finalBalance);

    console.log(`Amount credited. New balance: ${formatBalance(finalBalance)}`);
  };

  /**
   * DEBIT operation: Subtract amount from account
   * Equivalent to COBOL: IF OPERATION-TYPE = 'DEBIT '
   * 
   * Business Logic:
   * - Prompts user for amount
   * - Validates sufficient funds (FINAL-BALANCE >= AMOUNT)
   * - Only updates balance if validation passes
   * - Prevents overdraft
   */
  const debitAccount = () => {
    console.log('Enter debit amount: ');
    const amount = parseFloat(prompt());

    let finalBalance = DataProgram.read();

    // Business Rule: Overdraft Prevention
    // Equivalent to COBOL: IF FINAL-BALANCE >= AMOUNT
    if (finalBalance >= amount) {
      finalBalance -= amount;
      DataProgram.write(finalBalance);
      console.log(`Amount debited. New balance: ${formatBalance(finalBalance)}`);
    } else {
      // Business Rule: Reject debit if insufficient funds
      console.log('Insufficient funds for this debit.');
    }
  };

  /**
   * Format balance to match COBOL output format
   * COBOL format: 9(6)V99 = XXXXXX.XX
   * @param {number} balance - Balance to format
   * @returns {string} Formatted balance string
   */
  const formatBalance = (balance) => {
    return String(Math.floor(balance)).padStart(6, '0') + 
           String((balance % 1).toFixed(2)).substring(1);
  };

  return {
    viewBalance,
    creditAccount,
    debitAccount
  };
})();

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Format balance to match COBOL output (XXXXXX.XX)
 * @param {number} balance - Balance to format
 * @returns {string} Formatted balance
 */
const formatBalance = (balance) => {
  return String(Math.floor(balance)).padStart(6, '0') + 
         String((balance % 1).toFixed(2)).substring(1);
};

/**
 * Display the main menu
 * Equivalent to COBOL DISPLAY statements in main.cob
 */
const displayMenu = () => {
  console.log('--------------------------------');
  console.log('Account Management System');
  console.log('1. View Balance');
  console.log('2. Credit Account');
  console.log('3. Debit Account');
  console.log('4. Exit');
  console.log('--------------------------------');
};

// ============================================================================
// MAIN PROGRAM: Menu-driven interface
// Equivalent to: main.cob (MainProgram)
// ============================================================================

const MainProgram = (() => {
  /**
   * Main event loop
   * Equivalent to COBOL: PERFORM UNTIL CONTINUE-FLAG = 'NO'
   */
  const run = () => {
    let continueFlag = true;

    while (continueFlag) {
      displayMenu();
      console.log('Enter your choice (1-4): ');
      const userChoice = prompt().trim();

      // Equivalent to COBOL: EVALUATE USER-CHOICE
      switch (userChoice) {
        case '1':
          // WHEN 1: CALL 'Operations' USING 'TOTAL '
          Operations.viewBalance();
          break;
        case '2':
          // WHEN 2: CALL 'Operations' USING 'CREDIT'
          Operations.creditAccount();
          break;
        case '3':
          // WHEN 3: CALL 'Operations' USING 'DEBIT '
          Operations.debitAccount();
          break;
        case '4':
          // WHEN 4: MOVE 'NO' TO CONTINUE-FLAG
          continueFlag = false;
          break;
        default:
          // WHEN OTHER: Display error message
          console.log('Invalid choice, please select 1-4.');
      }
    }

    // Equivalent to COBOL: STOP RUN
    console.log('Exiting the program. Goodbye!');
    process.exit(0);
  };

  return { run };
})();

// ============================================================================
// APPLICATION ENTRY POINT
// ============================================================================

if (require.main === module) {
  MainProgram.run();
}

module.exports = {
  DataProgram,
  Operations,
  formatBalance
};
