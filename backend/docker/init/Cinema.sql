--
-- PostgreSQL database dump
--

-- Dumped from database version 17.4
-- Dumped by pg_dump version 17.4

-- Started on 2025-04-04 13:44:07

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 5 (class 2615 OID 41085)
-- Name: public; Type: SCHEMA; Schema: -; Owner: postgres
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO postgres;

--
-- TOC entry 4855 (class 0 OID 0)
-- Dependencies: 5
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: postgres
--

COMMENT ON SCHEMA public IS '';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 227 (class 1259 OID 41136)
-- Name: Booking; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Booking" (
    id integer NOT NULL,
    "sessionId" integer NOT NULL,
    "userId" integer NOT NULL,
    status text DEFAULT 'reserved'::text NOT NULL,
    "reservationExpiry" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."Booking" OWNER TO postgres;

--
-- TOC entry 226 (class 1259 OID 41135)
-- Name: Booking_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Booking_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Booking_id_seq" OWNER TO postgres;

--
-- TOC entry 4857 (class 0 OID 0)
-- Dependencies: 226
-- Name: Booking_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Booking_id_seq" OWNED BY public."Booking".id;


--
-- TOC entry 221 (class 1259 OID 41110)
-- Name: Movie; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Movie" (
    id integer NOT NULL,
    title text NOT NULL,
    duration integer NOT NULL
);


ALTER TABLE public."Movie" OWNER TO postgres;

--
-- TOC entry 220 (class 1259 OID 41109)
-- Name: Movie_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Movie_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Movie_id_seq" OWNER TO postgres;

--
-- TOC entry 4858 (class 0 OID 0)
-- Dependencies: 220
-- Name: Movie_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Movie_id_seq" OWNED BY public."Movie".id;


--
-- TOC entry 225 (class 1259 OID 41126)
-- Name: Seat; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Seat" (
    id integer NOT NULL,
    "sessionId" integer NOT NULL,
    "row" integer NOT NULL,
    "seatNumber" integer NOT NULL,
    status text DEFAULT 'available'::text NOT NULL,
    "bookingId" integer
);


ALTER TABLE public."Seat" OWNER TO postgres;

--
-- TOC entry 224 (class 1259 OID 41125)
-- Name: Seat_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Seat_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Seat_id_seq" OWNER TO postgres;

--
-- TOC entry 4859 (class 0 OID 0)
-- Dependencies: 224
-- Name: Seat_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Seat_id_seq" OWNED BY public."Seat".id;


--
-- TOC entry 223 (class 1259 OID 41119)
-- Name: Session; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Session" (
    id integer NOT NULL,
    "movieId" integer NOT NULL,
    "startTime" timestamp(3) without time zone NOT NULL,
    "totalRows" integer NOT NULL,
    "seatsPerRow" integer NOT NULL
);


ALTER TABLE public."Session" OWNER TO postgres;

--
-- TOC entry 222 (class 1259 OID 41118)
-- Name: Session_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Session_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Session_id_seq" OWNER TO postgres;

--
-- TOC entry 4860 (class 0 OID 0)
-- Dependencies: 222
-- Name: Session_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Session_id_seq" OWNED BY public."Session".id;


--
-- TOC entry 219 (class 1259 OID 41100)
-- Name: User; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."User" (
    id integer NOT NULL,
    "fullName" text,
    email text NOT NULL,
    password text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."User" OWNER TO postgres;

--
-- TOC entry 218 (class 1259 OID 41099)
-- Name: User_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."User_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."User_id_seq" OWNER TO postgres;

--
-- TOC entry 4861 (class 0 OID 0)
-- Dependencies: 218
-- Name: User_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."User_id_seq" OWNED BY public."User".id;


--
-- TOC entry 217 (class 1259 OID 41086)
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO postgres;

--
-- TOC entry 4673 (class 2604 OID 41139)
-- Name: Booking id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Booking" ALTER COLUMN id SET DEFAULT nextval('public."Booking_id_seq"'::regclass);


--
-- TOC entry 4669 (class 2604 OID 41113)
-- Name: Movie id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Movie" ALTER COLUMN id SET DEFAULT nextval('public."Movie_id_seq"'::regclass);


--
-- TOC entry 4671 (class 2604 OID 41129)
-- Name: Seat id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Seat" ALTER COLUMN id SET DEFAULT nextval('public."Seat_id_seq"'::regclass);


--
-- TOC entry 4670 (class 2604 OID 41122)
-- Name: Session id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Session" ALTER COLUMN id SET DEFAULT nextval('public."Session_id_seq"'::regclass);


--
-- TOC entry 4667 (class 2604 OID 41103)
-- Name: User id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User" ALTER COLUMN id SET DEFAULT nextval('public."User_id_seq"'::regclass);


--
-- TOC entry 4849 (class 0 OID 41136)
-- Dependencies: 227
-- Data for Name: Booking; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Booking" (id, "sessionId", "userId", status, "reservationExpiry", "createdAt") FROM stdin;
1	1	1	booked	\N	2025-04-04 09:34:23.975
2	2	2	reserved	2025-04-04 09:36:23.982	2025-04-04 09:34:23.983
\.


--
-- TOC entry 4843 (class 0 OID 41110)
-- Dependencies: 221
-- Data for Name: Movie; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Movie" (id, title, duration) FROM stdin;
1	The Hobbit	136
2	Inception	148
\.


--
-- TOC entry 4847 (class 0 OID 41126)
-- Dependencies: 225
-- Data for Name: Seat; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Seat" (id, "sessionId", "row", "seatNumber", status, "bookingId") FROM stdin;
3	1	1	3	available	\N
4	1	1	4	available	\N
5	1	1	5	available	\N
6	1	1	6	available	\N
7	1	1	7	available	\N
8	1	1	8	available	\N
9	1	1	9	available	\N
10	1	1	10	available	\N
11	1	2	1	available	\N
12	1	2	2	available	\N
13	1	2	3	available	\N
14	1	2	4	available	\N
15	1	2	5	available	\N
16	1	2	6	available	\N
17	1	2	7	available	\N
18	1	2	8	available	\N
19	1	2	9	available	\N
20	1	2	10	available	\N
21	1	3	1	available	\N
22	1	3	2	available	\N
23	1	3	3	available	\N
24	1	3	4	available	\N
25	1	3	5	available	\N
26	1	3	6	available	\N
27	1	3	7	available	\N
28	1	3	8	available	\N
29	1	3	9	available	\N
30	1	3	10	available	\N
31	1	4	1	available	\N
32	1	4	2	available	\N
33	1	4	3	available	\N
34	1	4	4	available	\N
35	1	4	5	available	\N
36	1	4	6	available	\N
37	1	4	7	available	\N
38	1	4	8	available	\N
39	1	4	9	available	\N
40	1	4	10	available	\N
41	1	5	1	available	\N
42	1	5	2	available	\N
43	1	5	3	available	\N
44	1	5	4	available	\N
45	1	5	5	available	\N
46	1	5	6	available	\N
47	1	5	7	available	\N
48	1	5	8	available	\N
49	1	5	9	available	\N
50	1	5	10	available	\N
52	2	1	2	available	\N
53	2	1	3	available	\N
54	2	1	4	available	\N
55	2	1	5	available	\N
56	2	1	6	available	\N
57	2	1	7	available	\N
58	2	1	8	available	\N
59	2	2	1	available	\N
60	2	2	2	available	\N
61	2	2	3	available	\N
62	2	2	4	available	\N
63	2	2	5	available	\N
64	2	2	6	available	\N
65	2	2	7	available	\N
66	2	2	8	available	\N
67	2	3	1	available	\N
68	2	3	2	available	\N
69	2	3	3	available	\N
70	2	3	4	available	\N
71	2	3	5	available	\N
72	2	3	6	available	\N
73	2	3	7	available	\N
74	2	3	8	available	\N
1	1	1	1	booked	1
2	1	1	2	booked	1
51	2	1	1	reserved	2
\.


--
-- TOC entry 4845 (class 0 OID 41119)
-- Dependencies: 223
-- Data for Name: Session; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Session" (id, "movieId", "startTime", "totalRows", "seatsPerRow") FROM stdin;
1	1	2025-04-02 19:00:00	5	10
2	2	2025-04-02 21:00:00	3	8
\.


--
-- TOC entry 4841 (class 0 OID 41100)
-- Dependencies: 219
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."User" (id, "fullName", email, password, "createdAt") FROM stdin;
1	\N	Giorgi@example.com	password123	2025-04-04 09:34:23.942
2	\N	Johny@example.com	password456	2025-04-04 09:34:23.951
\.


--
-- TOC entry 4839 (class 0 OID 41086)
-- Dependencies: 217
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
2c4e0b95-44a9-4320-89af-29ac2ce3d465	602bf5aa17bfdb41cda1156eb2c7deb74ca9a22f7a46a3112cdd685bdaf93370	2025-04-04 12:03:33.869139+04	20250404080333_init	\N	\N	2025-04-04 12:03:33.816843+04	1
\.


--
-- TOC entry 4862 (class 0 OID 0)
-- Dependencies: 226
-- Name: Booking_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Booking_id_seq"', 2, true);


--
-- TOC entry 4863 (class 0 OID 0)
-- Dependencies: 220
-- Name: Movie_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Movie_id_seq"', 2, true);


--
-- TOC entry 4864 (class 0 OID 0)
-- Dependencies: 224
-- Name: Seat_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Seat_id_seq"', 74, true);


--
-- TOC entry 4865 (class 0 OID 0)
-- Dependencies: 222
-- Name: Session_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Session_id_seq"', 2, true);


--
-- TOC entry 4866 (class 0 OID 0)
-- Dependencies: 218
-- Name: User_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."User_id_seq"', 2, true);


--
-- TOC entry 4688 (class 2606 OID 41145)
-- Name: Booking Booking_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Booking"
    ADD CONSTRAINT "Booking_pkey" PRIMARY KEY (id);


--
-- TOC entry 4682 (class 2606 OID 41117)
-- Name: Movie Movie_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Movie"
    ADD CONSTRAINT "Movie_pkey" PRIMARY KEY (id);


--
-- TOC entry 4686 (class 2606 OID 41134)
-- Name: Seat Seat_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Seat"
    ADD CONSTRAINT "Seat_pkey" PRIMARY KEY (id);


--
-- TOC entry 4684 (class 2606 OID 41124)
-- Name: Session Session_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Session"
    ADD CONSTRAINT "Session_pkey" PRIMARY KEY (id);


--
-- TOC entry 4680 (class 2606 OID 41108)
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- TOC entry 4677 (class 2606 OID 41094)
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- TOC entry 4678 (class 1259 OID 41146)
-- Name: User_email_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "User_email_key" ON public."User" USING btree (email);


--
-- TOC entry 4692 (class 2606 OID 41162)
-- Name: Booking Booking_sessionId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Booking"
    ADD CONSTRAINT "Booking_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES public."Session"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 4693 (class 2606 OID 41167)
-- Name: Booking Booking_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Booking"
    ADD CONSTRAINT "Booking_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 4690 (class 2606 OID 41157)
-- Name: Seat Seat_bookingId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Seat"
    ADD CONSTRAINT "Seat_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES public."Booking"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 4691 (class 2606 OID 41152)
-- Name: Seat Seat_sessionId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Seat"
    ADD CONSTRAINT "Seat_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES public."Session"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 4689 (class 2606 OID 41147)
-- Name: Session Session_movieId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Session"
    ADD CONSTRAINT "Session_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES public."Movie"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 4856 (class 0 OID 0)
-- Dependencies: 5
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;


-- Completed on 2025-04-04 13:44:07

--
-- PostgreSQL database dump complete
--

