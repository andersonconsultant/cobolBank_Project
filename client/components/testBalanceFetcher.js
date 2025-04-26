const getBalance = require('./balanceFetcher.js');

// Test the getBalance function
getBalance((balance) => {
    if (typeof balance === 'string' && balance.startsWith('Error')) {
        console.error(balance);
    } else {
        console.log(`${balance}`);
    }
}); 