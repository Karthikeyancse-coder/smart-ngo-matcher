    -- 1. Create the 'surveys' table
    CREATE TABLE IF NOT EXISTS public.surveys (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
        village TEXT NOT NULL,
        district TEXT NOT NULL,
        need_type TEXT NOT NULL,
        description TEXT,
        urgency INTEGER NOT NULL,
        families INTEGER NOT NULL,
        lat DOUBLE PRECISION NOT NULL,
        lng DOUBLE PRECISION NOT NULL,
        status TEXT DEFAULT 'reported'::text NOT NULL
    );

    -- 2. Enable Row Level Security (RLS) but allow anonymous access for testing
    ALTER TABLE public.surveys ENABLE ROW LEVEL SECURITY;

    DROP POLICY IF EXISTS "Allow anonymous read access" ON public.surveys;
    CREATE POLICY "Allow anonymous read access"
    ON public.surveys FOR SELECT
    TO anon
    USING (true);

    DROP POLICY IF EXISTS "Allow anonymous insert access" ON public.surveys;
    CREATE POLICY "Allow anonymous insert access"
    ON public.surveys FOR INSERT
    TO anon
    WITH CHECK (true);

    -- 3. Insert some mock data so your Heatmap & Volunteer Matcher aren't empty
    INSERT INTO public.surveys (village, district, need_type, description, urgency, families, lat, lng, status)
    VALUES 
    ('Kadayam', 'Tenkasi', 'Medical Aid', 'Need immediate antibiotics and emergency kits due to flooding blocking main access road.', 9, 45, 8.8252, 77.3756, 'reported'),
    ('Alangulam', 'Tenkasi', 'Water', 'Drinking water contamination. Need water purification tablets and bottled water.', 8, 120, 8.8687, 77.4984, 'reported'),
    ('Pavoorchatram', 'Tenkasi', 'Shelter', 'Temporary shelter needed for families displaced by landslide.', 7, 30, 8.9131, 77.3912, 'reported'),
    ('Ambasamudram', 'Tirunelveli', 'Food Supply', 'Rice and basic provisions required for cut-off hamlet.', 6, 85, 8.7051, 77.4586, 'assigned'),
    ('Papanasam', 'Tirunelveli', 'Heavy Eqpt', 'Earth movers needed to clear road blocks near the dam area.', 5, 200, 8.7144, 77.3725, 'resolved');

    -- 4. Create the 'volunteers' table
    CREATE TABLE IF NOT EXISTS public.volunteers (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
        name TEXT NOT NULL,
        role TEXT NOT NULL,
        rating DOUBLE PRECISION DEFAULT 5.0,
        completed_missions INTEGER DEFAULT 0,
        availability TEXT DEFAULT 'Available Now',
        lat DOUBLE PRECISION NOT NULL,
        lng DOUBLE PRECISION NOT NULL,
        region TEXT
    );

    -- 5. Enable RLS for Volunteers
    ALTER TABLE public.volunteers ENABLE ROW LEVEL SECURITY;

    DROP POLICY IF EXISTS "Allow anonymous read access volunteers" ON public.volunteers;
    CREATE POLICY "Allow anonymous read access volunteers"
    ON public.volunteers FOR SELECT TO anon USING (true);

    DROP POLICY IF EXISTS "Allow anonymous insert access volunteers" ON public.volunteers;
    CREATE POLICY "Allow anonymous insert access volunteers"
    ON public.volunteers FOR INSERT TO anon WITH CHECK (true);

    -- 6. Insert Mock Volunteers covering both Ukraine and India
    INSERT INTO public.volunteers (name, role, rating, completed_missions, availability, lat, lng, region) VALUES
    ('Dr. Oksana V.', 'Medical Specialist', 4.9, 87, 'Available Now', 51.52, 30.72, 'Ukraine'),
    ('Ivan S.', 'Logistics Coordinator', 4.8, 42, 'In 1 hour', 51.40, 30.60, 'Ukraine'),
    ('Kyiv Rescue Unit B', 'Heavy Equipment', 5.0, 210, 'In 4 hours', 50.45, 30.52, 'Ukraine'),
    ('Anya M.', 'General Volunteer', 4.6, 15, 'Available Now', 51.51, 30.70, 'Ukraine'),
    ('Dr. Aravind', 'Medical Specialist', 4.9, 34, 'Available Now', 8.82, 77.37, 'India'),
    ('Meena K.', 'Logistics Coordinator', 4.7, 12, 'In 2 hours', 8.85, 77.40, 'India'),
    ('Rescue Team Alpha', 'Heavy Equipment', 5.0, 108, 'Available Now', 8.90, 77.35, 'India'),
    ('Rajesh Kumar', 'General Volunteer', 4.8, 5, 'Available Now', 8.80, 77.38, 'India');

-- ==========================================
-- 🔐 MULTI-USER AUTHENTICATION SYSTEM
-- ==========================================

-- 1. ORGANIZATIONS TABLE (for Coordinators)
CREATE TABLE IF NOT EXISTS public.organizations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    logo_url TEXT,
    website TEXT,
    
    -- Location
    district TEXT NOT NULL,
    state TEXT DEFAULT 'Tamil Nadu',
    headquarters_lat DOUBLE PRECISION,
    headquarters_lng DOUBLE PRECISION,
    
    -- Details
    registration_number TEXT UNIQUE,
    verified BOOLEAN DEFAULT false,
    tier TEXT DEFAULT 'free', -- free, pro, enterprise
    
    -- Stats
    total_surveys INTEGER DEFAULT 0,
    total_volunteers INTEGER DEFAULT 0,
    total_families_served INTEGER DEFAULT 0,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_organizations_district ON public.organizations(district);
CREATE INDEX IF NOT EXISTS idx_organizations_verified ON public.organizations(verified);

ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can read organizations" ON public.organizations;
CREATE POLICY "Anyone can read organizations"
ON public.organizations FOR SELECT USING (true);

-- 2. USERS TABLE (Core Authentication)
CREATE TABLE IF NOT EXISTS public.users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    
    -- Email & Password
    email TEXT UNIQUE,
    phone TEXT UNIQUE,
    password_hash TEXT,
    
    -- Profile Info
    full_name TEXT NOT NULL,
    avatar_url TEXT,
    bio TEXT,
    
    -- User Type
    user_type TEXT NOT NULL,
    -- Options: coordinator, volunteer, admin
    
    -- Coordinator Details (if user_type = coordinator)
    coordinator_org_id UUID REFERENCES public.organizations(id),
    coordinator_title TEXT, -- "Field Coordinator", "Manager", etc.
    coordinator_verified BOOLEAN DEFAULT false,
    
    -- Volunteer Details (if user_type = volunteer)
    volunteer_id UUID UNIQUE REFERENCES public.volunteers(id),
    volunteer_skills TEXT[],
    volunteer_languages TEXT[],
    volunteer_max_travel_km INTEGER DEFAULT 20,
    volunteer_rating DECIMAL(3,1) DEFAULT 5.0,
    
    -- Status
    is_active BOOLEAN DEFAULT true,
    email_verified BOOLEAN DEFAULT false,
    phone_verified BOOLEAN DEFAULT false,
    last_login TIMESTAMP WITH TIME ZONE,
    
    -- Security
    two_factor_enabled BOOLEAN DEFAULT false,
    two_factor_secret TEXT,
    
    -- Terms & Privacy
    agreed_to_terms_at TIMESTAMP WITH TIME ZONE,
    agreed_to_privacy_at TIMESTAMP WITH TIME ZONE,
    
    -- System
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_phone ON public.users(phone);
CREATE INDEX IF NOT EXISTS idx_users_type ON public.users(user_type);
CREATE INDEX IF NOT EXISTS idx_users_org ON public.users(coordinator_org_id);
CREATE INDEX IF NOT EXISTS idx_users_active ON public.users(is_active);

-- RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read own profile" ON public.users;
CREATE POLICY "Users can read own profile"
ON public.users FOR SELECT
USING (auth.uid() = id OR user_type = 'admin');

DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
CREATE POLICY "Users can update own profile"
ON public.users FOR UPDATE
USING (auth.uid() = id);

-- 3. SESSIONS TABLE (Token Management)
CREATE TABLE IF NOT EXISTS public.sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    
    -- Token
    access_token TEXT NOT NULL UNIQUE,
    refresh_token TEXT UNIQUE,
    
    -- Device Info
    device_name TEXT,
    device_type TEXT, -- web, mobile, tablet
    ip_address TEXT,
    user_agent TEXT,
    
    -- Status
    is_active BOOLEAN DEFAULT true,
    
    -- Timeline
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    last_activity TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    
    -- Security
    two_factor_verified BOOLEAN DEFAULT false
);

CREATE INDEX IF NOT EXISTS idx_sessions_user ON public.sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_token ON public.sessions(access_token);
CREATE INDEX IF NOT EXISTS idx_sessions_active ON public.sessions(is_active);

-- 4. LOGIN_AUDIT TABLE (Security Tracking)
CREATE TABLE IF NOT EXISTS public.login_audit (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    
    user_id UUID REFERENCES public.users(id),
    email TEXT, 
    user_type TEXT,
    
    -- Attempt Details
    attempt_type TEXT, -- successful, failed, two_factor, password_reset
    reason TEXT, 
    
    -- Device Info
    ip_address TEXT,
    device_type TEXT,
    user_agent TEXT,
    location TEXT,
    
    -- Timeline
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_audit_user ON public.login_audit(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_type ON public.login_audit(attempt_type);
CREATE INDEX IF NOT EXISTS idx_audit_date ON public.login_audit(created_at);

-- 5. ASSIGNMENTS TABLE (Volunteer Workflow)
CREATE TABLE IF NOT EXISTS public.assignments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    survey_id UUID REFERENCES public.surveys(id) ON DELETE CASCADE,
    volunteer_id UUID REFERENCES public.volunteers(id) ON DELETE CASCADE,
    coordinator_id UUID REFERENCES public.users(id),
    
    -- Assignment Status
    acceptance_status TEXT DEFAULT 'pending',
    -- pending | accepted | rejected | expired
    
    accepted_by_volunteer_at TIMESTAMP WITH TIME ZONE,
    rejected_by_volunteer_at TIMESTAMP WITH TIME ZONE,
    volunteer_rejection_reason TEXT,
    
    -- Proof/Photos
    before_photo_url TEXT,
    after_photo_url TEXT,
    problem_solved TEXT DEFAULT NULL,
    -- 'yes' | 'partial' | 'no' | NULL (not submitted yet)
    
    proof_submitted_at TIMESTAMP WITH TIME ZONE,
    families_helped_at_completion INTEGER,
    hours_spent_at_completion DECIMAL(5,2),
    volunteer_completion_notes TEXT,
    
    -- Verification by Coordinator
    verification_status TEXT DEFAULT 'not_submitted',
    -- not_submitted | submitted | approved | rejected | resubmitted
    
    coordinator_verification_notes TEXT,
    coordinator_verification_rating INTEGER, -- 1-5 stars
    coordinator_verified_at TIMESTAMP WITH TIME ZONE,
    
    -- Rejection handling
    rejection_count INTEGER DEFAULT 0,
    resubmission_deadline TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_assignments_acceptance_status ON public.assignments(acceptance_status);
CREATE INDEX IF NOT EXISTS idx_assignments_verification_status ON public.assignments(verification_status);
CREATE INDEX IF NOT EXISTS idx_assignments_problem_solved ON public.assignments(problem_solved);
