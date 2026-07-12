-- ResumeAI Database Schema (PostgreSQL)

-- Enable UUID extension if not already present
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Users Table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name VARCHAR(255),
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'GUEST',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Resumes Table
CREATE TABLE resumes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    target_job_role VARCHAR(255),
    template_id VARCHAR(50) DEFAULT 'classic',
    font VARCHAR(50) DEFAULT 'Arial',
    font_size VARCHAR(10) DEFAULT '11pt',
    line_spacing REAL DEFAULT 1.15,
    margins REAL DEFAULT 1.0,
    paper_size VARCHAR(20) DEFAULT 'A4',
    accent_color VARCHAR(20) DEFAULT '#4f46e5',
    show_icons BOOLEAN DEFAULT TRUE,
    show_photo BOOLEAN DEFAULT FALSE,
    section_order TEXT, -- Comma-separated order of sections, e.g. "personal,summary,experience,projects,education,skills"
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Personal Details Table
CREATE TABLE personal_details (
    id BIGSERIAL PRIMARY KEY,
    resume_id UUID NOT NULL REFERENCES resumes(id) ON DELETE CASCADE UNIQUE,
    first_name VARCHAR(100),
    middle_name VARCHAR(100),
    last_name VARCHAR(100),
    preferred_name VARCHAR(100),
    professional_title VARCHAR(255),
    current_position VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(50),
    alternate_phone VARCHAR(50),
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    country VARCHAR(100),
    postal_code VARCHAR(20),
    date_of_birth DATE,
    nationality VARCHAR(100),
    linkedin VARCHAR(255),
    github VARCHAR(255),
    portfolio VARCHAR(255),
    website VARCHAR(255),
    twitter VARCHAR(255),
    leetcode VARCHAR(255),
    hackerrank VARCHAR(255),
    codeforces VARCHAR(255),
    codechef VARCHAR(255),
    geeksforgeeks VARCHAR(255),
    kaggle VARCHAR(255),
    behance VARCHAR(255),
    dribbble VARCHAR(255),
    stackoverflow VARCHAR(255),
    medium VARCHAR(255),
    custom_links TEXT, -- Stored as serialised JSON array
    photo_url VARCHAR(512)
);

-- 4. Work Experiences Table
CREATE TABLE experiences (
    id BIGSERIAL PRIMARY KEY,
    resume_id UUID NOT NULL REFERENCES resumes(id) ON DELETE CASCADE,
    job_title VARCHAR(255) NOT NULL,
    company VARCHAR(255) NOT NULL,
    employment_type VARCHAR(50),
    industry VARCHAR(100),
    location VARCHAR(100),
    work_mode VARCHAR(50), -- e.g. REMOTE, HYBRID, ONSITE
    start_date DATE,
    end_date DATE,
    is_current_job BOOLEAN DEFAULT FALSE,
    responsibilities TEXT, -- Serialized JSON array of bullet points
    achievements TEXT, -- Serialized JSON array of bullet points
    technologies VARCHAR(512), -- Comma-separated list of tech
    team_size INT,
    list_order INT DEFAULT 0
);

-- 5. Projects Table
CREATE TABLE projects (
    id BIGSERIAL PRIMARY KEY,
    resume_id UUID NOT NULL REFERENCES resumes(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    short_description VARCHAR(512),
    detailed_description TEXT, -- Detailed achievements/work
    tech_stack VARCHAR(512), -- Comma-separated list
    github_url VARCHAR(255),
    live_demo_url VARCHAR(255),
    play_store_url VARCHAR(255),
    app_store_url VARCHAR(255),
    team_size INT,
    duration VARCHAR(50),
    role VARCHAR(100),
    features TEXT, -- Serialized JSON array
    challenges TEXT, -- Serialized JSON array
    learnings TEXT, -- Serialized JSON array
    achievements TEXT, -- Serialized JSON array
    list_order INT DEFAULT 0
);

-- 6. Educations Table
CREATE TABLE educations (
    id BIGSERIAL PRIMARY KEY,
    resume_id UUID NOT NULL REFERENCES resumes(id) ON DELETE CASCADE,
    degree VARCHAR(255) NOT NULL,
    course VARCHAR(255),
    specialization VARCHAR(255),
    college VARCHAR(255),
    university VARCHAR(255),
    board VARCHAR(100),
    city VARCHAR(100),
    country VARCHAR(100),
    start_year INT,
    end_year INT,
    cgpa REAL,
    percentage REAL,
    grade VARCHAR(20),
    list_order INT DEFAULT 0
);

-- 7. Skills Table
CREATE TABLE skills (
    id BIGSERIAL PRIMARY KEY,
    resume_id UUID NOT NULL REFERENCES resumes(id) ON DELETE CASCADE,
    category VARCHAR(100) NOT NULL, -- e.g. Languages, Databases
    items TEXT NOT NULL, -- Comma-separated list of skill tags
    list_order INT DEFAULT 0
);

-- 8. Certifications Table
CREATE TABLE certifications (
    id BIGSERIAL PRIMARY KEY,
    resume_id UUID NOT NULL REFERENCES resumes(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    issuer VARCHAR(255) NOT NULL,
    issue_date DATE,
    expiration_date DATE,
    credential_id VARCHAR(100),
    credential_url VARCHAR(512),
    list_order INT DEFAULT 0
);

-- 9. Resume Versions Table
CREATE TABLE resume_versions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    resume_id UUID NOT NULL REFERENCES resumes(id) ON DELETE CASCADE,
    version_name VARCHAR(255) NOT NULL,
    resume_data_json TEXT NOT NULL, -- JSON snapshot of the entire resume
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
