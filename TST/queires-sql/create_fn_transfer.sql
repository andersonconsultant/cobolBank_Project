-- Create the fn_transfer table
CREATE TABLE fn_transfer (
    id SERIAL PRIMARY KEY,
    conta VARCHAR(20),
    valor DECIMAL(10,2),
    data_transacao TIMESTAMP,
    descricao VARCHAR(255),
    tipo VARCHAR(50),
    status VARCHAR(50),
    referencia_externa VARCHAR(100),
    canal VARCHAR(50),
    moeda VARCHAR(3),
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    usuario_operador VARCHAR(100),
    ip_operador VARCHAR(15)
);

-- Insert data from JSON
INSERT INTO fn_transfer (
    id, conta, valor, data_transacao, descricao, tipo, status, 
    referencia_externa, canal, moeda, created_at, updated_at, 
    usuario_operador, ip_operador
) VALUES
(1, '001234-5', -156.75, '2024-03-15 09:23:45', 'PIX para Mercado Delivery', 'pix', 'completed', 'PIX89745632', 'mobile', 'BRL', '2024-03-15 09:23:45', '2024-03-15 09:23:45', 'cliente_app', '192.168.1.105'),
(2, '001234-5', 5280.00, '2024-03-14 08:00:12', 'Salário - Tech Corp LTDA', 'ted', 'completed', 'TED20240314001', 'banco_origem', 'BRL', '2024-03-14 08:00:12', '2024-03-14 08:00:12', 'sistema_folha', '10.0.5.123'),
(3, '001234-5', -1000.00, '2024-03-14 15:45:22', 'Transferência para Poupança', 'internal', 'completed', 'INT20240314003', 'web', 'BRL', '2024-03-14 15:45:22', '2024-03-14 15:45:22', 'cliente_web', '189.54.123.45'),
(4, '001234-5', 1450.50, '2024-03-13 19:12:33', 'PIX de Ana - Aluguel', 'pix', 'completed', 'PIX20240313004', 'mobile', 'BRL', '2024-03-13 19:12:33', '2024-03-13 19:12:33', 'cliente_externo', '177.98.234.12'),
(5, '001234-5', -2785.90, '2024-03-13 16:30:00', 'Pagamento Cartão Nubank', 'ted', 'completed', 'TED20240313005', 'web', 'BRL', '2024-03-13 16:30:00', '2024-03-13 16:30:00', 'cliente_web', '189.54.123.45'),
(6, '001234-5', -89.90, '2024-03-12 10:15:42', 'Farmácia São João', 'pix', 'completed', 'PIX20240312006', 'mobile', 'BRL', '2024-03-12 10:15:42', '2024-03-12 10:15:42', 'cliente_app', '192.168.1.105'),
(7, '001234-5', 325.45, '2024-03-12 11:20:18', 'Transferência de Investimentos', 'internal', 'completed', 'INT20240312007', 'web', 'BRL', '2024-03-12 11:20:18', '2024-03-12 11:20:18', 'sistema_invest', '10.0.5.89'),
(8, '001234-5', -42.80, '2024-03-11 20:45:33', 'Uber Viagens', 'pix', 'completed', 'PIX20240311008', 'mobile', 'BRL', '2024-03-11 20:45:33', '2024-03-11 20:45:33', 'cliente_app', '192.168.0.15'),
(9, '001234-5', -129.99, '2024-03-11 14:22:55', 'Pagamento Internet Vivo', 'ted', 'completed', 'TED20240311009', 'web', 'BRL', '2024-03-11 14:22:55', '2024-03-11 14:22:55', 'cliente_web', '189.54.123.45'),
(10, '001234-5', -64.90, '2024-03-10 19:33:21', 'iFood Refeições', 'pix', 'completed', 'PIX20240310010', 'mobile', 'BRL', '2024-03-10 19:33:21', '2024-03-10 19:33:21', 'cliente_app', '192.168.1.105');

-- For the remaining transactions that have less fields, we'll insert only the available data
INSERT INTO fn_transfer (
    id, data_transacao, tipo, descricao, valor, status
) VALUES
(11, '2024-03-10 00:00:00', 'internal', 'Resgate CDB', 1580.00, 'completed'),
(12, '2024-03-09 00:00:00', 'pix', 'Academia Smart Fit', -99.90, 'completed'),
(13, '2024-03-09 00:00:00', 'ted', 'Aluguel Apartamento', -1800.00, 'completed'),
(14, '2024-03-08 00:00:00', 'pix', 'Presente Aniversário Maria', -150.00, 'completed'),
(15, '2024-03-08 00:00:00', 'internal', 'Rendimento Poupança', 12.75, 'completed'),
(16, '2024-03-07 00:00:00', 'pix', 'Conta de Luz - CPFL', -245.67, 'completed'),
(17, '2024-03-07 00:00:00', 'ted', 'Freelance - Design Logo', 800.00, 'completed'),
(18, '2024-03-06 00:00:00', 'pix', 'Spotify Premium', -19.90, 'completed'),
(19, '2024-03-06 00:00:00', 'internal', 'Aplicação LCI', -2000.00, 'completed'),
(20, '2024-03-05 00:00:00', 'pix', 'Conta de Água - SABESP', -87.45, 'completed'); 