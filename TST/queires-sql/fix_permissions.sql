-- Conceder permissões no schema public para operador
GRANT ALL ON SCHEMA public TO operador;
GRANT ALL ON ALL TABLES IN SCHEMA public TO operador;

-- Conceder permissões específicas na tabela fn_transfer
GRANT ALL PRIVILEGES ON TABLE fn_transfer TO operador;

-- Conceder permissão na sequência do id (necessário para INSERT)
GRANT USAGE, SELECT ON SEQUENCE fn_transfer_id_seq TO operador;

-- Tornar operador o owner do schema public
ALTER SCHEMA public OWNER TO operador;

-- Verificar as permissões da tabela
\dp fn_transfer