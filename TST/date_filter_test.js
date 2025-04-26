// Dados de teste - transações do arquivo original
const transactions = [
    {
        id: 1,
        data_transacao: '2024-03-15 09:23:45',
        description: 'PIX para Mercado Delivery',
        amount: -156.75
    },
    {
        id: 2,
        data_transacao: '2024-03-14 08:00:12',
        description: 'Salário - Tech Corp LTDA',
        amount: 5280.00
    },
    {
        id: 11,
        date: '2024-03-10',
        description: 'Resgate CDB',
        amount: 1580.00
    },
    {
        id: 20,
        date: '2024-03-04',
        description: 'Conta de Água - SABESP',
        amount: -87.45
    }
];

// Função para testar o filtro de datas
function testDateFilter() {
    console.log('=== TESTE DE FILTRO DE DATAS ===');

    // 1. Processar as datas
    const processedTransactions = transactions.map(t => ({
        ...t,
        date: new Date(t.data_transacao || t.date)
    }));

    // 2. Mostrar as datas processadas
    console.log('\nDatas processadas:');
    processedTransactions.forEach(t => {
        console.log(`ID ${t.id}:`, {
            date: t.date.toISOString(),
            description: t.description
        });
    });

    // 3. Testar filtro de 90 dias
    // Usar a data atual real (23/04/2025)
    const today = new Date('2025-04-23');
    today.setHours(0, 0, 0, 0);
    
    const cutoffDate = new Date(today);
    cutoffDate.setDate(today.getDate() - 90);
    
    console.log('\nDatas de referência:');
    console.log('Data atual:', today.toISOString());
    console.log('90 dias atrás:', cutoffDate.toISOString());

    // 4. Aplicar filtro
    const filtered = processedTransactions.filter(t => {
        const transactionDate = new Date(t.date);
        transactionDate.setHours(0, 0, 0, 0);
        const isIncluded = transactionDate >= cutoffDate;
        
        console.log(`\nTransação ${t.id}:`, {
            date: transactionDate.toISOString(),
            cutoffDate: cutoffDate.toISOString(),
            diasAntesDeHoje: Math.floor((today - transactionDate) / (1000 * 60 * 60 * 24)),
            isIncluded: isIncluded
        });
        
        return isIncluded;
    });

    // 5. Resultado
    console.log('\nResultado do filtro:');
    console.log('Total de transações:', processedTransactions.length);
    console.log('Transações após filtro:', filtered.length);
    console.log('Transações incluídas:', filtered.map(t => t.id));
    
    // 6. Explicação do resultado
    console.log('\nExplicação:');
    console.log('- Data atual é 23/04/2025');
    console.log('- 90 dias atrás seria 23/01/2025');
    console.log('- Todas as transações são de março/2024');
    console.log('- Portanto, todas as transações são mais antigas que o período de 90 dias');

    // 7. Análise detalhada das datas
    console.log('\nIdade das transações:');
    processedTransactions.forEach(t => {
        const diasAntigos = Math.floor((today - t.date) / (1000 * 60 * 60 * 24));
        console.log(`${t.description}:`, {
            data: t.date.toLocaleDateString(),
            diasAntigos: diasAntigos,
            meses: Math.floor(diasAntigos / 30),
            anos: Math.floor(diasAntigos / 365)
        });
    });
}

// Executar teste
testDateFilter(); 