// Component Tests
import Overview from '../components/Overview.js';
import Transfer from '../components/Transfer.js';
import History from '../components/History.js';

class ComponentTester {
    constructor() {
        this.testResults = {
            overview: {},
            transfer: {},
            history: {}
        };
    }

    async runAllTests() {
        console.log('Starting component tests...');
        
        await this.testOverview();
        await this.testTransfer();
        await this.testHistory();
        
        this.displayResults();
    }

    async testOverview() {
        console.log('\nTesting Overview Component...');
        const overview = new Overview();
        
        // Test 1: Component Mounting
        try {
            overview.mount();
            this.testResults.overview.mounting = 'PASS';
        } catch (error) {
            this.testResults.overview.mounting = `FAIL: ${error.message}`;
        }

        // Test 2: Balance Toggle
        try {
            const toggleBtn = document.getElementById('toggleBalance');
            const balanceValue = document.getElementById('balanceValue');
            const initialBalance = balanceValue.textContent;
            
            toggleBtn.click();
            const hiddenBalance = balanceValue.textContent === '••••••';
            
            toggleBtn.click();
            const shownBalance = balanceValue.textContent === initialBalance;
            
            this.testResults.overview.balanceToggle = hiddenBalance && shownBalance ? 'PASS' : 'FAIL';
        } catch (error) {
            this.testResults.overview.balanceToggle = `FAIL: ${error.message}`;
        }

        // Cleanup
        overview.unmount();
    }

    async testTransfer() {
        console.log('\nTesting Transfer Component...');
        const transfer = new Transfer();
        
        // Test 1: Component Mounting
        try {
            transfer.mount();
            this.testResults.transfer.mounting = 'PASS';
        } catch (error) {
            this.testResults.transfer.mounting = `FAIL: ${error.message}`;
        }

        // Test 2: Transfer Type Switching
        try {
            const pixButton = document.querySelector('[data-type="pix"]');
            const tedButton = document.querySelector('[data-type="ted"]');
            const pixField = document.getElementById('pixField');
            const tedFields = document.getElementById('tedFields');
            
            pixButton.click();
            const pixVisible = !pixField.classList.contains('d-none');
            
            tedButton.click();
            const tedVisible = !tedFields.classList.contains('d-none');
            
            this.testResults.transfer.typeSwitching = pixVisible && tedVisible ? 'PASS' : 'FAIL';
        } catch (error) {
            this.testResults.transfer.typeSwitching = `FAIL: ${error.message}`;
        }

        // Test 3: Form Validation
        try {
            const form = document.getElementById('transferForm');
            form.dispatchEvent(new Event('submit'));
            
            const wasValidated = form.classList.contains('was-validated');
            this.testResults.transfer.formValidation = wasValidated ? 'PASS' : 'FAIL';
        } catch (error) {
            this.testResults.transfer.formValidation = `FAIL: ${error.message}`;
        }

        // Cleanup
        transfer.unmount();
    }

    async testHistory() {
        console.log('\nTesting History Component...');
        const history = new History();
        
        // Test 1: Component Mounting
        try {
            history.mount();
            this.testResults.history.mounting = 'PASS';
        } catch (error) {
            this.testResults.history.mounting = `FAIL: ${error.message}`;
        }

        // Test 2: Filter Changes
        try {
            const periodFilter = document.getElementById('periodFilter');
            const typeFilter = document.getElementById('typeFilter');
            const sortFilter = document.getElementById('sortFilter');
            
            let filterChangeDetected = false;
            const originalConsoleLog = console.log;
            console.log = (...args) => {
                if (args[0] === 'Filtro alterado:') filterChangeDetected = true;
            };
            
            periodFilter.value = '15';
            periodFilter.dispatchEvent(new Event('change'));
            
            console.log = originalConsoleLog;
            this.testResults.history.filtering = filterChangeDetected ? 'PASS' : 'FAIL';
        } catch (error) {
            this.testResults.history.filtering = `FAIL: ${error.message}`;
        }

        // Test 3: Transaction Formatting
        try {
            const transactions = document.querySelectorAll('.transaction-item');
            const hasFormattedDate = /\d{2}\/\d{2}\/\d{4}/.test(transactions[0].textContent);
            const hasFormattedAmount = /R\$/.test(transactions[0].textContent);
            
            this.testResults.history.formatting = hasFormattedDate && hasFormattedAmount ? 'PASS' : 'FAIL';
        } catch (error) {
            this.testResults.history.formatting = `FAIL: ${error.message}`;
        }

        // Cleanup
        history.unmount();
    }

    displayResults() {
        console.log('\n=== Test Results ===');
        
        console.log('\nOverview Component:');
        Object.entries(this.testResults.overview).forEach(([test, result]) => {
            console.log(`${test}: ${result}`);
        });
        
        console.log('\nTransfer Component:');
        Object.entries(this.testResults.transfer).forEach(([test, result]) => {
            console.log(`${test}: ${result}`);
        });
        
        console.log('\nHistory Component:');
        Object.entries(this.testResults.history).forEach(([test, result]) => {
            console.log(`${test}: ${result}`);
        });
    }
}

// Run tests
const tester = new ComponentTester();
tester.runAllTests(); 