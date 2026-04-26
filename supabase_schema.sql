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

    CREATE POLICY "Allow anonymous read access"
    ON public.surveys FOR SELECT
    TO anon
    USING (true);

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

    CREATE POLICY "Allow anonymous read access volunteers"
    ON public.volunteers FOR SELECT TO anon USING (true);

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
