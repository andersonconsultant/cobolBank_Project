const { Worker, isMainThread, parentPort } = require('worker_threads');
const exec = require('child_process').exec;

if (isMainThread) {
    // Export a function to use in the main thread
    module.exports = function getBalance(callback) {
        const worker = new Worker(__filename);
        worker.on('message', callback);
        worker.on('error', (error) => {
            console.error(`Worker error: ${error}`);
        });
    };
} else {
    // Worker thread: execute the SALDO binary
    exec('/srv/cb_Project/Rules/api/cobol/DEV/SALDO', (error, stdout, stderr) => {
        if (error) {
            parentPort.postMessage(`Error executing SALDO: ${stderr}`);
            return;
        }
        
        // Assuming the output is in the format "saldo\\0000000775,54"
        const [header, value] = stdout.trim().split('\\');
        // Convert the balance to a number and format it
        const formattedBalance = parseFloat(value.replace(',', '.')).toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        });
        parentPort.postMessage(formattedBalance);
    });
} 