--
-- PostgreSQL database dump
--

-- Dumped from database version 16.8 (Ubuntu 16.8-0ubuntu0.24.04.1)
-- Dumped by pg_dump version 16.8 (Ubuntu 16.8-0ubuntu0.24.04.1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: fn_transfer; Type: TABLE; Schema: public; Owner: server
--

CREATE TABLE public.fn_transfer (
    id integer NOT NULL,
    conta character varying(20),
    valor numeric(10,2),
    data_transacao timestamp without time zone,
    descricao character varying(255),
    tipo character varying(50),
    status character varying(50),
    referencia_externa character varying(100),
    canal character varying(50),
    moeda character varying(3),
    created_at timestamp without time zone,
    updated_at timestamp without time zone,
    usuario_operador character varying(100),
    ip_operador character varying(15)
);


ALTER TABLE public.fn_transfer OWNER TO server;

--
-- Name: fn_transfer_id_seq; Type: SEQUENCE; Schema: public; Owner: server
--

CREATE SEQUENCE public.fn_transfer_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.fn_transfer_id_seq OWNER TO server;

--
-- Name: fn_transfer_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: server
--

ALTER SEQUENCE public.fn_transfer_id_seq OWNED BY public.fn_transfer.id;


--
-- Name: fn_transfer id; Type: DEFAULT; Schema: public; Owner: server
--

ALTER TABLE ONLY public.fn_transfer ALTER COLUMN id SET DEFAULT nextval('public.fn_transfer_id_seq'::regclass);


--
-- Data for Name: fn_transfer; Type: TABLE DATA; Schema: public; Owner: server
--

COPY public.fn_transfer (id, conta, valor, data_transacao, descricao, tipo, status, referencia_externa, canal, moeda, created_at, updated_at, usuario_operador, ip_operador) FROM stdin;
1	001234-5	-156.75	2024-03-15 09:23:45	PIX para Mercado Delivery	pix	completed	PIX89745632	mobile	BRL	2024-03-15 09:23:45	2024-03-15 09:23:45	cliente_app	192.168.1.105
2	001234-5	5280.00	2024-03-14 08:00:12	Salário - Tech Corp LTDA	ted	completed	TED20240314001	banco_origem	BRL	2024-03-14 08:00:12	2024-03-14 08:00:12	sistema_folha	10.0.5.123
3	001234-5	-1000.00	2024-03-14 15:45:22	Transferência para Poupança	internal	completed	INT20240314003	web	BRL	2024-03-14 15:45:22	2024-03-14 15:45:22	cliente_web	189.54.123.45
4	001234-5	1450.50	2024-03-13 19:12:33	PIX de Ana - Aluguel	pix	completed	PIX20240313004	mobile	BRL	2024-03-13 19:12:33	2024-03-13 19:12:33	cliente_externo	177.98.234.12
5	001234-5	-2785.90	2024-03-13 16:30:00	Pagamento Cartão Nubank	ted	completed	TED20240313005	web	BRL	2024-03-13 16:30:00	2024-03-13 16:30:00	cliente_web	189.54.123.45
6	001234-5	-89.90	2024-03-12 10:15:42	Farmácia São João	pix	completed	PIX20240312006	mobile	BRL	2024-03-12 10:15:42	2024-03-12 10:15:42	cliente_app	192.168.1.105
7	001234-5	325.45	2024-03-12 11:20:18	Transferência de Investimentos	internal	completed	INT20240312007	web	BRL	2024-03-12 11:20:18	2024-03-12 11:20:18	sistema_invest	10.0.5.89
8	001234-5	-42.80	2024-03-11 20:45:33	Uber Viagens	pix	completed	PIX20240311008	mobile	BRL	2024-03-11 20:45:33	2024-03-11 20:45:33	cliente_app	192.168.0.15
9	001234-5	-129.99	2024-03-11 14:22:55	Pagamento Internet Vivo	ted	completed	TED20240311009	web	BRL	2024-03-11 14:22:55	2024-03-11 14:22:55	cliente_web	189.54.123.45
10	001234-5	-64.90	2024-03-10 19:33:21	iFood Refeições	pix	completed	PIX20240310010	mobile	BRL	2024-03-10 19:33:21	2024-03-10 19:33:21	cliente_app	192.168.1.105
11	\N	1580.00	2024-03-10 00:00:00	Resgate CDB	internal	completed	\N	\N	\N	\N	\N	\N	\N
12	\N	-99.90	2024-03-09 00:00:00	Academia Smart Fit	pix	completed	\N	\N	\N	\N	\N	\N	\N
13	\N	-1800.00	2024-03-09 00:00:00	Aluguel Apartamento	ted	completed	\N	\N	\N	\N	\N	\N	\N
14	\N	-150.00	2024-03-08 00:00:00	Presente Aniversário Maria	pix	completed	\N	\N	\N	\N	\N	\N	\N
15	\N	12.75	2024-03-08 00:00:00	Rendimento Poupança	internal	completed	\N	\N	\N	\N	\N	\N	\N
16	\N	-245.67	2024-03-07 00:00:00	Conta de Luz - CPFL	pix	completed	\N	\N	\N	\N	\N	\N	\N
17	\N	800.00	2024-03-07 00:00:00	Freelance - Design Logo	ted	completed	\N	\N	\N	\N	\N	\N	\N
18	\N	-19.90	2024-03-06 00:00:00	Spotify Premium	pix	completed	\N	\N	\N	\N	\N	\N	\N
19	\N	-2000.00	2024-03-06 00:00:00	Aplicação LCI	internal	completed	\N	\N	\N	\N	\N	\N	\N
20	\N	-87.45	2024-03-05 00:00:00	Conta de Água - SABESP	pix	completed	\N	\N	\N	\N	\N	\N	\N
\.


--
-- Name: fn_transfer_id_seq; Type: SEQUENCE SET; Schema: public; Owner: server
--

SELECT pg_catalog.setval('public.fn_transfer_id_seq', 1, false);


--
-- Name: fn_transfer fn_transfer_pkey; Type: CONSTRAINT; Schema: public; Owner: server
--

ALTER TABLE ONLY public.fn_transfer
    ADD CONSTRAINT fn_transfer_pkey PRIMARY KEY (id);


--
-- Name: TABLE fn_transfer; Type: ACL; Schema: public; Owner: server
--

GRANT ALL ON TABLE public.fn_transfer TO operador;


--
-- Name: SEQUENCE fn_transfer_id_seq; Type: ACL; Schema: public; Owner: server
--

GRANT SELECT,USAGE ON SEQUENCE public.fn_transfer_id_seq TO operador;


--
-- PostgreSQL database dump complete
--

