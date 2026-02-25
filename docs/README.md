# Legacy COBOL Account Management System Documentation

## Overview

This documentation describes the legacy COBOL-based Account Management System designed for student account operations. The system manages account balances, processes credits and debits, and enforces business rules for fund transfers.

## COBOL Files

### 1. main.cob (MainProgram)

**Purpose:**
The main entry point for the Account Management System. This program provides an interactive menu-driven interface for users to manage student accounts.

**Key Functions:**
- Display main menu with available operations
- Accept user input to select operations (1-4)
- Route user selections to appropriate operations
- Control program flow until user chooses to exit

**Program Flow:**
1. Display menu options:
   - Option 1: View Balance
   - Option 2: Credit Account
   - Option 3: Debit Account
   - Option 4: Exit
2. Accept user choice (numeric input)
3. Call the `Operations` program with the selected operation type
4. Loop until user selects option 4 (Exit)

**Business Rules Applied:**
- Input validation for menu choices (only accepts 1-4)
- Invalid entries trigger an error message and return to menu

---

### 2. data.cob (DataProgram)

**Purpose:**
Manages the persistent storage and retrieval of account balance data. This program serves as the data access layer for the account management system.

**Initial Data:**
- Default account balance: **$1,000.00** (stored as `STORAGE-BALANCE`)

**Key Functions:**
- **READ Operation:** Retrieves the current account balance
- **WRITE Operation:** Updates the account balance with a new value

**Data Storage:**
- `STORAGE-BALANCE`: A 9-digit numeric field with 2 decimal places (PIC 9(6)V99)
  - Represents currency in dollars and cents
  - Initial value: 1000.00

**Interface:**
- Accepts operation type (READ or WRITE) and balance data from calling programs
- Uses the LINKAGE SECTION to communicate with other programs
- Updates the working storage balance only on WRITE operations

**Business Rules Applied:**
- READ operations are non-destructive (do not modify the balance)
- WRITE operations persist changes to the stored balance
- All balance values maintain two decimal places for currency accuracy

---

### 3. operations.cob (Operations)

**Purpose:**
Implements the core business logic for account operations including balance inquiries, credit transactions, and debit transactions with validations.

**Key Functions:**

#### TOTAL (View Balance)
- Retrieves and displays the current account balance
- Calls `DataProgram` with READ operation
- No balance modifications

#### CREDIT (Add Funds)
- Prompts user to enter a credit amount
- Retrieves current balance
- Adds the credit amount to the balance
- Persists the updated balance
- Displays the new balance to the user

#### DEBIT (Withdraw Funds)
- Prompts user to enter a debit amount
- Retrieves current balance
- **Validates:** Checks if sufficient funds exist before processing
- If sufficient funds:
  - Subtracts amount from balance
  - Persists the updated balance
  - Displays the new balance
- If insufficient funds:
  - Rejects the transaction with an error message
  - Balance remains unchanged

**Business Rules Applied:**
- **Overdraft Prevention:** Debit operations cannot exceed the available balance
- **Data Consistency:** All balance updates are persisted through the `DataProgram`
- **User Feedback:** Operations provide clear confirmation messages with updated balances
- **Amount Format:** All amounts use 2 decimal places for currency accuracy

---

## Business Rules Summary

### Student Account Constraints

1. **Minimum Balance Protection:** Accounts cannot go negative; debits exceeding the balance are rejected
2. **Transaction Types:** Only two transaction types are permitted:
   - **Credit:** Increases the account balance
   - **Debit:** Decreases the account balance (with validation)
3. **Initial Balance:** New student accounts begin with $1,000.00
4. **Data Persistence:** All balance changes are stored in the `DataProgram` module
5. **Precision:** All monetary values maintain cents precision (2 decimal places)

### Operation Workflow

```
User Menu (main.cob)
        ↓
   [User Selection]
        ↓
   Operations (operations.cob)
        ↓
   [Business Logic + Validation]
        ↓
   DataProgram (data.cob)
        ↓
   [Balance Read/Write]
        ↓
   Confirmation to User
```

---

## Data Structure

| Field | Type | Format | Description |
|-------|------|--------|-------------|
| STORAGE-BALANCE | Numeric | 9(6)V99 | Current account balance (dollars.cents) |
| USER-CHOICE | Numeric | 9 | Menu selection (1-4) |
| OPERATION-TYPE | Alphanumeric | X(6) | Operation identifier (READ, WRITE, TOTAL, CREDIT, DEBIT) |
| AMOUNT | Numeric | 9(6)V99 | Transaction amount |
| FINAL-BALANCE | Numeric | 9(6)V99 | Calculated balance after transaction |

---

## Error Handling

| Scenario | Response |
|----------|----------|
| Invalid menu choice | Display error message and redisplay menu |
| Debit exceeds balance | Display "Insufficient funds" message; transaction cancelled |
| Valid transaction | Display confirmation with new balance |

---

## Notes for Modernization

This legacy COBOL system is a candidate for modernization efforts. Key areas for consideration:

- **Modularization:** Break down large programs into smaller, testable functions
- **Error Handling:** Implement comprehensive exception handling
- **Data Persistence:** Migrate from in-memory storage to a database
- **Validation:** Add input validation and business rule enforcement at all entry points
- **Testing:** Implement unit and integration test suites
- **API Layer:** Create service interfaces for external system integration
- **Documentation:** Add inline code comments and API documentation

---

## Getting Started

To compile and run this COBOL system (requires a COBOL compiler such as GnuCOBOL):

```bash
cobc -x main.cob data.cob operations.cob -o account_system
./account_system
```

This will start the interactive Account Management System menu.

---

## Data Flow Sequence Diagram

The following diagram illustrates the interaction between system components and data flow for a typical account operation:

```mermaid
sequenceDiagram
    participant User
    participant MainProgram as main.cob<br/>(MainProgram)
    participant Operations as operations.cob<br/>(Operations)
    participant DataProgram as data.cob<br/>(DataProgram)

    loop Menu Loop Until Exit
        User->>MainProgram: Interact with menu
        MainProgram->>User: Display menu options
        User->>MainProgram: Enter choice (1-4)
        
        alt Choice = 1 (View Balance)
            MainProgram->>Operations: CALL with 'TOTAL'
            Operations->>DataProgram: CALL with 'READ'
            DataProgram-->>Operations: Return FINAL-BALANCE
            Operations->>User: Display current balance
            
        else Choice = 2 (Credit Account)
            MainProgram->>Operations: CALL with 'CREDIT'
            Operations->>User: Prompt for credit amount
            User->>Operations: Enter AMOUNT
            Operations->>DataProgram: CALL with 'READ'
            DataProgram-->>Operations: Return FINAL-BALANCE
            Operations->>Operations: ADD AMOUNT to FINAL-BALANCE
            Operations->>DataProgram: CALL with 'WRITE'
            DataProgram->>DataProgram: Update STORAGE-BALANCE
            DataProgram-->>Operations: Confirm write
            Operations->>User: Display new balance
            
        else Choice = 3 (Debit Account)
            MainProgram->>Operations: CALL with 'DEBIT'
            Operations->>User: Prompt for debit amount
            User->>Operations: Enter AMOUNT
            Operations->>DataProgram: CALL with 'READ'
            DataProgram-->>Operations: Return FINAL-BALANCE
            Operations->>Operations: Validate: FINAL-BALANCE >= AMOUNT?
            
            alt Sufficient Funds
                Operations->>Operations: SUBTRACT AMOUNT from FINAL-BALANCE
                Operations->>DataProgram: CALL with 'WRITE'
                DataProgram->>DataProgram: Update STORAGE-BALANCE
                DataProgram-->>Operations: Confirm write
                Operations->>User: Display new balance
                
            else Insufficient Funds
                Operations->>User: Display error message
            end
            
        else Choice = 4 (Exit)
            MainProgram->>User: Display exit message
            MainProgram->>MainProgram: Set CONTINUE-FLAG = 'NO'
            break Exit loop
        end
    end
    
    MainProgram->>MainProgram: STOP RUN
```

### Data Flow Explanation

1. **User → MainProgram:** User provides menu selection via keyboard input
2. **MainProgram → Operations:** Routes the selected operation to the Operations program
3. **Operations → DataProgram:** Calls the DataProgram to read current balance or write new balance
4. **DataProgram Storage:** Maintains the account balance in STORAGE-BALANCE variable
5. **DataProgram → Operations:** Returns balance data for processing
6. **Operations Logic:** Performs transaction calculations and validation
7. **Operations → User:** Displays result or error message
8. **Feedback Loop:** System returns to menu until user selects Exit

### Key Data Elements in Flow

| Data Element | Source | Destination | Purpose |
|---|---|---|---|
| USER-CHOICE | User Input | MainProgram | Determines operation type |
| OPERATION-TYPE | MainProgram | Operations | Specifies READ, WRITE, TOTAL, CREDIT, DEBIT |
| AMOUNT | User Input | Operations | Transaction amount for credit/debit |
| FINAL-BALANCE | DataProgram | Operations | Current or updated account balance |
| STORAGE-BALANCE | DataProgram | DataProgram | Persistent account balance storage |
