# Test Plan: Legacy COBOL Account Management System

**Project:** Account Management System Modernization  
**Application:** Student Account Management (COBOL)  
**Date:** February 25, 2026  
**Purpose:** Comprehensive testing of all business logic and functionality for validation with business stakeholders and migration to Node.js

---

## Executive Summary

This test plan covers all critical business logic and user workflows of the legacy COBOL Account Management System. It includes positive test cases, negative test cases, and edge cases to ensure complete coverage of system functionality.

**Total Test Cases:** 18  
**Coverage Areas:** Menu Navigation, Balance Inquiry, Credit Operations, Debit Operations, Input Validation, Error Handling

---

## Test Cases

| Test Case ID | Test Case Description | Pre-conditions | Test Steps | Expected Result | Actual Result | Status | Comments |
|---|---|---|---|---|---|---|---|
| TC001 | Display Main Menu | Application started successfully | 1. Run the accountsystem executable<br/>2. Observe the menu displayed to the user | Main menu with options 1-4 (View Balance, Credit Account, Debit Account, Exit) is displayed with clear formatting and instructions to enter choice 1-4 | | | |
| TC002 | View Current Account Balance | Application running and displaying menu | 1. Select option 1 from menu<br/>2. Observe the balance displayed | Current balance of 001000.00 is displayed with label "Current balance: " | | | |
| TC003 | View Balance - Return to Menu | Application running after viewing balance | 1. View balance (TC002)<br/>2. Observe system behavior after displaying balance | Main menu is displayed again automatically; system ready for next operation | | | |
| TC004 | Credit Account - Valid Amount | Application running at main menu with initial balance 1000.00 | 1. Select option 2 (Credit Account)<br/>2. Enter amount: 500<br/>3. Observe balance displayed and stored | Balance increases to 001500.00; message displays "Amount credited. New balance: 001500.00" | | | |
| TC005 | Credit Account - Credit Persistence | After TC004 (balance is 1500.00) | 1. Select option 1 (View Balance)<br/>2. Observe the balance displayed | Balance displays as 001500.00, confirming credit was persisted | | | |
| TC006 | Credit Account - Multiple Credits | After TC005 (balance is 1500.00) | 1. Select option 2<br/>2. Enter amount: 250<br/>3. Select option 1 to view balance | Balance increases to 001750.00; "Amount credited. New balance: 001750.00" displayed | | | |
| TC007 | Credit Account - Zero Amount | Application at main menu | 1. Select option 2 (Credit Account)<br/>2. Enter amount: 0 | System accepts the transaction; balance remains unchanged or increases by 0 | | | Edge case - verify system behavior |
| TC008 | Credit Account - Large Amount | Application with balance 1000.00 | 1. Select option 2<br/>2. Enter amount: 999999 | System accepts large credit; balance updates correctly to 1000000.00 | | | Verify system handles maximum numeric range (9(6)V99) |
| TC009 | Debit Account - Valid Amount with Sufficient Funds | Application at main menu with balance 1750.00 | 1. Select option 3 (Debit Account)<br/>2. Enter amount: 500<br/>3. Observe balance change | Balance decreases to 001250.00; message displays "Amount debited. New balance: 001250.00" | | | |
| TC010 | Debit Account - Debit Persistence | After TC009 (balance is 1250.00) | 1. Select option 1 (View Balance)<br/>2. Observe balance displayed | Balance displays as 001250.00, confirming debit was persisted | | | |
| TC011 | Debit Account - Exact Balance Debit | Application with balance 1250.00 | 1. Select option 3<br/>2. Enter amount: 1250<br/>3. Observe result | Debit succeeds; balance decreases to 000000.00 | | | Edge case - verify system accepts debit equal to balance |
| TC012 | Debit Account - Insufficient Funds | Application with balance 1000.00 | 1. Select option 3 (Debit Account)<br/>2. Enter amount: 2000<br/>3. Observe error message | Transaction rejected with message "Insufficient funds for this debit."; balance remains 001000.00 | | | Critical business rule - overdraft prevention |
| TC013 | Debit Account - Insufficient Funds (Balance Unchanged) | After TC012 (balance still 1000.00) | 1. Select option 1 (View Balance)<br/>2. Observe balance | Balance still displays as 001000.00, confirming failed debit did not alter balance | | | |
| TC014 | Debit Account - Exceed Maximum Amount | Application with balance 1000.00 | 1. Select option 3<br/>2. Enter amount: 9999999 | Transaction rejected with "Insufficient funds" message; balance remains 001000.00 | | | Boundary test - system should prevent overdraft regardless of amount magnitude |
| TC015 | Invalid Menu Choice - Numeric Out of Range | Application at main menu | 1. Enter choice: 5<br/>2. Observe error message and system behavior | Error message displayed: "Invalid choice, please select 1-4."; menu redisplayed for new selection | | | |
| TC016 | Invalid Menu Choice - Zero | Application at main menu | 1. Enter choice: 0<br/>2. Observe error message | Error message displayed: "Invalid choice, please select 1-4."; menu redisplayed | | | |
| TC017 | Invalid Menu Choice - Negative | Application at main menu | 1. Enter choice: -1<br/>2. Observe error message | Error message displayed: "Invalid choice, please select 1-4."; menu redisplayed | | | Edge case - verify validation handles negative input |
| TC018 | Exit Program | Application at main menu | 1. Select option 4 (Exit)<br/>2. Observe program termination | Message "Exiting the program. Goodbye!" displayed; program terminates (STOP RUN); system returns to command prompt | | | |

---

## Test Case Grouping by Feature

### Feature: Menu Navigation & Display
- TC001 - Display Main Menu
- TC015 - Invalid Menu Choice - Numeric Out of Range
- TC016 - Invalid Menu Choice - Zero
- TC017 - Invalid Menu Choice - Negative
- TC018 - Exit Program

### Feature: View Balance
- TC002 - View Current Account Balance
- TC003 - View Balance - Return to Menu

### Feature: Credit Operations
- TC004 - Credit Account - Valid Amount
- TC005 - Credit Account - Credit Persistence
- TC006 - Credit Account - Multiple Credits
- TC007 - Credit Account - Zero Amount
- TC008 - Credit Account - Large Amount

### Feature: Debit Operations
- TC009 - Debit Account - Valid Amount with Sufficient Funds
- TC010 - Debit Account - Debit Persistence
- TC011 - Debit Account - Exact Balance Debit
- TC012 - Debit Account - Insufficient Funds (Critical)
- TC013 - Debit Account - Insufficient Funds (Balance Unchanged)
- TC014 - Debit Account - Exceed Maximum Amount

---

## Business Logic Coverage

| Business Rule | Test Cases | Status |
|---|---|---|
| User can view current account balance without modification | TC002, TC003 | Covered |
| Credit operations increase the balance | TC004, TC005, TC006 | Covered |
| Credits are persisted across operations | TC005, TC006 | Covered |
| Debit operations decrease the balance | TC009, TC010 | Covered |
| Debits are persisted across operations | TC010 | Covered |
| System prevents overdraft (debit > balance) | TC012, TC013, TC014 | **Critical** - Covered |
| User can debit exactly their balance | TC011 | Covered |
| Invalid menu choices display error and return to menu | TC015, TC016, TC017 | Covered |
| User can exit the program cleanly | TC018 | Covered |
| System maintains precision with currency (2 decimal places) | All balance operations | Covered |
| Menu loops until user selects Exit | TC003, TC013 | Covered |

---

## Exit Criteria

All test cases must achieve **PASS** status before the system can be:
1. ✓ Approved for production use
2. ✓ Migrated to Node.js implementation
3. ✓ Released to business stakeholders

### Critical Test Cases (Must Pass)
- **TC012 & TC013:** Overdraft prevention - absolute requirement for student account safety
- **TC001:** Menu display and basic navigation
- **TC018:** Program exit functionality

---

## Notes for Node.js Implementation

When creating the Node.js version of this application, ensure the following:

1. **Exact Balance Logic:** Match the COBOL debit validation logic exactly (balance >= amount)
2. **Data Persistence:** Implement persistent storage (database) to replace COBOL in-memory storage
3. **User Input Validation:** Replicate input validation for menu choices (1-4 only)
4. **Error Messages:** Use identical or equivalent error messages for consistency
5. **Precision:**  Maintain 2 decimal place precision for all currency values
6. **Test-Driven Development:** Use this test plan to write unit and integration tests before implementation
7. **Menu State:** Ensure menu properly displays after each operation, matching COBOL behavior

---

## Test Execution Instructions

### Setup
```bash
# Compile COBOL application
cd /workspaces/skills-modernize-your-legacy-code-with-github-copilot
cobc -x src/cobol/main.cob src/cobol/operations.cob src/cobol/data.cob -o accountsystem
```

### Execution
```bash
# Run the application
./accountsystem

# Follow test case steps and record Actual Results and Status
```

### Reset Between Test Runs
- The application initializes with balance 1000.00 on each execution
- For sequential testing, restart the application between logical test groups
- Each application restart resets the balance to 1000.00

---

## Sign-Off

| Role | Name | Date | Signature |
|---|---|---|---|
| Business Analyst | | | |
| QA Lead | | | |
| Development Lead | | | |
| Project Manager | | | |

---

## Appendix: Sample Test Output

### TC012 Execution Example
```
Account Management System
1. View Balance
2. Credit Account
3. Debit Account
4. Exit
--------------------------------
Enter your choice (1-4): 3
Enter debit amount: 2000
Insufficient funds for this debit.
```

**Expected:** Transaction rejected with insufficient funds message ✓  
**Actual:** [To be completed during test execution]

---

**Document Version:** 1.0  
**Last Updated:** February 25, 2026  
**Next Review:** Upon Node.js implementation start
