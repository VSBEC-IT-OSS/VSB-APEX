--
-- PostgreSQL database dump
--

\restrict G2GXxw4a9c92g81P2dCzUrcqWaeczaqU4X50p7flLBs5LNsB830N9gj7cgjrRjm

-- Dumped from database version 18.3
-- Dumped by pg_dump version 18.3

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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: activity_logs; Type: TABLE; Schema: public; Owner: vsb_user
--

CREATE TABLE public.activity_logs (
    id integer NOT NULL,
    user_id integer NOT NULL,
    action character varying(20) NOT NULL,
    ip_address character varying(45),
    user_agent character varying(300),
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.activity_logs OWNER TO vsb_user;

--
-- Name: activity_logs_id_seq; Type: SEQUENCE; Schema: public; Owner: vsb_user
--

CREATE SEQUENCE public.activity_logs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.activity_logs_id_seq OWNER TO vsb_user;

--
-- Name: activity_logs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: vsb_user
--

ALTER SEQUENCE public.activity_logs_id_seq OWNED BY public.activity_logs.id;


--
-- Name: alembic_version; Type: TABLE; Schema: public; Owner: vsb_user
--

CREATE TABLE public.alembic_version (
    version_num character varying(32) NOT NULL
);


ALTER TABLE public.alembic_version OWNER TO vsb_user;

--
-- Name: attendance_records; Type: TABLE; Schema: public; Owner: vsb_user
--

CREATE TABLE public.attendance_records (
    id integer NOT NULL,
    student_id character varying(20) NOT NULL,
    student_name character varying(100),
    year character varying(20) NOT NULL,
    section character varying(5) NOT NULL,
    subject_code character varying(20) NOT NULL,
    subject_name character varying(100),
    date date NOT NULL,
    status character varying(10) NOT NULL,
    uploaded_at timestamp with time zone DEFAULT now(),
    upload_batch character varying(50)
);


ALTER TABLE public.attendance_records OWNER TO vsb_user;

--
-- Name: attendance_records_id_seq; Type: SEQUENCE; Schema: public; Owner: vsb_user
--

CREATE SEQUENCE public.attendance_records_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.attendance_records_id_seq OWNER TO vsb_user;

--
-- Name: attendance_records_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: vsb_user
--

ALTER SEQUENCE public.attendance_records_id_seq OWNED BY public.attendance_records.id;


--
-- Name: attendance_summary; Type: TABLE; Schema: public; Owner: vsb_user
--

CREATE TABLE public.attendance_summary (
    id integer NOT NULL,
    student_id character varying(20) NOT NULL,
    student_name character varying(100),
    year character varying(20) NOT NULL,
    section character varying(5) NOT NULL,
    subject_code character varying(20) NOT NULL,
    subject_name character varying(100),
    total_classes integer,
    classes_attended integer,
    attendance_pct double precision,
    is_below_75 boolean,
    updated_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.attendance_summary OWNER TO vsb_user;

--
-- Name: attendance_summary_id_seq; Type: SEQUENCE; Schema: public; Owner: vsb_user
--

CREATE SEQUENCE public.attendance_summary_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.attendance_summary_id_seq OWNER TO vsb_user;

--
-- Name: attendance_summary_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: vsb_user
--

ALTER SEQUENCE public.attendance_summary_id_seq OWNED BY public.attendance_summary.id;


--
-- Name: goals; Type: TABLE; Schema: public; Owner: vsb_user
--

CREATE TABLE public.goals (
    id integer NOT NULL,
    metric character varying(60) NOT NULL,
    label character varying(120) NOT NULL,
    target double precision NOT NULL,
    current double precision,
    unit character varying(10),
    deadline character varying(20),
    status character varying(20),
    auto_tracked boolean,
    rule character varying(255),
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.goals OWNER TO vsb_user;

--
-- Name: goals_id_seq; Type: SEQUENCE; Schema: public; Owner: vsb_user
--

CREATE SEQUENCE public.goals_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.goals_id_seq OWNER TO vsb_user;

--
-- Name: goals_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: vsb_user
--

ALTER SEQUENCE public.goals_id_seq OWNED BY public.goals.id;


--
-- Name: internal_tests; Type: TABLE; Schema: public; Owner: vsb_user
--

CREATE TABLE public.internal_tests (
    id integer NOT NULL,
    student_id character varying(20) NOT NULL,
    student_name character varying(100),
    year character varying(20) NOT NULL,
    section character varying(5) NOT NULL,
    subject_code character varying(20) NOT NULL,
    subject_name character varying(100),
    test_number integer NOT NULL,
    max_marks double precision,
    marks_scored double precision,
    uploaded_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.internal_tests OWNER TO vsb_user;

--
-- Name: internal_tests_id_seq; Type: SEQUENCE; Schema: public; Owner: vsb_user
--

CREATE SEQUENCE public.internal_tests_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.internal_tests_id_seq OWNER TO vsb_user;

--
-- Name: internal_tests_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: vsb_user
--

ALTER SEQUENCE public.internal_tests_id_seq OWNED BY public.internal_tests.id;


--
-- Name: placement; Type: TABLE; Schema: public; Owner: vsb_user
--

CREATE TABLE public.placement (
    id integer NOT NULL,
    student_id character varying(20) NOT NULL,
    student_name character varying(100),
    year character varying(20),
    section character varying(5),
    company character varying(120) NOT NULL,
    package_lpa double precision,
    offer_type character varying(30),
    batch character varying(20),
    upload_batch character varying(50),
    uploaded_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.placement OWNER TO vsb_user;

--
-- Name: placement_id_seq; Type: SEQUENCE; Schema: public; Owner: vsb_user
--

CREATE SEQUENCE public.placement_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.placement_id_seq OWNER TO vsb_user;

--
-- Name: placement_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: vsb_user
--

ALTER SEQUENCE public.placement_id_seq OWNED BY public.placement.id;


--
-- Name: results; Type: TABLE; Schema: public; Owner: vsb_user
--

CREATE TABLE public.results (
    id integer NOT NULL,
    student_id character varying(20) NOT NULL,
    student_name character varying(100),
    year character varying(20) NOT NULL,
    section character varying(5) NOT NULL,
    semester integer NOT NULL,
    subject_code character varying(20) NOT NULL,
    subject_name character varying(100),
    internal_marks double precision,
    external_marks double precision,
    total_marks double precision,
    grade character varying(5),
    is_pass boolean,
    has_arrear boolean,
    uploaded_at timestamp with time zone DEFAULT now(),
    upload_batch character varying(50)
);


ALTER TABLE public.results OWNER TO vsb_user;

--
-- Name: results_id_seq; Type: SEQUENCE; Schema: public; Owner: vsb_user
--

CREATE SEQUENCE public.results_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.results_id_seq OWNER TO vsb_user;

--
-- Name: results_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: vsb_user
--

ALTER SEQUENCE public.results_id_seq OWNED BY public.results.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: vsb_user
--

CREATE TABLE public.users (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    email character varying(150) NOT NULL,
    password character varying(255) NOT NULL,
    role character varying(20),
    is_active boolean,
    last_login timestamp with time zone,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.users OWNER TO vsb_user;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: vsb_user
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO vsb_user;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: vsb_user
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: activity_logs id; Type: DEFAULT; Schema: public; Owner: vsb_user
--

ALTER TABLE ONLY public.activity_logs ALTER COLUMN id SET DEFAULT nextval('public.activity_logs_id_seq'::regclass);


--
-- Name: attendance_records id; Type: DEFAULT; Schema: public; Owner: vsb_user
--

ALTER TABLE ONLY public.attendance_records ALTER COLUMN id SET DEFAULT nextval('public.attendance_records_id_seq'::regclass);


--
-- Name: attendance_summary id; Type: DEFAULT; Schema: public; Owner: vsb_user
--

ALTER TABLE ONLY public.attendance_summary ALTER COLUMN id SET DEFAULT nextval('public.attendance_summary_id_seq'::regclass);


--
-- Name: goals id; Type: DEFAULT; Schema: public; Owner: vsb_user
--

ALTER TABLE ONLY public.goals ALTER COLUMN id SET DEFAULT nextval('public.goals_id_seq'::regclass);


--
-- Name: internal_tests id; Type: DEFAULT; Schema: public; Owner: vsb_user
--

ALTER TABLE ONLY public.internal_tests ALTER COLUMN id SET DEFAULT nextval('public.internal_tests_id_seq'::regclass);


--
-- Name: placement id; Type: DEFAULT; Schema: public; Owner: vsb_user
--

ALTER TABLE ONLY public.placement ALTER COLUMN id SET DEFAULT nextval('public.placement_id_seq'::regclass);


--
-- Name: results id; Type: DEFAULT; Schema: public; Owner: vsb_user
--

ALTER TABLE ONLY public.results ALTER COLUMN id SET DEFAULT nextval('public.results_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: vsb_user
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: activity_logs; Type: TABLE DATA; Schema: public; Owner: vsb_user
--

COPY public.activity_logs (id, user_id, action, ip_address, user_agent, created_at) FROM stdin;
1	1	login	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36	2026-03-23 16:03:21.092402+05:30
\.


--
-- Data for Name: alembic_version; Type: TABLE DATA; Schema: public; Owner: vsb_user
--

COPY public.alembic_version (version_num) FROM stdin;
0002_activity_log
\.


--
-- Data for Name: attendance_records; Type: TABLE DATA; Schema: public; Owner: vsb_user
--

COPY public.attendance_records (id, student_id, student_name, year, section, subject_code, subject_name, date, status, uploaded_at, upload_batch) FROM stdin;
1	921221104001	Aakash R	2	A	IT2301	Data Structures	2024-11-01	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
2	921221104001	Aakash R	2	A	IT2301	Data Structures	2024-11-04	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
3	921221104001	Aakash R	2	A	IT2301	Data Structures	2024-11-07	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
4	921221104001	Aakash R	2	A	IT2301	Data Structures	2024-11-10	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
5	921221104001	Aakash R	2	A	IT2301	Data Structures	2024-11-13	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
6	921221104001	Aakash R	2	A	IT2301	Data Structures	2024-11-16	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
7	921221104001	Aakash R	2	A	IT2301	Data Structures	2024-11-19	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
8	921221104001	Aakash R	2	A	IT2301	Data Structures	2024-11-22	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
9	921221104001	Aakash R	2	A	IT2301	Data Structures	2024-11-25	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
10	921221104001	Aakash R	2	A	IT2301	Data Structures	2024-11-28	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
11	921221104001	Aakash R	2	A	IT2301	Data Structures	2024-12-01	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
12	921221104001	Aakash R	2	A	IT2301	Data Structures	2024-12-04	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
13	921221104001	Aakash R	2	A	IT2301	Data Structures	2024-12-07	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
14	921221104001	Aakash R	2	A	IT2301	Data Structures	2024-12-10	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
15	921221104001	Aakash R	2	A	IT2301	Data Structures	2024-12-13	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
16	921221104001	Aakash R	2	A	IT2301	Data Structures	2024-12-16	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
17	921221104001	Aakash R	2	A	IT2301	Data Structures	2024-12-19	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
18	921221104001	Aakash R	2	A	IT2301	Data Structures	2024-12-22	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
19	921221104001	Aakash R	2	A	IT2301	Data Structures	2024-12-25	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
20	921221104001	Aakash R	2	A	IT2301	Data Structures	2024-12-28	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
21	921221104001	Aakash R	2	A	IT2302	Digital Principles	2024-11-01	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
22	921221104001	Aakash R	2	A	IT2302	Digital Principles	2024-11-04	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
23	921221104001	Aakash R	2	A	IT2302	Digital Principles	2024-11-07	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
24	921221104001	Aakash R	2	A	IT2302	Digital Principles	2024-11-10	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
25	921221104001	Aakash R	2	A	IT2302	Digital Principles	2024-11-13	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
26	921221104001	Aakash R	2	A	IT2302	Digital Principles	2024-11-16	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
27	921221104001	Aakash R	2	A	IT2302	Digital Principles	2024-11-19	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
28	921221104001	Aakash R	2	A	IT2302	Digital Principles	2024-11-22	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
29	921221104001	Aakash R	2	A	IT2302	Digital Principles	2024-11-25	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
30	921221104001	Aakash R	2	A	IT2302	Digital Principles	2024-11-28	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
31	921221104001	Aakash R	2	A	IT2302	Digital Principles	2024-12-01	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
32	921221104001	Aakash R	2	A	IT2302	Digital Principles	2024-12-04	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
33	921221104001	Aakash R	2	A	IT2302	Digital Principles	2024-12-07	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
34	921221104001	Aakash R	2	A	IT2302	Digital Principles	2024-12-10	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
35	921221104001	Aakash R	2	A	IT2302	Digital Principles	2024-12-13	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
36	921221104001	Aakash R	2	A	IT2302	Digital Principles	2024-12-16	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
37	921221104001	Aakash R	2	A	IT2302	Digital Principles	2024-12-19	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
38	921221104001	Aakash R	2	A	IT2302	Digital Principles	2024-12-22	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
39	921221104001	Aakash R	2	A	IT2302	Digital Principles	2024-12-25	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
40	921221104001	Aakash R	2	A	IT2302	Digital Principles	2024-12-28	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
41	921221104001	Aakash R	2	A	IT2303	Computer Organization	2024-11-01	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
42	921221104001	Aakash R	2	A	IT2303	Computer Organization	2024-11-04	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
43	921221104001	Aakash R	2	A	IT2303	Computer Organization	2024-11-07	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
44	921221104001	Aakash R	2	A	IT2303	Computer Organization	2024-11-10	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
45	921221104001	Aakash R	2	A	IT2303	Computer Organization	2024-11-13	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
46	921221104001	Aakash R	2	A	IT2303	Computer Organization	2024-11-16	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
47	921221104001	Aakash R	2	A	IT2303	Computer Organization	2024-11-19	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
48	921221104001	Aakash R	2	A	IT2303	Computer Organization	2024-11-22	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
49	921221104001	Aakash R	2	A	IT2303	Computer Organization	2024-11-25	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
50	921221104001	Aakash R	2	A	IT2303	Computer Organization	2024-11-28	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
51	921221104001	Aakash R	2	A	IT2303	Computer Organization	2024-12-01	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
52	921221104001	Aakash R	2	A	IT2303	Computer Organization	2024-12-04	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
53	921221104001	Aakash R	2	A	IT2303	Computer Organization	2024-12-07	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
54	921221104001	Aakash R	2	A	IT2303	Computer Organization	2024-12-10	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
55	921221104001	Aakash R	2	A	IT2303	Computer Organization	2024-12-13	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
56	921221104001	Aakash R	2	A	IT2303	Computer Organization	2024-12-16	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
57	921221104001	Aakash R	2	A	IT2303	Computer Organization	2024-12-19	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
58	921221104001	Aakash R	2	A	IT2303	Computer Organization	2024-12-22	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
59	921221104001	Aakash R	2	A	IT2303	Computer Organization	2024-12-25	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
60	921221104001	Aakash R	2	A	IT2303	Computer Organization	2024-12-28	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
61	921221104001	Aakash R	2	A	MA2301	Discrete Mathematics	2024-11-01	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
62	921221104001	Aakash R	2	A	MA2301	Discrete Mathematics	2024-11-04	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
63	921221104001	Aakash R	2	A	MA2301	Discrete Mathematics	2024-11-07	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
64	921221104001	Aakash R	2	A	MA2301	Discrete Mathematics	2024-11-10	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
65	921221104001	Aakash R	2	A	MA2301	Discrete Mathematics	2024-11-13	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
66	921221104001	Aakash R	2	A	MA2301	Discrete Mathematics	2024-11-16	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
67	921221104001	Aakash R	2	A	MA2301	Discrete Mathematics	2024-11-19	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
68	921221104001	Aakash R	2	A	MA2301	Discrete Mathematics	2024-11-22	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
69	921221104001	Aakash R	2	A	MA2301	Discrete Mathematics	2024-11-25	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
70	921221104001	Aakash R	2	A	MA2301	Discrete Mathematics	2024-11-28	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
71	921221104001	Aakash R	2	A	MA2301	Discrete Mathematics	2024-12-01	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
72	921221104001	Aakash R	2	A	MA2301	Discrete Mathematics	2024-12-04	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
73	921221104001	Aakash R	2	A	MA2301	Discrete Mathematics	2024-12-07	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
74	921221104001	Aakash R	2	A	MA2301	Discrete Mathematics	2024-12-10	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
75	921221104001	Aakash R	2	A	MA2301	Discrete Mathematics	2024-12-13	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
76	921221104001	Aakash R	2	A	MA2301	Discrete Mathematics	2024-12-16	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
77	921221104001	Aakash R	2	A	MA2301	Discrete Mathematics	2024-12-19	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
78	921221104001	Aakash R	2	A	MA2301	Discrete Mathematics	2024-12-22	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
79	921221104001	Aakash R	2	A	MA2301	Discrete Mathematics	2024-12-25	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
80	921221104001	Aakash R	2	A	MA2301	Discrete Mathematics	2024-12-28	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
81	921221104001	Aakash R	2	A	IT2304	OOP with Java	2024-11-01	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
82	921221104001	Aakash R	2	A	IT2304	OOP with Java	2024-11-04	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
83	921221104001	Aakash R	2	A	IT2304	OOP with Java	2024-11-07	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
84	921221104001	Aakash R	2	A	IT2304	OOP with Java	2024-11-10	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
85	921221104001	Aakash R	2	A	IT2304	OOP with Java	2024-11-13	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
86	921221104001	Aakash R	2	A	IT2304	OOP with Java	2024-11-16	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
87	921221104001	Aakash R	2	A	IT2304	OOP with Java	2024-11-19	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
88	921221104001	Aakash R	2	A	IT2304	OOP with Java	2024-11-22	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
89	921221104001	Aakash R	2	A	IT2304	OOP with Java	2024-11-25	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
90	921221104001	Aakash R	2	A	IT2304	OOP with Java	2024-11-28	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
91	921221104001	Aakash R	2	A	IT2304	OOP with Java	2024-12-01	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
92	921221104001	Aakash R	2	A	IT2304	OOP with Java	2024-12-04	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
93	921221104001	Aakash R	2	A	IT2304	OOP with Java	2024-12-07	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
94	921221104001	Aakash R	2	A	IT2304	OOP with Java	2024-12-10	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
95	921221104001	Aakash R	2	A	IT2304	OOP with Java	2024-12-13	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
96	921221104001	Aakash R	2	A	IT2304	OOP with Java	2024-12-16	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
97	921221104001	Aakash R	2	A	IT2304	OOP with Java	2024-12-19	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
98	921221104001	Aakash R	2	A	IT2304	OOP with Java	2024-12-22	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
99	921221104001	Aakash R	2	A	IT2304	OOP with Java	2024-12-25	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
100	921221104001	Aakash R	2	A	IT2304	OOP with Java	2024-12-28	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
101	921221104002	Bharathi S	2	B	IT2301	Data Structures	2024-11-01	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
102	921221104002	Bharathi S	2	B	IT2301	Data Structures	2024-11-04	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
103	921221104002	Bharathi S	2	B	IT2301	Data Structures	2024-11-07	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
104	921221104002	Bharathi S	2	B	IT2301	Data Structures	2024-11-10	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
105	921221104002	Bharathi S	2	B	IT2301	Data Structures	2024-11-13	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
106	921221104002	Bharathi S	2	B	IT2301	Data Structures	2024-11-16	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
107	921221104002	Bharathi S	2	B	IT2301	Data Structures	2024-11-19	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
108	921221104002	Bharathi S	2	B	IT2301	Data Structures	2024-11-22	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
109	921221104002	Bharathi S	2	B	IT2301	Data Structures	2024-11-25	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
110	921221104002	Bharathi S	2	B	IT2301	Data Structures	2024-11-28	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
111	921221104002	Bharathi S	2	B	IT2301	Data Structures	2024-12-01	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
112	921221104002	Bharathi S	2	B	IT2301	Data Structures	2024-12-04	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
113	921221104002	Bharathi S	2	B	IT2301	Data Structures	2024-12-07	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
114	921221104002	Bharathi S	2	B	IT2301	Data Structures	2024-12-10	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
115	921221104002	Bharathi S	2	B	IT2301	Data Structures	2024-12-13	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
116	921221104002	Bharathi S	2	B	IT2301	Data Structures	2024-12-16	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
117	921221104002	Bharathi S	2	B	IT2301	Data Structures	2024-12-19	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
118	921221104002	Bharathi S	2	B	IT2301	Data Structures	2024-12-22	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
119	921221104002	Bharathi S	2	B	IT2301	Data Structures	2024-12-25	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
120	921221104002	Bharathi S	2	B	IT2301	Data Structures	2024-12-28	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
121	921221104002	Bharathi S	2	B	IT2302	Digital Principles	2024-11-01	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
122	921221104002	Bharathi S	2	B	IT2302	Digital Principles	2024-11-04	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
123	921221104002	Bharathi S	2	B	IT2302	Digital Principles	2024-11-07	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
124	921221104002	Bharathi S	2	B	IT2302	Digital Principles	2024-11-10	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
125	921221104002	Bharathi S	2	B	IT2302	Digital Principles	2024-11-13	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
126	921221104002	Bharathi S	2	B	IT2302	Digital Principles	2024-11-16	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
127	921221104002	Bharathi S	2	B	IT2302	Digital Principles	2024-11-19	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
128	921221104002	Bharathi S	2	B	IT2302	Digital Principles	2024-11-22	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
129	921221104002	Bharathi S	2	B	IT2302	Digital Principles	2024-11-25	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
130	921221104002	Bharathi S	2	B	IT2302	Digital Principles	2024-11-28	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
131	921221104002	Bharathi S	2	B	IT2302	Digital Principles	2024-12-01	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
132	921221104002	Bharathi S	2	B	IT2302	Digital Principles	2024-12-04	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
133	921221104002	Bharathi S	2	B	IT2302	Digital Principles	2024-12-07	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
134	921221104002	Bharathi S	2	B	IT2302	Digital Principles	2024-12-10	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
135	921221104002	Bharathi S	2	B	IT2302	Digital Principles	2024-12-13	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
136	921221104002	Bharathi S	2	B	IT2302	Digital Principles	2024-12-16	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
137	921221104002	Bharathi S	2	B	IT2302	Digital Principles	2024-12-19	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
138	921221104002	Bharathi S	2	B	IT2302	Digital Principles	2024-12-22	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
139	921221104002	Bharathi S	2	B	IT2302	Digital Principles	2024-12-25	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
140	921221104002	Bharathi S	2	B	IT2302	Digital Principles	2024-12-28	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
141	921221104002	Bharathi S	2	B	IT2303	Computer Organization	2024-11-01	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
142	921221104002	Bharathi S	2	B	IT2303	Computer Organization	2024-11-04	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
143	921221104002	Bharathi S	2	B	IT2303	Computer Organization	2024-11-07	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
144	921221104002	Bharathi S	2	B	IT2303	Computer Organization	2024-11-10	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
145	921221104002	Bharathi S	2	B	IT2303	Computer Organization	2024-11-13	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
146	921221104002	Bharathi S	2	B	IT2303	Computer Organization	2024-11-16	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
147	921221104002	Bharathi S	2	B	IT2303	Computer Organization	2024-11-19	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
148	921221104002	Bharathi S	2	B	IT2303	Computer Organization	2024-11-22	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
149	921221104002	Bharathi S	2	B	IT2303	Computer Organization	2024-11-25	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
150	921221104002	Bharathi S	2	B	IT2303	Computer Organization	2024-11-28	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
151	921221104002	Bharathi S	2	B	IT2303	Computer Organization	2024-12-01	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
152	921221104002	Bharathi S	2	B	IT2303	Computer Organization	2024-12-04	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
153	921221104002	Bharathi S	2	B	IT2303	Computer Organization	2024-12-07	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
154	921221104002	Bharathi S	2	B	IT2303	Computer Organization	2024-12-10	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
155	921221104002	Bharathi S	2	B	IT2303	Computer Organization	2024-12-13	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
156	921221104002	Bharathi S	2	B	IT2303	Computer Organization	2024-12-16	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
157	921221104002	Bharathi S	2	B	IT2303	Computer Organization	2024-12-19	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
158	921221104002	Bharathi S	2	B	IT2303	Computer Organization	2024-12-22	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
159	921221104002	Bharathi S	2	B	IT2303	Computer Organization	2024-12-25	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
160	921221104002	Bharathi S	2	B	IT2303	Computer Organization	2024-12-28	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
161	921221104002	Bharathi S	2	B	MA2301	Discrete Mathematics	2024-11-01	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
162	921221104002	Bharathi S	2	B	MA2301	Discrete Mathematics	2024-11-04	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
163	921221104002	Bharathi S	2	B	MA2301	Discrete Mathematics	2024-11-07	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
164	921221104002	Bharathi S	2	B	MA2301	Discrete Mathematics	2024-11-10	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
165	921221104002	Bharathi S	2	B	MA2301	Discrete Mathematics	2024-11-13	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
166	921221104002	Bharathi S	2	B	MA2301	Discrete Mathematics	2024-11-16	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
167	921221104002	Bharathi S	2	B	MA2301	Discrete Mathematics	2024-11-19	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
168	921221104002	Bharathi S	2	B	MA2301	Discrete Mathematics	2024-11-22	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
169	921221104002	Bharathi S	2	B	MA2301	Discrete Mathematics	2024-11-25	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
170	921221104002	Bharathi S	2	B	MA2301	Discrete Mathematics	2024-11-28	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
171	921221104002	Bharathi S	2	B	MA2301	Discrete Mathematics	2024-12-01	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
172	921221104002	Bharathi S	2	B	MA2301	Discrete Mathematics	2024-12-04	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
173	921221104002	Bharathi S	2	B	MA2301	Discrete Mathematics	2024-12-07	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
174	921221104002	Bharathi S	2	B	MA2301	Discrete Mathematics	2024-12-10	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
175	921221104002	Bharathi S	2	B	MA2301	Discrete Mathematics	2024-12-13	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
176	921221104002	Bharathi S	2	B	MA2301	Discrete Mathematics	2024-12-16	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
177	921221104002	Bharathi S	2	B	MA2301	Discrete Mathematics	2024-12-19	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
178	921221104002	Bharathi S	2	B	MA2301	Discrete Mathematics	2024-12-22	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
179	921221104002	Bharathi S	2	B	MA2301	Discrete Mathematics	2024-12-25	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
180	921221104002	Bharathi S	2	B	MA2301	Discrete Mathematics	2024-12-28	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
181	921221104002	Bharathi S	2	B	IT2304	OOP with Java	2024-11-01	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
182	921221104002	Bharathi S	2	B	IT2304	OOP with Java	2024-11-04	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
183	921221104002	Bharathi S	2	B	IT2304	OOP with Java	2024-11-07	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
184	921221104002	Bharathi S	2	B	IT2304	OOP with Java	2024-11-10	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
185	921221104002	Bharathi S	2	B	IT2304	OOP with Java	2024-11-13	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
186	921221104002	Bharathi S	2	B	IT2304	OOP with Java	2024-11-16	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
187	921221104002	Bharathi S	2	B	IT2304	OOP with Java	2024-11-19	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
188	921221104002	Bharathi S	2	B	IT2304	OOP with Java	2024-11-22	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
189	921221104002	Bharathi S	2	B	IT2304	OOP with Java	2024-11-25	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
190	921221104002	Bharathi S	2	B	IT2304	OOP with Java	2024-11-28	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
191	921221104002	Bharathi S	2	B	IT2304	OOP with Java	2024-12-01	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
192	921221104002	Bharathi S	2	B	IT2304	OOP with Java	2024-12-04	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
193	921221104002	Bharathi S	2	B	IT2304	OOP with Java	2024-12-07	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
194	921221104002	Bharathi S	2	B	IT2304	OOP with Java	2024-12-10	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
195	921221104002	Bharathi S	2	B	IT2304	OOP with Java	2024-12-13	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
196	921221104002	Bharathi S	2	B	IT2304	OOP with Java	2024-12-16	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
197	921221104002	Bharathi S	2	B	IT2304	OOP with Java	2024-12-19	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
198	921221104002	Bharathi S	2	B	IT2304	OOP with Java	2024-12-22	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
199	921221104002	Bharathi S	2	B	IT2304	OOP with Java	2024-12-25	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
200	921221104002	Bharathi S	2	B	IT2304	OOP with Java	2024-12-28	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
201	921221104003	Chandru M	2	C	IT2301	Data Structures	2024-11-01	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
202	921221104003	Chandru M	2	C	IT2301	Data Structures	2024-11-04	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
203	921221104003	Chandru M	2	C	IT2301	Data Structures	2024-11-07	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
204	921221104003	Chandru M	2	C	IT2301	Data Structures	2024-11-10	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
205	921221104003	Chandru M	2	C	IT2301	Data Structures	2024-11-13	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
206	921221104003	Chandru M	2	C	IT2301	Data Structures	2024-11-16	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
207	921221104003	Chandru M	2	C	IT2301	Data Structures	2024-11-19	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
208	921221104003	Chandru M	2	C	IT2301	Data Structures	2024-11-22	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
209	921221104003	Chandru M	2	C	IT2301	Data Structures	2024-11-25	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
210	921221104003	Chandru M	2	C	IT2301	Data Structures	2024-11-28	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
211	921221104003	Chandru M	2	C	IT2301	Data Structures	2024-12-01	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
212	921221104003	Chandru M	2	C	IT2301	Data Structures	2024-12-04	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
213	921221104003	Chandru M	2	C	IT2301	Data Structures	2024-12-07	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
214	921221104003	Chandru M	2	C	IT2301	Data Structures	2024-12-10	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
215	921221104003	Chandru M	2	C	IT2301	Data Structures	2024-12-13	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
216	921221104003	Chandru M	2	C	IT2301	Data Structures	2024-12-16	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
217	921221104003	Chandru M	2	C	IT2301	Data Structures	2024-12-19	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
218	921221104003	Chandru M	2	C	IT2301	Data Structures	2024-12-22	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
219	921221104003	Chandru M	2	C	IT2301	Data Structures	2024-12-25	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
220	921221104003	Chandru M	2	C	IT2301	Data Structures	2024-12-28	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
221	921221104003	Chandru M	2	C	IT2302	Digital Principles	2024-11-01	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
222	921221104003	Chandru M	2	C	IT2302	Digital Principles	2024-11-04	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
223	921221104003	Chandru M	2	C	IT2302	Digital Principles	2024-11-07	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
224	921221104003	Chandru M	2	C	IT2302	Digital Principles	2024-11-10	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
225	921221104003	Chandru M	2	C	IT2302	Digital Principles	2024-11-13	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
226	921221104003	Chandru M	2	C	IT2302	Digital Principles	2024-11-16	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
227	921221104003	Chandru M	2	C	IT2302	Digital Principles	2024-11-19	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
228	921221104003	Chandru M	2	C	IT2302	Digital Principles	2024-11-22	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
229	921221104003	Chandru M	2	C	IT2302	Digital Principles	2024-11-25	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
230	921221104003	Chandru M	2	C	IT2302	Digital Principles	2024-11-28	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
231	921221104003	Chandru M	2	C	IT2302	Digital Principles	2024-12-01	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
232	921221104003	Chandru M	2	C	IT2302	Digital Principles	2024-12-04	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
233	921221104003	Chandru M	2	C	IT2302	Digital Principles	2024-12-07	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
234	921221104003	Chandru M	2	C	IT2302	Digital Principles	2024-12-10	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
235	921221104003	Chandru M	2	C	IT2302	Digital Principles	2024-12-13	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
236	921221104003	Chandru M	2	C	IT2302	Digital Principles	2024-12-16	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
237	921221104003	Chandru M	2	C	IT2302	Digital Principles	2024-12-19	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
238	921221104003	Chandru M	2	C	IT2302	Digital Principles	2024-12-22	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
239	921221104003	Chandru M	2	C	IT2302	Digital Principles	2024-12-25	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
240	921221104003	Chandru M	2	C	IT2302	Digital Principles	2024-12-28	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
241	921221104003	Chandru M	2	C	IT2303	Computer Organization	2024-11-01	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
242	921221104003	Chandru M	2	C	IT2303	Computer Organization	2024-11-04	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
243	921221104003	Chandru M	2	C	IT2303	Computer Organization	2024-11-07	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
244	921221104003	Chandru M	2	C	IT2303	Computer Organization	2024-11-10	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
245	921221104003	Chandru M	2	C	IT2303	Computer Organization	2024-11-13	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
246	921221104003	Chandru M	2	C	IT2303	Computer Organization	2024-11-16	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
247	921221104003	Chandru M	2	C	IT2303	Computer Organization	2024-11-19	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
248	921221104003	Chandru M	2	C	IT2303	Computer Organization	2024-11-22	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
249	921221104003	Chandru M	2	C	IT2303	Computer Organization	2024-11-25	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
250	921221104003	Chandru M	2	C	IT2303	Computer Organization	2024-11-28	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
251	921221104003	Chandru M	2	C	IT2303	Computer Organization	2024-12-01	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
252	921221104003	Chandru M	2	C	IT2303	Computer Organization	2024-12-04	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
253	921221104003	Chandru M	2	C	IT2303	Computer Organization	2024-12-07	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
254	921221104003	Chandru M	2	C	IT2303	Computer Organization	2024-12-10	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
255	921221104003	Chandru M	2	C	IT2303	Computer Organization	2024-12-13	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
256	921221104003	Chandru M	2	C	IT2303	Computer Organization	2024-12-16	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
257	921221104003	Chandru M	2	C	IT2303	Computer Organization	2024-12-19	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
258	921221104003	Chandru M	2	C	IT2303	Computer Organization	2024-12-22	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
259	921221104003	Chandru M	2	C	IT2303	Computer Organization	2024-12-25	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
260	921221104003	Chandru M	2	C	IT2303	Computer Organization	2024-12-28	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
261	921221104003	Chandru M	2	C	MA2301	Discrete Mathematics	2024-11-01	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
262	921221104003	Chandru M	2	C	MA2301	Discrete Mathematics	2024-11-04	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
263	921221104003	Chandru M	2	C	MA2301	Discrete Mathematics	2024-11-07	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
264	921221104003	Chandru M	2	C	MA2301	Discrete Mathematics	2024-11-10	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
265	921221104003	Chandru M	2	C	MA2301	Discrete Mathematics	2024-11-13	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
266	921221104003	Chandru M	2	C	MA2301	Discrete Mathematics	2024-11-16	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
267	921221104003	Chandru M	2	C	MA2301	Discrete Mathematics	2024-11-19	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
268	921221104003	Chandru M	2	C	MA2301	Discrete Mathematics	2024-11-22	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
269	921221104003	Chandru M	2	C	MA2301	Discrete Mathematics	2024-11-25	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
270	921221104003	Chandru M	2	C	MA2301	Discrete Mathematics	2024-11-28	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
271	921221104003	Chandru M	2	C	MA2301	Discrete Mathematics	2024-12-01	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
272	921221104003	Chandru M	2	C	MA2301	Discrete Mathematics	2024-12-04	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
273	921221104003	Chandru M	2	C	MA2301	Discrete Mathematics	2024-12-07	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
274	921221104003	Chandru M	2	C	MA2301	Discrete Mathematics	2024-12-10	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
275	921221104003	Chandru M	2	C	MA2301	Discrete Mathematics	2024-12-13	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
276	921221104003	Chandru M	2	C	MA2301	Discrete Mathematics	2024-12-16	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
277	921221104003	Chandru M	2	C	MA2301	Discrete Mathematics	2024-12-19	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
278	921221104003	Chandru M	2	C	MA2301	Discrete Mathematics	2024-12-22	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
279	921221104003	Chandru M	2	C	MA2301	Discrete Mathematics	2024-12-25	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
280	921221104003	Chandru M	2	C	MA2301	Discrete Mathematics	2024-12-28	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
281	921221104003	Chandru M	2	C	IT2304	OOP with Java	2024-11-01	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
282	921221104003	Chandru M	2	C	IT2304	OOP with Java	2024-11-04	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
283	921221104003	Chandru M	2	C	IT2304	OOP with Java	2024-11-07	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
284	921221104003	Chandru M	2	C	IT2304	OOP with Java	2024-11-10	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
285	921221104003	Chandru M	2	C	IT2304	OOP with Java	2024-11-13	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
286	921221104003	Chandru M	2	C	IT2304	OOP with Java	2024-11-16	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
287	921221104003	Chandru M	2	C	IT2304	OOP with Java	2024-11-19	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
288	921221104003	Chandru M	2	C	IT2304	OOP with Java	2024-11-22	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
289	921221104003	Chandru M	2	C	IT2304	OOP with Java	2024-11-25	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
290	921221104003	Chandru M	2	C	IT2304	OOP with Java	2024-11-28	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
291	921221104003	Chandru M	2	C	IT2304	OOP with Java	2024-12-01	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
292	921221104003	Chandru M	2	C	IT2304	OOP with Java	2024-12-04	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
293	921221104003	Chandru M	2	C	IT2304	OOP with Java	2024-12-07	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
294	921221104003	Chandru M	2	C	IT2304	OOP with Java	2024-12-10	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
295	921221104003	Chandru M	2	C	IT2304	OOP with Java	2024-12-13	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
296	921221104003	Chandru M	2	C	IT2304	OOP with Java	2024-12-16	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
297	921221104003	Chandru M	2	C	IT2304	OOP with Java	2024-12-19	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
298	921221104003	Chandru M	2	C	IT2304	OOP with Java	2024-12-22	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
299	921221104003	Chandru M	2	C	IT2304	OOP with Java	2024-12-25	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
300	921221104003	Chandru M	2	C	IT2304	OOP with Java	2024-12-28	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
301	921221104004	Deepika V	2	A	IT2301	Data Structures	2024-11-01	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
302	921221104004	Deepika V	2	A	IT2301	Data Structures	2024-11-04	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
303	921221104004	Deepika V	2	A	IT2301	Data Structures	2024-11-07	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
304	921221104004	Deepika V	2	A	IT2301	Data Structures	2024-11-10	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
305	921221104004	Deepika V	2	A	IT2301	Data Structures	2024-11-13	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
306	921221104004	Deepika V	2	A	IT2301	Data Structures	2024-11-16	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
307	921221104004	Deepika V	2	A	IT2301	Data Structures	2024-11-19	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
308	921221104004	Deepika V	2	A	IT2301	Data Structures	2024-11-22	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
309	921221104004	Deepika V	2	A	IT2301	Data Structures	2024-11-25	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
310	921221104004	Deepika V	2	A	IT2301	Data Structures	2024-11-28	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
311	921221104004	Deepika V	2	A	IT2301	Data Structures	2024-12-01	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
312	921221104004	Deepika V	2	A	IT2301	Data Structures	2024-12-04	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
313	921221104004	Deepika V	2	A	IT2301	Data Structures	2024-12-07	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
314	921221104004	Deepika V	2	A	IT2301	Data Structures	2024-12-10	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
315	921221104004	Deepika V	2	A	IT2301	Data Structures	2024-12-13	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
316	921221104004	Deepika V	2	A	IT2301	Data Structures	2024-12-16	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
317	921221104004	Deepika V	2	A	IT2301	Data Structures	2024-12-19	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
318	921221104004	Deepika V	2	A	IT2301	Data Structures	2024-12-22	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
319	921221104004	Deepika V	2	A	IT2301	Data Structures	2024-12-25	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
320	921221104004	Deepika V	2	A	IT2301	Data Structures	2024-12-28	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
321	921221104004	Deepika V	2	A	IT2302	Digital Principles	2024-11-01	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
322	921221104004	Deepika V	2	A	IT2302	Digital Principles	2024-11-04	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
323	921221104004	Deepika V	2	A	IT2302	Digital Principles	2024-11-07	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
324	921221104004	Deepika V	2	A	IT2302	Digital Principles	2024-11-10	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
325	921221104004	Deepika V	2	A	IT2302	Digital Principles	2024-11-13	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
326	921221104004	Deepika V	2	A	IT2302	Digital Principles	2024-11-16	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
327	921221104004	Deepika V	2	A	IT2302	Digital Principles	2024-11-19	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
328	921221104004	Deepika V	2	A	IT2302	Digital Principles	2024-11-22	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
329	921221104004	Deepika V	2	A	IT2302	Digital Principles	2024-11-25	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
330	921221104004	Deepika V	2	A	IT2302	Digital Principles	2024-11-28	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
331	921221104004	Deepika V	2	A	IT2302	Digital Principles	2024-12-01	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
332	921221104004	Deepika V	2	A	IT2302	Digital Principles	2024-12-04	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
333	921221104004	Deepika V	2	A	IT2302	Digital Principles	2024-12-07	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
334	921221104004	Deepika V	2	A	IT2302	Digital Principles	2024-12-10	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
335	921221104004	Deepika V	2	A	IT2302	Digital Principles	2024-12-13	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
336	921221104004	Deepika V	2	A	IT2302	Digital Principles	2024-12-16	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
337	921221104004	Deepika V	2	A	IT2302	Digital Principles	2024-12-19	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
338	921221104004	Deepika V	2	A	IT2302	Digital Principles	2024-12-22	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
339	921221104004	Deepika V	2	A	IT2302	Digital Principles	2024-12-25	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
340	921221104004	Deepika V	2	A	IT2302	Digital Principles	2024-12-28	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
341	921221104004	Deepika V	2	A	IT2303	Computer Organization	2024-11-01	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
342	921221104004	Deepika V	2	A	IT2303	Computer Organization	2024-11-04	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
343	921221104004	Deepika V	2	A	IT2303	Computer Organization	2024-11-07	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
344	921221104004	Deepika V	2	A	IT2303	Computer Organization	2024-11-10	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
345	921221104004	Deepika V	2	A	IT2303	Computer Organization	2024-11-13	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
346	921221104004	Deepika V	2	A	IT2303	Computer Organization	2024-11-16	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
347	921221104004	Deepika V	2	A	IT2303	Computer Organization	2024-11-19	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
348	921221104004	Deepika V	2	A	IT2303	Computer Organization	2024-11-22	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
349	921221104004	Deepika V	2	A	IT2303	Computer Organization	2024-11-25	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
350	921221104004	Deepika V	2	A	IT2303	Computer Organization	2024-11-28	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
351	921221104004	Deepika V	2	A	IT2303	Computer Organization	2024-12-01	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
352	921221104004	Deepika V	2	A	IT2303	Computer Organization	2024-12-04	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
353	921221104004	Deepika V	2	A	IT2303	Computer Organization	2024-12-07	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
354	921221104004	Deepika V	2	A	IT2303	Computer Organization	2024-12-10	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
355	921221104004	Deepika V	2	A	IT2303	Computer Organization	2024-12-13	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
356	921221104004	Deepika V	2	A	IT2303	Computer Organization	2024-12-16	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
357	921221104004	Deepika V	2	A	IT2303	Computer Organization	2024-12-19	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
358	921221104004	Deepika V	2	A	IT2303	Computer Organization	2024-12-22	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
359	921221104004	Deepika V	2	A	IT2303	Computer Organization	2024-12-25	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
360	921221104004	Deepika V	2	A	IT2303	Computer Organization	2024-12-28	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
361	921221104004	Deepika V	2	A	MA2301	Discrete Mathematics	2024-11-01	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
362	921221104004	Deepika V	2	A	MA2301	Discrete Mathematics	2024-11-04	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
363	921221104004	Deepika V	2	A	MA2301	Discrete Mathematics	2024-11-07	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
364	921221104004	Deepika V	2	A	MA2301	Discrete Mathematics	2024-11-10	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
365	921221104004	Deepika V	2	A	MA2301	Discrete Mathematics	2024-11-13	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
366	921221104004	Deepika V	2	A	MA2301	Discrete Mathematics	2024-11-16	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
367	921221104004	Deepika V	2	A	MA2301	Discrete Mathematics	2024-11-19	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
368	921221104004	Deepika V	2	A	MA2301	Discrete Mathematics	2024-11-22	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
369	921221104004	Deepika V	2	A	MA2301	Discrete Mathematics	2024-11-25	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
370	921221104004	Deepika V	2	A	MA2301	Discrete Mathematics	2024-11-28	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
371	921221104004	Deepika V	2	A	MA2301	Discrete Mathematics	2024-12-01	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
372	921221104004	Deepika V	2	A	MA2301	Discrete Mathematics	2024-12-04	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
373	921221104004	Deepika V	2	A	MA2301	Discrete Mathematics	2024-12-07	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
374	921221104004	Deepika V	2	A	MA2301	Discrete Mathematics	2024-12-10	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
375	921221104004	Deepika V	2	A	MA2301	Discrete Mathematics	2024-12-13	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
376	921221104004	Deepika V	2	A	MA2301	Discrete Mathematics	2024-12-16	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
377	921221104004	Deepika V	2	A	MA2301	Discrete Mathematics	2024-12-19	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
378	921221104004	Deepika V	2	A	MA2301	Discrete Mathematics	2024-12-22	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
379	921221104004	Deepika V	2	A	MA2301	Discrete Mathematics	2024-12-25	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
380	921221104004	Deepika V	2	A	MA2301	Discrete Mathematics	2024-12-28	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
381	921221104004	Deepika V	2	A	IT2304	OOP with Java	2024-11-01	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
382	921221104004	Deepika V	2	A	IT2304	OOP with Java	2024-11-04	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
383	921221104004	Deepika V	2	A	IT2304	OOP with Java	2024-11-07	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
384	921221104004	Deepika V	2	A	IT2304	OOP with Java	2024-11-10	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
385	921221104004	Deepika V	2	A	IT2304	OOP with Java	2024-11-13	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
386	921221104004	Deepika V	2	A	IT2304	OOP with Java	2024-11-16	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
387	921221104004	Deepika V	2	A	IT2304	OOP with Java	2024-11-19	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
388	921221104004	Deepika V	2	A	IT2304	OOP with Java	2024-11-22	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
389	921221104004	Deepika V	2	A	IT2304	OOP with Java	2024-11-25	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
390	921221104004	Deepika V	2	A	IT2304	OOP with Java	2024-11-28	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
391	921221104004	Deepika V	2	A	IT2304	OOP with Java	2024-12-01	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
392	921221104004	Deepika V	2	A	IT2304	OOP with Java	2024-12-04	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
393	921221104004	Deepika V	2	A	IT2304	OOP with Java	2024-12-07	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
394	921221104004	Deepika V	2	A	IT2304	OOP with Java	2024-12-10	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
395	921221104004	Deepika V	2	A	IT2304	OOP with Java	2024-12-13	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
396	921221104004	Deepika V	2	A	IT2304	OOP with Java	2024-12-16	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
397	921221104004	Deepika V	2	A	IT2304	OOP with Java	2024-12-19	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
398	921221104004	Deepika V	2	A	IT2304	OOP with Java	2024-12-22	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
399	921221104004	Deepika V	2	A	IT2304	OOP with Java	2024-12-25	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
400	921221104004	Deepika V	2	A	IT2304	OOP with Java	2024-12-28	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
401	921221104005	Eswaran K	2	B	IT2301	Data Structures	2024-11-01	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
402	921221104005	Eswaran K	2	B	IT2301	Data Structures	2024-11-04	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
403	921221104005	Eswaran K	2	B	IT2301	Data Structures	2024-11-07	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
404	921221104005	Eswaran K	2	B	IT2301	Data Structures	2024-11-10	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
405	921221104005	Eswaran K	2	B	IT2301	Data Structures	2024-11-13	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
406	921221104005	Eswaran K	2	B	IT2301	Data Structures	2024-11-16	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
407	921221104005	Eswaran K	2	B	IT2301	Data Structures	2024-11-19	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
408	921221104005	Eswaran K	2	B	IT2301	Data Structures	2024-11-22	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
409	921221104005	Eswaran K	2	B	IT2301	Data Structures	2024-11-25	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
410	921221104005	Eswaran K	2	B	IT2301	Data Structures	2024-11-28	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
411	921221104005	Eswaran K	2	B	IT2301	Data Structures	2024-12-01	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
412	921221104005	Eswaran K	2	B	IT2301	Data Structures	2024-12-04	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
413	921221104005	Eswaran K	2	B	IT2301	Data Structures	2024-12-07	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
414	921221104005	Eswaran K	2	B	IT2301	Data Structures	2024-12-10	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
415	921221104005	Eswaran K	2	B	IT2301	Data Structures	2024-12-13	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
416	921221104005	Eswaran K	2	B	IT2301	Data Structures	2024-12-16	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
417	921221104005	Eswaran K	2	B	IT2301	Data Structures	2024-12-19	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
418	921221104005	Eswaran K	2	B	IT2301	Data Structures	2024-12-22	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
419	921221104005	Eswaran K	2	B	IT2301	Data Structures	2024-12-25	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
420	921221104005	Eswaran K	2	B	IT2301	Data Structures	2024-12-28	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
421	921221104005	Eswaran K	2	B	IT2302	Digital Principles	2024-11-01	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
422	921221104005	Eswaran K	2	B	IT2302	Digital Principles	2024-11-04	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
423	921221104005	Eswaran K	2	B	IT2302	Digital Principles	2024-11-07	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
424	921221104005	Eswaran K	2	B	IT2302	Digital Principles	2024-11-10	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
425	921221104005	Eswaran K	2	B	IT2302	Digital Principles	2024-11-13	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
426	921221104005	Eswaran K	2	B	IT2302	Digital Principles	2024-11-16	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
427	921221104005	Eswaran K	2	B	IT2302	Digital Principles	2024-11-19	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
428	921221104005	Eswaran K	2	B	IT2302	Digital Principles	2024-11-22	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
429	921221104005	Eswaran K	2	B	IT2302	Digital Principles	2024-11-25	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
430	921221104005	Eswaran K	2	B	IT2302	Digital Principles	2024-11-28	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
431	921221104005	Eswaran K	2	B	IT2302	Digital Principles	2024-12-01	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
432	921221104005	Eswaran K	2	B	IT2302	Digital Principles	2024-12-04	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
433	921221104005	Eswaran K	2	B	IT2302	Digital Principles	2024-12-07	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
434	921221104005	Eswaran K	2	B	IT2302	Digital Principles	2024-12-10	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
435	921221104005	Eswaran K	2	B	IT2302	Digital Principles	2024-12-13	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
436	921221104005	Eswaran K	2	B	IT2302	Digital Principles	2024-12-16	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
437	921221104005	Eswaran K	2	B	IT2302	Digital Principles	2024-12-19	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
438	921221104005	Eswaran K	2	B	IT2302	Digital Principles	2024-12-22	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
439	921221104005	Eswaran K	2	B	IT2302	Digital Principles	2024-12-25	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
440	921221104005	Eswaran K	2	B	IT2302	Digital Principles	2024-12-28	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
441	921221104005	Eswaran K	2	B	IT2303	Computer Organization	2024-11-01	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
442	921221104005	Eswaran K	2	B	IT2303	Computer Organization	2024-11-04	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
443	921221104005	Eswaran K	2	B	IT2303	Computer Organization	2024-11-07	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
444	921221104005	Eswaran K	2	B	IT2303	Computer Organization	2024-11-10	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
445	921221104005	Eswaran K	2	B	IT2303	Computer Organization	2024-11-13	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
446	921221104005	Eswaran K	2	B	IT2303	Computer Organization	2024-11-16	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
447	921221104005	Eswaran K	2	B	IT2303	Computer Organization	2024-11-19	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
448	921221104005	Eswaran K	2	B	IT2303	Computer Organization	2024-11-22	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
449	921221104005	Eswaran K	2	B	IT2303	Computer Organization	2024-11-25	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
450	921221104005	Eswaran K	2	B	IT2303	Computer Organization	2024-11-28	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
451	921221104005	Eswaran K	2	B	IT2303	Computer Organization	2024-12-01	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
452	921221104005	Eswaran K	2	B	IT2303	Computer Organization	2024-12-04	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
453	921221104005	Eswaran K	2	B	IT2303	Computer Organization	2024-12-07	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
454	921221104005	Eswaran K	2	B	IT2303	Computer Organization	2024-12-10	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
455	921221104005	Eswaran K	2	B	IT2303	Computer Organization	2024-12-13	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
456	921221104005	Eswaran K	2	B	IT2303	Computer Organization	2024-12-16	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
457	921221104005	Eswaran K	2	B	IT2303	Computer Organization	2024-12-19	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
458	921221104005	Eswaran K	2	B	IT2303	Computer Organization	2024-12-22	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
459	921221104005	Eswaran K	2	B	IT2303	Computer Organization	2024-12-25	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
460	921221104005	Eswaran K	2	B	IT2303	Computer Organization	2024-12-28	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
461	921221104005	Eswaran K	2	B	MA2301	Discrete Mathematics	2024-11-01	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
462	921221104005	Eswaran K	2	B	MA2301	Discrete Mathematics	2024-11-04	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
463	921221104005	Eswaran K	2	B	MA2301	Discrete Mathematics	2024-11-07	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
464	921221104005	Eswaran K	2	B	MA2301	Discrete Mathematics	2024-11-10	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
465	921221104005	Eswaran K	2	B	MA2301	Discrete Mathematics	2024-11-13	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
466	921221104005	Eswaran K	2	B	MA2301	Discrete Mathematics	2024-11-16	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
467	921221104005	Eswaran K	2	B	MA2301	Discrete Mathematics	2024-11-19	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
468	921221104005	Eswaran K	2	B	MA2301	Discrete Mathematics	2024-11-22	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
469	921221104005	Eswaran K	2	B	MA2301	Discrete Mathematics	2024-11-25	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
470	921221104005	Eswaran K	2	B	MA2301	Discrete Mathematics	2024-11-28	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
471	921221104005	Eswaran K	2	B	MA2301	Discrete Mathematics	2024-12-01	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
472	921221104005	Eswaran K	2	B	MA2301	Discrete Mathematics	2024-12-04	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
473	921221104005	Eswaran K	2	B	MA2301	Discrete Mathematics	2024-12-07	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
474	921221104005	Eswaran K	2	B	MA2301	Discrete Mathematics	2024-12-10	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
475	921221104005	Eswaran K	2	B	MA2301	Discrete Mathematics	2024-12-13	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
476	921221104005	Eswaran K	2	B	MA2301	Discrete Mathematics	2024-12-16	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
477	921221104005	Eswaran K	2	B	MA2301	Discrete Mathematics	2024-12-19	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
478	921221104005	Eswaran K	2	B	MA2301	Discrete Mathematics	2024-12-22	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
479	921221104005	Eswaran K	2	B	MA2301	Discrete Mathematics	2024-12-25	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
480	921221104005	Eswaran K	2	B	MA2301	Discrete Mathematics	2024-12-28	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
481	921221104005	Eswaran K	2	B	IT2304	OOP with Java	2024-11-01	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
482	921221104005	Eswaran K	2	B	IT2304	OOP with Java	2024-11-04	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
483	921221104005	Eswaran K	2	B	IT2304	OOP with Java	2024-11-07	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
484	921221104005	Eswaran K	2	B	IT2304	OOP with Java	2024-11-10	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
485	921221104005	Eswaran K	2	B	IT2304	OOP with Java	2024-11-13	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
486	921221104005	Eswaran K	2	B	IT2304	OOP with Java	2024-11-16	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
487	921221104005	Eswaran K	2	B	IT2304	OOP with Java	2024-11-19	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
488	921221104005	Eswaran K	2	B	IT2304	OOP with Java	2024-11-22	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
489	921221104005	Eswaran K	2	B	IT2304	OOP with Java	2024-11-25	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
490	921221104005	Eswaran K	2	B	IT2304	OOP with Java	2024-11-28	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
491	921221104005	Eswaran K	2	B	IT2304	OOP with Java	2024-12-01	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
492	921221104005	Eswaran K	2	B	IT2304	OOP with Java	2024-12-04	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
493	921221104005	Eswaran K	2	B	IT2304	OOP with Java	2024-12-07	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
494	921221104005	Eswaran K	2	B	IT2304	OOP with Java	2024-12-10	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
495	921221104005	Eswaran K	2	B	IT2304	OOP with Java	2024-12-13	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
496	921221104005	Eswaran K	2	B	IT2304	OOP with Java	2024-12-16	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
497	921221104005	Eswaran K	2	B	IT2304	OOP with Java	2024-12-19	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
498	921221104005	Eswaran K	2	B	IT2304	OOP with Java	2024-12-22	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
499	921221104005	Eswaran K	2	B	IT2304	OOP with Java	2024-12-25	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
500	921221104005	Eswaran K	2	B	IT2304	OOP with Java	2024-12-28	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
501	921221104006	Fathima N	2	C	IT2301	Data Structures	2024-11-01	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
502	921221104006	Fathima N	2	C	IT2301	Data Structures	2024-11-04	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
503	921221104006	Fathima N	2	C	IT2301	Data Structures	2024-11-07	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
504	921221104006	Fathima N	2	C	IT2301	Data Structures	2024-11-10	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
505	921221104006	Fathima N	2	C	IT2301	Data Structures	2024-11-13	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
506	921221104006	Fathima N	2	C	IT2301	Data Structures	2024-11-16	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
507	921221104006	Fathima N	2	C	IT2301	Data Structures	2024-11-19	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
508	921221104006	Fathima N	2	C	IT2301	Data Structures	2024-11-22	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
509	921221104006	Fathima N	2	C	IT2301	Data Structures	2024-11-25	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
510	921221104006	Fathima N	2	C	IT2301	Data Structures	2024-11-28	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
511	921221104006	Fathima N	2	C	IT2301	Data Structures	2024-12-01	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
512	921221104006	Fathima N	2	C	IT2301	Data Structures	2024-12-04	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
513	921221104006	Fathima N	2	C	IT2301	Data Structures	2024-12-07	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
514	921221104006	Fathima N	2	C	IT2301	Data Structures	2024-12-10	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
515	921221104006	Fathima N	2	C	IT2301	Data Structures	2024-12-13	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
516	921221104006	Fathima N	2	C	IT2301	Data Structures	2024-12-16	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
517	921221104006	Fathima N	2	C	IT2301	Data Structures	2024-12-19	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
518	921221104006	Fathima N	2	C	IT2301	Data Structures	2024-12-22	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
519	921221104006	Fathima N	2	C	IT2301	Data Structures	2024-12-25	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
520	921221104006	Fathima N	2	C	IT2301	Data Structures	2024-12-28	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
521	921221104006	Fathima N	2	C	IT2302	Digital Principles	2024-11-01	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
522	921221104006	Fathima N	2	C	IT2302	Digital Principles	2024-11-04	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
523	921221104006	Fathima N	2	C	IT2302	Digital Principles	2024-11-07	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
524	921221104006	Fathima N	2	C	IT2302	Digital Principles	2024-11-10	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
525	921221104006	Fathima N	2	C	IT2302	Digital Principles	2024-11-13	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
526	921221104006	Fathima N	2	C	IT2302	Digital Principles	2024-11-16	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
527	921221104006	Fathima N	2	C	IT2302	Digital Principles	2024-11-19	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
528	921221104006	Fathima N	2	C	IT2302	Digital Principles	2024-11-22	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
529	921221104006	Fathima N	2	C	IT2302	Digital Principles	2024-11-25	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
530	921221104006	Fathima N	2	C	IT2302	Digital Principles	2024-11-28	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
531	921221104006	Fathima N	2	C	IT2302	Digital Principles	2024-12-01	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
532	921221104006	Fathima N	2	C	IT2302	Digital Principles	2024-12-04	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
533	921221104006	Fathima N	2	C	IT2302	Digital Principles	2024-12-07	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
534	921221104006	Fathima N	2	C	IT2302	Digital Principles	2024-12-10	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
535	921221104006	Fathima N	2	C	IT2302	Digital Principles	2024-12-13	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
536	921221104006	Fathima N	2	C	IT2302	Digital Principles	2024-12-16	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
537	921221104006	Fathima N	2	C	IT2302	Digital Principles	2024-12-19	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
538	921221104006	Fathima N	2	C	IT2302	Digital Principles	2024-12-22	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
539	921221104006	Fathima N	2	C	IT2302	Digital Principles	2024-12-25	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
540	921221104006	Fathima N	2	C	IT2302	Digital Principles	2024-12-28	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
541	921221104006	Fathima N	2	C	IT2303	Computer Organization	2024-11-01	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
542	921221104006	Fathima N	2	C	IT2303	Computer Organization	2024-11-04	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
543	921221104006	Fathima N	2	C	IT2303	Computer Organization	2024-11-07	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
544	921221104006	Fathima N	2	C	IT2303	Computer Organization	2024-11-10	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
545	921221104006	Fathima N	2	C	IT2303	Computer Organization	2024-11-13	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
546	921221104006	Fathima N	2	C	IT2303	Computer Organization	2024-11-16	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
547	921221104006	Fathima N	2	C	IT2303	Computer Organization	2024-11-19	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
548	921221104006	Fathima N	2	C	IT2303	Computer Organization	2024-11-22	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
549	921221104006	Fathima N	2	C	IT2303	Computer Organization	2024-11-25	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
550	921221104006	Fathima N	2	C	IT2303	Computer Organization	2024-11-28	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
551	921221104006	Fathima N	2	C	IT2303	Computer Organization	2024-12-01	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
552	921221104006	Fathima N	2	C	IT2303	Computer Organization	2024-12-04	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
553	921221104006	Fathima N	2	C	IT2303	Computer Organization	2024-12-07	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
554	921221104006	Fathima N	2	C	IT2303	Computer Organization	2024-12-10	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
555	921221104006	Fathima N	2	C	IT2303	Computer Organization	2024-12-13	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
556	921221104006	Fathima N	2	C	IT2303	Computer Organization	2024-12-16	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
557	921221104006	Fathima N	2	C	IT2303	Computer Organization	2024-12-19	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
558	921221104006	Fathima N	2	C	IT2303	Computer Organization	2024-12-22	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
559	921221104006	Fathima N	2	C	IT2303	Computer Organization	2024-12-25	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
560	921221104006	Fathima N	2	C	IT2303	Computer Organization	2024-12-28	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
561	921221104006	Fathima N	2	C	MA2301	Discrete Mathematics	2024-11-01	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
562	921221104006	Fathima N	2	C	MA2301	Discrete Mathematics	2024-11-04	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
563	921221104006	Fathima N	2	C	MA2301	Discrete Mathematics	2024-11-07	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
564	921221104006	Fathima N	2	C	MA2301	Discrete Mathematics	2024-11-10	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
565	921221104006	Fathima N	2	C	MA2301	Discrete Mathematics	2024-11-13	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
566	921221104006	Fathima N	2	C	MA2301	Discrete Mathematics	2024-11-16	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
567	921221104006	Fathima N	2	C	MA2301	Discrete Mathematics	2024-11-19	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
568	921221104006	Fathima N	2	C	MA2301	Discrete Mathematics	2024-11-22	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
569	921221104006	Fathima N	2	C	MA2301	Discrete Mathematics	2024-11-25	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
570	921221104006	Fathima N	2	C	MA2301	Discrete Mathematics	2024-11-28	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
571	921221104006	Fathima N	2	C	MA2301	Discrete Mathematics	2024-12-01	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
572	921221104006	Fathima N	2	C	MA2301	Discrete Mathematics	2024-12-04	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
573	921221104006	Fathima N	2	C	MA2301	Discrete Mathematics	2024-12-07	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
574	921221104006	Fathima N	2	C	MA2301	Discrete Mathematics	2024-12-10	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
575	921221104006	Fathima N	2	C	MA2301	Discrete Mathematics	2024-12-13	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
576	921221104006	Fathima N	2	C	MA2301	Discrete Mathematics	2024-12-16	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
577	921221104006	Fathima N	2	C	MA2301	Discrete Mathematics	2024-12-19	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
578	921221104006	Fathima N	2	C	MA2301	Discrete Mathematics	2024-12-22	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
579	921221104006	Fathima N	2	C	MA2301	Discrete Mathematics	2024-12-25	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
580	921221104006	Fathima N	2	C	MA2301	Discrete Mathematics	2024-12-28	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
581	921221104006	Fathima N	2	C	IT2304	OOP with Java	2024-11-01	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
582	921221104006	Fathima N	2	C	IT2304	OOP with Java	2024-11-04	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
583	921221104006	Fathima N	2	C	IT2304	OOP with Java	2024-11-07	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
584	921221104006	Fathima N	2	C	IT2304	OOP with Java	2024-11-10	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
585	921221104006	Fathima N	2	C	IT2304	OOP with Java	2024-11-13	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
586	921221104006	Fathima N	2	C	IT2304	OOP with Java	2024-11-16	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
587	921221104006	Fathima N	2	C	IT2304	OOP with Java	2024-11-19	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
588	921221104006	Fathima N	2	C	IT2304	OOP with Java	2024-11-22	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
589	921221104006	Fathima N	2	C	IT2304	OOP with Java	2024-11-25	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
590	921221104006	Fathima N	2	C	IT2304	OOP with Java	2024-11-28	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
591	921221104006	Fathima N	2	C	IT2304	OOP with Java	2024-12-01	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
592	921221104006	Fathima N	2	C	IT2304	OOP with Java	2024-12-04	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
593	921221104006	Fathima N	2	C	IT2304	OOP with Java	2024-12-07	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
594	921221104006	Fathima N	2	C	IT2304	OOP with Java	2024-12-10	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
595	921221104006	Fathima N	2	C	IT2304	OOP with Java	2024-12-13	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
596	921221104006	Fathima N	2	C	IT2304	OOP with Java	2024-12-16	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
597	921221104006	Fathima N	2	C	IT2304	OOP with Java	2024-12-19	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
598	921221104006	Fathima N	2	C	IT2304	OOP with Java	2024-12-22	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
599	921221104006	Fathima N	2	C	IT2304	OOP with Java	2024-12-25	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
600	921221104006	Fathima N	2	C	IT2304	OOP with Java	2024-12-28	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
601	921221104007	Gopal T	2	A	IT2301	Data Structures	2024-11-01	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
602	921221104007	Gopal T	2	A	IT2301	Data Structures	2024-11-04	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
603	921221104007	Gopal T	2	A	IT2301	Data Structures	2024-11-07	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
604	921221104007	Gopal T	2	A	IT2301	Data Structures	2024-11-10	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
605	921221104007	Gopal T	2	A	IT2301	Data Structures	2024-11-13	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
606	921221104007	Gopal T	2	A	IT2301	Data Structures	2024-11-16	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
607	921221104007	Gopal T	2	A	IT2301	Data Structures	2024-11-19	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
608	921221104007	Gopal T	2	A	IT2301	Data Structures	2024-11-22	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
609	921221104007	Gopal T	2	A	IT2301	Data Structures	2024-11-25	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
610	921221104007	Gopal T	2	A	IT2301	Data Structures	2024-11-28	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
611	921221104007	Gopal T	2	A	IT2301	Data Structures	2024-12-01	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
612	921221104007	Gopal T	2	A	IT2301	Data Structures	2024-12-04	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
613	921221104007	Gopal T	2	A	IT2301	Data Structures	2024-12-07	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
614	921221104007	Gopal T	2	A	IT2301	Data Structures	2024-12-10	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
615	921221104007	Gopal T	2	A	IT2301	Data Structures	2024-12-13	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
616	921221104007	Gopal T	2	A	IT2301	Data Structures	2024-12-16	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
617	921221104007	Gopal T	2	A	IT2301	Data Structures	2024-12-19	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
618	921221104007	Gopal T	2	A	IT2301	Data Structures	2024-12-22	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
619	921221104007	Gopal T	2	A	IT2301	Data Structures	2024-12-25	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
620	921221104007	Gopal T	2	A	IT2301	Data Structures	2024-12-28	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
621	921221104007	Gopal T	2	A	IT2302	Digital Principles	2024-11-01	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
622	921221104007	Gopal T	2	A	IT2302	Digital Principles	2024-11-04	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
623	921221104007	Gopal T	2	A	IT2302	Digital Principles	2024-11-07	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
624	921221104007	Gopal T	2	A	IT2302	Digital Principles	2024-11-10	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
625	921221104007	Gopal T	2	A	IT2302	Digital Principles	2024-11-13	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
626	921221104007	Gopal T	2	A	IT2302	Digital Principles	2024-11-16	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
627	921221104007	Gopal T	2	A	IT2302	Digital Principles	2024-11-19	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
628	921221104007	Gopal T	2	A	IT2302	Digital Principles	2024-11-22	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
629	921221104007	Gopal T	2	A	IT2302	Digital Principles	2024-11-25	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
630	921221104007	Gopal T	2	A	IT2302	Digital Principles	2024-11-28	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
631	921221104007	Gopal T	2	A	IT2302	Digital Principles	2024-12-01	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
632	921221104007	Gopal T	2	A	IT2302	Digital Principles	2024-12-04	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
633	921221104007	Gopal T	2	A	IT2302	Digital Principles	2024-12-07	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
634	921221104007	Gopal T	2	A	IT2302	Digital Principles	2024-12-10	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
635	921221104007	Gopal T	2	A	IT2302	Digital Principles	2024-12-13	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
636	921221104007	Gopal T	2	A	IT2302	Digital Principles	2024-12-16	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
637	921221104007	Gopal T	2	A	IT2302	Digital Principles	2024-12-19	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
638	921221104007	Gopal T	2	A	IT2302	Digital Principles	2024-12-22	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
639	921221104007	Gopal T	2	A	IT2302	Digital Principles	2024-12-25	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
640	921221104007	Gopal T	2	A	IT2302	Digital Principles	2024-12-28	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
641	921221104007	Gopal T	2	A	IT2303	Computer Organization	2024-11-01	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
642	921221104007	Gopal T	2	A	IT2303	Computer Organization	2024-11-04	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
643	921221104007	Gopal T	2	A	IT2303	Computer Organization	2024-11-07	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
644	921221104007	Gopal T	2	A	IT2303	Computer Organization	2024-11-10	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
645	921221104007	Gopal T	2	A	IT2303	Computer Organization	2024-11-13	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
646	921221104007	Gopal T	2	A	IT2303	Computer Organization	2024-11-16	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
647	921221104007	Gopal T	2	A	IT2303	Computer Organization	2024-11-19	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
648	921221104007	Gopal T	2	A	IT2303	Computer Organization	2024-11-22	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
649	921221104007	Gopal T	2	A	IT2303	Computer Organization	2024-11-25	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
650	921221104007	Gopal T	2	A	IT2303	Computer Organization	2024-11-28	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
651	921221104007	Gopal T	2	A	IT2303	Computer Organization	2024-12-01	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
652	921221104007	Gopal T	2	A	IT2303	Computer Organization	2024-12-04	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
653	921221104007	Gopal T	2	A	IT2303	Computer Organization	2024-12-07	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
654	921221104007	Gopal T	2	A	IT2303	Computer Organization	2024-12-10	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
655	921221104007	Gopal T	2	A	IT2303	Computer Organization	2024-12-13	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
656	921221104007	Gopal T	2	A	IT2303	Computer Organization	2024-12-16	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
657	921221104007	Gopal T	2	A	IT2303	Computer Organization	2024-12-19	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
658	921221104007	Gopal T	2	A	IT2303	Computer Organization	2024-12-22	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
659	921221104007	Gopal T	2	A	IT2303	Computer Organization	2024-12-25	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
660	921221104007	Gopal T	2	A	IT2303	Computer Organization	2024-12-28	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
661	921221104007	Gopal T	2	A	MA2301	Discrete Mathematics	2024-11-01	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
662	921221104007	Gopal T	2	A	MA2301	Discrete Mathematics	2024-11-04	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
663	921221104007	Gopal T	2	A	MA2301	Discrete Mathematics	2024-11-07	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
664	921221104007	Gopal T	2	A	MA2301	Discrete Mathematics	2024-11-10	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
665	921221104007	Gopal T	2	A	MA2301	Discrete Mathematics	2024-11-13	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
666	921221104007	Gopal T	2	A	MA2301	Discrete Mathematics	2024-11-16	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
667	921221104007	Gopal T	2	A	MA2301	Discrete Mathematics	2024-11-19	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
668	921221104007	Gopal T	2	A	MA2301	Discrete Mathematics	2024-11-22	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
669	921221104007	Gopal T	2	A	MA2301	Discrete Mathematics	2024-11-25	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
670	921221104007	Gopal T	2	A	MA2301	Discrete Mathematics	2024-11-28	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
671	921221104007	Gopal T	2	A	MA2301	Discrete Mathematics	2024-12-01	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
672	921221104007	Gopal T	2	A	MA2301	Discrete Mathematics	2024-12-04	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
673	921221104007	Gopal T	2	A	MA2301	Discrete Mathematics	2024-12-07	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
674	921221104007	Gopal T	2	A	MA2301	Discrete Mathematics	2024-12-10	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
675	921221104007	Gopal T	2	A	MA2301	Discrete Mathematics	2024-12-13	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
676	921221104007	Gopal T	2	A	MA2301	Discrete Mathematics	2024-12-16	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
677	921221104007	Gopal T	2	A	MA2301	Discrete Mathematics	2024-12-19	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
678	921221104007	Gopal T	2	A	MA2301	Discrete Mathematics	2024-12-22	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
679	921221104007	Gopal T	2	A	MA2301	Discrete Mathematics	2024-12-25	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
680	921221104007	Gopal T	2	A	MA2301	Discrete Mathematics	2024-12-28	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
681	921221104007	Gopal T	2	A	IT2304	OOP with Java	2024-11-01	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
682	921221104007	Gopal T	2	A	IT2304	OOP with Java	2024-11-04	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
683	921221104007	Gopal T	2	A	IT2304	OOP with Java	2024-11-07	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
684	921221104007	Gopal T	2	A	IT2304	OOP with Java	2024-11-10	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
685	921221104007	Gopal T	2	A	IT2304	OOP with Java	2024-11-13	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
686	921221104007	Gopal T	2	A	IT2304	OOP with Java	2024-11-16	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
687	921221104007	Gopal T	2	A	IT2304	OOP with Java	2024-11-19	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
688	921221104007	Gopal T	2	A	IT2304	OOP with Java	2024-11-22	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
689	921221104007	Gopal T	2	A	IT2304	OOP with Java	2024-11-25	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
690	921221104007	Gopal T	2	A	IT2304	OOP with Java	2024-11-28	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
691	921221104007	Gopal T	2	A	IT2304	OOP with Java	2024-12-01	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
692	921221104007	Gopal T	2	A	IT2304	OOP with Java	2024-12-04	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
693	921221104007	Gopal T	2	A	IT2304	OOP with Java	2024-12-07	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
694	921221104007	Gopal T	2	A	IT2304	OOP with Java	2024-12-10	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
695	921221104007	Gopal T	2	A	IT2304	OOP with Java	2024-12-13	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
696	921221104007	Gopal T	2	A	IT2304	OOP with Java	2024-12-16	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
697	921221104007	Gopal T	2	A	IT2304	OOP with Java	2024-12-19	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
698	921221104007	Gopal T	2	A	IT2304	OOP with Java	2024-12-22	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
699	921221104007	Gopal T	2	A	IT2304	OOP with Java	2024-12-25	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
700	921221104007	Gopal T	2	A	IT2304	OOP with Java	2024-12-28	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
701	921221104008	Harini P	2	B	IT2301	Data Structures	2024-11-01	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
702	921221104008	Harini P	2	B	IT2301	Data Structures	2024-11-04	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
703	921221104008	Harini P	2	B	IT2301	Data Structures	2024-11-07	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
704	921221104008	Harini P	2	B	IT2301	Data Structures	2024-11-10	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
705	921221104008	Harini P	2	B	IT2301	Data Structures	2024-11-13	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
706	921221104008	Harini P	2	B	IT2301	Data Structures	2024-11-16	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
707	921221104008	Harini P	2	B	IT2301	Data Structures	2024-11-19	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
708	921221104008	Harini P	2	B	IT2301	Data Structures	2024-11-22	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
709	921221104008	Harini P	2	B	IT2301	Data Structures	2024-11-25	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
710	921221104008	Harini P	2	B	IT2301	Data Structures	2024-11-28	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
711	921221104008	Harini P	2	B	IT2301	Data Structures	2024-12-01	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
712	921221104008	Harini P	2	B	IT2301	Data Structures	2024-12-04	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
713	921221104008	Harini P	2	B	IT2301	Data Structures	2024-12-07	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
714	921221104008	Harini P	2	B	IT2301	Data Structures	2024-12-10	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
715	921221104008	Harini P	2	B	IT2301	Data Structures	2024-12-13	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
716	921221104008	Harini P	2	B	IT2301	Data Structures	2024-12-16	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
717	921221104008	Harini P	2	B	IT2301	Data Structures	2024-12-19	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
718	921221104008	Harini P	2	B	IT2301	Data Structures	2024-12-22	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
719	921221104008	Harini P	2	B	IT2301	Data Structures	2024-12-25	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
720	921221104008	Harini P	2	B	IT2301	Data Structures	2024-12-28	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
721	921221104008	Harini P	2	B	IT2302	Digital Principles	2024-11-01	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
722	921221104008	Harini P	2	B	IT2302	Digital Principles	2024-11-04	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
723	921221104008	Harini P	2	B	IT2302	Digital Principles	2024-11-07	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
724	921221104008	Harini P	2	B	IT2302	Digital Principles	2024-11-10	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
725	921221104008	Harini P	2	B	IT2302	Digital Principles	2024-11-13	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
726	921221104008	Harini P	2	B	IT2302	Digital Principles	2024-11-16	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
727	921221104008	Harini P	2	B	IT2302	Digital Principles	2024-11-19	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
728	921221104008	Harini P	2	B	IT2302	Digital Principles	2024-11-22	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
729	921221104008	Harini P	2	B	IT2302	Digital Principles	2024-11-25	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
730	921221104008	Harini P	2	B	IT2302	Digital Principles	2024-11-28	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
731	921221104008	Harini P	2	B	IT2302	Digital Principles	2024-12-01	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
732	921221104008	Harini P	2	B	IT2302	Digital Principles	2024-12-04	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
733	921221104008	Harini P	2	B	IT2302	Digital Principles	2024-12-07	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
734	921221104008	Harini P	2	B	IT2302	Digital Principles	2024-12-10	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
735	921221104008	Harini P	2	B	IT2302	Digital Principles	2024-12-13	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
736	921221104008	Harini P	2	B	IT2302	Digital Principles	2024-12-16	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
737	921221104008	Harini P	2	B	IT2302	Digital Principles	2024-12-19	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
738	921221104008	Harini P	2	B	IT2302	Digital Principles	2024-12-22	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
739	921221104008	Harini P	2	B	IT2302	Digital Principles	2024-12-25	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
740	921221104008	Harini P	2	B	IT2302	Digital Principles	2024-12-28	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
741	921221104008	Harini P	2	B	IT2303	Computer Organization	2024-11-01	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
742	921221104008	Harini P	2	B	IT2303	Computer Organization	2024-11-04	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
743	921221104008	Harini P	2	B	IT2303	Computer Organization	2024-11-07	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
744	921221104008	Harini P	2	B	IT2303	Computer Organization	2024-11-10	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
745	921221104008	Harini P	2	B	IT2303	Computer Organization	2024-11-13	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
746	921221104008	Harini P	2	B	IT2303	Computer Organization	2024-11-16	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
747	921221104008	Harini P	2	B	IT2303	Computer Organization	2024-11-19	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
748	921221104008	Harini P	2	B	IT2303	Computer Organization	2024-11-22	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
749	921221104008	Harini P	2	B	IT2303	Computer Organization	2024-11-25	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
750	921221104008	Harini P	2	B	IT2303	Computer Organization	2024-11-28	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
751	921221104008	Harini P	2	B	IT2303	Computer Organization	2024-12-01	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
752	921221104008	Harini P	2	B	IT2303	Computer Organization	2024-12-04	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
753	921221104008	Harini P	2	B	IT2303	Computer Organization	2024-12-07	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
754	921221104008	Harini P	2	B	IT2303	Computer Organization	2024-12-10	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
755	921221104008	Harini P	2	B	IT2303	Computer Organization	2024-12-13	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
756	921221104008	Harini P	2	B	IT2303	Computer Organization	2024-12-16	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
757	921221104008	Harini P	2	B	IT2303	Computer Organization	2024-12-19	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
758	921221104008	Harini P	2	B	IT2303	Computer Organization	2024-12-22	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
759	921221104008	Harini P	2	B	IT2303	Computer Organization	2024-12-25	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
760	921221104008	Harini P	2	B	IT2303	Computer Organization	2024-12-28	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
761	921221104008	Harini P	2	B	MA2301	Discrete Mathematics	2024-11-01	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
762	921221104008	Harini P	2	B	MA2301	Discrete Mathematics	2024-11-04	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
763	921221104008	Harini P	2	B	MA2301	Discrete Mathematics	2024-11-07	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
764	921221104008	Harini P	2	B	MA2301	Discrete Mathematics	2024-11-10	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
765	921221104008	Harini P	2	B	MA2301	Discrete Mathematics	2024-11-13	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
766	921221104008	Harini P	2	B	MA2301	Discrete Mathematics	2024-11-16	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
767	921221104008	Harini P	2	B	MA2301	Discrete Mathematics	2024-11-19	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
768	921221104008	Harini P	2	B	MA2301	Discrete Mathematics	2024-11-22	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
769	921221104008	Harini P	2	B	MA2301	Discrete Mathematics	2024-11-25	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
770	921221104008	Harini P	2	B	MA2301	Discrete Mathematics	2024-11-28	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
771	921221104008	Harini P	2	B	MA2301	Discrete Mathematics	2024-12-01	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
772	921221104008	Harini P	2	B	MA2301	Discrete Mathematics	2024-12-04	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
773	921221104008	Harini P	2	B	MA2301	Discrete Mathematics	2024-12-07	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
774	921221104008	Harini P	2	B	MA2301	Discrete Mathematics	2024-12-10	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
775	921221104008	Harini P	2	B	MA2301	Discrete Mathematics	2024-12-13	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
776	921221104008	Harini P	2	B	MA2301	Discrete Mathematics	2024-12-16	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
777	921221104008	Harini P	2	B	MA2301	Discrete Mathematics	2024-12-19	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
778	921221104008	Harini P	2	B	MA2301	Discrete Mathematics	2024-12-22	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
779	921221104008	Harini P	2	B	MA2301	Discrete Mathematics	2024-12-25	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
780	921221104008	Harini P	2	B	MA2301	Discrete Mathematics	2024-12-28	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
781	921221104008	Harini P	2	B	IT2304	OOP with Java	2024-11-01	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
782	921221104008	Harini P	2	B	IT2304	OOP with Java	2024-11-04	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
783	921221104008	Harini P	2	B	IT2304	OOP with Java	2024-11-07	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
784	921221104008	Harini P	2	B	IT2304	OOP with Java	2024-11-10	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
785	921221104008	Harini P	2	B	IT2304	OOP with Java	2024-11-13	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
786	921221104008	Harini P	2	B	IT2304	OOP with Java	2024-11-16	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
787	921221104008	Harini P	2	B	IT2304	OOP with Java	2024-11-19	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
788	921221104008	Harini P	2	B	IT2304	OOP with Java	2024-11-22	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
789	921221104008	Harini P	2	B	IT2304	OOP with Java	2024-11-25	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
790	921221104008	Harini P	2	B	IT2304	OOP with Java	2024-11-28	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
791	921221104008	Harini P	2	B	IT2304	OOP with Java	2024-12-01	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
792	921221104008	Harini P	2	B	IT2304	OOP with Java	2024-12-04	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
793	921221104008	Harini P	2	B	IT2304	OOP with Java	2024-12-07	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
794	921221104008	Harini P	2	B	IT2304	OOP with Java	2024-12-10	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
795	921221104008	Harini P	2	B	IT2304	OOP with Java	2024-12-13	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
796	921221104008	Harini P	2	B	IT2304	OOP with Java	2024-12-16	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
797	921221104008	Harini P	2	B	IT2304	OOP with Java	2024-12-19	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
798	921221104008	Harini P	2	B	IT2304	OOP with Java	2024-12-22	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
799	921221104008	Harini P	2	B	IT2304	OOP with Java	2024-12-25	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
800	921221104008	Harini P	2	B	IT2304	OOP with Java	2024-12-28	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
801	921221104009	Indira C	2	C	IT2301	Data Structures	2024-11-01	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
802	921221104009	Indira C	2	C	IT2301	Data Structures	2024-11-04	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
803	921221104009	Indira C	2	C	IT2301	Data Structures	2024-11-07	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
804	921221104009	Indira C	2	C	IT2301	Data Structures	2024-11-10	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
805	921221104009	Indira C	2	C	IT2301	Data Structures	2024-11-13	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
806	921221104009	Indira C	2	C	IT2301	Data Structures	2024-11-16	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
807	921221104009	Indira C	2	C	IT2301	Data Structures	2024-11-19	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
808	921221104009	Indira C	2	C	IT2301	Data Structures	2024-11-22	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
809	921221104009	Indira C	2	C	IT2301	Data Structures	2024-11-25	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
810	921221104009	Indira C	2	C	IT2301	Data Structures	2024-11-28	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
811	921221104009	Indira C	2	C	IT2301	Data Structures	2024-12-01	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
812	921221104009	Indira C	2	C	IT2301	Data Structures	2024-12-04	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
813	921221104009	Indira C	2	C	IT2301	Data Structures	2024-12-07	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
814	921221104009	Indira C	2	C	IT2301	Data Structures	2024-12-10	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
815	921221104009	Indira C	2	C	IT2301	Data Structures	2024-12-13	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
816	921221104009	Indira C	2	C	IT2301	Data Structures	2024-12-16	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
817	921221104009	Indira C	2	C	IT2301	Data Structures	2024-12-19	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
818	921221104009	Indira C	2	C	IT2301	Data Structures	2024-12-22	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
819	921221104009	Indira C	2	C	IT2301	Data Structures	2024-12-25	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
820	921221104009	Indira C	2	C	IT2301	Data Structures	2024-12-28	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
821	921221104009	Indira C	2	C	IT2302	Digital Principles	2024-11-01	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
822	921221104009	Indira C	2	C	IT2302	Digital Principles	2024-11-04	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
823	921221104009	Indira C	2	C	IT2302	Digital Principles	2024-11-07	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
824	921221104009	Indira C	2	C	IT2302	Digital Principles	2024-11-10	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
825	921221104009	Indira C	2	C	IT2302	Digital Principles	2024-11-13	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
826	921221104009	Indira C	2	C	IT2302	Digital Principles	2024-11-16	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
827	921221104009	Indira C	2	C	IT2302	Digital Principles	2024-11-19	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
828	921221104009	Indira C	2	C	IT2302	Digital Principles	2024-11-22	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
829	921221104009	Indira C	2	C	IT2302	Digital Principles	2024-11-25	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
830	921221104009	Indira C	2	C	IT2302	Digital Principles	2024-11-28	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
831	921221104009	Indira C	2	C	IT2302	Digital Principles	2024-12-01	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
832	921221104009	Indira C	2	C	IT2302	Digital Principles	2024-12-04	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
833	921221104009	Indira C	2	C	IT2302	Digital Principles	2024-12-07	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
834	921221104009	Indira C	2	C	IT2302	Digital Principles	2024-12-10	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
835	921221104009	Indira C	2	C	IT2302	Digital Principles	2024-12-13	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
836	921221104009	Indira C	2	C	IT2302	Digital Principles	2024-12-16	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
837	921221104009	Indira C	2	C	IT2302	Digital Principles	2024-12-19	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
838	921221104009	Indira C	2	C	IT2302	Digital Principles	2024-12-22	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
839	921221104009	Indira C	2	C	IT2302	Digital Principles	2024-12-25	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
840	921221104009	Indira C	2	C	IT2302	Digital Principles	2024-12-28	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
841	921221104009	Indira C	2	C	IT2303	Computer Organization	2024-11-01	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
842	921221104009	Indira C	2	C	IT2303	Computer Organization	2024-11-04	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
843	921221104009	Indira C	2	C	IT2303	Computer Organization	2024-11-07	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
844	921221104009	Indira C	2	C	IT2303	Computer Organization	2024-11-10	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
845	921221104009	Indira C	2	C	IT2303	Computer Organization	2024-11-13	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
846	921221104009	Indira C	2	C	IT2303	Computer Organization	2024-11-16	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
847	921221104009	Indira C	2	C	IT2303	Computer Organization	2024-11-19	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
848	921221104009	Indira C	2	C	IT2303	Computer Organization	2024-11-22	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
849	921221104009	Indira C	2	C	IT2303	Computer Organization	2024-11-25	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
850	921221104009	Indira C	2	C	IT2303	Computer Organization	2024-11-28	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
851	921221104009	Indira C	2	C	IT2303	Computer Organization	2024-12-01	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
852	921221104009	Indira C	2	C	IT2303	Computer Organization	2024-12-04	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
853	921221104009	Indira C	2	C	IT2303	Computer Organization	2024-12-07	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
854	921221104009	Indira C	2	C	IT2303	Computer Organization	2024-12-10	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
855	921221104009	Indira C	2	C	IT2303	Computer Organization	2024-12-13	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
856	921221104009	Indira C	2	C	IT2303	Computer Organization	2024-12-16	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
857	921221104009	Indira C	2	C	IT2303	Computer Organization	2024-12-19	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
858	921221104009	Indira C	2	C	IT2303	Computer Organization	2024-12-22	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
859	921221104009	Indira C	2	C	IT2303	Computer Organization	2024-12-25	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
860	921221104009	Indira C	2	C	IT2303	Computer Organization	2024-12-28	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
861	921221104009	Indira C	2	C	MA2301	Discrete Mathematics	2024-11-01	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
862	921221104009	Indira C	2	C	MA2301	Discrete Mathematics	2024-11-04	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
863	921221104009	Indira C	2	C	MA2301	Discrete Mathematics	2024-11-07	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
864	921221104009	Indira C	2	C	MA2301	Discrete Mathematics	2024-11-10	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
865	921221104009	Indira C	2	C	MA2301	Discrete Mathematics	2024-11-13	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
866	921221104009	Indira C	2	C	MA2301	Discrete Mathematics	2024-11-16	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
867	921221104009	Indira C	2	C	MA2301	Discrete Mathematics	2024-11-19	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
868	921221104009	Indira C	2	C	MA2301	Discrete Mathematics	2024-11-22	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
869	921221104009	Indira C	2	C	MA2301	Discrete Mathematics	2024-11-25	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
870	921221104009	Indira C	2	C	MA2301	Discrete Mathematics	2024-11-28	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
871	921221104009	Indira C	2	C	MA2301	Discrete Mathematics	2024-12-01	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
872	921221104009	Indira C	2	C	MA2301	Discrete Mathematics	2024-12-04	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
873	921221104009	Indira C	2	C	MA2301	Discrete Mathematics	2024-12-07	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
874	921221104009	Indira C	2	C	MA2301	Discrete Mathematics	2024-12-10	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
875	921221104009	Indira C	2	C	MA2301	Discrete Mathematics	2024-12-13	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
876	921221104009	Indira C	2	C	MA2301	Discrete Mathematics	2024-12-16	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
877	921221104009	Indira C	2	C	MA2301	Discrete Mathematics	2024-12-19	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
878	921221104009	Indira C	2	C	MA2301	Discrete Mathematics	2024-12-22	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
879	921221104009	Indira C	2	C	MA2301	Discrete Mathematics	2024-12-25	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
880	921221104009	Indira C	2	C	MA2301	Discrete Mathematics	2024-12-28	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
881	921221104009	Indira C	2	C	IT2304	OOP with Java	2024-11-01	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
882	921221104009	Indira C	2	C	IT2304	OOP with Java	2024-11-04	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
883	921221104009	Indira C	2	C	IT2304	OOP with Java	2024-11-07	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
884	921221104009	Indira C	2	C	IT2304	OOP with Java	2024-11-10	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
885	921221104009	Indira C	2	C	IT2304	OOP with Java	2024-11-13	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
886	921221104009	Indira C	2	C	IT2304	OOP with Java	2024-11-16	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
887	921221104009	Indira C	2	C	IT2304	OOP with Java	2024-11-19	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
888	921221104009	Indira C	2	C	IT2304	OOP with Java	2024-11-22	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
889	921221104009	Indira C	2	C	IT2304	OOP with Java	2024-11-25	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
890	921221104009	Indira C	2	C	IT2304	OOP with Java	2024-11-28	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
891	921221104009	Indira C	2	C	IT2304	OOP with Java	2024-12-01	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
892	921221104009	Indira C	2	C	IT2304	OOP with Java	2024-12-04	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
893	921221104009	Indira C	2	C	IT2304	OOP with Java	2024-12-07	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
894	921221104009	Indira C	2	C	IT2304	OOP with Java	2024-12-10	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
895	921221104009	Indira C	2	C	IT2304	OOP with Java	2024-12-13	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
896	921221104009	Indira C	2	C	IT2304	OOP with Java	2024-12-16	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
897	921221104009	Indira C	2	C	IT2304	OOP with Java	2024-12-19	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
898	921221104009	Indira C	2	C	IT2304	OOP with Java	2024-12-22	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
899	921221104009	Indira C	2	C	IT2304	OOP with Java	2024-12-25	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
900	921221104009	Indira C	2	C	IT2304	OOP with Java	2024-12-28	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
901	921221104010	Jayakumar B	2	A	IT2301	Data Structures	2024-11-01	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
902	921221104010	Jayakumar B	2	A	IT2301	Data Structures	2024-11-04	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
903	921221104010	Jayakumar B	2	A	IT2301	Data Structures	2024-11-07	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
904	921221104010	Jayakumar B	2	A	IT2301	Data Structures	2024-11-10	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
905	921221104010	Jayakumar B	2	A	IT2301	Data Structures	2024-11-13	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
906	921221104010	Jayakumar B	2	A	IT2301	Data Structures	2024-11-16	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
907	921221104010	Jayakumar B	2	A	IT2301	Data Structures	2024-11-19	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
908	921221104010	Jayakumar B	2	A	IT2301	Data Structures	2024-11-22	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
909	921221104010	Jayakumar B	2	A	IT2301	Data Structures	2024-11-25	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
910	921221104010	Jayakumar B	2	A	IT2301	Data Structures	2024-11-28	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
911	921221104010	Jayakumar B	2	A	IT2301	Data Structures	2024-12-01	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
912	921221104010	Jayakumar B	2	A	IT2301	Data Structures	2024-12-04	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
913	921221104010	Jayakumar B	2	A	IT2301	Data Structures	2024-12-07	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
914	921221104010	Jayakumar B	2	A	IT2301	Data Structures	2024-12-10	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
915	921221104010	Jayakumar B	2	A	IT2301	Data Structures	2024-12-13	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
916	921221104010	Jayakumar B	2	A	IT2301	Data Structures	2024-12-16	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
917	921221104010	Jayakumar B	2	A	IT2301	Data Structures	2024-12-19	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
918	921221104010	Jayakumar B	2	A	IT2301	Data Structures	2024-12-22	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
919	921221104010	Jayakumar B	2	A	IT2301	Data Structures	2024-12-25	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
920	921221104010	Jayakumar B	2	A	IT2301	Data Structures	2024-12-28	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
921	921221104010	Jayakumar B	2	A	IT2302	Digital Principles	2024-11-01	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
922	921221104010	Jayakumar B	2	A	IT2302	Digital Principles	2024-11-04	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
923	921221104010	Jayakumar B	2	A	IT2302	Digital Principles	2024-11-07	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
924	921221104010	Jayakumar B	2	A	IT2302	Digital Principles	2024-11-10	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
925	921221104010	Jayakumar B	2	A	IT2302	Digital Principles	2024-11-13	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
926	921221104010	Jayakumar B	2	A	IT2302	Digital Principles	2024-11-16	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
927	921221104010	Jayakumar B	2	A	IT2302	Digital Principles	2024-11-19	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
928	921221104010	Jayakumar B	2	A	IT2302	Digital Principles	2024-11-22	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
929	921221104010	Jayakumar B	2	A	IT2302	Digital Principles	2024-11-25	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
930	921221104010	Jayakumar B	2	A	IT2302	Digital Principles	2024-11-28	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
931	921221104010	Jayakumar B	2	A	IT2302	Digital Principles	2024-12-01	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
932	921221104010	Jayakumar B	2	A	IT2302	Digital Principles	2024-12-04	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
933	921221104010	Jayakumar B	2	A	IT2302	Digital Principles	2024-12-07	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
934	921221104010	Jayakumar B	2	A	IT2302	Digital Principles	2024-12-10	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
935	921221104010	Jayakumar B	2	A	IT2302	Digital Principles	2024-12-13	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
936	921221104010	Jayakumar B	2	A	IT2302	Digital Principles	2024-12-16	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
937	921221104010	Jayakumar B	2	A	IT2302	Digital Principles	2024-12-19	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
938	921221104010	Jayakumar B	2	A	IT2302	Digital Principles	2024-12-22	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
939	921221104010	Jayakumar B	2	A	IT2302	Digital Principles	2024-12-25	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
940	921221104010	Jayakumar B	2	A	IT2302	Digital Principles	2024-12-28	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
941	921221104010	Jayakumar B	2	A	IT2303	Computer Organization	2024-11-01	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
942	921221104010	Jayakumar B	2	A	IT2303	Computer Organization	2024-11-04	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
943	921221104010	Jayakumar B	2	A	IT2303	Computer Organization	2024-11-07	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
944	921221104010	Jayakumar B	2	A	IT2303	Computer Organization	2024-11-10	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
945	921221104010	Jayakumar B	2	A	IT2303	Computer Organization	2024-11-13	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
946	921221104010	Jayakumar B	2	A	IT2303	Computer Organization	2024-11-16	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
947	921221104010	Jayakumar B	2	A	IT2303	Computer Organization	2024-11-19	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
948	921221104010	Jayakumar B	2	A	IT2303	Computer Organization	2024-11-22	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
949	921221104010	Jayakumar B	2	A	IT2303	Computer Organization	2024-11-25	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
950	921221104010	Jayakumar B	2	A	IT2303	Computer Organization	2024-11-28	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
951	921221104010	Jayakumar B	2	A	IT2303	Computer Organization	2024-12-01	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
952	921221104010	Jayakumar B	2	A	IT2303	Computer Organization	2024-12-04	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
953	921221104010	Jayakumar B	2	A	IT2303	Computer Organization	2024-12-07	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
954	921221104010	Jayakumar B	2	A	IT2303	Computer Organization	2024-12-10	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
955	921221104010	Jayakumar B	2	A	IT2303	Computer Organization	2024-12-13	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
956	921221104010	Jayakumar B	2	A	IT2303	Computer Organization	2024-12-16	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
957	921221104010	Jayakumar B	2	A	IT2303	Computer Organization	2024-12-19	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
958	921221104010	Jayakumar B	2	A	IT2303	Computer Organization	2024-12-22	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
959	921221104010	Jayakumar B	2	A	IT2303	Computer Organization	2024-12-25	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
960	921221104010	Jayakumar B	2	A	IT2303	Computer Organization	2024-12-28	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
961	921221104010	Jayakumar B	2	A	MA2301	Discrete Mathematics	2024-11-01	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
962	921221104010	Jayakumar B	2	A	MA2301	Discrete Mathematics	2024-11-04	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
963	921221104010	Jayakumar B	2	A	MA2301	Discrete Mathematics	2024-11-07	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
964	921221104010	Jayakumar B	2	A	MA2301	Discrete Mathematics	2024-11-10	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
965	921221104010	Jayakumar B	2	A	MA2301	Discrete Mathematics	2024-11-13	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
966	921221104010	Jayakumar B	2	A	MA2301	Discrete Mathematics	2024-11-16	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
967	921221104010	Jayakumar B	2	A	MA2301	Discrete Mathematics	2024-11-19	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
968	921221104010	Jayakumar B	2	A	MA2301	Discrete Mathematics	2024-11-22	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
969	921221104010	Jayakumar B	2	A	MA2301	Discrete Mathematics	2024-11-25	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
970	921221104010	Jayakumar B	2	A	MA2301	Discrete Mathematics	2024-11-28	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
971	921221104010	Jayakumar B	2	A	MA2301	Discrete Mathematics	2024-12-01	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
972	921221104010	Jayakumar B	2	A	MA2301	Discrete Mathematics	2024-12-04	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
973	921221104010	Jayakumar B	2	A	MA2301	Discrete Mathematics	2024-12-07	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
974	921221104010	Jayakumar B	2	A	MA2301	Discrete Mathematics	2024-12-10	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
975	921221104010	Jayakumar B	2	A	MA2301	Discrete Mathematics	2024-12-13	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
976	921221104010	Jayakumar B	2	A	MA2301	Discrete Mathematics	2024-12-16	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
977	921221104010	Jayakumar B	2	A	MA2301	Discrete Mathematics	2024-12-19	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
978	921221104010	Jayakumar B	2	A	MA2301	Discrete Mathematics	2024-12-22	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
979	921221104010	Jayakumar B	2	A	MA2301	Discrete Mathematics	2024-12-25	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
980	921221104010	Jayakumar B	2	A	MA2301	Discrete Mathematics	2024-12-28	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
981	921221104010	Jayakumar B	2	A	IT2304	OOP with Java	2024-11-01	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
982	921221104010	Jayakumar B	2	A	IT2304	OOP with Java	2024-11-04	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
983	921221104010	Jayakumar B	2	A	IT2304	OOP with Java	2024-11-07	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
984	921221104010	Jayakumar B	2	A	IT2304	OOP with Java	2024-11-10	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
985	921221104010	Jayakumar B	2	A	IT2304	OOP with Java	2024-11-13	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
986	921221104010	Jayakumar B	2	A	IT2304	OOP with Java	2024-11-16	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
987	921221104010	Jayakumar B	2	A	IT2304	OOP with Java	2024-11-19	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
988	921221104010	Jayakumar B	2	A	IT2304	OOP with Java	2024-11-22	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
989	921221104010	Jayakumar B	2	A	IT2304	OOP with Java	2024-11-25	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
990	921221104010	Jayakumar B	2	A	IT2304	OOP with Java	2024-11-28	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
991	921221104010	Jayakumar B	2	A	IT2304	OOP with Java	2024-12-01	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
992	921221104010	Jayakumar B	2	A	IT2304	OOP with Java	2024-12-04	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
993	921221104010	Jayakumar B	2	A	IT2304	OOP with Java	2024-12-07	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
994	921221104010	Jayakumar B	2	A	IT2304	OOP with Java	2024-12-10	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
995	921221104010	Jayakumar B	2	A	IT2304	OOP with Java	2024-12-13	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
996	921221104010	Jayakumar B	2	A	IT2304	OOP with Java	2024-12-16	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
997	921221104010	Jayakumar B	2	A	IT2304	OOP with Java	2024-12-19	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
998	921221104010	Jayakumar B	2	A	IT2304	OOP with Java	2024-12-22	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
999	921221104010	Jayakumar B	2	A	IT2304	OOP with Java	2024-12-25	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1000	921221104010	Jayakumar B	2	A	IT2304	OOP with Java	2024-12-28	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1001	921221104011	Karthik L	3	B	IT2501	Database Systems	2024-11-01	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1002	921221104011	Karthik L	3	B	IT2501	Database Systems	2024-11-04	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1003	921221104011	Karthik L	3	B	IT2501	Database Systems	2024-11-07	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1004	921221104011	Karthik L	3	B	IT2501	Database Systems	2024-11-10	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1005	921221104011	Karthik L	3	B	IT2501	Database Systems	2024-11-13	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1006	921221104011	Karthik L	3	B	IT2501	Database Systems	2024-11-16	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1007	921221104011	Karthik L	3	B	IT2501	Database Systems	2024-11-19	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1008	921221104011	Karthik L	3	B	IT2501	Database Systems	2024-11-22	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1009	921221104011	Karthik L	3	B	IT2501	Database Systems	2024-11-25	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1010	921221104011	Karthik L	3	B	IT2501	Database Systems	2024-11-28	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1011	921221104011	Karthik L	3	B	IT2501	Database Systems	2024-12-01	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1012	921221104011	Karthik L	3	B	IT2501	Database Systems	2024-12-04	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1013	921221104011	Karthik L	3	B	IT2501	Database Systems	2024-12-07	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1014	921221104011	Karthik L	3	B	IT2501	Database Systems	2024-12-10	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1015	921221104011	Karthik L	3	B	IT2501	Database Systems	2024-12-13	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1016	921221104011	Karthik L	3	B	IT2501	Database Systems	2024-12-16	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1017	921221104011	Karthik L	3	B	IT2501	Database Systems	2024-12-19	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1018	921221104011	Karthik L	3	B	IT2501	Database Systems	2024-12-22	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1019	921221104011	Karthik L	3	B	IT2501	Database Systems	2024-12-25	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1020	921221104011	Karthik L	3	B	IT2501	Database Systems	2024-12-28	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1021	921221104011	Karthik L	3	B	IT2502	Computer Networks	2024-11-01	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1022	921221104011	Karthik L	3	B	IT2502	Computer Networks	2024-11-04	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1023	921221104011	Karthik L	3	B	IT2502	Computer Networks	2024-11-07	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1024	921221104011	Karthik L	3	B	IT2502	Computer Networks	2024-11-10	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1025	921221104011	Karthik L	3	B	IT2502	Computer Networks	2024-11-13	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1026	921221104011	Karthik L	3	B	IT2502	Computer Networks	2024-11-16	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1027	921221104011	Karthik L	3	B	IT2502	Computer Networks	2024-11-19	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1028	921221104011	Karthik L	3	B	IT2502	Computer Networks	2024-11-22	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1029	921221104011	Karthik L	3	B	IT2502	Computer Networks	2024-11-25	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1030	921221104011	Karthik L	3	B	IT2502	Computer Networks	2024-11-28	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1031	921221104011	Karthik L	3	B	IT2502	Computer Networks	2024-12-01	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1032	921221104011	Karthik L	3	B	IT2502	Computer Networks	2024-12-04	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1033	921221104011	Karthik L	3	B	IT2502	Computer Networks	2024-12-07	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1034	921221104011	Karthik L	3	B	IT2502	Computer Networks	2024-12-10	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1035	921221104011	Karthik L	3	B	IT2502	Computer Networks	2024-12-13	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1036	921221104011	Karthik L	3	B	IT2502	Computer Networks	2024-12-16	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1037	921221104011	Karthik L	3	B	IT2502	Computer Networks	2024-12-19	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1038	921221104011	Karthik L	3	B	IT2502	Computer Networks	2024-12-22	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1039	921221104011	Karthik L	3	B	IT2502	Computer Networks	2024-12-25	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1040	921221104011	Karthik L	3	B	IT2502	Computer Networks	2024-12-28	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1041	921221104011	Karthik L	3	B	IT2503	Operating Systems	2024-11-01	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1042	921221104011	Karthik L	3	B	IT2503	Operating Systems	2024-11-04	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1043	921221104011	Karthik L	3	B	IT2503	Operating Systems	2024-11-07	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1044	921221104011	Karthik L	3	B	IT2503	Operating Systems	2024-11-10	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1045	921221104011	Karthik L	3	B	IT2503	Operating Systems	2024-11-13	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1046	921221104011	Karthik L	3	B	IT2503	Operating Systems	2024-11-16	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1047	921221104011	Karthik L	3	B	IT2503	Operating Systems	2024-11-19	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1048	921221104011	Karthik L	3	B	IT2503	Operating Systems	2024-11-22	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1049	921221104011	Karthik L	3	B	IT2503	Operating Systems	2024-11-25	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1050	921221104011	Karthik L	3	B	IT2503	Operating Systems	2024-11-28	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1051	921221104011	Karthik L	3	B	IT2503	Operating Systems	2024-12-01	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1052	921221104011	Karthik L	3	B	IT2503	Operating Systems	2024-12-04	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1053	921221104011	Karthik L	3	B	IT2503	Operating Systems	2024-12-07	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1054	921221104011	Karthik L	3	B	IT2503	Operating Systems	2024-12-10	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1055	921221104011	Karthik L	3	B	IT2503	Operating Systems	2024-12-13	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1056	921221104011	Karthik L	3	B	IT2503	Operating Systems	2024-12-16	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1057	921221104011	Karthik L	3	B	IT2503	Operating Systems	2024-12-19	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1058	921221104011	Karthik L	3	B	IT2503	Operating Systems	2024-12-22	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1059	921221104011	Karthik L	3	B	IT2503	Operating Systems	2024-12-25	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1060	921221104011	Karthik L	3	B	IT2503	Operating Systems	2024-12-28	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1061	921221104011	Karthik L	3	B	IT2504	Software Engineering	2024-11-01	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1062	921221104011	Karthik L	3	B	IT2504	Software Engineering	2024-11-04	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1063	921221104011	Karthik L	3	B	IT2504	Software Engineering	2024-11-07	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1064	921221104011	Karthik L	3	B	IT2504	Software Engineering	2024-11-10	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1065	921221104011	Karthik L	3	B	IT2504	Software Engineering	2024-11-13	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1066	921221104011	Karthik L	3	B	IT2504	Software Engineering	2024-11-16	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1067	921221104011	Karthik L	3	B	IT2504	Software Engineering	2024-11-19	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1068	921221104011	Karthik L	3	B	IT2504	Software Engineering	2024-11-22	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1069	921221104011	Karthik L	3	B	IT2504	Software Engineering	2024-11-25	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1070	921221104011	Karthik L	3	B	IT2504	Software Engineering	2024-11-28	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1071	921221104011	Karthik L	3	B	IT2504	Software Engineering	2024-12-01	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1072	921221104011	Karthik L	3	B	IT2504	Software Engineering	2024-12-04	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1073	921221104011	Karthik L	3	B	IT2504	Software Engineering	2024-12-07	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1074	921221104011	Karthik L	3	B	IT2504	Software Engineering	2024-12-10	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1075	921221104011	Karthik L	3	B	IT2504	Software Engineering	2024-12-13	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1076	921221104011	Karthik L	3	B	IT2504	Software Engineering	2024-12-16	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1077	921221104011	Karthik L	3	B	IT2504	Software Engineering	2024-12-19	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1078	921221104011	Karthik L	3	B	IT2504	Software Engineering	2024-12-22	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1079	921221104011	Karthik L	3	B	IT2504	Software Engineering	2024-12-25	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1080	921221104011	Karthik L	3	B	IT2504	Software Engineering	2024-12-28	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1081	921221104011	Karthik L	3	B	IT2505	Web Technology	2024-11-01	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1082	921221104011	Karthik L	3	B	IT2505	Web Technology	2024-11-04	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1083	921221104011	Karthik L	3	B	IT2505	Web Technology	2024-11-07	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1084	921221104011	Karthik L	3	B	IT2505	Web Technology	2024-11-10	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1085	921221104011	Karthik L	3	B	IT2505	Web Technology	2024-11-13	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1086	921221104011	Karthik L	3	B	IT2505	Web Technology	2024-11-16	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1087	921221104011	Karthik L	3	B	IT2505	Web Technology	2024-11-19	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1088	921221104011	Karthik L	3	B	IT2505	Web Technology	2024-11-22	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1089	921221104011	Karthik L	3	B	IT2505	Web Technology	2024-11-25	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1090	921221104011	Karthik L	3	B	IT2505	Web Technology	2024-11-28	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1091	921221104011	Karthik L	3	B	IT2505	Web Technology	2024-12-01	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1092	921221104011	Karthik L	3	B	IT2505	Web Technology	2024-12-04	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1093	921221104011	Karthik L	3	B	IT2505	Web Technology	2024-12-07	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1094	921221104011	Karthik L	3	B	IT2505	Web Technology	2024-12-10	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1095	921221104011	Karthik L	3	B	IT2505	Web Technology	2024-12-13	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1096	921221104011	Karthik L	3	B	IT2505	Web Technology	2024-12-16	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1097	921221104011	Karthik L	3	B	IT2505	Web Technology	2024-12-19	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1098	921221104011	Karthik L	3	B	IT2505	Web Technology	2024-12-22	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1099	921221104011	Karthik L	3	B	IT2505	Web Technology	2024-12-25	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1100	921221104011	Karthik L	3	B	IT2505	Web Technology	2024-12-28	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1101	921221104012	Lavanya M	3	C	IT2501	Database Systems	2024-11-01	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1102	921221104012	Lavanya M	3	C	IT2501	Database Systems	2024-11-04	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1103	921221104012	Lavanya M	3	C	IT2501	Database Systems	2024-11-07	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1104	921221104012	Lavanya M	3	C	IT2501	Database Systems	2024-11-10	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1105	921221104012	Lavanya M	3	C	IT2501	Database Systems	2024-11-13	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1106	921221104012	Lavanya M	3	C	IT2501	Database Systems	2024-11-16	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1107	921221104012	Lavanya M	3	C	IT2501	Database Systems	2024-11-19	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1108	921221104012	Lavanya M	3	C	IT2501	Database Systems	2024-11-22	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1109	921221104012	Lavanya M	3	C	IT2501	Database Systems	2024-11-25	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1110	921221104012	Lavanya M	3	C	IT2501	Database Systems	2024-11-28	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1111	921221104012	Lavanya M	3	C	IT2501	Database Systems	2024-12-01	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1112	921221104012	Lavanya M	3	C	IT2501	Database Systems	2024-12-04	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1113	921221104012	Lavanya M	3	C	IT2501	Database Systems	2024-12-07	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1114	921221104012	Lavanya M	3	C	IT2501	Database Systems	2024-12-10	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1115	921221104012	Lavanya M	3	C	IT2501	Database Systems	2024-12-13	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1116	921221104012	Lavanya M	3	C	IT2501	Database Systems	2024-12-16	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1117	921221104012	Lavanya M	3	C	IT2501	Database Systems	2024-12-19	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1118	921221104012	Lavanya M	3	C	IT2501	Database Systems	2024-12-22	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1119	921221104012	Lavanya M	3	C	IT2501	Database Systems	2024-12-25	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1120	921221104012	Lavanya M	3	C	IT2501	Database Systems	2024-12-28	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1121	921221104012	Lavanya M	3	C	IT2502	Computer Networks	2024-11-01	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1122	921221104012	Lavanya M	3	C	IT2502	Computer Networks	2024-11-04	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1123	921221104012	Lavanya M	3	C	IT2502	Computer Networks	2024-11-07	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1124	921221104012	Lavanya M	3	C	IT2502	Computer Networks	2024-11-10	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1125	921221104012	Lavanya M	3	C	IT2502	Computer Networks	2024-11-13	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1126	921221104012	Lavanya M	3	C	IT2502	Computer Networks	2024-11-16	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1127	921221104012	Lavanya M	3	C	IT2502	Computer Networks	2024-11-19	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1128	921221104012	Lavanya M	3	C	IT2502	Computer Networks	2024-11-22	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1129	921221104012	Lavanya M	3	C	IT2502	Computer Networks	2024-11-25	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1130	921221104012	Lavanya M	3	C	IT2502	Computer Networks	2024-11-28	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1131	921221104012	Lavanya M	3	C	IT2502	Computer Networks	2024-12-01	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1132	921221104012	Lavanya M	3	C	IT2502	Computer Networks	2024-12-04	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1133	921221104012	Lavanya M	3	C	IT2502	Computer Networks	2024-12-07	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1134	921221104012	Lavanya M	3	C	IT2502	Computer Networks	2024-12-10	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1135	921221104012	Lavanya M	3	C	IT2502	Computer Networks	2024-12-13	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1136	921221104012	Lavanya M	3	C	IT2502	Computer Networks	2024-12-16	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1137	921221104012	Lavanya M	3	C	IT2502	Computer Networks	2024-12-19	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1138	921221104012	Lavanya M	3	C	IT2502	Computer Networks	2024-12-22	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1139	921221104012	Lavanya M	3	C	IT2502	Computer Networks	2024-12-25	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1140	921221104012	Lavanya M	3	C	IT2502	Computer Networks	2024-12-28	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1141	921221104012	Lavanya M	3	C	IT2503	Operating Systems	2024-11-01	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1142	921221104012	Lavanya M	3	C	IT2503	Operating Systems	2024-11-04	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1143	921221104012	Lavanya M	3	C	IT2503	Operating Systems	2024-11-07	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1144	921221104012	Lavanya M	3	C	IT2503	Operating Systems	2024-11-10	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1145	921221104012	Lavanya M	3	C	IT2503	Operating Systems	2024-11-13	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1146	921221104012	Lavanya M	3	C	IT2503	Operating Systems	2024-11-16	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1147	921221104012	Lavanya M	3	C	IT2503	Operating Systems	2024-11-19	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1148	921221104012	Lavanya M	3	C	IT2503	Operating Systems	2024-11-22	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1149	921221104012	Lavanya M	3	C	IT2503	Operating Systems	2024-11-25	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1150	921221104012	Lavanya M	3	C	IT2503	Operating Systems	2024-11-28	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1151	921221104012	Lavanya M	3	C	IT2503	Operating Systems	2024-12-01	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1152	921221104012	Lavanya M	3	C	IT2503	Operating Systems	2024-12-04	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1153	921221104012	Lavanya M	3	C	IT2503	Operating Systems	2024-12-07	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1154	921221104012	Lavanya M	3	C	IT2503	Operating Systems	2024-12-10	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1155	921221104012	Lavanya M	3	C	IT2503	Operating Systems	2024-12-13	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1156	921221104012	Lavanya M	3	C	IT2503	Operating Systems	2024-12-16	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1157	921221104012	Lavanya M	3	C	IT2503	Operating Systems	2024-12-19	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1158	921221104012	Lavanya M	3	C	IT2503	Operating Systems	2024-12-22	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1159	921221104012	Lavanya M	3	C	IT2503	Operating Systems	2024-12-25	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1160	921221104012	Lavanya M	3	C	IT2503	Operating Systems	2024-12-28	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1161	921221104012	Lavanya M	3	C	IT2504	Software Engineering	2024-11-01	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1162	921221104012	Lavanya M	3	C	IT2504	Software Engineering	2024-11-04	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1163	921221104012	Lavanya M	3	C	IT2504	Software Engineering	2024-11-07	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1164	921221104012	Lavanya M	3	C	IT2504	Software Engineering	2024-11-10	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1165	921221104012	Lavanya M	3	C	IT2504	Software Engineering	2024-11-13	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1166	921221104012	Lavanya M	3	C	IT2504	Software Engineering	2024-11-16	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1167	921221104012	Lavanya M	3	C	IT2504	Software Engineering	2024-11-19	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1168	921221104012	Lavanya M	3	C	IT2504	Software Engineering	2024-11-22	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1169	921221104012	Lavanya M	3	C	IT2504	Software Engineering	2024-11-25	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1170	921221104012	Lavanya M	3	C	IT2504	Software Engineering	2024-11-28	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1171	921221104012	Lavanya M	3	C	IT2504	Software Engineering	2024-12-01	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1172	921221104012	Lavanya M	3	C	IT2504	Software Engineering	2024-12-04	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1173	921221104012	Lavanya M	3	C	IT2504	Software Engineering	2024-12-07	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1174	921221104012	Lavanya M	3	C	IT2504	Software Engineering	2024-12-10	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1175	921221104012	Lavanya M	3	C	IT2504	Software Engineering	2024-12-13	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1176	921221104012	Lavanya M	3	C	IT2504	Software Engineering	2024-12-16	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1177	921221104012	Lavanya M	3	C	IT2504	Software Engineering	2024-12-19	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1178	921221104012	Lavanya M	3	C	IT2504	Software Engineering	2024-12-22	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1179	921221104012	Lavanya M	3	C	IT2504	Software Engineering	2024-12-25	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1180	921221104012	Lavanya M	3	C	IT2504	Software Engineering	2024-12-28	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1181	921221104012	Lavanya M	3	C	IT2505	Web Technology	2024-11-01	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1182	921221104012	Lavanya M	3	C	IT2505	Web Technology	2024-11-04	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1183	921221104012	Lavanya M	3	C	IT2505	Web Technology	2024-11-07	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1184	921221104012	Lavanya M	3	C	IT2505	Web Technology	2024-11-10	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1185	921221104012	Lavanya M	3	C	IT2505	Web Technology	2024-11-13	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1186	921221104012	Lavanya M	3	C	IT2505	Web Technology	2024-11-16	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1187	921221104012	Lavanya M	3	C	IT2505	Web Technology	2024-11-19	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1188	921221104012	Lavanya M	3	C	IT2505	Web Technology	2024-11-22	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1189	921221104012	Lavanya M	3	C	IT2505	Web Technology	2024-11-25	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1190	921221104012	Lavanya M	3	C	IT2505	Web Technology	2024-11-28	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1191	921221104012	Lavanya M	3	C	IT2505	Web Technology	2024-12-01	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1192	921221104012	Lavanya M	3	C	IT2505	Web Technology	2024-12-04	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1193	921221104012	Lavanya M	3	C	IT2505	Web Technology	2024-12-07	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1194	921221104012	Lavanya M	3	C	IT2505	Web Technology	2024-12-10	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1195	921221104012	Lavanya M	3	C	IT2505	Web Technology	2024-12-13	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1196	921221104012	Lavanya M	3	C	IT2505	Web Technology	2024-12-16	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1197	921221104012	Lavanya M	3	C	IT2505	Web Technology	2024-12-19	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1198	921221104012	Lavanya M	3	C	IT2505	Web Technology	2024-12-22	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1199	921221104012	Lavanya M	3	C	IT2505	Web Technology	2024-12-25	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1200	921221104012	Lavanya M	3	C	IT2505	Web Technology	2024-12-28	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1201	921221104013	Manikandan S	3	A	IT2501	Database Systems	2024-11-01	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1202	921221104013	Manikandan S	3	A	IT2501	Database Systems	2024-11-04	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1203	921221104013	Manikandan S	3	A	IT2501	Database Systems	2024-11-07	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1204	921221104013	Manikandan S	3	A	IT2501	Database Systems	2024-11-10	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1205	921221104013	Manikandan S	3	A	IT2501	Database Systems	2024-11-13	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1206	921221104013	Manikandan S	3	A	IT2501	Database Systems	2024-11-16	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1207	921221104013	Manikandan S	3	A	IT2501	Database Systems	2024-11-19	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1208	921221104013	Manikandan S	3	A	IT2501	Database Systems	2024-11-22	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1209	921221104013	Manikandan S	3	A	IT2501	Database Systems	2024-11-25	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1210	921221104013	Manikandan S	3	A	IT2501	Database Systems	2024-11-28	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1211	921221104013	Manikandan S	3	A	IT2501	Database Systems	2024-12-01	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1212	921221104013	Manikandan S	3	A	IT2501	Database Systems	2024-12-04	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1213	921221104013	Manikandan S	3	A	IT2501	Database Systems	2024-12-07	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1214	921221104013	Manikandan S	3	A	IT2501	Database Systems	2024-12-10	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1215	921221104013	Manikandan S	3	A	IT2501	Database Systems	2024-12-13	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1216	921221104013	Manikandan S	3	A	IT2501	Database Systems	2024-12-16	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1217	921221104013	Manikandan S	3	A	IT2501	Database Systems	2024-12-19	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1218	921221104013	Manikandan S	3	A	IT2501	Database Systems	2024-12-22	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1219	921221104013	Manikandan S	3	A	IT2501	Database Systems	2024-12-25	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1220	921221104013	Manikandan S	3	A	IT2501	Database Systems	2024-12-28	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1221	921221104013	Manikandan S	3	A	IT2502	Computer Networks	2024-11-01	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1222	921221104013	Manikandan S	3	A	IT2502	Computer Networks	2024-11-04	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1223	921221104013	Manikandan S	3	A	IT2502	Computer Networks	2024-11-07	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1224	921221104013	Manikandan S	3	A	IT2502	Computer Networks	2024-11-10	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1225	921221104013	Manikandan S	3	A	IT2502	Computer Networks	2024-11-13	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1226	921221104013	Manikandan S	3	A	IT2502	Computer Networks	2024-11-16	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1227	921221104013	Manikandan S	3	A	IT2502	Computer Networks	2024-11-19	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1228	921221104013	Manikandan S	3	A	IT2502	Computer Networks	2024-11-22	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1229	921221104013	Manikandan S	3	A	IT2502	Computer Networks	2024-11-25	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1230	921221104013	Manikandan S	3	A	IT2502	Computer Networks	2024-11-28	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1231	921221104013	Manikandan S	3	A	IT2502	Computer Networks	2024-12-01	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1232	921221104013	Manikandan S	3	A	IT2502	Computer Networks	2024-12-04	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1233	921221104013	Manikandan S	3	A	IT2502	Computer Networks	2024-12-07	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1234	921221104013	Manikandan S	3	A	IT2502	Computer Networks	2024-12-10	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1235	921221104013	Manikandan S	3	A	IT2502	Computer Networks	2024-12-13	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1236	921221104013	Manikandan S	3	A	IT2502	Computer Networks	2024-12-16	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1237	921221104013	Manikandan S	3	A	IT2502	Computer Networks	2024-12-19	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1238	921221104013	Manikandan S	3	A	IT2502	Computer Networks	2024-12-22	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1239	921221104013	Manikandan S	3	A	IT2502	Computer Networks	2024-12-25	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1240	921221104013	Manikandan S	3	A	IT2502	Computer Networks	2024-12-28	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1241	921221104013	Manikandan S	3	A	IT2503	Operating Systems	2024-11-01	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1242	921221104013	Manikandan S	3	A	IT2503	Operating Systems	2024-11-04	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1243	921221104013	Manikandan S	3	A	IT2503	Operating Systems	2024-11-07	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1244	921221104013	Manikandan S	3	A	IT2503	Operating Systems	2024-11-10	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1245	921221104013	Manikandan S	3	A	IT2503	Operating Systems	2024-11-13	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1246	921221104013	Manikandan S	3	A	IT2503	Operating Systems	2024-11-16	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1247	921221104013	Manikandan S	3	A	IT2503	Operating Systems	2024-11-19	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1248	921221104013	Manikandan S	3	A	IT2503	Operating Systems	2024-11-22	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1249	921221104013	Manikandan S	3	A	IT2503	Operating Systems	2024-11-25	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1250	921221104013	Manikandan S	3	A	IT2503	Operating Systems	2024-11-28	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1251	921221104013	Manikandan S	3	A	IT2503	Operating Systems	2024-12-01	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1252	921221104013	Manikandan S	3	A	IT2503	Operating Systems	2024-12-04	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1253	921221104013	Manikandan S	3	A	IT2503	Operating Systems	2024-12-07	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1254	921221104013	Manikandan S	3	A	IT2503	Operating Systems	2024-12-10	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1255	921221104013	Manikandan S	3	A	IT2503	Operating Systems	2024-12-13	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1256	921221104013	Manikandan S	3	A	IT2503	Operating Systems	2024-12-16	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1257	921221104013	Manikandan S	3	A	IT2503	Operating Systems	2024-12-19	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1258	921221104013	Manikandan S	3	A	IT2503	Operating Systems	2024-12-22	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1259	921221104013	Manikandan S	3	A	IT2503	Operating Systems	2024-12-25	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1260	921221104013	Manikandan S	3	A	IT2503	Operating Systems	2024-12-28	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1261	921221104013	Manikandan S	3	A	IT2504	Software Engineering	2024-11-01	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1262	921221104013	Manikandan S	3	A	IT2504	Software Engineering	2024-11-04	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1263	921221104013	Manikandan S	3	A	IT2504	Software Engineering	2024-11-07	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1264	921221104013	Manikandan S	3	A	IT2504	Software Engineering	2024-11-10	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1265	921221104013	Manikandan S	3	A	IT2504	Software Engineering	2024-11-13	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1266	921221104013	Manikandan S	3	A	IT2504	Software Engineering	2024-11-16	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1267	921221104013	Manikandan S	3	A	IT2504	Software Engineering	2024-11-19	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1268	921221104013	Manikandan S	3	A	IT2504	Software Engineering	2024-11-22	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1269	921221104013	Manikandan S	3	A	IT2504	Software Engineering	2024-11-25	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1270	921221104013	Manikandan S	3	A	IT2504	Software Engineering	2024-11-28	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1271	921221104013	Manikandan S	3	A	IT2504	Software Engineering	2024-12-01	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1272	921221104013	Manikandan S	3	A	IT2504	Software Engineering	2024-12-04	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1273	921221104013	Manikandan S	3	A	IT2504	Software Engineering	2024-12-07	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1274	921221104013	Manikandan S	3	A	IT2504	Software Engineering	2024-12-10	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1275	921221104013	Manikandan S	3	A	IT2504	Software Engineering	2024-12-13	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1276	921221104013	Manikandan S	3	A	IT2504	Software Engineering	2024-12-16	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1277	921221104013	Manikandan S	3	A	IT2504	Software Engineering	2024-12-19	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1278	921221104013	Manikandan S	3	A	IT2504	Software Engineering	2024-12-22	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1279	921221104013	Manikandan S	3	A	IT2504	Software Engineering	2024-12-25	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1280	921221104013	Manikandan S	3	A	IT2504	Software Engineering	2024-12-28	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1281	921221104013	Manikandan S	3	A	IT2505	Web Technology	2024-11-01	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1282	921221104013	Manikandan S	3	A	IT2505	Web Technology	2024-11-04	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1283	921221104013	Manikandan S	3	A	IT2505	Web Technology	2024-11-07	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1284	921221104013	Manikandan S	3	A	IT2505	Web Technology	2024-11-10	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1285	921221104013	Manikandan S	3	A	IT2505	Web Technology	2024-11-13	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1286	921221104013	Manikandan S	3	A	IT2505	Web Technology	2024-11-16	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1287	921221104013	Manikandan S	3	A	IT2505	Web Technology	2024-11-19	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1288	921221104013	Manikandan S	3	A	IT2505	Web Technology	2024-11-22	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1289	921221104013	Manikandan S	3	A	IT2505	Web Technology	2024-11-25	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1290	921221104013	Manikandan S	3	A	IT2505	Web Technology	2024-11-28	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1291	921221104013	Manikandan S	3	A	IT2505	Web Technology	2024-12-01	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1292	921221104013	Manikandan S	3	A	IT2505	Web Technology	2024-12-04	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1293	921221104013	Manikandan S	3	A	IT2505	Web Technology	2024-12-07	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1294	921221104013	Manikandan S	3	A	IT2505	Web Technology	2024-12-10	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1295	921221104013	Manikandan S	3	A	IT2505	Web Technology	2024-12-13	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1296	921221104013	Manikandan S	3	A	IT2505	Web Technology	2024-12-16	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1297	921221104013	Manikandan S	3	A	IT2505	Web Technology	2024-12-19	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1298	921221104013	Manikandan S	3	A	IT2505	Web Technology	2024-12-22	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1299	921221104013	Manikandan S	3	A	IT2505	Web Technology	2024-12-25	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1300	921221104013	Manikandan S	3	A	IT2505	Web Technology	2024-12-28	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1301	921221104014	Nithya R	3	B	IT2501	Database Systems	2024-11-01	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1302	921221104014	Nithya R	3	B	IT2501	Database Systems	2024-11-04	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1303	921221104014	Nithya R	3	B	IT2501	Database Systems	2024-11-07	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1304	921221104014	Nithya R	3	B	IT2501	Database Systems	2024-11-10	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1305	921221104014	Nithya R	3	B	IT2501	Database Systems	2024-11-13	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1306	921221104014	Nithya R	3	B	IT2501	Database Systems	2024-11-16	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1307	921221104014	Nithya R	3	B	IT2501	Database Systems	2024-11-19	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1308	921221104014	Nithya R	3	B	IT2501	Database Systems	2024-11-22	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1309	921221104014	Nithya R	3	B	IT2501	Database Systems	2024-11-25	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1310	921221104014	Nithya R	3	B	IT2501	Database Systems	2024-11-28	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1311	921221104014	Nithya R	3	B	IT2501	Database Systems	2024-12-01	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1312	921221104014	Nithya R	3	B	IT2501	Database Systems	2024-12-04	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1313	921221104014	Nithya R	3	B	IT2501	Database Systems	2024-12-07	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1314	921221104014	Nithya R	3	B	IT2501	Database Systems	2024-12-10	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1315	921221104014	Nithya R	3	B	IT2501	Database Systems	2024-12-13	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1316	921221104014	Nithya R	3	B	IT2501	Database Systems	2024-12-16	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1317	921221104014	Nithya R	3	B	IT2501	Database Systems	2024-12-19	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1318	921221104014	Nithya R	3	B	IT2501	Database Systems	2024-12-22	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1319	921221104014	Nithya R	3	B	IT2501	Database Systems	2024-12-25	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1320	921221104014	Nithya R	3	B	IT2501	Database Systems	2024-12-28	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1321	921221104014	Nithya R	3	B	IT2502	Computer Networks	2024-11-01	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1322	921221104014	Nithya R	3	B	IT2502	Computer Networks	2024-11-04	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1323	921221104014	Nithya R	3	B	IT2502	Computer Networks	2024-11-07	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1324	921221104014	Nithya R	3	B	IT2502	Computer Networks	2024-11-10	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1325	921221104014	Nithya R	3	B	IT2502	Computer Networks	2024-11-13	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1326	921221104014	Nithya R	3	B	IT2502	Computer Networks	2024-11-16	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1327	921221104014	Nithya R	3	B	IT2502	Computer Networks	2024-11-19	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1328	921221104014	Nithya R	3	B	IT2502	Computer Networks	2024-11-22	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1329	921221104014	Nithya R	3	B	IT2502	Computer Networks	2024-11-25	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1330	921221104014	Nithya R	3	B	IT2502	Computer Networks	2024-11-28	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1331	921221104014	Nithya R	3	B	IT2502	Computer Networks	2024-12-01	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1332	921221104014	Nithya R	3	B	IT2502	Computer Networks	2024-12-04	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1333	921221104014	Nithya R	3	B	IT2502	Computer Networks	2024-12-07	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1334	921221104014	Nithya R	3	B	IT2502	Computer Networks	2024-12-10	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1335	921221104014	Nithya R	3	B	IT2502	Computer Networks	2024-12-13	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1336	921221104014	Nithya R	3	B	IT2502	Computer Networks	2024-12-16	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1337	921221104014	Nithya R	3	B	IT2502	Computer Networks	2024-12-19	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1338	921221104014	Nithya R	3	B	IT2502	Computer Networks	2024-12-22	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1339	921221104014	Nithya R	3	B	IT2502	Computer Networks	2024-12-25	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1340	921221104014	Nithya R	3	B	IT2502	Computer Networks	2024-12-28	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1341	921221104014	Nithya R	3	B	IT2503	Operating Systems	2024-11-01	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1342	921221104014	Nithya R	3	B	IT2503	Operating Systems	2024-11-04	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1343	921221104014	Nithya R	3	B	IT2503	Operating Systems	2024-11-07	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1344	921221104014	Nithya R	3	B	IT2503	Operating Systems	2024-11-10	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1345	921221104014	Nithya R	3	B	IT2503	Operating Systems	2024-11-13	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1346	921221104014	Nithya R	3	B	IT2503	Operating Systems	2024-11-16	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1347	921221104014	Nithya R	3	B	IT2503	Operating Systems	2024-11-19	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1348	921221104014	Nithya R	3	B	IT2503	Operating Systems	2024-11-22	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1349	921221104014	Nithya R	3	B	IT2503	Operating Systems	2024-11-25	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1350	921221104014	Nithya R	3	B	IT2503	Operating Systems	2024-11-28	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1351	921221104014	Nithya R	3	B	IT2503	Operating Systems	2024-12-01	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1352	921221104014	Nithya R	3	B	IT2503	Operating Systems	2024-12-04	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1353	921221104014	Nithya R	3	B	IT2503	Operating Systems	2024-12-07	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1354	921221104014	Nithya R	3	B	IT2503	Operating Systems	2024-12-10	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1355	921221104014	Nithya R	3	B	IT2503	Operating Systems	2024-12-13	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1356	921221104014	Nithya R	3	B	IT2503	Operating Systems	2024-12-16	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1357	921221104014	Nithya R	3	B	IT2503	Operating Systems	2024-12-19	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1358	921221104014	Nithya R	3	B	IT2503	Operating Systems	2024-12-22	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1359	921221104014	Nithya R	3	B	IT2503	Operating Systems	2024-12-25	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1360	921221104014	Nithya R	3	B	IT2503	Operating Systems	2024-12-28	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1361	921221104014	Nithya R	3	B	IT2504	Software Engineering	2024-11-01	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1362	921221104014	Nithya R	3	B	IT2504	Software Engineering	2024-11-04	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1363	921221104014	Nithya R	3	B	IT2504	Software Engineering	2024-11-07	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1364	921221104014	Nithya R	3	B	IT2504	Software Engineering	2024-11-10	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1365	921221104014	Nithya R	3	B	IT2504	Software Engineering	2024-11-13	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1366	921221104014	Nithya R	3	B	IT2504	Software Engineering	2024-11-16	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1367	921221104014	Nithya R	3	B	IT2504	Software Engineering	2024-11-19	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1368	921221104014	Nithya R	3	B	IT2504	Software Engineering	2024-11-22	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1369	921221104014	Nithya R	3	B	IT2504	Software Engineering	2024-11-25	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1370	921221104014	Nithya R	3	B	IT2504	Software Engineering	2024-11-28	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1371	921221104014	Nithya R	3	B	IT2504	Software Engineering	2024-12-01	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1372	921221104014	Nithya R	3	B	IT2504	Software Engineering	2024-12-04	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1373	921221104014	Nithya R	3	B	IT2504	Software Engineering	2024-12-07	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1374	921221104014	Nithya R	3	B	IT2504	Software Engineering	2024-12-10	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1375	921221104014	Nithya R	3	B	IT2504	Software Engineering	2024-12-13	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1376	921221104014	Nithya R	3	B	IT2504	Software Engineering	2024-12-16	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1377	921221104014	Nithya R	3	B	IT2504	Software Engineering	2024-12-19	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1378	921221104014	Nithya R	3	B	IT2504	Software Engineering	2024-12-22	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1379	921221104014	Nithya R	3	B	IT2504	Software Engineering	2024-12-25	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1380	921221104014	Nithya R	3	B	IT2504	Software Engineering	2024-12-28	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1381	921221104014	Nithya R	3	B	IT2505	Web Technology	2024-11-01	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1382	921221104014	Nithya R	3	B	IT2505	Web Technology	2024-11-04	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1383	921221104014	Nithya R	3	B	IT2505	Web Technology	2024-11-07	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1384	921221104014	Nithya R	3	B	IT2505	Web Technology	2024-11-10	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1385	921221104014	Nithya R	3	B	IT2505	Web Technology	2024-11-13	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1386	921221104014	Nithya R	3	B	IT2505	Web Technology	2024-11-16	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1387	921221104014	Nithya R	3	B	IT2505	Web Technology	2024-11-19	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1388	921221104014	Nithya R	3	B	IT2505	Web Technology	2024-11-22	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1389	921221104014	Nithya R	3	B	IT2505	Web Technology	2024-11-25	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1390	921221104014	Nithya R	3	B	IT2505	Web Technology	2024-11-28	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1391	921221104014	Nithya R	3	B	IT2505	Web Technology	2024-12-01	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1392	921221104014	Nithya R	3	B	IT2505	Web Technology	2024-12-04	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1393	921221104014	Nithya R	3	B	IT2505	Web Technology	2024-12-07	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1394	921221104014	Nithya R	3	B	IT2505	Web Technology	2024-12-10	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1395	921221104014	Nithya R	3	B	IT2505	Web Technology	2024-12-13	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1396	921221104014	Nithya R	3	B	IT2505	Web Technology	2024-12-16	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1397	921221104014	Nithya R	3	B	IT2505	Web Technology	2024-12-19	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1398	921221104014	Nithya R	3	B	IT2505	Web Technology	2024-12-22	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1399	921221104014	Nithya R	3	B	IT2505	Web Technology	2024-12-25	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1400	921221104014	Nithya R	3	B	IT2505	Web Technology	2024-12-28	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1401	921221104015	Oviya K	3	C	IT2501	Database Systems	2024-11-01	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1402	921221104015	Oviya K	3	C	IT2501	Database Systems	2024-11-04	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1403	921221104015	Oviya K	3	C	IT2501	Database Systems	2024-11-07	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1404	921221104015	Oviya K	3	C	IT2501	Database Systems	2024-11-10	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1405	921221104015	Oviya K	3	C	IT2501	Database Systems	2024-11-13	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1406	921221104015	Oviya K	3	C	IT2501	Database Systems	2024-11-16	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1407	921221104015	Oviya K	3	C	IT2501	Database Systems	2024-11-19	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1408	921221104015	Oviya K	3	C	IT2501	Database Systems	2024-11-22	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1409	921221104015	Oviya K	3	C	IT2501	Database Systems	2024-11-25	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1410	921221104015	Oviya K	3	C	IT2501	Database Systems	2024-11-28	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1411	921221104015	Oviya K	3	C	IT2501	Database Systems	2024-12-01	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1412	921221104015	Oviya K	3	C	IT2501	Database Systems	2024-12-04	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1413	921221104015	Oviya K	3	C	IT2501	Database Systems	2024-12-07	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1414	921221104015	Oviya K	3	C	IT2501	Database Systems	2024-12-10	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1415	921221104015	Oviya K	3	C	IT2501	Database Systems	2024-12-13	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1416	921221104015	Oviya K	3	C	IT2501	Database Systems	2024-12-16	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1417	921221104015	Oviya K	3	C	IT2501	Database Systems	2024-12-19	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1418	921221104015	Oviya K	3	C	IT2501	Database Systems	2024-12-22	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1419	921221104015	Oviya K	3	C	IT2501	Database Systems	2024-12-25	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1420	921221104015	Oviya K	3	C	IT2501	Database Systems	2024-12-28	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1421	921221104015	Oviya K	3	C	IT2502	Computer Networks	2024-11-01	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1422	921221104015	Oviya K	3	C	IT2502	Computer Networks	2024-11-04	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1423	921221104015	Oviya K	3	C	IT2502	Computer Networks	2024-11-07	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1424	921221104015	Oviya K	3	C	IT2502	Computer Networks	2024-11-10	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1425	921221104015	Oviya K	3	C	IT2502	Computer Networks	2024-11-13	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1426	921221104015	Oviya K	3	C	IT2502	Computer Networks	2024-11-16	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1427	921221104015	Oviya K	3	C	IT2502	Computer Networks	2024-11-19	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1428	921221104015	Oviya K	3	C	IT2502	Computer Networks	2024-11-22	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1429	921221104015	Oviya K	3	C	IT2502	Computer Networks	2024-11-25	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1430	921221104015	Oviya K	3	C	IT2502	Computer Networks	2024-11-28	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1431	921221104015	Oviya K	3	C	IT2502	Computer Networks	2024-12-01	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1432	921221104015	Oviya K	3	C	IT2502	Computer Networks	2024-12-04	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1433	921221104015	Oviya K	3	C	IT2502	Computer Networks	2024-12-07	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1434	921221104015	Oviya K	3	C	IT2502	Computer Networks	2024-12-10	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1435	921221104015	Oviya K	3	C	IT2502	Computer Networks	2024-12-13	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1436	921221104015	Oviya K	3	C	IT2502	Computer Networks	2024-12-16	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1437	921221104015	Oviya K	3	C	IT2502	Computer Networks	2024-12-19	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1438	921221104015	Oviya K	3	C	IT2502	Computer Networks	2024-12-22	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1439	921221104015	Oviya K	3	C	IT2502	Computer Networks	2024-12-25	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1440	921221104015	Oviya K	3	C	IT2502	Computer Networks	2024-12-28	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1441	921221104015	Oviya K	3	C	IT2503	Operating Systems	2024-11-01	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1442	921221104015	Oviya K	3	C	IT2503	Operating Systems	2024-11-04	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1443	921221104015	Oviya K	3	C	IT2503	Operating Systems	2024-11-07	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1444	921221104015	Oviya K	3	C	IT2503	Operating Systems	2024-11-10	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1445	921221104015	Oviya K	3	C	IT2503	Operating Systems	2024-11-13	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1446	921221104015	Oviya K	3	C	IT2503	Operating Systems	2024-11-16	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1447	921221104015	Oviya K	3	C	IT2503	Operating Systems	2024-11-19	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1448	921221104015	Oviya K	3	C	IT2503	Operating Systems	2024-11-22	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1449	921221104015	Oviya K	3	C	IT2503	Operating Systems	2024-11-25	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1450	921221104015	Oviya K	3	C	IT2503	Operating Systems	2024-11-28	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1451	921221104015	Oviya K	3	C	IT2503	Operating Systems	2024-12-01	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1452	921221104015	Oviya K	3	C	IT2503	Operating Systems	2024-12-04	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1453	921221104015	Oviya K	3	C	IT2503	Operating Systems	2024-12-07	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1454	921221104015	Oviya K	3	C	IT2503	Operating Systems	2024-12-10	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1455	921221104015	Oviya K	3	C	IT2503	Operating Systems	2024-12-13	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1456	921221104015	Oviya K	3	C	IT2503	Operating Systems	2024-12-16	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1457	921221104015	Oviya K	3	C	IT2503	Operating Systems	2024-12-19	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1458	921221104015	Oviya K	3	C	IT2503	Operating Systems	2024-12-22	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1459	921221104015	Oviya K	3	C	IT2503	Operating Systems	2024-12-25	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1460	921221104015	Oviya K	3	C	IT2503	Operating Systems	2024-12-28	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1461	921221104015	Oviya K	3	C	IT2504	Software Engineering	2024-11-01	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1462	921221104015	Oviya K	3	C	IT2504	Software Engineering	2024-11-04	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1463	921221104015	Oviya K	3	C	IT2504	Software Engineering	2024-11-07	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1464	921221104015	Oviya K	3	C	IT2504	Software Engineering	2024-11-10	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1465	921221104015	Oviya K	3	C	IT2504	Software Engineering	2024-11-13	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1466	921221104015	Oviya K	3	C	IT2504	Software Engineering	2024-11-16	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1467	921221104015	Oviya K	3	C	IT2504	Software Engineering	2024-11-19	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1468	921221104015	Oviya K	3	C	IT2504	Software Engineering	2024-11-22	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1469	921221104015	Oviya K	3	C	IT2504	Software Engineering	2024-11-25	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1470	921221104015	Oviya K	3	C	IT2504	Software Engineering	2024-11-28	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1471	921221104015	Oviya K	3	C	IT2504	Software Engineering	2024-12-01	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1472	921221104015	Oviya K	3	C	IT2504	Software Engineering	2024-12-04	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1473	921221104015	Oviya K	3	C	IT2504	Software Engineering	2024-12-07	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1474	921221104015	Oviya K	3	C	IT2504	Software Engineering	2024-12-10	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1475	921221104015	Oviya K	3	C	IT2504	Software Engineering	2024-12-13	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1476	921221104015	Oviya K	3	C	IT2504	Software Engineering	2024-12-16	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1477	921221104015	Oviya K	3	C	IT2504	Software Engineering	2024-12-19	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1478	921221104015	Oviya K	3	C	IT2504	Software Engineering	2024-12-22	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1479	921221104015	Oviya K	3	C	IT2504	Software Engineering	2024-12-25	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1480	921221104015	Oviya K	3	C	IT2504	Software Engineering	2024-12-28	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1481	921221104015	Oviya K	3	C	IT2505	Web Technology	2024-11-01	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1482	921221104015	Oviya K	3	C	IT2505	Web Technology	2024-11-04	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1483	921221104015	Oviya K	3	C	IT2505	Web Technology	2024-11-07	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1484	921221104015	Oviya K	3	C	IT2505	Web Technology	2024-11-10	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1485	921221104015	Oviya K	3	C	IT2505	Web Technology	2024-11-13	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1486	921221104015	Oviya K	3	C	IT2505	Web Technology	2024-11-16	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1487	921221104015	Oviya K	3	C	IT2505	Web Technology	2024-11-19	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1488	921221104015	Oviya K	3	C	IT2505	Web Technology	2024-11-22	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1489	921221104015	Oviya K	3	C	IT2505	Web Technology	2024-11-25	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1490	921221104015	Oviya K	3	C	IT2505	Web Technology	2024-11-28	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1491	921221104015	Oviya K	3	C	IT2505	Web Technology	2024-12-01	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1492	921221104015	Oviya K	3	C	IT2505	Web Technology	2024-12-04	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1493	921221104015	Oviya K	3	C	IT2505	Web Technology	2024-12-07	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1494	921221104015	Oviya K	3	C	IT2505	Web Technology	2024-12-10	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1495	921221104015	Oviya K	3	C	IT2505	Web Technology	2024-12-13	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1496	921221104015	Oviya K	3	C	IT2505	Web Technology	2024-12-16	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1497	921221104015	Oviya K	3	C	IT2505	Web Technology	2024-12-19	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1498	921221104015	Oviya K	3	C	IT2505	Web Technology	2024-12-22	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1499	921221104015	Oviya K	3	C	IT2505	Web Technology	2024-12-25	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1500	921221104015	Oviya K	3	C	IT2505	Web Technology	2024-12-28	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1501	921221104016	Prabu T	3	A	IT2501	Database Systems	2024-11-01	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1502	921221104016	Prabu T	3	A	IT2501	Database Systems	2024-11-04	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1503	921221104016	Prabu T	3	A	IT2501	Database Systems	2024-11-07	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1504	921221104016	Prabu T	3	A	IT2501	Database Systems	2024-11-10	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1505	921221104016	Prabu T	3	A	IT2501	Database Systems	2024-11-13	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1506	921221104016	Prabu T	3	A	IT2501	Database Systems	2024-11-16	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1507	921221104016	Prabu T	3	A	IT2501	Database Systems	2024-11-19	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1508	921221104016	Prabu T	3	A	IT2501	Database Systems	2024-11-22	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1509	921221104016	Prabu T	3	A	IT2501	Database Systems	2024-11-25	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1510	921221104016	Prabu T	3	A	IT2501	Database Systems	2024-11-28	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1511	921221104016	Prabu T	3	A	IT2501	Database Systems	2024-12-01	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1512	921221104016	Prabu T	3	A	IT2501	Database Systems	2024-12-04	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1513	921221104016	Prabu T	3	A	IT2501	Database Systems	2024-12-07	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1514	921221104016	Prabu T	3	A	IT2501	Database Systems	2024-12-10	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1515	921221104016	Prabu T	3	A	IT2501	Database Systems	2024-12-13	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1516	921221104016	Prabu T	3	A	IT2501	Database Systems	2024-12-16	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1517	921221104016	Prabu T	3	A	IT2501	Database Systems	2024-12-19	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1518	921221104016	Prabu T	3	A	IT2501	Database Systems	2024-12-22	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1519	921221104016	Prabu T	3	A	IT2501	Database Systems	2024-12-25	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1520	921221104016	Prabu T	3	A	IT2501	Database Systems	2024-12-28	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1521	921221104016	Prabu T	3	A	IT2502	Computer Networks	2024-11-01	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1522	921221104016	Prabu T	3	A	IT2502	Computer Networks	2024-11-04	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1523	921221104016	Prabu T	3	A	IT2502	Computer Networks	2024-11-07	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1524	921221104016	Prabu T	3	A	IT2502	Computer Networks	2024-11-10	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1525	921221104016	Prabu T	3	A	IT2502	Computer Networks	2024-11-13	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1526	921221104016	Prabu T	3	A	IT2502	Computer Networks	2024-11-16	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1527	921221104016	Prabu T	3	A	IT2502	Computer Networks	2024-11-19	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1528	921221104016	Prabu T	3	A	IT2502	Computer Networks	2024-11-22	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1529	921221104016	Prabu T	3	A	IT2502	Computer Networks	2024-11-25	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1530	921221104016	Prabu T	3	A	IT2502	Computer Networks	2024-11-28	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1531	921221104016	Prabu T	3	A	IT2502	Computer Networks	2024-12-01	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1532	921221104016	Prabu T	3	A	IT2502	Computer Networks	2024-12-04	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1533	921221104016	Prabu T	3	A	IT2502	Computer Networks	2024-12-07	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1534	921221104016	Prabu T	3	A	IT2502	Computer Networks	2024-12-10	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1535	921221104016	Prabu T	3	A	IT2502	Computer Networks	2024-12-13	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1536	921221104016	Prabu T	3	A	IT2502	Computer Networks	2024-12-16	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1537	921221104016	Prabu T	3	A	IT2502	Computer Networks	2024-12-19	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1538	921221104016	Prabu T	3	A	IT2502	Computer Networks	2024-12-22	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1539	921221104016	Prabu T	3	A	IT2502	Computer Networks	2024-12-25	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1540	921221104016	Prabu T	3	A	IT2502	Computer Networks	2024-12-28	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1541	921221104016	Prabu T	3	A	IT2503	Operating Systems	2024-11-01	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1542	921221104016	Prabu T	3	A	IT2503	Operating Systems	2024-11-04	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1543	921221104016	Prabu T	3	A	IT2503	Operating Systems	2024-11-07	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1544	921221104016	Prabu T	3	A	IT2503	Operating Systems	2024-11-10	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1545	921221104016	Prabu T	3	A	IT2503	Operating Systems	2024-11-13	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1546	921221104016	Prabu T	3	A	IT2503	Operating Systems	2024-11-16	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1547	921221104016	Prabu T	3	A	IT2503	Operating Systems	2024-11-19	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1548	921221104016	Prabu T	3	A	IT2503	Operating Systems	2024-11-22	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1549	921221104016	Prabu T	3	A	IT2503	Operating Systems	2024-11-25	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1550	921221104016	Prabu T	3	A	IT2503	Operating Systems	2024-11-28	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1551	921221104016	Prabu T	3	A	IT2503	Operating Systems	2024-12-01	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1552	921221104016	Prabu T	3	A	IT2503	Operating Systems	2024-12-04	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1553	921221104016	Prabu T	3	A	IT2503	Operating Systems	2024-12-07	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1554	921221104016	Prabu T	3	A	IT2503	Operating Systems	2024-12-10	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1555	921221104016	Prabu T	3	A	IT2503	Operating Systems	2024-12-13	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1556	921221104016	Prabu T	3	A	IT2503	Operating Systems	2024-12-16	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1557	921221104016	Prabu T	3	A	IT2503	Operating Systems	2024-12-19	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1558	921221104016	Prabu T	3	A	IT2503	Operating Systems	2024-12-22	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1559	921221104016	Prabu T	3	A	IT2503	Operating Systems	2024-12-25	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1560	921221104016	Prabu T	3	A	IT2503	Operating Systems	2024-12-28	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1561	921221104016	Prabu T	3	A	IT2504	Software Engineering	2024-11-01	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1562	921221104016	Prabu T	3	A	IT2504	Software Engineering	2024-11-04	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1563	921221104016	Prabu T	3	A	IT2504	Software Engineering	2024-11-07	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1564	921221104016	Prabu T	3	A	IT2504	Software Engineering	2024-11-10	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1565	921221104016	Prabu T	3	A	IT2504	Software Engineering	2024-11-13	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1566	921221104016	Prabu T	3	A	IT2504	Software Engineering	2024-11-16	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1567	921221104016	Prabu T	3	A	IT2504	Software Engineering	2024-11-19	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1568	921221104016	Prabu T	3	A	IT2504	Software Engineering	2024-11-22	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1569	921221104016	Prabu T	3	A	IT2504	Software Engineering	2024-11-25	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1570	921221104016	Prabu T	3	A	IT2504	Software Engineering	2024-11-28	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1571	921221104016	Prabu T	3	A	IT2504	Software Engineering	2024-12-01	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1572	921221104016	Prabu T	3	A	IT2504	Software Engineering	2024-12-04	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1573	921221104016	Prabu T	3	A	IT2504	Software Engineering	2024-12-07	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1574	921221104016	Prabu T	3	A	IT2504	Software Engineering	2024-12-10	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1575	921221104016	Prabu T	3	A	IT2504	Software Engineering	2024-12-13	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1576	921221104016	Prabu T	3	A	IT2504	Software Engineering	2024-12-16	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1577	921221104016	Prabu T	3	A	IT2504	Software Engineering	2024-12-19	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1578	921221104016	Prabu T	3	A	IT2504	Software Engineering	2024-12-22	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1579	921221104016	Prabu T	3	A	IT2504	Software Engineering	2024-12-25	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1580	921221104016	Prabu T	3	A	IT2504	Software Engineering	2024-12-28	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1581	921221104016	Prabu T	3	A	IT2505	Web Technology	2024-11-01	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1582	921221104016	Prabu T	3	A	IT2505	Web Technology	2024-11-04	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1583	921221104016	Prabu T	3	A	IT2505	Web Technology	2024-11-07	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1584	921221104016	Prabu T	3	A	IT2505	Web Technology	2024-11-10	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1585	921221104016	Prabu T	3	A	IT2505	Web Technology	2024-11-13	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1586	921221104016	Prabu T	3	A	IT2505	Web Technology	2024-11-16	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1587	921221104016	Prabu T	3	A	IT2505	Web Technology	2024-11-19	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1588	921221104016	Prabu T	3	A	IT2505	Web Technology	2024-11-22	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1589	921221104016	Prabu T	3	A	IT2505	Web Technology	2024-11-25	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1590	921221104016	Prabu T	3	A	IT2505	Web Technology	2024-11-28	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1591	921221104016	Prabu T	3	A	IT2505	Web Technology	2024-12-01	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1592	921221104016	Prabu T	3	A	IT2505	Web Technology	2024-12-04	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1593	921221104016	Prabu T	3	A	IT2505	Web Technology	2024-12-07	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1594	921221104016	Prabu T	3	A	IT2505	Web Technology	2024-12-10	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1595	921221104016	Prabu T	3	A	IT2505	Web Technology	2024-12-13	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1596	921221104016	Prabu T	3	A	IT2505	Web Technology	2024-12-16	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1597	921221104016	Prabu T	3	A	IT2505	Web Technology	2024-12-19	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1598	921221104016	Prabu T	3	A	IT2505	Web Technology	2024-12-22	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1599	921221104016	Prabu T	3	A	IT2505	Web Technology	2024-12-25	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1600	921221104016	Prabu T	3	A	IT2505	Web Technology	2024-12-28	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1601	921221104017	Ragavi S	3	B	IT2501	Database Systems	2024-11-01	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1602	921221104017	Ragavi S	3	B	IT2501	Database Systems	2024-11-04	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1603	921221104017	Ragavi S	3	B	IT2501	Database Systems	2024-11-07	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1604	921221104017	Ragavi S	3	B	IT2501	Database Systems	2024-11-10	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1605	921221104017	Ragavi S	3	B	IT2501	Database Systems	2024-11-13	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1606	921221104017	Ragavi S	3	B	IT2501	Database Systems	2024-11-16	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1607	921221104017	Ragavi S	3	B	IT2501	Database Systems	2024-11-19	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1608	921221104017	Ragavi S	3	B	IT2501	Database Systems	2024-11-22	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1609	921221104017	Ragavi S	3	B	IT2501	Database Systems	2024-11-25	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1610	921221104017	Ragavi S	3	B	IT2501	Database Systems	2024-11-28	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1611	921221104017	Ragavi S	3	B	IT2501	Database Systems	2024-12-01	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1612	921221104017	Ragavi S	3	B	IT2501	Database Systems	2024-12-04	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1613	921221104017	Ragavi S	3	B	IT2501	Database Systems	2024-12-07	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1614	921221104017	Ragavi S	3	B	IT2501	Database Systems	2024-12-10	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1615	921221104017	Ragavi S	3	B	IT2501	Database Systems	2024-12-13	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1616	921221104017	Ragavi S	3	B	IT2501	Database Systems	2024-12-16	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1617	921221104017	Ragavi S	3	B	IT2501	Database Systems	2024-12-19	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1618	921221104017	Ragavi S	3	B	IT2501	Database Systems	2024-12-22	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1619	921221104017	Ragavi S	3	B	IT2501	Database Systems	2024-12-25	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1620	921221104017	Ragavi S	3	B	IT2501	Database Systems	2024-12-28	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1621	921221104017	Ragavi S	3	B	IT2502	Computer Networks	2024-11-01	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1622	921221104017	Ragavi S	3	B	IT2502	Computer Networks	2024-11-04	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1623	921221104017	Ragavi S	3	B	IT2502	Computer Networks	2024-11-07	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1624	921221104017	Ragavi S	3	B	IT2502	Computer Networks	2024-11-10	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1625	921221104017	Ragavi S	3	B	IT2502	Computer Networks	2024-11-13	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1626	921221104017	Ragavi S	3	B	IT2502	Computer Networks	2024-11-16	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1627	921221104017	Ragavi S	3	B	IT2502	Computer Networks	2024-11-19	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1628	921221104017	Ragavi S	3	B	IT2502	Computer Networks	2024-11-22	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1629	921221104017	Ragavi S	3	B	IT2502	Computer Networks	2024-11-25	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1630	921221104017	Ragavi S	3	B	IT2502	Computer Networks	2024-11-28	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1631	921221104017	Ragavi S	3	B	IT2502	Computer Networks	2024-12-01	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1632	921221104017	Ragavi S	3	B	IT2502	Computer Networks	2024-12-04	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1633	921221104017	Ragavi S	3	B	IT2502	Computer Networks	2024-12-07	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1634	921221104017	Ragavi S	3	B	IT2502	Computer Networks	2024-12-10	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1635	921221104017	Ragavi S	3	B	IT2502	Computer Networks	2024-12-13	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1636	921221104017	Ragavi S	3	B	IT2502	Computer Networks	2024-12-16	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1637	921221104017	Ragavi S	3	B	IT2502	Computer Networks	2024-12-19	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1638	921221104017	Ragavi S	3	B	IT2502	Computer Networks	2024-12-22	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1639	921221104017	Ragavi S	3	B	IT2502	Computer Networks	2024-12-25	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1640	921221104017	Ragavi S	3	B	IT2502	Computer Networks	2024-12-28	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1641	921221104017	Ragavi S	3	B	IT2503	Operating Systems	2024-11-01	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1642	921221104017	Ragavi S	3	B	IT2503	Operating Systems	2024-11-04	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1643	921221104017	Ragavi S	3	B	IT2503	Operating Systems	2024-11-07	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1644	921221104017	Ragavi S	3	B	IT2503	Operating Systems	2024-11-10	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1645	921221104017	Ragavi S	3	B	IT2503	Operating Systems	2024-11-13	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1646	921221104017	Ragavi S	3	B	IT2503	Operating Systems	2024-11-16	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1647	921221104017	Ragavi S	3	B	IT2503	Operating Systems	2024-11-19	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1648	921221104017	Ragavi S	3	B	IT2503	Operating Systems	2024-11-22	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1649	921221104017	Ragavi S	3	B	IT2503	Operating Systems	2024-11-25	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1650	921221104017	Ragavi S	3	B	IT2503	Operating Systems	2024-11-28	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1651	921221104017	Ragavi S	3	B	IT2503	Operating Systems	2024-12-01	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1652	921221104017	Ragavi S	3	B	IT2503	Operating Systems	2024-12-04	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1653	921221104017	Ragavi S	3	B	IT2503	Operating Systems	2024-12-07	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1654	921221104017	Ragavi S	3	B	IT2503	Operating Systems	2024-12-10	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1655	921221104017	Ragavi S	3	B	IT2503	Operating Systems	2024-12-13	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1656	921221104017	Ragavi S	3	B	IT2503	Operating Systems	2024-12-16	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1657	921221104017	Ragavi S	3	B	IT2503	Operating Systems	2024-12-19	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1658	921221104017	Ragavi S	3	B	IT2503	Operating Systems	2024-12-22	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1659	921221104017	Ragavi S	3	B	IT2503	Operating Systems	2024-12-25	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1660	921221104017	Ragavi S	3	B	IT2503	Operating Systems	2024-12-28	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1661	921221104017	Ragavi S	3	B	IT2504	Software Engineering	2024-11-01	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1662	921221104017	Ragavi S	3	B	IT2504	Software Engineering	2024-11-04	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1663	921221104017	Ragavi S	3	B	IT2504	Software Engineering	2024-11-07	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1664	921221104017	Ragavi S	3	B	IT2504	Software Engineering	2024-11-10	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1665	921221104017	Ragavi S	3	B	IT2504	Software Engineering	2024-11-13	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1666	921221104017	Ragavi S	3	B	IT2504	Software Engineering	2024-11-16	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1667	921221104017	Ragavi S	3	B	IT2504	Software Engineering	2024-11-19	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1668	921221104017	Ragavi S	3	B	IT2504	Software Engineering	2024-11-22	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1669	921221104017	Ragavi S	3	B	IT2504	Software Engineering	2024-11-25	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1670	921221104017	Ragavi S	3	B	IT2504	Software Engineering	2024-11-28	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1671	921221104017	Ragavi S	3	B	IT2504	Software Engineering	2024-12-01	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1672	921221104017	Ragavi S	3	B	IT2504	Software Engineering	2024-12-04	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1673	921221104017	Ragavi S	3	B	IT2504	Software Engineering	2024-12-07	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1674	921221104017	Ragavi S	3	B	IT2504	Software Engineering	2024-12-10	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1675	921221104017	Ragavi S	3	B	IT2504	Software Engineering	2024-12-13	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1676	921221104017	Ragavi S	3	B	IT2504	Software Engineering	2024-12-16	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1677	921221104017	Ragavi S	3	B	IT2504	Software Engineering	2024-12-19	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1678	921221104017	Ragavi S	3	B	IT2504	Software Engineering	2024-12-22	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1679	921221104017	Ragavi S	3	B	IT2504	Software Engineering	2024-12-25	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1680	921221104017	Ragavi S	3	B	IT2504	Software Engineering	2024-12-28	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1681	921221104017	Ragavi S	3	B	IT2505	Web Technology	2024-11-01	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1682	921221104017	Ragavi S	3	B	IT2505	Web Technology	2024-11-04	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1683	921221104017	Ragavi S	3	B	IT2505	Web Technology	2024-11-07	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1684	921221104017	Ragavi S	3	B	IT2505	Web Technology	2024-11-10	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1685	921221104017	Ragavi S	3	B	IT2505	Web Technology	2024-11-13	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1686	921221104017	Ragavi S	3	B	IT2505	Web Technology	2024-11-16	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1687	921221104017	Ragavi S	3	B	IT2505	Web Technology	2024-11-19	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1688	921221104017	Ragavi S	3	B	IT2505	Web Technology	2024-11-22	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1689	921221104017	Ragavi S	3	B	IT2505	Web Technology	2024-11-25	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1690	921221104017	Ragavi S	3	B	IT2505	Web Technology	2024-11-28	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1691	921221104017	Ragavi S	3	B	IT2505	Web Technology	2024-12-01	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1692	921221104017	Ragavi S	3	B	IT2505	Web Technology	2024-12-04	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1693	921221104017	Ragavi S	3	B	IT2505	Web Technology	2024-12-07	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1694	921221104017	Ragavi S	3	B	IT2505	Web Technology	2024-12-10	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1695	921221104017	Ragavi S	3	B	IT2505	Web Technology	2024-12-13	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1696	921221104017	Ragavi S	3	B	IT2505	Web Technology	2024-12-16	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1697	921221104017	Ragavi S	3	B	IT2505	Web Technology	2024-12-19	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1698	921221104017	Ragavi S	3	B	IT2505	Web Technology	2024-12-22	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1699	921221104017	Ragavi S	3	B	IT2505	Web Technology	2024-12-25	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1700	921221104017	Ragavi S	3	B	IT2505	Web Technology	2024-12-28	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1701	921221104018	Selvam J	3	C	IT2501	Database Systems	2024-11-01	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1702	921221104018	Selvam J	3	C	IT2501	Database Systems	2024-11-04	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1703	921221104018	Selvam J	3	C	IT2501	Database Systems	2024-11-07	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1704	921221104018	Selvam J	3	C	IT2501	Database Systems	2024-11-10	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1705	921221104018	Selvam J	3	C	IT2501	Database Systems	2024-11-13	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1706	921221104018	Selvam J	3	C	IT2501	Database Systems	2024-11-16	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1707	921221104018	Selvam J	3	C	IT2501	Database Systems	2024-11-19	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1708	921221104018	Selvam J	3	C	IT2501	Database Systems	2024-11-22	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1709	921221104018	Selvam J	3	C	IT2501	Database Systems	2024-11-25	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1710	921221104018	Selvam J	3	C	IT2501	Database Systems	2024-11-28	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1711	921221104018	Selvam J	3	C	IT2501	Database Systems	2024-12-01	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1712	921221104018	Selvam J	3	C	IT2501	Database Systems	2024-12-04	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1713	921221104018	Selvam J	3	C	IT2501	Database Systems	2024-12-07	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1714	921221104018	Selvam J	3	C	IT2501	Database Systems	2024-12-10	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1715	921221104018	Selvam J	3	C	IT2501	Database Systems	2024-12-13	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1716	921221104018	Selvam J	3	C	IT2501	Database Systems	2024-12-16	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1717	921221104018	Selvam J	3	C	IT2501	Database Systems	2024-12-19	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1718	921221104018	Selvam J	3	C	IT2501	Database Systems	2024-12-22	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1719	921221104018	Selvam J	3	C	IT2501	Database Systems	2024-12-25	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1720	921221104018	Selvam J	3	C	IT2501	Database Systems	2024-12-28	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1721	921221104018	Selvam J	3	C	IT2502	Computer Networks	2024-11-01	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1722	921221104018	Selvam J	3	C	IT2502	Computer Networks	2024-11-04	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1723	921221104018	Selvam J	3	C	IT2502	Computer Networks	2024-11-07	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1724	921221104018	Selvam J	3	C	IT2502	Computer Networks	2024-11-10	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1725	921221104018	Selvam J	3	C	IT2502	Computer Networks	2024-11-13	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1726	921221104018	Selvam J	3	C	IT2502	Computer Networks	2024-11-16	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1727	921221104018	Selvam J	3	C	IT2502	Computer Networks	2024-11-19	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1728	921221104018	Selvam J	3	C	IT2502	Computer Networks	2024-11-22	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1729	921221104018	Selvam J	3	C	IT2502	Computer Networks	2024-11-25	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1730	921221104018	Selvam J	3	C	IT2502	Computer Networks	2024-11-28	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1731	921221104018	Selvam J	3	C	IT2502	Computer Networks	2024-12-01	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1732	921221104018	Selvam J	3	C	IT2502	Computer Networks	2024-12-04	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1733	921221104018	Selvam J	3	C	IT2502	Computer Networks	2024-12-07	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1734	921221104018	Selvam J	3	C	IT2502	Computer Networks	2024-12-10	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1735	921221104018	Selvam J	3	C	IT2502	Computer Networks	2024-12-13	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1736	921221104018	Selvam J	3	C	IT2502	Computer Networks	2024-12-16	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1737	921221104018	Selvam J	3	C	IT2502	Computer Networks	2024-12-19	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1738	921221104018	Selvam J	3	C	IT2502	Computer Networks	2024-12-22	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1739	921221104018	Selvam J	3	C	IT2502	Computer Networks	2024-12-25	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1740	921221104018	Selvam J	3	C	IT2502	Computer Networks	2024-12-28	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1741	921221104018	Selvam J	3	C	IT2503	Operating Systems	2024-11-01	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1742	921221104018	Selvam J	3	C	IT2503	Operating Systems	2024-11-04	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1743	921221104018	Selvam J	3	C	IT2503	Operating Systems	2024-11-07	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1744	921221104018	Selvam J	3	C	IT2503	Operating Systems	2024-11-10	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1745	921221104018	Selvam J	3	C	IT2503	Operating Systems	2024-11-13	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1746	921221104018	Selvam J	3	C	IT2503	Operating Systems	2024-11-16	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1747	921221104018	Selvam J	3	C	IT2503	Operating Systems	2024-11-19	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1748	921221104018	Selvam J	3	C	IT2503	Operating Systems	2024-11-22	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1749	921221104018	Selvam J	3	C	IT2503	Operating Systems	2024-11-25	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1750	921221104018	Selvam J	3	C	IT2503	Operating Systems	2024-11-28	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1751	921221104018	Selvam J	3	C	IT2503	Operating Systems	2024-12-01	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1752	921221104018	Selvam J	3	C	IT2503	Operating Systems	2024-12-04	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1753	921221104018	Selvam J	3	C	IT2503	Operating Systems	2024-12-07	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1754	921221104018	Selvam J	3	C	IT2503	Operating Systems	2024-12-10	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1755	921221104018	Selvam J	3	C	IT2503	Operating Systems	2024-12-13	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1756	921221104018	Selvam J	3	C	IT2503	Operating Systems	2024-12-16	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1757	921221104018	Selvam J	3	C	IT2503	Operating Systems	2024-12-19	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1758	921221104018	Selvam J	3	C	IT2503	Operating Systems	2024-12-22	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1759	921221104018	Selvam J	3	C	IT2503	Operating Systems	2024-12-25	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1760	921221104018	Selvam J	3	C	IT2503	Operating Systems	2024-12-28	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1761	921221104018	Selvam J	3	C	IT2504	Software Engineering	2024-11-01	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1762	921221104018	Selvam J	3	C	IT2504	Software Engineering	2024-11-04	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1763	921221104018	Selvam J	3	C	IT2504	Software Engineering	2024-11-07	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1764	921221104018	Selvam J	3	C	IT2504	Software Engineering	2024-11-10	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1765	921221104018	Selvam J	3	C	IT2504	Software Engineering	2024-11-13	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1766	921221104018	Selvam J	3	C	IT2504	Software Engineering	2024-11-16	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1767	921221104018	Selvam J	3	C	IT2504	Software Engineering	2024-11-19	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1768	921221104018	Selvam J	3	C	IT2504	Software Engineering	2024-11-22	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1769	921221104018	Selvam J	3	C	IT2504	Software Engineering	2024-11-25	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1770	921221104018	Selvam J	3	C	IT2504	Software Engineering	2024-11-28	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1771	921221104018	Selvam J	3	C	IT2504	Software Engineering	2024-12-01	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1772	921221104018	Selvam J	3	C	IT2504	Software Engineering	2024-12-04	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1773	921221104018	Selvam J	3	C	IT2504	Software Engineering	2024-12-07	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1774	921221104018	Selvam J	3	C	IT2504	Software Engineering	2024-12-10	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1775	921221104018	Selvam J	3	C	IT2504	Software Engineering	2024-12-13	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1776	921221104018	Selvam J	3	C	IT2504	Software Engineering	2024-12-16	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1777	921221104018	Selvam J	3	C	IT2504	Software Engineering	2024-12-19	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1778	921221104018	Selvam J	3	C	IT2504	Software Engineering	2024-12-22	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1779	921221104018	Selvam J	3	C	IT2504	Software Engineering	2024-12-25	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1780	921221104018	Selvam J	3	C	IT2504	Software Engineering	2024-12-28	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1781	921221104018	Selvam J	3	C	IT2505	Web Technology	2024-11-01	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1782	921221104018	Selvam J	3	C	IT2505	Web Technology	2024-11-04	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1783	921221104018	Selvam J	3	C	IT2505	Web Technology	2024-11-07	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1784	921221104018	Selvam J	3	C	IT2505	Web Technology	2024-11-10	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1785	921221104018	Selvam J	3	C	IT2505	Web Technology	2024-11-13	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1786	921221104018	Selvam J	3	C	IT2505	Web Technology	2024-11-16	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1787	921221104018	Selvam J	3	C	IT2505	Web Technology	2024-11-19	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1788	921221104018	Selvam J	3	C	IT2505	Web Technology	2024-11-22	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1789	921221104018	Selvam J	3	C	IT2505	Web Technology	2024-11-25	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1790	921221104018	Selvam J	3	C	IT2505	Web Technology	2024-11-28	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1791	921221104018	Selvam J	3	C	IT2505	Web Technology	2024-12-01	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1792	921221104018	Selvam J	3	C	IT2505	Web Technology	2024-12-04	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1793	921221104018	Selvam J	3	C	IT2505	Web Technology	2024-12-07	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1794	921221104018	Selvam J	3	C	IT2505	Web Technology	2024-12-10	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1795	921221104018	Selvam J	3	C	IT2505	Web Technology	2024-12-13	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1796	921221104018	Selvam J	3	C	IT2505	Web Technology	2024-12-16	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1797	921221104018	Selvam J	3	C	IT2505	Web Technology	2024-12-19	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1798	921221104018	Selvam J	3	C	IT2505	Web Technology	2024-12-22	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1799	921221104018	Selvam J	3	C	IT2505	Web Technology	2024-12-25	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1800	921221104018	Selvam J	3	C	IT2505	Web Technology	2024-12-28	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1801	921221104019	Tamilarasi P	3	A	IT2501	Database Systems	2024-11-01	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1802	921221104019	Tamilarasi P	3	A	IT2501	Database Systems	2024-11-04	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1803	921221104019	Tamilarasi P	3	A	IT2501	Database Systems	2024-11-07	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1804	921221104019	Tamilarasi P	3	A	IT2501	Database Systems	2024-11-10	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1805	921221104019	Tamilarasi P	3	A	IT2501	Database Systems	2024-11-13	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1806	921221104019	Tamilarasi P	3	A	IT2501	Database Systems	2024-11-16	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1807	921221104019	Tamilarasi P	3	A	IT2501	Database Systems	2024-11-19	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1808	921221104019	Tamilarasi P	3	A	IT2501	Database Systems	2024-11-22	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1809	921221104019	Tamilarasi P	3	A	IT2501	Database Systems	2024-11-25	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1810	921221104019	Tamilarasi P	3	A	IT2501	Database Systems	2024-11-28	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1811	921221104019	Tamilarasi P	3	A	IT2501	Database Systems	2024-12-01	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1812	921221104019	Tamilarasi P	3	A	IT2501	Database Systems	2024-12-04	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1813	921221104019	Tamilarasi P	3	A	IT2501	Database Systems	2024-12-07	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1814	921221104019	Tamilarasi P	3	A	IT2501	Database Systems	2024-12-10	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1815	921221104019	Tamilarasi P	3	A	IT2501	Database Systems	2024-12-13	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1816	921221104019	Tamilarasi P	3	A	IT2501	Database Systems	2024-12-16	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1817	921221104019	Tamilarasi P	3	A	IT2501	Database Systems	2024-12-19	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1818	921221104019	Tamilarasi P	3	A	IT2501	Database Systems	2024-12-22	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1819	921221104019	Tamilarasi P	3	A	IT2501	Database Systems	2024-12-25	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1820	921221104019	Tamilarasi P	3	A	IT2501	Database Systems	2024-12-28	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1821	921221104019	Tamilarasi P	3	A	IT2502	Computer Networks	2024-11-01	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1822	921221104019	Tamilarasi P	3	A	IT2502	Computer Networks	2024-11-04	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1823	921221104019	Tamilarasi P	3	A	IT2502	Computer Networks	2024-11-07	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1824	921221104019	Tamilarasi P	3	A	IT2502	Computer Networks	2024-11-10	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1825	921221104019	Tamilarasi P	3	A	IT2502	Computer Networks	2024-11-13	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1826	921221104019	Tamilarasi P	3	A	IT2502	Computer Networks	2024-11-16	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1827	921221104019	Tamilarasi P	3	A	IT2502	Computer Networks	2024-11-19	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1828	921221104019	Tamilarasi P	3	A	IT2502	Computer Networks	2024-11-22	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1829	921221104019	Tamilarasi P	3	A	IT2502	Computer Networks	2024-11-25	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1830	921221104019	Tamilarasi P	3	A	IT2502	Computer Networks	2024-11-28	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1831	921221104019	Tamilarasi P	3	A	IT2502	Computer Networks	2024-12-01	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1832	921221104019	Tamilarasi P	3	A	IT2502	Computer Networks	2024-12-04	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1833	921221104019	Tamilarasi P	3	A	IT2502	Computer Networks	2024-12-07	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1834	921221104019	Tamilarasi P	3	A	IT2502	Computer Networks	2024-12-10	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1835	921221104019	Tamilarasi P	3	A	IT2502	Computer Networks	2024-12-13	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1836	921221104019	Tamilarasi P	3	A	IT2502	Computer Networks	2024-12-16	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1837	921221104019	Tamilarasi P	3	A	IT2502	Computer Networks	2024-12-19	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1838	921221104019	Tamilarasi P	3	A	IT2502	Computer Networks	2024-12-22	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1839	921221104019	Tamilarasi P	3	A	IT2502	Computer Networks	2024-12-25	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1840	921221104019	Tamilarasi P	3	A	IT2502	Computer Networks	2024-12-28	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1841	921221104019	Tamilarasi P	3	A	IT2503	Operating Systems	2024-11-01	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1842	921221104019	Tamilarasi P	3	A	IT2503	Operating Systems	2024-11-04	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1843	921221104019	Tamilarasi P	3	A	IT2503	Operating Systems	2024-11-07	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1844	921221104019	Tamilarasi P	3	A	IT2503	Operating Systems	2024-11-10	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1845	921221104019	Tamilarasi P	3	A	IT2503	Operating Systems	2024-11-13	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1846	921221104019	Tamilarasi P	3	A	IT2503	Operating Systems	2024-11-16	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1847	921221104019	Tamilarasi P	3	A	IT2503	Operating Systems	2024-11-19	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1848	921221104019	Tamilarasi P	3	A	IT2503	Operating Systems	2024-11-22	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1849	921221104019	Tamilarasi P	3	A	IT2503	Operating Systems	2024-11-25	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1850	921221104019	Tamilarasi P	3	A	IT2503	Operating Systems	2024-11-28	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1851	921221104019	Tamilarasi P	3	A	IT2503	Operating Systems	2024-12-01	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1852	921221104019	Tamilarasi P	3	A	IT2503	Operating Systems	2024-12-04	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1853	921221104019	Tamilarasi P	3	A	IT2503	Operating Systems	2024-12-07	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1854	921221104019	Tamilarasi P	3	A	IT2503	Operating Systems	2024-12-10	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1855	921221104019	Tamilarasi P	3	A	IT2503	Operating Systems	2024-12-13	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1856	921221104019	Tamilarasi P	3	A	IT2503	Operating Systems	2024-12-16	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1857	921221104019	Tamilarasi P	3	A	IT2503	Operating Systems	2024-12-19	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1858	921221104019	Tamilarasi P	3	A	IT2503	Operating Systems	2024-12-22	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1859	921221104019	Tamilarasi P	3	A	IT2503	Operating Systems	2024-12-25	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1860	921221104019	Tamilarasi P	3	A	IT2503	Operating Systems	2024-12-28	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1861	921221104019	Tamilarasi P	3	A	IT2504	Software Engineering	2024-11-01	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1862	921221104019	Tamilarasi P	3	A	IT2504	Software Engineering	2024-11-04	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1863	921221104019	Tamilarasi P	3	A	IT2504	Software Engineering	2024-11-07	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1864	921221104019	Tamilarasi P	3	A	IT2504	Software Engineering	2024-11-10	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1865	921221104019	Tamilarasi P	3	A	IT2504	Software Engineering	2024-11-13	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1866	921221104019	Tamilarasi P	3	A	IT2504	Software Engineering	2024-11-16	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1867	921221104019	Tamilarasi P	3	A	IT2504	Software Engineering	2024-11-19	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1868	921221104019	Tamilarasi P	3	A	IT2504	Software Engineering	2024-11-22	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1869	921221104019	Tamilarasi P	3	A	IT2504	Software Engineering	2024-11-25	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1870	921221104019	Tamilarasi P	3	A	IT2504	Software Engineering	2024-11-28	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1871	921221104019	Tamilarasi P	3	A	IT2504	Software Engineering	2024-12-01	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1872	921221104019	Tamilarasi P	3	A	IT2504	Software Engineering	2024-12-04	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1873	921221104019	Tamilarasi P	3	A	IT2504	Software Engineering	2024-12-07	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1874	921221104019	Tamilarasi P	3	A	IT2504	Software Engineering	2024-12-10	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1875	921221104019	Tamilarasi P	3	A	IT2504	Software Engineering	2024-12-13	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1876	921221104019	Tamilarasi P	3	A	IT2504	Software Engineering	2024-12-16	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1877	921221104019	Tamilarasi P	3	A	IT2504	Software Engineering	2024-12-19	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1878	921221104019	Tamilarasi P	3	A	IT2504	Software Engineering	2024-12-22	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1879	921221104019	Tamilarasi P	3	A	IT2504	Software Engineering	2024-12-25	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1880	921221104019	Tamilarasi P	3	A	IT2504	Software Engineering	2024-12-28	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1881	921221104019	Tamilarasi P	3	A	IT2505	Web Technology	2024-11-01	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1882	921221104019	Tamilarasi P	3	A	IT2505	Web Technology	2024-11-04	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1883	921221104019	Tamilarasi P	3	A	IT2505	Web Technology	2024-11-07	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1884	921221104019	Tamilarasi P	3	A	IT2505	Web Technology	2024-11-10	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1885	921221104019	Tamilarasi P	3	A	IT2505	Web Technology	2024-11-13	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1886	921221104019	Tamilarasi P	3	A	IT2505	Web Technology	2024-11-16	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1887	921221104019	Tamilarasi P	3	A	IT2505	Web Technology	2024-11-19	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1888	921221104019	Tamilarasi P	3	A	IT2505	Web Technology	2024-11-22	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1889	921221104019	Tamilarasi P	3	A	IT2505	Web Technology	2024-11-25	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1890	921221104019	Tamilarasi P	3	A	IT2505	Web Technology	2024-11-28	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1891	921221104019	Tamilarasi P	3	A	IT2505	Web Technology	2024-12-01	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1892	921221104019	Tamilarasi P	3	A	IT2505	Web Technology	2024-12-04	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1893	921221104019	Tamilarasi P	3	A	IT2505	Web Technology	2024-12-07	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1894	921221104019	Tamilarasi P	3	A	IT2505	Web Technology	2024-12-10	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1895	921221104019	Tamilarasi P	3	A	IT2505	Web Technology	2024-12-13	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1896	921221104019	Tamilarasi P	3	A	IT2505	Web Technology	2024-12-16	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1897	921221104019	Tamilarasi P	3	A	IT2505	Web Technology	2024-12-19	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1898	921221104019	Tamilarasi P	3	A	IT2505	Web Technology	2024-12-22	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1899	921221104019	Tamilarasi P	3	A	IT2505	Web Technology	2024-12-25	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1900	921221104019	Tamilarasi P	3	A	IT2505	Web Technology	2024-12-28	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1901	921221104020	Usha K	3	B	IT2501	Database Systems	2024-11-01	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1902	921221104020	Usha K	3	B	IT2501	Database Systems	2024-11-04	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1903	921221104020	Usha K	3	B	IT2501	Database Systems	2024-11-07	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1904	921221104020	Usha K	3	B	IT2501	Database Systems	2024-11-10	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1905	921221104020	Usha K	3	B	IT2501	Database Systems	2024-11-13	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1906	921221104020	Usha K	3	B	IT2501	Database Systems	2024-11-16	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1907	921221104020	Usha K	3	B	IT2501	Database Systems	2024-11-19	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1908	921221104020	Usha K	3	B	IT2501	Database Systems	2024-11-22	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1909	921221104020	Usha K	3	B	IT2501	Database Systems	2024-11-25	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1910	921221104020	Usha K	3	B	IT2501	Database Systems	2024-11-28	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1911	921221104020	Usha K	3	B	IT2501	Database Systems	2024-12-01	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1912	921221104020	Usha K	3	B	IT2501	Database Systems	2024-12-04	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1913	921221104020	Usha K	3	B	IT2501	Database Systems	2024-12-07	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1914	921221104020	Usha K	3	B	IT2501	Database Systems	2024-12-10	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1915	921221104020	Usha K	3	B	IT2501	Database Systems	2024-12-13	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1916	921221104020	Usha K	3	B	IT2501	Database Systems	2024-12-16	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1917	921221104020	Usha K	3	B	IT2501	Database Systems	2024-12-19	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1918	921221104020	Usha K	3	B	IT2501	Database Systems	2024-12-22	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1919	921221104020	Usha K	3	B	IT2501	Database Systems	2024-12-25	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1920	921221104020	Usha K	3	B	IT2501	Database Systems	2024-12-28	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1921	921221104020	Usha K	3	B	IT2502	Computer Networks	2024-11-01	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1922	921221104020	Usha K	3	B	IT2502	Computer Networks	2024-11-04	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1923	921221104020	Usha K	3	B	IT2502	Computer Networks	2024-11-07	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1924	921221104020	Usha K	3	B	IT2502	Computer Networks	2024-11-10	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1925	921221104020	Usha K	3	B	IT2502	Computer Networks	2024-11-13	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1926	921221104020	Usha K	3	B	IT2502	Computer Networks	2024-11-16	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1927	921221104020	Usha K	3	B	IT2502	Computer Networks	2024-11-19	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1928	921221104020	Usha K	3	B	IT2502	Computer Networks	2024-11-22	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1929	921221104020	Usha K	3	B	IT2502	Computer Networks	2024-11-25	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1930	921221104020	Usha K	3	B	IT2502	Computer Networks	2024-11-28	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1931	921221104020	Usha K	3	B	IT2502	Computer Networks	2024-12-01	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1932	921221104020	Usha K	3	B	IT2502	Computer Networks	2024-12-04	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1933	921221104020	Usha K	3	B	IT2502	Computer Networks	2024-12-07	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1934	921221104020	Usha K	3	B	IT2502	Computer Networks	2024-12-10	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1935	921221104020	Usha K	3	B	IT2502	Computer Networks	2024-12-13	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1936	921221104020	Usha K	3	B	IT2502	Computer Networks	2024-12-16	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1937	921221104020	Usha K	3	B	IT2502	Computer Networks	2024-12-19	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1938	921221104020	Usha K	3	B	IT2502	Computer Networks	2024-12-22	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1939	921221104020	Usha K	3	B	IT2502	Computer Networks	2024-12-25	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1940	921221104020	Usha K	3	B	IT2502	Computer Networks	2024-12-28	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1941	921221104020	Usha K	3	B	IT2503	Operating Systems	2024-11-01	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1942	921221104020	Usha K	3	B	IT2503	Operating Systems	2024-11-04	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1943	921221104020	Usha K	3	B	IT2503	Operating Systems	2024-11-07	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1944	921221104020	Usha K	3	B	IT2503	Operating Systems	2024-11-10	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1945	921221104020	Usha K	3	B	IT2503	Operating Systems	2024-11-13	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1946	921221104020	Usha K	3	B	IT2503	Operating Systems	2024-11-16	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1947	921221104020	Usha K	3	B	IT2503	Operating Systems	2024-11-19	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1948	921221104020	Usha K	3	B	IT2503	Operating Systems	2024-11-22	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1949	921221104020	Usha K	3	B	IT2503	Operating Systems	2024-11-25	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1950	921221104020	Usha K	3	B	IT2503	Operating Systems	2024-11-28	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1951	921221104020	Usha K	3	B	IT2503	Operating Systems	2024-12-01	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1952	921221104020	Usha K	3	B	IT2503	Operating Systems	2024-12-04	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1953	921221104020	Usha K	3	B	IT2503	Operating Systems	2024-12-07	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1954	921221104020	Usha K	3	B	IT2503	Operating Systems	2024-12-10	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1955	921221104020	Usha K	3	B	IT2503	Operating Systems	2024-12-13	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1956	921221104020	Usha K	3	B	IT2503	Operating Systems	2024-12-16	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1957	921221104020	Usha K	3	B	IT2503	Operating Systems	2024-12-19	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1958	921221104020	Usha K	3	B	IT2503	Operating Systems	2024-12-22	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1959	921221104020	Usha K	3	B	IT2503	Operating Systems	2024-12-25	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1960	921221104020	Usha K	3	B	IT2503	Operating Systems	2024-12-28	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1961	921221104020	Usha K	3	B	IT2504	Software Engineering	2024-11-01	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1962	921221104020	Usha K	3	B	IT2504	Software Engineering	2024-11-04	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1963	921221104020	Usha K	3	B	IT2504	Software Engineering	2024-11-07	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1964	921221104020	Usha K	3	B	IT2504	Software Engineering	2024-11-10	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1965	921221104020	Usha K	3	B	IT2504	Software Engineering	2024-11-13	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1966	921221104020	Usha K	3	B	IT2504	Software Engineering	2024-11-16	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1967	921221104020	Usha K	3	B	IT2504	Software Engineering	2024-11-19	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1968	921221104020	Usha K	3	B	IT2504	Software Engineering	2024-11-22	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1969	921221104020	Usha K	3	B	IT2504	Software Engineering	2024-11-25	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1970	921221104020	Usha K	3	B	IT2504	Software Engineering	2024-11-28	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1971	921221104020	Usha K	3	B	IT2504	Software Engineering	2024-12-01	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1972	921221104020	Usha K	3	B	IT2504	Software Engineering	2024-12-04	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1973	921221104020	Usha K	3	B	IT2504	Software Engineering	2024-12-07	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1974	921221104020	Usha K	3	B	IT2504	Software Engineering	2024-12-10	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1975	921221104020	Usha K	3	B	IT2504	Software Engineering	2024-12-13	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1976	921221104020	Usha K	3	B	IT2504	Software Engineering	2024-12-16	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1977	921221104020	Usha K	3	B	IT2504	Software Engineering	2024-12-19	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1978	921221104020	Usha K	3	B	IT2504	Software Engineering	2024-12-22	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1979	921221104020	Usha K	3	B	IT2504	Software Engineering	2024-12-25	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1980	921221104020	Usha K	3	B	IT2504	Software Engineering	2024-12-28	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1981	921221104020	Usha K	3	B	IT2505	Web Technology	2024-11-01	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1982	921221104020	Usha K	3	B	IT2505	Web Technology	2024-11-04	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1983	921221104020	Usha K	3	B	IT2505	Web Technology	2024-11-07	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1984	921221104020	Usha K	3	B	IT2505	Web Technology	2024-11-10	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1985	921221104020	Usha K	3	B	IT2505	Web Technology	2024-11-13	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1986	921221104020	Usha K	3	B	IT2505	Web Technology	2024-11-16	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1987	921221104020	Usha K	3	B	IT2505	Web Technology	2024-11-19	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1988	921221104020	Usha K	3	B	IT2505	Web Technology	2024-11-22	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1989	921221104020	Usha K	3	B	IT2505	Web Technology	2024-11-25	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1990	921221104020	Usha K	3	B	IT2505	Web Technology	2024-11-28	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1991	921221104020	Usha K	3	B	IT2505	Web Technology	2024-12-01	absent	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1992	921221104020	Usha K	3	B	IT2505	Web Technology	2024-12-04	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1993	921221104020	Usha K	3	B	IT2505	Web Technology	2024-12-07	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1994	921221104020	Usha K	3	B	IT2505	Web Technology	2024-12-10	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1995	921221104020	Usha K	3	B	IT2505	Web Technology	2024-12-13	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1996	921221104020	Usha K	3	B	IT2505	Web Technology	2024-12-16	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1997	921221104020	Usha K	3	B	IT2505	Web Technology	2024-12-19	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1998	921221104020	Usha K	3	B	IT2505	Web Technology	2024-12-22	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
1999	921221104020	Usha K	3	B	IT2505	Web Technology	2024-12-25	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
2000	921221104020	Usha K	3	B	IT2505	Web Technology	2024-12-28	present	2026-03-23 16:17:00.509969+05:30	f50e2ed7
\.


--
-- Data for Name: attendance_summary; Type: TABLE DATA; Schema: public; Owner: vsb_user
--

COPY public.attendance_summary (id, student_id, student_name, year, section, subject_code, subject_name, total_classes, classes_attended, attendance_pct, is_below_75, updated_at) FROM stdin;
1	921221104018	Selvam J	3	C	IT2503	Operating Systems	20	16	80	f	2026-03-23 16:17:03.073534+05:30
2	921221104009	Indira C	2	C	IT2301	Data Structures	20	17	85	f	2026-03-23 16:17:03.073534+05:30
3	921221104007	Gopal T	2	A	IT2303	Computer Organization	20	14	70	t	2026-03-23 16:17:03.073534+05:30
4	921221104020	Usha K	3	B	IT2504	Software Engineering	20	16	80	f	2026-03-23 16:17:03.073534+05:30
5	921221104006	Fathima N	2	C	IT2303	Computer Organization	20	15	75	f	2026-03-23 16:17:03.073534+05:30
6	921221104011	Karthik L	3	B	IT2501	Database Systems	20	14	70	t	2026-03-23 16:17:03.073534+05:30
7	921221104016	Prabu T	3	A	IT2501	Database Systems	20	17	85	f	2026-03-23 16:17:03.073534+05:30
8	921221104014	Nithya R	3	B	IT2502	Computer Networks	20	16	80	f	2026-03-23 16:17:03.073534+05:30
9	921221104016	Prabu T	3	A	IT2502	Computer Networks	20	17	85	f	2026-03-23 16:17:03.073534+05:30
10	921221104005	Eswaran K	2	B	MA2301	Discrete Mathematics	20	17	85	f	2026-03-23 16:17:03.073534+05:30
11	921221104007	Gopal T	2	A	IT2302	Digital Principles	20	12	60	t	2026-03-23 16:17:03.073534+05:30
12	921221104002	Bharathi S	2	B	IT2304	OOP with Java	20	17	85	f	2026-03-23 16:17:03.073534+05:30
13	921221104019	Tamilarasi P	3	A	IT2502	Computer Networks	20	16	80	f	2026-03-23 16:17:03.073534+05:30
14	921221104019	Tamilarasi P	3	A	IT2504	Software Engineering	20	14	70	t	2026-03-23 16:17:03.073534+05:30
15	921221104002	Bharathi S	2	B	IT2302	Digital Principles	20	14	70	t	2026-03-23 16:17:03.073534+05:30
16	921221104011	Karthik L	3	B	IT2504	Software Engineering	20	16	80	f	2026-03-23 16:17:03.073534+05:30
17	921221104018	Selvam J	3	C	IT2505	Web Technology	20	19	95	f	2026-03-23 16:17:03.073534+05:30
18	921221104017	Ragavi S	3	B	IT2505	Web Technology	20	16	80	f	2026-03-23 16:17:03.073534+05:30
19	921221104003	Chandru M	2	C	MA2301	Discrete Mathematics	20	15	75	f	2026-03-23 16:17:03.073534+05:30
20	921221104020	Usha K	3	B	IT2502	Computer Networks	20	15	75	f	2026-03-23 16:17:03.073534+05:30
21	921221104004	Deepika V	2	A	IT2303	Computer Organization	20	15	75	f	2026-03-23 16:17:03.073534+05:30
22	921221104018	Selvam J	3	C	IT2502	Computer Networks	20	14	70	t	2026-03-23 16:17:03.073534+05:30
23	921221104002	Bharathi S	2	B	MA2301	Discrete Mathematics	20	15	75	f	2026-03-23 16:17:03.073534+05:30
24	921221104005	Eswaran K	2	B	IT2301	Data Structures	20	15	75	f	2026-03-23 16:17:03.073534+05:30
25	921221104010	Jayakumar B	2	A	IT2304	OOP with Java	20	15	75	f	2026-03-23 16:17:03.073534+05:30
26	921221104004	Deepika V	2	A	IT2302	Digital Principles	20	18	90	f	2026-03-23 16:17:03.073534+05:30
27	921221104008	Harini P	2	B	MA2301	Discrete Mathematics	20	16	80	f	2026-03-23 16:17:03.073534+05:30
28	921221104019	Tamilarasi P	3	A	IT2503	Operating Systems	20	15	75	f	2026-03-23 16:17:03.073534+05:30
29	921221104011	Karthik L	3	B	IT2505	Web Technology	20	15	75	f	2026-03-23 16:17:03.073534+05:30
30	921221104016	Prabu T	3	A	IT2505	Web Technology	20	14	70	t	2026-03-23 16:17:03.073534+05:30
31	921221104012	Lavanya M	3	C	IT2501	Database Systems	20	18	90	f	2026-03-23 16:17:03.073534+05:30
32	921221104017	Ragavi S	3	B	IT2502	Computer Networks	20	17	85	f	2026-03-23 16:17:03.073534+05:30
33	921221104013	Manikandan S	3	A	IT2501	Database Systems	20	16	80	f	2026-03-23 16:17:03.073534+05:30
34	921221104008	Harini P	2	B	IT2304	OOP with Java	20	20	100	f	2026-03-23 16:17:03.073534+05:30
35	921221104011	Karthik L	3	B	IT2503	Operating Systems	20	17	85	f	2026-03-23 16:17:03.073534+05:30
36	921221104007	Gopal T	2	A	IT2301	Data Structures	20	18	90	f	2026-03-23 16:17:03.073534+05:30
37	921221104002	Bharathi S	2	B	IT2301	Data Structures	20	16	80	f	2026-03-23 16:17:03.073534+05:30
38	921221104012	Lavanya M	3	C	IT2502	Computer Networks	20	15	75	f	2026-03-23 16:17:03.073534+05:30
39	921221104006	Fathima N	2	C	IT2302	Digital Principles	20	14	70	t	2026-03-23 16:17:03.073534+05:30
40	921221104003	Chandru M	2	C	IT2304	OOP with Java	20	16	80	f	2026-03-23 16:17:03.073534+05:30
41	921221104016	Prabu T	3	A	IT2504	Software Engineering	20	17	85	f	2026-03-23 16:17:03.073534+05:30
42	921221104003	Chandru M	2	C	IT2303	Computer Organization	20	18	90	f	2026-03-23 16:17:03.073534+05:30
43	921221104019	Tamilarasi P	3	A	IT2505	Web Technology	20	17	85	f	2026-03-23 16:17:03.073534+05:30
44	921221104006	Fathima N	2	C	IT2304	OOP with Java	20	16	80	f	2026-03-23 16:17:03.073534+05:30
45	921221104004	Deepika V	2	A	IT2304	OOP with Java	20	18	90	f	2026-03-23 16:17:03.073534+05:30
46	921221104018	Selvam J	3	C	IT2504	Software Engineering	20	18	90	f	2026-03-23 16:17:03.073534+05:30
47	921221104017	Ragavi S	3	B	IT2501	Database Systems	20	17	85	f	2026-03-23 16:17:03.073534+05:30
48	921221104013	Manikandan S	3	A	IT2502	Computer Networks	20	17	85	f	2026-03-23 16:17:03.073534+05:30
49	921221104004	Deepika V	2	A	IT2301	Data Structures	20	16	80	f	2026-03-23 16:17:03.073534+05:30
50	921221104017	Ragavi S	3	B	IT2504	Software Engineering	20	17	85	f	2026-03-23 16:17:03.073534+05:30
51	921221104008	Harini P	2	B	IT2303	Computer Organization	20	19	95	f	2026-03-23 16:17:03.073534+05:30
52	921221104010	Jayakumar B	2	A	IT2302	Digital Principles	20	17	85	f	2026-03-23 16:17:03.073534+05:30
53	921221104009	Indira C	2	C	IT2302	Digital Principles	20	18	90	f	2026-03-23 16:17:03.073534+05:30
54	921221104009	Indira C	2	C	MA2301	Discrete Mathematics	20	15	75	f	2026-03-23 16:17:03.073534+05:30
55	921221104015	Oviya K	3	C	IT2504	Software Engineering	20	18	90	f	2026-03-23 16:17:03.073534+05:30
56	921221104006	Fathima N	2	C	MA2301	Discrete Mathematics	20	19	95	f	2026-03-23 16:17:03.073534+05:30
57	921221104008	Harini P	2	B	IT2301	Data Structures	20	15	75	f	2026-03-23 16:17:03.073534+05:30
58	921221104001	Aakash R	2	A	IT2301	Data Structures	20	14	70	t	2026-03-23 16:17:03.073534+05:30
59	921221104010	Jayakumar B	2	A	IT2303	Computer Organization	20	17	85	f	2026-03-23 16:17:03.073534+05:30
60	921221104002	Bharathi S	2	B	IT2303	Computer Organization	20	19	95	f	2026-03-23 16:17:03.073534+05:30
61	921221104008	Harini P	2	B	IT2302	Digital Principles	20	16	80	f	2026-03-23 16:17:03.073534+05:30
62	921221104019	Tamilarasi P	3	A	IT2501	Database Systems	20	15	75	f	2026-03-23 16:17:03.073534+05:30
63	921221104016	Prabu T	3	A	IT2503	Operating Systems	20	16	80	f	2026-03-23 16:17:03.073534+05:30
64	921221104005	Eswaran K	2	B	IT2303	Computer Organization	20	20	100	f	2026-03-23 16:17:03.073534+05:30
65	921221104014	Nithya R	3	B	IT2501	Database Systems	20	16	80	f	2026-03-23 16:17:03.073534+05:30
66	921221104020	Usha K	3	B	IT2501	Database Systems	20	14	70	t	2026-03-23 16:17:03.073534+05:30
67	921221104014	Nithya R	3	B	IT2503	Operating Systems	20	19	95	f	2026-03-23 16:17:03.073534+05:30
68	921221104001	Aakash R	2	A	IT2302	Digital Principles	20	17	85	f	2026-03-23 16:17:03.073534+05:30
69	921221104010	Jayakumar B	2	A	IT2301	Data Structures	20	19	95	f	2026-03-23 16:17:03.073534+05:30
70	921221104013	Manikandan S	3	A	IT2504	Software Engineering	20	15	75	f	2026-03-23 16:17:03.073534+05:30
71	921221104003	Chandru M	2	C	IT2302	Digital Principles	20	15	75	f	2026-03-23 16:17:03.073534+05:30
72	921221104020	Usha K	3	B	IT2505	Web Technology	20	16	80	f	2026-03-23 16:17:03.073534+05:30
73	921221104015	Oviya K	3	C	IT2501	Database Systems	20	14	70	t	2026-03-23 16:17:03.073534+05:30
74	921221104007	Gopal T	2	A	MA2301	Discrete Mathematics	20	19	95	f	2026-03-23 16:17:03.073534+05:30
75	921221104014	Nithya R	3	B	IT2505	Web Technology	20	15	75	f	2026-03-23 16:17:03.073534+05:30
76	921221104011	Karthik L	3	B	IT2502	Computer Networks	20	11	55	t	2026-03-23 16:17:03.073534+05:30
77	921221104001	Aakash R	2	A	IT2304	OOP with Java	20	16	80	f	2026-03-23 16:17:03.073534+05:30
78	921221104012	Lavanya M	3	C	IT2505	Web Technology	20	14	70	t	2026-03-23 16:17:03.073534+05:30
79	921221104012	Lavanya M	3	C	IT2503	Operating Systems	20	16	80	f	2026-03-23 16:17:03.073534+05:30
80	921221104001	Aakash R	2	A	MA2301	Discrete Mathematics	20	19	95	f	2026-03-23 16:17:03.073534+05:30
81	921221104015	Oviya K	3	C	IT2502	Computer Networks	20	18	90	f	2026-03-23 16:17:03.073534+05:30
82	921221104013	Manikandan S	3	A	IT2505	Web Technology	20	17	85	f	2026-03-23 16:17:03.073534+05:30
83	921221104020	Usha K	3	B	IT2503	Operating Systems	20	19	95	f	2026-03-23 16:17:03.073534+05:30
84	921221104004	Deepika V	2	A	MA2301	Discrete Mathematics	20	18	90	f	2026-03-23 16:17:03.073534+05:30
85	921221104014	Nithya R	3	B	IT2504	Software Engineering	20	15	75	f	2026-03-23 16:17:03.073534+05:30
86	921221104005	Eswaran K	2	B	IT2304	OOP with Java	20	16	80	f	2026-03-23 16:17:03.073534+05:30
87	921221104017	Ragavi S	3	B	IT2503	Operating Systems	20	17	85	f	2026-03-23 16:17:03.073534+05:30
88	921221104012	Lavanya M	3	C	IT2504	Software Engineering	20	15	75	f	2026-03-23 16:17:03.073534+05:30
89	921221104013	Manikandan S	3	A	IT2503	Operating Systems	20	17	85	f	2026-03-23 16:17:03.073534+05:30
90	921221104003	Chandru M	2	C	IT2301	Data Structures	20	17	85	f	2026-03-23 16:17:03.073534+05:30
91	921221104015	Oviya K	3	C	IT2505	Web Technology	20	17	85	f	2026-03-23 16:17:03.073534+05:30
92	921221104009	Indira C	2	C	IT2303	Computer Organization	20	17	85	f	2026-03-23 16:17:03.073534+05:30
93	921221104009	Indira C	2	C	IT2304	OOP with Java	20	17	85	f	2026-03-23 16:17:03.073534+05:30
94	921221104006	Fathima N	2	C	IT2301	Data Structures	20	14	70	t	2026-03-23 16:17:03.073534+05:30
95	921221104005	Eswaran K	2	B	IT2302	Digital Principles	20	15	75	f	2026-03-23 16:17:03.073534+05:30
96	921221104007	Gopal T	2	A	IT2304	OOP with Java	20	16	80	f	2026-03-23 16:17:03.073534+05:30
97	921221104015	Oviya K	3	C	IT2503	Operating Systems	20	14	70	t	2026-03-23 16:17:03.073534+05:30
98	921221104018	Selvam J	3	C	IT2501	Database Systems	20	19	95	f	2026-03-23 16:17:03.073534+05:30
99	921221104001	Aakash R	2	A	IT2303	Computer Organization	20	15	75	f	2026-03-23 16:17:03.073534+05:30
100	921221104010	Jayakumar B	2	A	MA2301	Discrete Mathematics	20	16	80	f	2026-03-23 16:17:03.073534+05:30
\.


--
-- Data for Name: goals; Type: TABLE DATA; Schema: public; Owner: vsb_user
--

COPY public.goals (id, metric, label, target, current, unit, deadline, status, auto_tracked, rule, created_at, updated_at) FROM stdin;
4	placement_rate	Placement Rate	85	78.3	%	Dec 2025	in-progress	f	Manual: updated from placement upload	2026-03-23 16:11:11.951301+05:30	2026-03-23 16:11:11.951301+05:30
8	highest_package	Highest Package	20	18	LPA	Dec 2025	in-progress	f	Manual: updated from placement upload	2026-03-23 16:11:11.951301+05:30	2026-03-23 16:11:11.951301+05:30
1	attendance_overall	Overall Attendance	85	0	%	May 2025	at-risk	t	Auto: avg attendance_pct from attendance_summary	2026-03-23 16:11:11.951301+05:30	2026-03-23 16:11:12.033844+05:30
2	pass_pct	Overall Pass %	90	0	%	May 2025	at-risk	t	Auto: passed/total from results	2026-03-23 16:11:11.951301+05:30	2026-03-23 16:11:12.033844+05:30
3	avg_cgpa	Average CGPA	7.8	0		May 2025	at-risk	t	Auto: avg total_marks/10 from results	2026-03-23 16:11:11.951301+05:30	2026-03-23 16:11:12.033844+05:30
5	arrear_sections	Zero-Arrear Sections	6	0		May 2025	at-risk	t	Auto: sections with arrears=0	2026-03-23 16:11:11.951301+05:30	2026-03-23 16:11:12.033844+05:30
6	avg_internal	Avg Internal Score	75	0	%	Apr 2025	at-risk	t	Auto: avg from internal_tests	2026-03-23 16:11:11.951301+05:30	2026-03-23 16:11:12.033844+05:30
7	sections_above_80att	Sections Above 80% Att	8	0		Mar 2025	at-risk	t	Auto: sections with avg_attendance>80	2026-03-23 16:11:11.951301+05:30	2026-03-23 16:11:12.033844+05:30
\.


--
-- Data for Name: internal_tests; Type: TABLE DATA; Schema: public; Owner: vsb_user
--

COPY public.internal_tests (id, student_id, student_name, year, section, subject_code, subject_name, test_number, max_marks, marks_scored, uploaded_at) FROM stdin;
1	921221104001	Aakash R	2	A	IT2301	Data Structures	1	50	28	2026-03-23 16:22:44.762498+05:30
2	921221104001	Aakash R	2	A	IT2301	Data Structures	2	50	42	2026-03-23 16:22:44.762498+05:30
3	921221104001	Aakash R	2	A	IT2301	Data Structures	3	50	28	2026-03-23 16:22:44.762498+05:30
4	921221104001	Aakash R	2	A	IT2302	Digital Principles	1	50	26	2026-03-23 16:22:44.762498+05:30
5	921221104001	Aakash R	2	A	IT2302	Digital Principles	2	50	35	2026-03-23 16:22:44.762498+05:30
6	921221104001	Aakash R	2	A	IT2302	Digital Principles	3	50	37	2026-03-23 16:22:44.762498+05:30
7	921221104001	Aakash R	2	A	IT2303	Computer Organization	1	50	35	2026-03-23 16:22:44.762498+05:30
8	921221104001	Aakash R	2	A	IT2303	Computer Organization	2	50	49	2026-03-23 16:22:44.762498+05:30
9	921221104001	Aakash R	2	A	IT2303	Computer Organization	3	50	27	2026-03-23 16:22:44.762498+05:30
10	921221104001	Aakash R	2	A	MA2301	Discrete Mathematics	1	50	22	2026-03-23 16:22:44.762498+05:30
11	921221104001	Aakash R	2	A	MA2301	Discrete Mathematics	2	50	28	2026-03-23 16:22:44.762498+05:30
12	921221104001	Aakash R	2	A	MA2301	Discrete Mathematics	3	50	45	2026-03-23 16:22:44.762498+05:30
13	921221104001	Aakash R	2	A	IT2304	OOP with Java	1	50	35	2026-03-23 16:22:44.762498+05:30
14	921221104001	Aakash R	2	A	IT2304	OOP with Java	2	50	44	2026-03-23 16:22:44.762498+05:30
15	921221104001	Aakash R	2	A	IT2304	OOP with Java	3	50	37	2026-03-23 16:22:44.762498+05:30
16	921221104002	Bharathi S	2	B	IT2301	Data Structures	1	50	48	2026-03-23 16:22:44.762498+05:30
17	921221104002	Bharathi S	2	B	IT2301	Data Structures	2	50	22	2026-03-23 16:22:44.762498+05:30
18	921221104002	Bharathi S	2	B	IT2301	Data Structures	3	50	41	2026-03-23 16:22:44.762498+05:30
19	921221104002	Bharathi S	2	B	IT2302	Digital Principles	1	50	34	2026-03-23 16:22:44.762498+05:30
20	921221104002	Bharathi S	2	B	IT2302	Digital Principles	2	50	33	2026-03-23 16:22:44.762498+05:30
21	921221104002	Bharathi S	2	B	IT2302	Digital Principles	3	50	49	2026-03-23 16:22:44.762498+05:30
22	921221104002	Bharathi S	2	B	IT2303	Computer Organization	1	50	30	2026-03-23 16:22:44.762498+05:30
23	921221104002	Bharathi S	2	B	IT2303	Computer Organization	2	50	47	2026-03-23 16:22:44.762498+05:30
24	921221104002	Bharathi S	2	B	IT2303	Computer Organization	3	50	24	2026-03-23 16:22:44.762498+05:30
25	921221104002	Bharathi S	2	B	MA2301	Discrete Mathematics	1	50	26	2026-03-23 16:22:44.762498+05:30
26	921221104002	Bharathi S	2	B	MA2301	Discrete Mathematics	2	50	37	2026-03-23 16:22:44.762498+05:30
27	921221104002	Bharathi S	2	B	MA2301	Discrete Mathematics	3	50	18	2026-03-23 16:22:44.762498+05:30
28	921221104002	Bharathi S	2	B	IT2304	OOP with Java	1	50	43	2026-03-23 16:22:44.762498+05:30
29	921221104002	Bharathi S	2	B	IT2304	OOP with Java	2	50	39	2026-03-23 16:22:44.762498+05:30
30	921221104002	Bharathi S	2	B	IT2304	OOP with Java	3	50	42	2026-03-23 16:22:44.762498+05:30
31	921221104003	Chandru M	2	C	IT2301	Data Structures	1	50	39	2026-03-23 16:22:44.762498+05:30
32	921221104003	Chandru M	2	C	IT2301	Data Structures	2	50	46	2026-03-23 16:22:44.762498+05:30
33	921221104003	Chandru M	2	C	IT2301	Data Structures	3	50	39	2026-03-23 16:22:44.762498+05:30
34	921221104003	Chandru M	2	C	IT2302	Digital Principles	1	50	45	2026-03-23 16:22:44.762498+05:30
35	921221104003	Chandru M	2	C	IT2302	Digital Principles	2	50	26	2026-03-23 16:22:44.762498+05:30
36	921221104003	Chandru M	2	C	IT2302	Digital Principles	3	50	37	2026-03-23 16:22:44.762498+05:30
37	921221104003	Chandru M	2	C	IT2303	Computer Organization	1	50	38	2026-03-23 16:22:44.762498+05:30
38	921221104003	Chandru M	2	C	IT2303	Computer Organization	2	50	30	2026-03-23 16:22:44.762498+05:30
39	921221104003	Chandru M	2	C	IT2303	Computer Organization	3	50	48	2026-03-23 16:22:44.762498+05:30
40	921221104003	Chandru M	2	C	MA2301	Discrete Mathematics	1	50	38	2026-03-23 16:22:44.762498+05:30
41	921221104003	Chandru M	2	C	MA2301	Discrete Mathematics	2	50	29	2026-03-23 16:22:44.762498+05:30
42	921221104003	Chandru M	2	C	MA2301	Discrete Mathematics	3	50	43	2026-03-23 16:22:44.762498+05:30
43	921221104003	Chandru M	2	C	IT2304	OOP with Java	1	50	38	2026-03-23 16:22:44.762498+05:30
44	921221104003	Chandru M	2	C	IT2304	OOP with Java	2	50	36	2026-03-23 16:22:44.762498+05:30
45	921221104003	Chandru M	2	C	IT2304	OOP with Java	3	50	49	2026-03-23 16:22:44.762498+05:30
46	921221104004	Deepika V	2	A	IT2301	Data Structures	1	50	33	2026-03-23 16:22:44.762498+05:30
47	921221104004	Deepika V	2	A	IT2301	Data Structures	2	50	38	2026-03-23 16:22:44.762498+05:30
48	921221104004	Deepika V	2	A	IT2301	Data Structures	3	50	42	2026-03-23 16:22:44.762498+05:30
49	921221104004	Deepika V	2	A	IT2302	Digital Principles	1	50	35	2026-03-23 16:22:44.762498+05:30
50	921221104004	Deepika V	2	A	IT2302	Digital Principles	2	50	43	2026-03-23 16:22:44.762498+05:30
51	921221104004	Deepika V	2	A	IT2302	Digital Principles	3	50	41	2026-03-23 16:22:44.762498+05:30
52	921221104004	Deepika V	2	A	IT2303	Computer Organization	1	50	25	2026-03-23 16:22:44.762498+05:30
53	921221104004	Deepika V	2	A	IT2303	Computer Organization	2	50	30	2026-03-23 16:22:44.762498+05:30
54	921221104004	Deepika V	2	A	IT2303	Computer Organization	3	50	29	2026-03-23 16:22:44.762498+05:30
55	921221104004	Deepika V	2	A	MA2301	Discrete Mathematics	1	50	19	2026-03-23 16:22:44.762498+05:30
56	921221104004	Deepika V	2	A	MA2301	Discrete Mathematics	2	50	47	2026-03-23 16:22:44.762498+05:30
57	921221104004	Deepika V	2	A	MA2301	Discrete Mathematics	3	50	31	2026-03-23 16:22:44.762498+05:30
58	921221104004	Deepika V	2	A	IT2304	OOP with Java	1	50	46	2026-03-23 16:22:44.762498+05:30
59	921221104004	Deepika V	2	A	IT2304	OOP with Java	2	50	36	2026-03-23 16:22:44.762498+05:30
60	921221104004	Deepika V	2	A	IT2304	OOP with Java	3	50	22	2026-03-23 16:22:44.762498+05:30
61	921221104005	Eswaran K	2	B	IT2301	Data Structures	1	50	44	2026-03-23 16:22:44.762498+05:30
62	921221104005	Eswaran K	2	B	IT2301	Data Structures	2	50	49	2026-03-23 16:22:44.762498+05:30
63	921221104005	Eswaran K	2	B	IT2301	Data Structures	3	50	26	2026-03-23 16:22:44.762498+05:30
64	921221104005	Eswaran K	2	B	IT2302	Digital Principles	1	50	37	2026-03-23 16:22:44.762498+05:30
65	921221104005	Eswaran K	2	B	IT2302	Digital Principles	2	50	33	2026-03-23 16:22:44.762498+05:30
66	921221104005	Eswaran K	2	B	IT2302	Digital Principles	3	50	34	2026-03-23 16:22:44.762498+05:30
67	921221104005	Eswaran K	2	B	IT2303	Computer Organization	1	50	27	2026-03-23 16:22:44.762498+05:30
68	921221104005	Eswaran K	2	B	IT2303	Computer Organization	2	50	45	2026-03-23 16:22:44.762498+05:30
69	921221104005	Eswaran K	2	B	IT2303	Computer Organization	3	50	42	2026-03-23 16:22:44.762498+05:30
70	921221104005	Eswaran K	2	B	MA2301	Discrete Mathematics	1	50	22	2026-03-23 16:22:44.762498+05:30
71	921221104005	Eswaran K	2	B	MA2301	Discrete Mathematics	2	50	46	2026-03-23 16:22:44.762498+05:30
72	921221104005	Eswaran K	2	B	MA2301	Discrete Mathematics	3	50	48	2026-03-23 16:22:44.762498+05:30
73	921221104005	Eswaran K	2	B	IT2304	OOP with Java	1	50	43	2026-03-23 16:22:44.762498+05:30
74	921221104005	Eswaran K	2	B	IT2304	OOP with Java	2	50	50	2026-03-23 16:22:44.762498+05:30
75	921221104005	Eswaran K	2	B	IT2304	OOP with Java	3	50	44	2026-03-23 16:22:44.762498+05:30
76	921221104006	Fathima N	2	C	IT2301	Data Structures	1	50	20	2026-03-23 16:22:44.762498+05:30
77	921221104006	Fathima N	2	C	IT2301	Data Structures	2	50	41	2026-03-23 16:22:44.762498+05:30
78	921221104006	Fathima N	2	C	IT2301	Data Structures	3	50	23	2026-03-23 16:22:44.762498+05:30
79	921221104006	Fathima N	2	C	IT2302	Digital Principles	1	50	24	2026-03-23 16:22:44.762498+05:30
80	921221104006	Fathima N	2	C	IT2302	Digital Principles	2	50	33	2026-03-23 16:22:44.762498+05:30
81	921221104006	Fathima N	2	C	IT2302	Digital Principles	3	50	40	2026-03-23 16:22:44.762498+05:30
82	921221104006	Fathima N	2	C	IT2303	Computer Organization	1	50	28	2026-03-23 16:22:44.762498+05:30
83	921221104006	Fathima N	2	C	IT2303	Computer Organization	2	50	20	2026-03-23 16:22:44.762498+05:30
84	921221104006	Fathima N	2	C	IT2303	Computer Organization	3	50	43	2026-03-23 16:22:44.762498+05:30
85	921221104006	Fathima N	2	C	MA2301	Discrete Mathematics	1	50	39	2026-03-23 16:22:44.762498+05:30
86	921221104006	Fathima N	2	C	MA2301	Discrete Mathematics	2	50	45	2026-03-23 16:22:44.762498+05:30
87	921221104006	Fathima N	2	C	MA2301	Discrete Mathematics	3	50	24	2026-03-23 16:22:44.762498+05:30
88	921221104006	Fathima N	2	C	IT2304	OOP with Java	1	50	18	2026-03-23 16:22:44.762498+05:30
89	921221104006	Fathima N	2	C	IT2304	OOP with Java	2	50	24	2026-03-23 16:22:44.762498+05:30
90	921221104006	Fathima N	2	C	IT2304	OOP with Java	3	50	34	2026-03-23 16:22:44.762498+05:30
91	921221104007	Gopal T	2	A	IT2301	Data Structures	1	50	32	2026-03-23 16:22:44.762498+05:30
92	921221104007	Gopal T	2	A	IT2301	Data Structures	2	50	50	2026-03-23 16:22:44.762498+05:30
93	921221104007	Gopal T	2	A	IT2301	Data Structures	3	50	32	2026-03-23 16:22:44.762498+05:30
94	921221104007	Gopal T	2	A	IT2302	Digital Principles	1	50	46	2026-03-23 16:22:44.762498+05:30
95	921221104007	Gopal T	2	A	IT2302	Digital Principles	2	50	41	2026-03-23 16:22:44.762498+05:30
96	921221104007	Gopal T	2	A	IT2302	Digital Principles	3	50	43	2026-03-23 16:22:44.762498+05:30
97	921221104007	Gopal T	2	A	IT2303	Computer Organization	1	50	47	2026-03-23 16:22:44.762498+05:30
98	921221104007	Gopal T	2	A	IT2303	Computer Organization	2	50	50	2026-03-23 16:22:44.762498+05:30
99	921221104007	Gopal T	2	A	IT2303	Computer Organization	3	50	27	2026-03-23 16:22:44.762498+05:30
100	921221104007	Gopal T	2	A	MA2301	Discrete Mathematics	1	50	40	2026-03-23 16:22:44.762498+05:30
101	921221104007	Gopal T	2	A	MA2301	Discrete Mathematics	2	50	19	2026-03-23 16:22:44.762498+05:30
102	921221104007	Gopal T	2	A	MA2301	Discrete Mathematics	3	50	48	2026-03-23 16:22:44.762498+05:30
103	921221104007	Gopal T	2	A	IT2304	OOP with Java	1	50	24	2026-03-23 16:22:44.762498+05:30
104	921221104007	Gopal T	2	A	IT2304	OOP with Java	2	50	36	2026-03-23 16:22:44.762498+05:30
105	921221104007	Gopal T	2	A	IT2304	OOP with Java	3	50	44	2026-03-23 16:22:44.762498+05:30
106	921221104008	Harini P	2	B	IT2301	Data Structures	1	50	23	2026-03-23 16:22:44.762498+05:30
107	921221104008	Harini P	2	B	IT2301	Data Structures	2	50	25	2026-03-23 16:22:44.762498+05:30
108	921221104008	Harini P	2	B	IT2301	Data Structures	3	50	27	2026-03-23 16:22:44.762498+05:30
109	921221104008	Harini P	2	B	IT2302	Digital Principles	1	50	40	2026-03-23 16:22:44.762498+05:30
110	921221104008	Harini P	2	B	IT2302	Digital Principles	2	50	37	2026-03-23 16:22:44.762498+05:30
111	921221104008	Harini P	2	B	IT2302	Digital Principles	3	50	39	2026-03-23 16:22:44.762498+05:30
112	921221104008	Harini P	2	B	IT2303	Computer Organization	1	50	47	2026-03-23 16:22:44.762498+05:30
113	921221104008	Harini P	2	B	IT2303	Computer Organization	2	50	31	2026-03-23 16:22:44.762498+05:30
114	921221104008	Harini P	2	B	IT2303	Computer Organization	3	50	48	2026-03-23 16:22:44.762498+05:30
115	921221104008	Harini P	2	B	MA2301	Discrete Mathematics	1	50	40	2026-03-23 16:22:44.762498+05:30
116	921221104008	Harini P	2	B	MA2301	Discrete Mathematics	2	50	48	2026-03-23 16:22:44.762498+05:30
117	921221104008	Harini P	2	B	MA2301	Discrete Mathematics	3	50	24	2026-03-23 16:22:44.762498+05:30
118	921221104008	Harini P	2	B	IT2304	OOP with Java	1	50	46	2026-03-23 16:22:44.762498+05:30
119	921221104008	Harini P	2	B	IT2304	OOP with Java	2	50	46	2026-03-23 16:22:44.762498+05:30
120	921221104008	Harini P	2	B	IT2304	OOP with Java	3	50	38	2026-03-23 16:22:44.762498+05:30
121	921221104009	Indira C	2	C	IT2301	Data Structures	1	50	22	2026-03-23 16:22:44.762498+05:30
122	921221104009	Indira C	2	C	IT2301	Data Structures	2	50	37	2026-03-23 16:22:44.762498+05:30
123	921221104009	Indira C	2	C	IT2301	Data Structures	3	50	20	2026-03-23 16:22:44.762498+05:30
124	921221104009	Indira C	2	C	IT2302	Digital Principles	1	50	25	2026-03-23 16:22:44.762498+05:30
125	921221104009	Indira C	2	C	IT2302	Digital Principles	2	50	19	2026-03-23 16:22:44.762498+05:30
126	921221104009	Indira C	2	C	IT2302	Digital Principles	3	50	39	2026-03-23 16:22:44.762498+05:30
127	921221104009	Indira C	2	C	IT2303	Computer Organization	1	50	24	2026-03-23 16:22:44.762498+05:30
128	921221104009	Indira C	2	C	IT2303	Computer Organization	2	50	28	2026-03-23 16:22:44.762498+05:30
129	921221104009	Indira C	2	C	IT2303	Computer Organization	3	50	33	2026-03-23 16:22:44.762498+05:30
130	921221104009	Indira C	2	C	MA2301	Discrete Mathematics	1	50	29	2026-03-23 16:22:44.762498+05:30
131	921221104009	Indira C	2	C	MA2301	Discrete Mathematics	2	50	28	2026-03-23 16:22:44.762498+05:30
132	921221104009	Indira C	2	C	MA2301	Discrete Mathematics	3	50	39	2026-03-23 16:22:44.762498+05:30
133	921221104009	Indira C	2	C	IT2304	OOP with Java	1	50	45	2026-03-23 16:22:44.762498+05:30
134	921221104009	Indira C	2	C	IT2304	OOP with Java	2	50	47	2026-03-23 16:22:44.762498+05:30
135	921221104009	Indira C	2	C	IT2304	OOP with Java	3	50	32	2026-03-23 16:22:44.762498+05:30
136	921221104010	Jayakumar B	2	A	IT2301	Data Structures	1	50	43	2026-03-23 16:22:44.762498+05:30
137	921221104010	Jayakumar B	2	A	IT2301	Data Structures	2	50	29	2026-03-23 16:22:44.762498+05:30
138	921221104010	Jayakumar B	2	A	IT2301	Data Structures	3	50	29	2026-03-23 16:22:44.762498+05:30
139	921221104010	Jayakumar B	2	A	IT2302	Digital Principles	1	50	45	2026-03-23 16:22:44.762498+05:30
140	921221104010	Jayakumar B	2	A	IT2302	Digital Principles	2	50	43	2026-03-23 16:22:44.762498+05:30
141	921221104010	Jayakumar B	2	A	IT2302	Digital Principles	3	50	19	2026-03-23 16:22:44.762498+05:30
142	921221104010	Jayakumar B	2	A	IT2303	Computer Organization	1	50	30	2026-03-23 16:22:44.762498+05:30
143	921221104010	Jayakumar B	2	A	IT2303	Computer Organization	2	50	46	2026-03-23 16:22:44.762498+05:30
144	921221104010	Jayakumar B	2	A	IT2303	Computer Organization	3	50	45	2026-03-23 16:22:44.762498+05:30
145	921221104010	Jayakumar B	2	A	MA2301	Discrete Mathematics	1	50	42	2026-03-23 16:22:44.762498+05:30
146	921221104010	Jayakumar B	2	A	MA2301	Discrete Mathematics	2	50	18	2026-03-23 16:22:44.762498+05:30
147	921221104010	Jayakumar B	2	A	MA2301	Discrete Mathematics	3	50	31	2026-03-23 16:22:44.762498+05:30
148	921221104010	Jayakumar B	2	A	IT2304	OOP with Java	1	50	31	2026-03-23 16:22:44.762498+05:30
149	921221104010	Jayakumar B	2	A	IT2304	OOP with Java	2	50	35	2026-03-23 16:22:44.762498+05:30
150	921221104010	Jayakumar B	2	A	IT2304	OOP with Java	3	50	22	2026-03-23 16:22:44.762498+05:30
151	921221104011	Karthik L	3	B	IT2501	Database Systems	1	50	24	2026-03-23 16:22:44.762498+05:30
152	921221104011	Karthik L	3	B	IT2501	Database Systems	2	50	29	2026-03-23 16:22:44.762498+05:30
153	921221104011	Karthik L	3	B	IT2501	Database Systems	3	50	41	2026-03-23 16:22:44.762498+05:30
154	921221104011	Karthik L	3	B	IT2502	Computer Networks	1	50	38	2026-03-23 16:22:44.762498+05:30
155	921221104011	Karthik L	3	B	IT2502	Computer Networks	2	50	30	2026-03-23 16:22:44.762498+05:30
156	921221104011	Karthik L	3	B	IT2502	Computer Networks	3	50	47	2026-03-23 16:22:44.762498+05:30
157	921221104011	Karthik L	3	B	IT2503	Operating Systems	1	50	25	2026-03-23 16:22:44.762498+05:30
158	921221104011	Karthik L	3	B	IT2503	Operating Systems	2	50	34	2026-03-23 16:22:44.762498+05:30
159	921221104011	Karthik L	3	B	IT2503	Operating Systems	3	50	49	2026-03-23 16:22:44.762498+05:30
160	921221104011	Karthik L	3	B	IT2504	Software Engineering	1	50	38	2026-03-23 16:22:44.762498+05:30
161	921221104011	Karthik L	3	B	IT2504	Software Engineering	2	50	42	2026-03-23 16:22:44.762498+05:30
162	921221104011	Karthik L	3	B	IT2504	Software Engineering	3	50	43	2026-03-23 16:22:44.762498+05:30
163	921221104011	Karthik L	3	B	IT2505	Web Technology	1	50	25	2026-03-23 16:22:44.762498+05:30
164	921221104011	Karthik L	3	B	IT2505	Web Technology	2	50	40	2026-03-23 16:22:44.762498+05:30
165	921221104011	Karthik L	3	B	IT2505	Web Technology	3	50	40	2026-03-23 16:22:44.762498+05:30
166	921221104012	Lavanya M	3	C	IT2501	Database Systems	1	50	47	2026-03-23 16:22:44.762498+05:30
167	921221104012	Lavanya M	3	C	IT2501	Database Systems	2	50	29	2026-03-23 16:22:44.762498+05:30
168	921221104012	Lavanya M	3	C	IT2501	Database Systems	3	50	37	2026-03-23 16:22:44.762498+05:30
169	921221104012	Lavanya M	3	C	IT2502	Computer Networks	1	50	23	2026-03-23 16:22:44.762498+05:30
170	921221104012	Lavanya M	3	C	IT2502	Computer Networks	2	50	26	2026-03-23 16:22:44.762498+05:30
171	921221104012	Lavanya M	3	C	IT2502	Computer Networks	3	50	38	2026-03-23 16:22:44.762498+05:30
172	921221104012	Lavanya M	3	C	IT2503	Operating Systems	1	50	25	2026-03-23 16:22:44.762498+05:30
173	921221104012	Lavanya M	3	C	IT2503	Operating Systems	2	50	33	2026-03-23 16:22:44.762498+05:30
174	921221104012	Lavanya M	3	C	IT2503	Operating Systems	3	50	37	2026-03-23 16:22:44.762498+05:30
175	921221104012	Lavanya M	3	C	IT2504	Software Engineering	1	50	25	2026-03-23 16:22:44.762498+05:30
176	921221104012	Lavanya M	3	C	IT2504	Software Engineering	2	50	29	2026-03-23 16:22:44.762498+05:30
177	921221104012	Lavanya M	3	C	IT2504	Software Engineering	3	50	41	2026-03-23 16:22:44.762498+05:30
178	921221104012	Lavanya M	3	C	IT2505	Web Technology	1	50	27	2026-03-23 16:22:44.762498+05:30
179	921221104012	Lavanya M	3	C	IT2505	Web Technology	2	50	50	2026-03-23 16:22:44.762498+05:30
180	921221104012	Lavanya M	3	C	IT2505	Web Technology	3	50	42	2026-03-23 16:22:44.762498+05:30
181	921221104013	Manikandan S	3	A	IT2501	Database Systems	1	50	44	2026-03-23 16:22:44.762498+05:30
182	921221104013	Manikandan S	3	A	IT2501	Database Systems	2	50	26	2026-03-23 16:22:44.762498+05:30
183	921221104013	Manikandan S	3	A	IT2501	Database Systems	3	50	42	2026-03-23 16:22:44.762498+05:30
184	921221104013	Manikandan S	3	A	IT2502	Computer Networks	1	50	45	2026-03-23 16:22:44.762498+05:30
185	921221104013	Manikandan S	3	A	IT2502	Computer Networks	2	50	29	2026-03-23 16:22:44.762498+05:30
186	921221104013	Manikandan S	3	A	IT2502	Computer Networks	3	50	49	2026-03-23 16:22:44.762498+05:30
187	921221104013	Manikandan S	3	A	IT2503	Operating Systems	1	50	29	2026-03-23 16:22:44.762498+05:30
188	921221104013	Manikandan S	3	A	IT2503	Operating Systems	2	50	28	2026-03-23 16:22:44.762498+05:30
189	921221104013	Manikandan S	3	A	IT2503	Operating Systems	3	50	49	2026-03-23 16:22:44.762498+05:30
190	921221104013	Manikandan S	3	A	IT2504	Software Engineering	1	50	36	2026-03-23 16:22:44.762498+05:30
191	921221104013	Manikandan S	3	A	IT2504	Software Engineering	2	50	26	2026-03-23 16:22:44.762498+05:30
192	921221104013	Manikandan S	3	A	IT2504	Software Engineering	3	50	29	2026-03-23 16:22:44.762498+05:30
193	921221104013	Manikandan S	3	A	IT2505	Web Technology	1	50	38	2026-03-23 16:22:44.762498+05:30
194	921221104013	Manikandan S	3	A	IT2505	Web Technology	2	50	46	2026-03-23 16:22:44.762498+05:30
195	921221104013	Manikandan S	3	A	IT2505	Web Technology	3	50	21	2026-03-23 16:22:44.762498+05:30
196	921221104014	Nithya R	3	B	IT2501	Database Systems	1	50	40	2026-03-23 16:22:44.762498+05:30
197	921221104014	Nithya R	3	B	IT2501	Database Systems	2	50	18	2026-03-23 16:22:44.762498+05:30
198	921221104014	Nithya R	3	B	IT2501	Database Systems	3	50	49	2026-03-23 16:22:44.762498+05:30
199	921221104014	Nithya R	3	B	IT2502	Computer Networks	1	50	26	2026-03-23 16:22:44.762498+05:30
200	921221104014	Nithya R	3	B	IT2502	Computer Networks	2	50	30	2026-03-23 16:22:44.762498+05:30
201	921221104014	Nithya R	3	B	IT2502	Computer Networks	3	50	42	2026-03-23 16:22:44.762498+05:30
202	921221104014	Nithya R	3	B	IT2503	Operating Systems	1	50	50	2026-03-23 16:22:44.762498+05:30
203	921221104014	Nithya R	3	B	IT2503	Operating Systems	2	50	49	2026-03-23 16:22:44.762498+05:30
204	921221104014	Nithya R	3	B	IT2503	Operating Systems	3	50	44	2026-03-23 16:22:44.762498+05:30
205	921221104014	Nithya R	3	B	IT2504	Software Engineering	1	50	49	2026-03-23 16:22:44.762498+05:30
206	921221104014	Nithya R	3	B	IT2504	Software Engineering	2	50	44	2026-03-23 16:22:44.762498+05:30
207	921221104014	Nithya R	3	B	IT2504	Software Engineering	3	50	46	2026-03-23 16:22:44.762498+05:30
208	921221104014	Nithya R	3	B	IT2505	Web Technology	1	50	49	2026-03-23 16:22:44.762498+05:30
209	921221104014	Nithya R	3	B	IT2505	Web Technology	2	50	28	2026-03-23 16:22:44.762498+05:30
210	921221104014	Nithya R	3	B	IT2505	Web Technology	3	50	23	2026-03-23 16:22:44.762498+05:30
211	921221104015	Oviya K	3	C	IT2501	Database Systems	1	50	19	2026-03-23 16:22:44.762498+05:30
212	921221104015	Oviya K	3	C	IT2501	Database Systems	2	50	32	2026-03-23 16:22:44.762498+05:30
213	921221104015	Oviya K	3	C	IT2501	Database Systems	3	50	36	2026-03-23 16:22:44.762498+05:30
214	921221104015	Oviya K	3	C	IT2502	Computer Networks	1	50	20	2026-03-23 16:22:44.762498+05:30
215	921221104015	Oviya K	3	C	IT2502	Computer Networks	2	50	35	2026-03-23 16:22:44.762498+05:30
216	921221104015	Oviya K	3	C	IT2502	Computer Networks	3	50	32	2026-03-23 16:22:44.762498+05:30
217	921221104015	Oviya K	3	C	IT2503	Operating Systems	1	50	36	2026-03-23 16:22:44.762498+05:30
218	921221104015	Oviya K	3	C	IT2503	Operating Systems	2	50	28	2026-03-23 16:22:44.762498+05:30
219	921221104015	Oviya K	3	C	IT2503	Operating Systems	3	50	47	2026-03-23 16:22:44.762498+05:30
220	921221104015	Oviya K	3	C	IT2504	Software Engineering	1	50	49	2026-03-23 16:22:44.762498+05:30
221	921221104015	Oviya K	3	C	IT2504	Software Engineering	2	50	50	2026-03-23 16:22:44.762498+05:30
222	921221104015	Oviya K	3	C	IT2504	Software Engineering	3	50	25	2026-03-23 16:22:44.762498+05:30
223	921221104015	Oviya K	3	C	IT2505	Web Technology	1	50	25	2026-03-23 16:22:44.762498+05:30
224	921221104015	Oviya K	3	C	IT2505	Web Technology	2	50	35	2026-03-23 16:22:44.762498+05:30
225	921221104015	Oviya K	3	C	IT2505	Web Technology	3	50	41	2026-03-23 16:22:44.762498+05:30
226	921221104016	Prabu T	3	A	IT2501	Database Systems	1	50	20	2026-03-23 16:22:44.762498+05:30
227	921221104016	Prabu T	3	A	IT2501	Database Systems	2	50	46	2026-03-23 16:22:44.762498+05:30
228	921221104016	Prabu T	3	A	IT2501	Database Systems	3	50	31	2026-03-23 16:22:44.762498+05:30
229	921221104016	Prabu T	3	A	IT2502	Computer Networks	1	50	45	2026-03-23 16:22:44.762498+05:30
230	921221104016	Prabu T	3	A	IT2502	Computer Networks	2	50	24	2026-03-23 16:22:44.762498+05:30
231	921221104016	Prabu T	3	A	IT2502	Computer Networks	3	50	33	2026-03-23 16:22:44.762498+05:30
232	921221104016	Prabu T	3	A	IT2503	Operating Systems	1	50	37	2026-03-23 16:22:44.762498+05:30
233	921221104016	Prabu T	3	A	IT2503	Operating Systems	2	50	20	2026-03-23 16:22:44.762498+05:30
234	921221104016	Prabu T	3	A	IT2503	Operating Systems	3	50	46	2026-03-23 16:22:44.762498+05:30
235	921221104016	Prabu T	3	A	IT2504	Software Engineering	1	50	34	2026-03-23 16:22:44.762498+05:30
236	921221104016	Prabu T	3	A	IT2504	Software Engineering	2	50	40	2026-03-23 16:22:44.762498+05:30
237	921221104016	Prabu T	3	A	IT2504	Software Engineering	3	50	23	2026-03-23 16:22:44.762498+05:30
238	921221104016	Prabu T	3	A	IT2505	Web Technology	1	50	46	2026-03-23 16:22:44.762498+05:30
239	921221104016	Prabu T	3	A	IT2505	Web Technology	2	50	25	2026-03-23 16:22:44.762498+05:30
240	921221104016	Prabu T	3	A	IT2505	Web Technology	3	50	33	2026-03-23 16:22:44.762498+05:30
241	921221104017	Ragavi S	3	B	IT2501	Database Systems	1	50	31	2026-03-23 16:22:44.762498+05:30
242	921221104017	Ragavi S	3	B	IT2501	Database Systems	2	50	40	2026-03-23 16:22:44.762498+05:30
243	921221104017	Ragavi S	3	B	IT2501	Database Systems	3	50	45	2026-03-23 16:22:44.762498+05:30
244	921221104017	Ragavi S	3	B	IT2502	Computer Networks	1	50	28	2026-03-23 16:22:44.762498+05:30
245	921221104017	Ragavi S	3	B	IT2502	Computer Networks	2	50	26	2026-03-23 16:22:44.762498+05:30
246	921221104017	Ragavi S	3	B	IT2502	Computer Networks	3	50	31	2026-03-23 16:22:44.762498+05:30
247	921221104017	Ragavi S	3	B	IT2503	Operating Systems	1	50	31	2026-03-23 16:22:44.762498+05:30
248	921221104017	Ragavi S	3	B	IT2503	Operating Systems	2	50	21	2026-03-23 16:22:44.762498+05:30
249	921221104017	Ragavi S	3	B	IT2503	Operating Systems	3	50	40	2026-03-23 16:22:44.762498+05:30
250	921221104017	Ragavi S	3	B	IT2504	Software Engineering	1	50	35	2026-03-23 16:22:44.762498+05:30
251	921221104017	Ragavi S	3	B	IT2504	Software Engineering	2	50	28	2026-03-23 16:22:44.762498+05:30
252	921221104017	Ragavi S	3	B	IT2504	Software Engineering	3	50	38	2026-03-23 16:22:44.762498+05:30
253	921221104017	Ragavi S	3	B	IT2505	Web Technology	1	50	36	2026-03-23 16:22:44.762498+05:30
254	921221104017	Ragavi S	3	B	IT2505	Web Technology	2	50	36	2026-03-23 16:22:44.762498+05:30
255	921221104017	Ragavi S	3	B	IT2505	Web Technology	3	50	35	2026-03-23 16:22:44.762498+05:30
256	921221104018	Selvam J	3	C	IT2501	Database Systems	1	50	50	2026-03-23 16:22:44.762498+05:30
257	921221104018	Selvam J	3	C	IT2501	Database Systems	2	50	24	2026-03-23 16:22:44.762498+05:30
258	921221104018	Selvam J	3	C	IT2501	Database Systems	3	50	26	2026-03-23 16:22:44.762498+05:30
259	921221104018	Selvam J	3	C	IT2502	Computer Networks	1	50	44	2026-03-23 16:22:44.762498+05:30
260	921221104018	Selvam J	3	C	IT2502	Computer Networks	2	50	21	2026-03-23 16:22:44.762498+05:30
261	921221104018	Selvam J	3	C	IT2502	Computer Networks	3	50	35	2026-03-23 16:22:44.762498+05:30
262	921221104018	Selvam J	3	C	IT2503	Operating Systems	1	50	26	2026-03-23 16:22:44.762498+05:30
263	921221104018	Selvam J	3	C	IT2503	Operating Systems	2	50	26	2026-03-23 16:22:44.762498+05:30
264	921221104018	Selvam J	3	C	IT2503	Operating Systems	3	50	33	2026-03-23 16:22:44.762498+05:30
265	921221104018	Selvam J	3	C	IT2504	Software Engineering	1	50	27	2026-03-23 16:22:44.762498+05:30
266	921221104018	Selvam J	3	C	IT2504	Software Engineering	2	50	38	2026-03-23 16:22:44.762498+05:30
267	921221104018	Selvam J	3	C	IT2504	Software Engineering	3	50	33	2026-03-23 16:22:44.762498+05:30
268	921221104018	Selvam J	3	C	IT2505	Web Technology	1	50	43	2026-03-23 16:22:44.762498+05:30
269	921221104018	Selvam J	3	C	IT2505	Web Technology	2	50	49	2026-03-23 16:22:44.762498+05:30
270	921221104018	Selvam J	3	C	IT2505	Web Technology	3	50	27	2026-03-23 16:22:44.762498+05:30
271	921221104019	Tamilarasi P	3	A	IT2501	Database Systems	1	50	35	2026-03-23 16:22:44.762498+05:30
272	921221104019	Tamilarasi P	3	A	IT2501	Database Systems	2	50	44	2026-03-23 16:22:44.762498+05:30
273	921221104019	Tamilarasi P	3	A	IT2501	Database Systems	3	50	42	2026-03-23 16:22:44.762498+05:30
274	921221104019	Tamilarasi P	3	A	IT2502	Computer Networks	1	50	46	2026-03-23 16:22:44.762498+05:30
275	921221104019	Tamilarasi P	3	A	IT2502	Computer Networks	2	50	22	2026-03-23 16:22:44.762498+05:30
276	921221104019	Tamilarasi P	3	A	IT2502	Computer Networks	3	50	23	2026-03-23 16:22:44.762498+05:30
277	921221104019	Tamilarasi P	3	A	IT2503	Operating Systems	1	50	43	2026-03-23 16:22:44.762498+05:30
278	921221104019	Tamilarasi P	3	A	IT2503	Operating Systems	2	50	50	2026-03-23 16:22:44.762498+05:30
279	921221104019	Tamilarasi P	3	A	IT2503	Operating Systems	3	50	35	2026-03-23 16:22:44.762498+05:30
280	921221104019	Tamilarasi P	3	A	IT2504	Software Engineering	1	50	41	2026-03-23 16:22:44.762498+05:30
281	921221104019	Tamilarasi P	3	A	IT2504	Software Engineering	2	50	47	2026-03-23 16:22:44.762498+05:30
282	921221104019	Tamilarasi P	3	A	IT2504	Software Engineering	3	50	49	2026-03-23 16:22:44.762498+05:30
283	921221104019	Tamilarasi P	3	A	IT2505	Web Technology	1	50	38	2026-03-23 16:22:44.762498+05:30
284	921221104019	Tamilarasi P	3	A	IT2505	Web Technology	2	50	18	2026-03-23 16:22:44.762498+05:30
285	921221104019	Tamilarasi P	3	A	IT2505	Web Technology	3	50	23	2026-03-23 16:22:44.762498+05:30
286	921221104020	Usha K	3	B	IT2501	Database Systems	1	50	47	2026-03-23 16:22:44.762498+05:30
287	921221104020	Usha K	3	B	IT2501	Database Systems	2	50	40	2026-03-23 16:22:44.762498+05:30
288	921221104020	Usha K	3	B	IT2501	Database Systems	3	50	22	2026-03-23 16:22:44.762498+05:30
289	921221104020	Usha K	3	B	IT2502	Computer Networks	1	50	43	2026-03-23 16:22:44.762498+05:30
290	921221104020	Usha K	3	B	IT2502	Computer Networks	2	50	31	2026-03-23 16:22:44.762498+05:30
291	921221104020	Usha K	3	B	IT2502	Computer Networks	3	50	45	2026-03-23 16:22:44.762498+05:30
292	921221104020	Usha K	3	B	IT2503	Operating Systems	1	50	31	2026-03-23 16:22:44.762498+05:30
293	921221104020	Usha K	3	B	IT2503	Operating Systems	2	50	49	2026-03-23 16:22:44.762498+05:30
294	921221104020	Usha K	3	B	IT2503	Operating Systems	3	50	35	2026-03-23 16:22:44.762498+05:30
295	921221104020	Usha K	3	B	IT2504	Software Engineering	1	50	38	2026-03-23 16:22:44.762498+05:30
296	921221104020	Usha K	3	B	IT2504	Software Engineering	2	50	36	2026-03-23 16:22:44.762498+05:30
297	921221104020	Usha K	3	B	IT2504	Software Engineering	3	50	39	2026-03-23 16:22:44.762498+05:30
298	921221104020	Usha K	3	B	IT2505	Web Technology	1	50	26	2026-03-23 16:22:44.762498+05:30
299	921221104020	Usha K	3	B	IT2505	Web Technology	2	50	49	2026-03-23 16:22:44.762498+05:30
300	921221104020	Usha K	3	B	IT2505	Web Technology	3	50	39	2026-03-23 16:22:44.762498+05:30
\.


--
-- Data for Name: placement; Type: TABLE DATA; Schema: public; Owner: vsb_user
--

COPY public.placement (id, student_id, student_name, year, section, company, package_lpa, offer_type, batch, upload_batch, uploaded_at) FROM stdin;
1	921221104001	Aakash R	4	A	TCS	3.36	IT	2022-2026	b510bcf9	2026-03-23 16:23:42.478638+05:30
2	921221104002	Bharathi S	4	B	Infosys	3.6	IT	2022-2026	b510bcf9	2026-03-23 16:23:42.478638+05:30
3	921221104003	Chandru M	4	C	Wipro	3.5	IT	2022-2026	b510bcf9	2026-03-23 16:23:42.478638+05:30
4	921221104004	Deepika V	4	A	Cognizant	4	IT	2022-2026	b510bcf9	2026-03-23 16:23:42.478638+05:30
5	921221104005	Eswaran K	4	B	Accenture	4.5	IT	2022-2026	b510bcf9	2026-03-23 16:23:42.478638+05:30
6	921221104006	Fathima N	4	C	HCL	3.8	IT	2022-2026	b510bcf9	2026-03-23 16:23:42.478638+05:30
7	921221104007	Gopal T	4	A	Zoho	6	IT	2022-2026	b510bcf9	2026-03-23 16:23:42.478638+05:30
8	921221104008	Harini P	4	B	Capgemini	3.8	IT	2022-2026	b510bcf9	2026-03-23 16:23:42.478638+05:30
9	921221104009	Indira C	4	C	CTS	4.2	IT	2022-2026	b510bcf9	2026-03-23 16:23:42.478638+05:30
10	921221104010	Jayakumar B	4	A	L&T Infotech	5	IT	2022-2026	b510bcf9	2026-03-23 16:23:42.478638+05:30
11	921221104011	Karthik L	4	B	Mphasis	4.8	IT	2022-2026	b510bcf9	2026-03-23 16:23:42.478638+05:30
12	921221104012	Lavanya M	4	C	Hexaware	3.9	IT	2022-2026	b510bcf9	2026-03-23 16:23:42.478638+05:30
13	921221104013	Manikandan S	4	A	Freshworks	7	IT	2022-2026	b510bcf9	2026-03-23 16:23:42.478638+05:30
14	921221104014	Nithya R	4	B	Paypal	8.5	IT	2022-2026	b510bcf9	2026-03-23 16:23:42.478638+05:30
\.


--
-- Data for Name: results; Type: TABLE DATA; Schema: public; Owner: vsb_user
--

COPY public.results (id, student_id, student_name, year, section, semester, subject_code, subject_name, internal_marks, external_marks, total_marks, grade, is_pass, has_arrear, uploaded_at, upload_batch) FROM stdin;
1	921221104001	Aakash R	2	A	3	IT2301	Data Structures	23	76	99	O	t	f	2026-03-23 16:18:49.335187+05:30	d15dc322
2	921221104001	Aakash R	2	A	3	IT2302	Digital Principles	20	55	75	A	t	f	2026-03-23 16:18:49.335187+05:30	d15dc322
3	921221104001	Aakash R	2	A	3	IT2303	Computer Organization	22	58	80	A	t	f	2026-03-23 16:18:49.335187+05:30	d15dc322
4	921221104001	Aakash R	2	A	3	MA2301	Discrete Mathematics	28	39	67	B+	t	f	2026-03-23 16:18:49.335187+05:30	d15dc322
5	921221104001	Aakash R	2	A	3	IT2304	OOP with Java	30	46	76	A	t	f	2026-03-23 16:18:49.335187+05:30	d15dc322
6	921221104002	Bharathi S	2	B	3	IT2301	Data Structures	25	44	69	B+	t	f	2026-03-23 16:18:49.335187+05:30	d15dc322
7	921221104002	Bharathi S	2	B	3	IT2302	Digital Principles	22	45	67	B+	t	f	2026-03-23 16:18:49.335187+05:30	d15dc322
8	921221104002	Bharathi S	2	B	3	IT2303	Computer Organization	28	55	83	A+	t	f	2026-03-23 16:18:49.335187+05:30	d15dc322
9	921221104002	Bharathi S	2	B	3	MA2301	Discrete Mathematics	24	50	74	A	t	f	2026-03-23 16:18:49.335187+05:30	d15dc322
10	921221104002	Bharathi S	2	B	3	IT2304	OOP with Java	27	25	52	B	t	f	2026-03-23 16:18:49.335187+05:30	d15dc322
11	921221104003	Chandru M	2	C	3	IT2301	Data Structures	26	23	49	C	t	f	2026-03-23 16:18:49.335187+05:30	d15dc322
12	921221104003	Chandru M	2	C	3	IT2302	Digital Principles	28	7	35	U	f	t	2026-03-23 16:18:49.335187+05:30	d15dc322
13	921221104003	Chandru M	2	C	3	IT2303	Computer Organization	24	70	94	O	t	f	2026-03-23 16:18:49.335187+05:30	d15dc322
14	921221104003	Chandru M	2	C	3	MA2301	Discrete Mathematics	27	55	82	A+	t	f	2026-03-23 16:18:49.335187+05:30	d15dc322
15	921221104003	Chandru M	2	C	3	IT2304	OOP with Java	28	23	51	B	t	f	2026-03-23 16:18:49.335187+05:30	d15dc322
16	921221104004	Deepika V	2	A	3	IT2301	Data Structures	20	44	64	B+	t	f	2026-03-23 16:18:49.335187+05:30	d15dc322
17	921221104004	Deepika V	2	A	3	IT2302	Digital Principles	29	61	90	A+	t	f	2026-03-23 16:18:49.335187+05:30	d15dc322
18	921221104004	Deepika V	2	A	3	IT2303	Computer Organization	23	69	92	O	t	f	2026-03-23 16:18:49.335187+05:30	d15dc322
19	921221104004	Deepika V	2	A	3	MA2301	Discrete Mathematics	30	29	59	B	t	f	2026-03-23 16:18:49.335187+05:30	d15dc322
20	921221104004	Deepika V	2	A	3	IT2304	OOP with Java	23	55	78	A	t	f	2026-03-23 16:18:49.335187+05:30	d15dc322
21	921221104005	Eswaran K	2	B	3	IT2301	Data Structures	24	31	55	B	t	f	2026-03-23 16:18:49.335187+05:30	d15dc322
22	921221104005	Eswaran K	2	B	3	IT2302	Digital Principles	0	0	0	U	f	t	2026-03-23 16:18:49.335187+05:30	d15dc322
23	921221104005	Eswaran K	2	B	3	IT2303	Computer Organization	27	18	45	C	t	f	2026-03-23 16:18:49.335187+05:30	d15dc322
24	921221104005	Eswaran K	2	B	3	MA2301	Discrete Mathematics	23	26	49	C	t	f	2026-03-23 16:18:49.335187+05:30	d15dc322
25	921221104005	Eswaran K	2	B	3	IT2304	OOP with Java	28	46	74	A	t	f	2026-03-23 16:18:49.335187+05:30	d15dc322
26	921221104006	Fathima N	2	C	3	IT2301	Data Structures	26	59	85	A+	t	f	2026-03-23 16:18:49.335187+05:30	d15dc322
27	921221104006	Fathima N	2	C	3	IT2302	Digital Principles	24	52	76	A	t	f	2026-03-23 16:18:49.335187+05:30	d15dc322
28	921221104006	Fathima N	2	C	3	IT2303	Computer Organization	27	62	89	A+	t	f	2026-03-23 16:18:49.335187+05:30	d15dc322
29	921221104006	Fathima N	2	C	3	MA2301	Discrete Mathematics	25	53	78	A	t	f	2026-03-23 16:18:49.335187+05:30	d15dc322
30	921221104006	Fathima N	2	C	3	IT2304	OOP with Java	25	22	47	C	t	f	2026-03-23 16:18:49.335187+05:30	d15dc322
31	921221104007	Gopal T	2	A	3	IT2301	Data Structures	23	57	80	A	t	f	2026-03-23 16:18:49.335187+05:30	d15dc322
32	921221104007	Gopal T	2	A	3	IT2302	Digital Principles	24	37	61	B+	t	f	2026-03-23 16:18:49.335187+05:30	d15dc322
33	921221104007	Gopal T	2	A	3	IT2303	Computer Organization	29	51	80	A	t	f	2026-03-23 16:18:49.335187+05:30	d15dc322
34	921221104007	Gopal T	2	A	3	MA2301	Discrete Mathematics	22	43	65	B+	t	f	2026-03-23 16:18:49.335187+05:30	d15dc322
35	921221104007	Gopal T	2	A	3	IT2304	OOP with Java	26	58	84	A+	t	f	2026-03-23 16:18:49.335187+05:30	d15dc322
36	921221104008	Harini P	2	B	3	IT2301	Data Structures	27	47	74	A	t	f	2026-03-23 16:18:49.335187+05:30	d15dc322
37	921221104008	Harini P	2	B	3	IT2302	Digital Principles	24	52	76	A	t	f	2026-03-23 16:18:49.335187+05:30	d15dc322
38	921221104008	Harini P	2	B	3	IT2303	Computer Organization	30	38	68	B+	t	f	2026-03-23 16:18:49.335187+05:30	d15dc322
39	921221104008	Harini P	2	B	3	MA2301	Discrete Mathematics	22	46	68	B+	t	f	2026-03-23 16:18:49.335187+05:30	d15dc322
40	921221104008	Harini P	2	B	3	IT2304	OOP with Java	22	44	66	B+	t	f	2026-03-23 16:18:49.335187+05:30	d15dc322
41	921221104009	Indira C	2	C	3	IT2301	Data Structures	27	72	99	O	t	f	2026-03-23 16:18:49.335187+05:30	d15dc322
42	921221104009	Indira C	2	C	3	IT2302	Digital Principles	30	59	89	A+	t	f	2026-03-23 16:18:49.335187+05:30	d15dc322
43	921221104009	Indira C	2	C	3	IT2303	Computer Organization	20	13	33	U	f	t	2026-03-23 16:18:49.335187+05:30	d15dc322
44	921221104009	Indira C	2	C	3	MA2301	Discrete Mathematics	30	21	51	B	t	f	2026-03-23 16:18:49.335187+05:30	d15dc322
45	921221104009	Indira C	2	C	3	IT2304	OOP with Java	26	65	91	O	t	f	2026-03-23 16:18:49.335187+05:30	d15dc322
46	921221104010	Jayakumar B	2	A	3	IT2301	Data Structures	21	73	94	O	t	f	2026-03-23 16:18:49.335187+05:30	d15dc322
47	921221104010	Jayakumar B	2	A	3	IT2302	Digital Principles	23	38	61	B+	t	f	2026-03-23 16:18:49.335187+05:30	d15dc322
48	921221104010	Jayakumar B	2	A	3	IT2303	Computer Organization	20	56	76	A	t	f	2026-03-23 16:18:49.335187+05:30	d15dc322
49	921221104010	Jayakumar B	2	A	3	MA2301	Discrete Mathematics	27	43	70	B+	t	f	2026-03-23 16:18:49.335187+05:30	d15dc322
50	921221104010	Jayakumar B	2	A	3	IT2304	OOP with Java	20	41	61	B+	t	f	2026-03-23 16:18:49.335187+05:30	d15dc322
51	921221104011	Karthik L	3	B	5	IT2501	Database Systems	20	57	77	A	t	f	2026-03-23 16:18:49.335187+05:30	d15dc322
52	921221104011	Karthik L	3	B	5	IT2502	Computer Networks	28	67	95	O	t	f	2026-03-23 16:18:49.335187+05:30	d15dc322
53	921221104011	Karthik L	3	B	5	IT2503	Operating Systems	1	0	1	U	f	t	2026-03-23 16:18:49.335187+05:30	d15dc322
54	921221104011	Karthik L	3	B	5	IT2504	Software Engineering	26	34	60	B	t	f	2026-03-23 16:18:49.335187+05:30	d15dc322
55	921221104011	Karthik L	3	B	5	IT2505	Web Technology	21	31	52	B	t	f	2026-03-23 16:18:49.335187+05:30	d15dc322
56	921221104012	Lavanya M	3	C	5	IT2501	Database Systems	22	27	49	C	t	f	2026-03-23 16:18:49.335187+05:30	d15dc322
57	921221104012	Lavanya M	3	C	5	IT2502	Computer Networks	28	62	90	A+	t	f	2026-03-23 16:18:49.335187+05:30	d15dc322
58	921221104012	Lavanya M	3	C	5	IT2503	Operating Systems	24	62	86	A+	t	f	2026-03-23 16:18:49.335187+05:30	d15dc322
59	921221104012	Lavanya M	3	C	5	IT2504	Software Engineering	25	26	51	B	t	f	2026-03-23 16:18:49.335187+05:30	d15dc322
60	921221104012	Lavanya M	3	C	5	IT2505	Web Technology	29	0	29	U	f	t	2026-03-23 16:18:49.335187+05:30	d15dc322
61	921221104013	Manikandan S	3	A	5	IT2501	Database Systems	24	60	84	A+	t	f	2026-03-23 16:18:49.335187+05:30	d15dc322
62	921221104013	Manikandan S	3	A	5	IT2502	Computer Networks	30	32	62	B+	t	f	2026-03-23 16:18:49.335187+05:30	d15dc322
63	921221104013	Manikandan S	3	A	5	IT2503	Operating Systems	20	21	41	U	f	t	2026-03-23 16:18:49.335187+05:30	d15dc322
64	921221104013	Manikandan S	3	A	5	IT2504	Software Engineering	26	71	97	O	t	f	2026-03-23 16:18:49.335187+05:30	d15dc322
65	921221104013	Manikandan S	3	A	5	IT2505	Web Technology	30	41	71	A	t	f	2026-03-23 16:18:49.335187+05:30	d15dc322
66	921221104014	Nithya R	3	B	5	IT2501	Database Systems	21	72	93	O	t	f	2026-03-23 16:18:49.335187+05:30	d15dc322
67	921221104014	Nithya R	3	B	5	IT2502	Computer Networks	30	47	77	A	t	f	2026-03-23 16:18:49.335187+05:30	d15dc322
68	921221104014	Nithya R	3	B	5	IT2503	Operating Systems	21	38	59	B	t	f	2026-03-23 16:18:49.335187+05:30	d15dc322
69	921221104014	Nithya R	3	B	5	IT2504	Software Engineering	23	27	50	B	t	f	2026-03-23 16:18:49.335187+05:30	d15dc322
70	921221104014	Nithya R	3	B	5	IT2505	Web Technology	27	63	90	A+	t	f	2026-03-23 16:18:49.335187+05:30	d15dc322
71	921221104015	Oviya K	3	C	5	IT2501	Database Systems	30	52	82	A+	t	f	2026-03-23 16:18:49.335187+05:30	d15dc322
72	921221104015	Oviya K	3	C	5	IT2502	Computer Networks	29	20	49	C	t	f	2026-03-23 16:18:49.335187+05:30	d15dc322
73	921221104015	Oviya K	3	C	5	IT2503	Operating Systems	25	38	63	B+	t	f	2026-03-23 16:18:49.335187+05:30	d15dc322
74	921221104015	Oviya K	3	C	5	IT2504	Software Engineering	29	65	94	O	t	f	2026-03-23 16:18:49.335187+05:30	d15dc322
75	921221104015	Oviya K	3	C	5	IT2505	Web Technology	21	76	97	O	t	f	2026-03-23 16:18:49.335187+05:30	d15dc322
76	921221104016	Prabu T	3	A	5	IT2501	Database Systems	23	67	90	A+	t	f	2026-03-23 16:18:49.335187+05:30	d15dc322
77	921221104016	Prabu T	3	A	5	IT2502	Computer Networks	30	47	77	A	t	f	2026-03-23 16:18:49.335187+05:30	d15dc322
78	921221104016	Prabu T	3	A	5	IT2503	Operating Systems	26	29	55	B	t	f	2026-03-23 16:18:49.335187+05:30	d15dc322
79	921221104016	Prabu T	3	A	5	IT2504	Software Engineering	21	42	63	B+	t	f	2026-03-23 16:18:49.335187+05:30	d15dc322
80	921221104016	Prabu T	3	A	5	IT2505	Web Technology	20	56	76	A	t	f	2026-03-23 16:18:49.335187+05:30	d15dc322
81	921221104017	Ragavi S	3	B	5	IT2501	Database Systems	21	73	94	O	t	f	2026-03-23 16:18:49.335187+05:30	d15dc322
82	921221104017	Ragavi S	3	B	5	IT2502	Computer Networks	29	61	90	A+	t	f	2026-03-23 16:18:49.335187+05:30	d15dc322
83	921221104017	Ragavi S	3	B	5	IT2503	Operating Systems	20	56	76	A	t	f	2026-03-23 16:18:49.335187+05:30	d15dc322
84	921221104017	Ragavi S	3	B	5	IT2504	Software Engineering	27	41	68	B+	t	f	2026-03-23 16:18:49.335187+05:30	d15dc322
85	921221104017	Ragavi S	3	B	5	IT2505	Web Technology	26	63	89	A+	t	f	2026-03-23 16:18:49.335187+05:30	d15dc322
86	921221104018	Selvam J	3	C	5	IT2501	Database Systems	30	50	80	A	t	f	2026-03-23 16:18:49.335187+05:30	d15dc322
87	921221104018	Selvam J	3	C	5	IT2502	Computer Networks	24	56	80	A	t	f	2026-03-23 16:18:49.335187+05:30	d15dc322
88	921221104018	Selvam J	3	C	5	IT2503	Operating Systems	21	30	51	B	t	f	2026-03-23 16:18:49.335187+05:30	d15dc322
89	921221104018	Selvam J	3	C	5	IT2504	Software Engineering	30	57	87	A+	t	f	2026-03-23 16:18:49.335187+05:30	d15dc322
90	921221104018	Selvam J	3	C	5	IT2505	Web Technology	25	62	87	A+	t	f	2026-03-23 16:18:49.335187+05:30	d15dc322
91	921221104019	Tamilarasi P	3	A	5	IT2501	Database Systems	20	52	72	A	t	f	2026-03-23 16:18:49.335187+05:30	d15dc322
92	921221104019	Tamilarasi P	3	A	5	IT2502	Computer Networks	25	23	48	C	t	f	2026-03-23 16:18:49.335187+05:30	d15dc322
93	921221104019	Tamilarasi P	3	A	5	IT2503	Operating Systems	22	40	62	B+	t	f	2026-03-23 16:18:49.335187+05:30	d15dc322
94	921221104019	Tamilarasi P	3	A	5	IT2504	Software Engineering	27	70	97	O	t	f	2026-03-23 16:18:49.335187+05:30	d15dc322
95	921221104019	Tamilarasi P	3	A	5	IT2505	Web Technology	26	53	79	A	t	f	2026-03-23 16:18:49.335187+05:30	d15dc322
96	921221104020	Usha K	3	B	5	IT2501	Database Systems	25	67	92	O	t	f	2026-03-23 16:18:49.335187+05:30	d15dc322
97	921221104020	Usha K	3	B	5	IT2502	Computer Networks	29	51	80	A	t	f	2026-03-23 16:18:49.335187+05:30	d15dc322
98	921221104020	Usha K	3	B	5	IT2503	Operating Systems	20	36	56	B	t	f	2026-03-23 16:18:49.335187+05:30	d15dc322
99	921221104020	Usha K	3	B	5	IT2504	Software Engineering	21	66	87	A+	t	f	2026-03-23 16:18:49.335187+05:30	d15dc322
100	921221104020	Usha K	3	B	5	IT2505	Web Technology	23	46	69	B+	t	f	2026-03-23 16:18:49.335187+05:30	d15dc322
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: vsb_user
--

COPY public.users (id, name, email, password, role, is_active, last_login, created_at) FROM stdin;
1	Dr. K. Manivannan	hod@vsbec.edu.in	$2b$12$UMj.sF.khpjVLl2ZeuRQL..fE4Vw7hs.ZLEo2NUUi3ToD/LN1fwwy	admin	t	2026-03-23 16:03:21.443137+05:30	2026-03-23 15:56:10.331253+05:30
\.


--
-- Name: activity_logs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: vsb_user
--

SELECT pg_catalog.setval('public.activity_logs_id_seq', 1, true);


--
-- Name: attendance_records_id_seq; Type: SEQUENCE SET; Schema: public; Owner: vsb_user
--

SELECT pg_catalog.setval('public.attendance_records_id_seq', 2000, true);


--
-- Name: attendance_summary_id_seq; Type: SEQUENCE SET; Schema: public; Owner: vsb_user
--

SELECT pg_catalog.setval('public.attendance_summary_id_seq', 100, true);


--
-- Name: goals_id_seq; Type: SEQUENCE SET; Schema: public; Owner: vsb_user
--

SELECT pg_catalog.setval('public.goals_id_seq', 8, true);


--
-- Name: internal_tests_id_seq; Type: SEQUENCE SET; Schema: public; Owner: vsb_user
--

SELECT pg_catalog.setval('public.internal_tests_id_seq', 300, true);


--
-- Name: placement_id_seq; Type: SEQUENCE SET; Schema: public; Owner: vsb_user
--

SELECT pg_catalog.setval('public.placement_id_seq', 14, true);


--
-- Name: results_id_seq; Type: SEQUENCE SET; Schema: public; Owner: vsb_user
--

SELECT pg_catalog.setval('public.results_id_seq', 100, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: vsb_user
--

SELECT pg_catalog.setval('public.users_id_seq', 1, true);


--
-- Name: activity_logs activity_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: vsb_user
--

ALTER TABLE ONLY public.activity_logs
    ADD CONSTRAINT activity_logs_pkey PRIMARY KEY (id);


--
-- Name: alembic_version alembic_version_pkc; Type: CONSTRAINT; Schema: public; Owner: vsb_user
--

ALTER TABLE ONLY public.alembic_version
    ADD CONSTRAINT alembic_version_pkc PRIMARY KEY (version_num);


--
-- Name: attendance_records attendance_records_pkey; Type: CONSTRAINT; Schema: public; Owner: vsb_user
--

ALTER TABLE ONLY public.attendance_records
    ADD CONSTRAINT attendance_records_pkey PRIMARY KEY (id);


--
-- Name: attendance_summary attendance_summary_pkey; Type: CONSTRAINT; Schema: public; Owner: vsb_user
--

ALTER TABLE ONLY public.attendance_summary
    ADD CONSTRAINT attendance_summary_pkey PRIMARY KEY (id);


--
-- Name: goals goals_pkey; Type: CONSTRAINT; Schema: public; Owner: vsb_user
--

ALTER TABLE ONLY public.goals
    ADD CONSTRAINT goals_pkey PRIMARY KEY (id);


--
-- Name: internal_tests internal_tests_pkey; Type: CONSTRAINT; Schema: public; Owner: vsb_user
--

ALTER TABLE ONLY public.internal_tests
    ADD CONSTRAINT internal_tests_pkey PRIMARY KEY (id);


--
-- Name: placement placement_pkey; Type: CONSTRAINT; Schema: public; Owner: vsb_user
--

ALTER TABLE ONLY public.placement
    ADD CONSTRAINT placement_pkey PRIMARY KEY (id);


--
-- Name: results results_pkey; Type: CONSTRAINT; Schema: public; Owner: vsb_user
--

ALTER TABLE ONLY public.results
    ADD CONSTRAINT results_pkey PRIMARY KEY (id);


--
-- Name: attendance_summary uq_att_summary; Type: CONSTRAINT; Schema: public; Owner: vsb_user
--

ALTER TABLE ONLY public.attendance_summary
    ADD CONSTRAINT uq_att_summary UNIQUE (student_id, subject_code);


--
-- Name: attendance_records uq_attendance; Type: CONSTRAINT; Schema: public; Owner: vsb_user
--

ALTER TABLE ONLY public.attendance_records
    ADD CONSTRAINT uq_attendance UNIQUE (student_id, subject_code, date);


--
-- Name: internal_tests uq_internal; Type: CONSTRAINT; Schema: public; Owner: vsb_user
--

ALTER TABLE ONLY public.internal_tests
    ADD CONSTRAINT uq_internal UNIQUE (student_id, subject_code, test_number);


--
-- Name: placement uq_placement; Type: CONSTRAINT; Schema: public; Owner: vsb_user
--

ALTER TABLE ONLY public.placement
    ADD CONSTRAINT uq_placement UNIQUE (student_id, company);


--
-- Name: results uq_result; Type: CONSTRAINT; Schema: public; Owner: vsb_user
--

ALTER TABLE ONLY public.results
    ADD CONSTRAINT uq_result UNIQUE (student_id, subject_code, semester);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: vsb_user
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: ix_activity_logs_created_at; Type: INDEX; Schema: public; Owner: vsb_user
--

CREATE INDEX ix_activity_logs_created_at ON public.activity_logs USING btree (created_at);


--
-- Name: ix_activity_logs_id; Type: INDEX; Schema: public; Owner: vsb_user
--

CREATE INDEX ix_activity_logs_id ON public.activity_logs USING btree (id);


--
-- Name: ix_activity_logs_user_id; Type: INDEX; Schema: public; Owner: vsb_user
--

CREATE INDEX ix_activity_logs_user_id ON public.activity_logs USING btree (user_id);


--
-- Name: ix_attendance_records_date; Type: INDEX; Schema: public; Owner: vsb_user
--

CREATE INDEX ix_attendance_records_date ON public.attendance_records USING btree (date);


--
-- Name: ix_attendance_records_id; Type: INDEX; Schema: public; Owner: vsb_user
--

CREATE INDEX ix_attendance_records_id ON public.attendance_records USING btree (id);


--
-- Name: ix_attendance_records_student_id; Type: INDEX; Schema: public; Owner: vsb_user
--

CREATE INDEX ix_attendance_records_student_id ON public.attendance_records USING btree (student_id);


--
-- Name: ix_attendance_summary_id; Type: INDEX; Schema: public; Owner: vsb_user
--

CREATE INDEX ix_attendance_summary_id ON public.attendance_summary USING btree (id);


--
-- Name: ix_attendance_summary_student_id; Type: INDEX; Schema: public; Owner: vsb_user
--

CREATE INDEX ix_attendance_summary_student_id ON public.attendance_summary USING btree (student_id);


--
-- Name: ix_goals_id; Type: INDEX; Schema: public; Owner: vsb_user
--

CREATE INDEX ix_goals_id ON public.goals USING btree (id);


--
-- Name: ix_internal_tests_id; Type: INDEX; Schema: public; Owner: vsb_user
--

CREATE INDEX ix_internal_tests_id ON public.internal_tests USING btree (id);


--
-- Name: ix_internal_tests_student_id; Type: INDEX; Schema: public; Owner: vsb_user
--

CREATE INDEX ix_internal_tests_student_id ON public.internal_tests USING btree (student_id);


--
-- Name: ix_placement_id; Type: INDEX; Schema: public; Owner: vsb_user
--

CREATE INDEX ix_placement_id ON public.placement USING btree (id);


--
-- Name: ix_placement_student_id; Type: INDEX; Schema: public; Owner: vsb_user
--

CREATE INDEX ix_placement_student_id ON public.placement USING btree (student_id);


--
-- Name: ix_results_id; Type: INDEX; Schema: public; Owner: vsb_user
--

CREATE INDEX ix_results_id ON public.results USING btree (id);


--
-- Name: ix_results_student_id; Type: INDEX; Schema: public; Owner: vsb_user
--

CREATE INDEX ix_results_student_id ON public.results USING btree (student_id);


--
-- Name: ix_results_subject_code; Type: INDEX; Schema: public; Owner: vsb_user
--

CREATE INDEX ix_results_subject_code ON public.results USING btree (subject_code);


--
-- Name: ix_users_email; Type: INDEX; Schema: public; Owner: vsb_user
--

CREATE UNIQUE INDEX ix_users_email ON public.users USING btree (email);


--
-- Name: ix_users_id; Type: INDEX; Schema: public; Owner: vsb_user
--

CREATE INDEX ix_users_id ON public.users USING btree (id);


--
-- Name: activity_logs activity_logs_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: vsb_user
--

ALTER TABLE ONLY public.activity_logs
    ADD CONSTRAINT activity_logs_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: pg_database_owner
--

GRANT ALL ON SCHEMA public TO vsb_user;


--
-- PostgreSQL database dump complete
--

\unrestrict G2GXxw4a9c92g81P2dCzUrcqWaeczaqU4X50p7flLBs5LNsB830N9gj7cgjrRjm

