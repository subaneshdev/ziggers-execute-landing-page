-- ==============================================================================
-- Ziggers Execute: Multi-Sided Physical Execution Marketplace Schema
-- Version: 2026.08.23.01
-- Tables for: Vendors, KYC, Rate Cards, Coverage, Requirements, RFQs, Quotes,
-- Work Orders, Milestones, Inventory, Shipments, Staffing, Venues, Settlements
-- ==============================================================================

-- 1. Vendors Base Entity
CREATE TABLE IF NOT EXISTS vendors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    legal_business_name VARCHAR(255) NOT NULL,
    trade_name VARCHAR(255),
    business_type VARCHAR(50) NOT NULL CHECK (business_type IN ('PROPRIETORSHIP', 'PARTNERSHIP', 'LLP', 'PVT_LTD', 'PUBLIC_LTD', 'INDIVIDUAL_FREELANCER')),
    gstin VARCHAR(15) UNIQUE,
    pan VARCHAR(10) NOT NULL,
    msme_registration_no VARCHAR(50),
    contact_email VARCHAR(255) NOT NULL,
    contact_phone VARCHAR(20) NOT NULL,
    address_line1 TEXT NOT NULL,
    address_line2 TEXT,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    pincode VARCHAR(10) NOT NULL,
    country VARCHAR(100) DEFAULT 'India',
    bank_account_holder VARCHAR(255),
    bank_account_number VARCHAR(50),
    bank_ifsc_code VARCHAR(20),
    bank_name VARCHAR(100),
    kyc_status VARCHAR(30) DEFAULT 'DRAFT' CHECK (kyc_status IN ('DRAFT', 'SUBMITTED', 'UNDER_REVIEW', 'VERIFIED', 'REJECTED', 'SUSPENDED')),
    kyc_rejection_reason TEXT,
    verified_at TIMESTAMPTZ,
    rating NUMERIC(3, 2) DEFAULT NULL, -- NULL until verified completed campaigns exist
    completed_campaigns_count INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Vendor Service Categories & Offerings
CREATE TABLE IF NOT EXISTS vendor_services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vendor_id UUID NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
    category VARCHAR(50) NOT NULL CHECK (category IN ('MANPOWER', 'PRINTING', 'FABRICATION', 'LOGISTICS', 'AV_PRODUCTION', 'VENUE_PERMISSION', 'PHOTOGRAPHY', 'OTHER')),
    service_name VARCHAR(150) NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Dynamic Vendor Rate Cards
CREATE TABLE IF NOT EXISTS vendor_rate_cards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vendor_id UUID NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
    service_id UUID REFERENCES vendor_services(id) ON DELETE SET NULL,
    service_name VARCHAR(150) NOT NULL,
    unit_metric VARCHAR(30) NOT NULL CHECK (unit_metric IN ('SHIFT', 'HOUR', 'DAY', 'PERSON', 'UNIT', 'SQ_FT', 'SQ_METER', 'KG', 'KM', 'TRIP', 'EVENT', 'PACKAGE')),
    base_rate_inr NUMERIC(12, 2) NOT NULL,
    min_order_quantity INT DEFAULT 1,
    city VARCHAR(100) NOT NULL,
    effective_from DATE NOT NULL,
    effective_until DATE,
    conditions TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Geographic Service Coverage
CREATE TABLE IF NOT EXISTS vendor_coverage (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vendor_id UUID NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
    coverage_type VARCHAR(30) NOT NULL CHECK (coverage_type IN ('CITY', 'DISTRICT', 'STATE', 'PINCODE_LIST', 'POLYGON_H3')),
    coverage_value VARCHAR(255) NOT NULL, -- City Name, State, Pincode prefix, or H3 Index
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Campaign Operational Requirements
CREATE TABLE IF NOT EXISTS campaign_requirements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id VARCHAR(100) NOT NULL,
    generated_at TIMESTAMPTZ DEFAULT NOW(),
    status VARCHAR(30) DEFAULT 'DRAFT' CHECK (status IN ('DRAFT', 'CONFIRMED', 'SOURCING_IN_PROGRESS', 'PROCUREMENT_COMPLETED'))
);

CREATE TABLE IF NOT EXISTS campaign_requirement_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    requirement_id UUID NOT NULL REFERENCES campaign_requirements(id) ON DELETE CASCADE,
    category VARCHAR(50) NOT NULL CHECK (category IN ('MANPOWER', 'COLLATERAL', 'LOGISTICS', 'VENUE', 'MEDIA')),
    item_title VARCHAR(255) NOT NULL,
    specification TEXT,
    quantity INT NOT NULL,
    unit_metric VARCHAR(30) NOT NULL,
    provenance VARCHAR(30) NOT NULL CHECK (provenance IN ('AI_SUGGESTED', 'USER_CONFIRMED', 'MANAGER_CONFIRMED', 'VENDOR_QUOTED')),
    is_critical BOOLEAN DEFAULT TRUE,
    status VARCHAR(30) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED', 'QUOTED', 'FULFILLED')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. RFQs & Vendor Quotations
CREATE TABLE IF NOT EXISTS vendor_rfqs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    rfq_number VARCHAR(50) UNIQUE NOT NULL,
    campaign_id VARCHAR(100) NOT NULL,
    requirement_item_id UUID REFERENCES campaign_requirement_items(id),
    category VARCHAR(50) NOT NULL,
    service_required VARCHAR(150) NOT NULL,
    quantity INT NOT NULL,
    unit_metric VARCHAR(30) NOT NULL,
    delivery_city VARCHAR(100) NOT NULL,
    delivery_venue VARCHAR(255) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    submission_deadline TIMESTAMPTZ NOT NULL,
    status VARCHAR(30) DEFAULT 'OPEN' CHECK (status IN ('OPEN', 'QUOTES_RECEIVED', 'AWARDED', 'CLOSED', 'CANCELLED')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS vendor_quotes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    quote_number VARCHAR(50) UNIQUE NOT NULL,
    rfq_id UUID NOT NULL REFERENCES vendor_rfqs(id) ON DELETE CASCADE,
    vendor_id UUID NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
    unit_rate_inr NUMERIC(12, 2) NOT NULL,
    quantity INT NOT NULL,
    subtotal_inr NUMERIC(12, 2) NOT NULL,
    gst_rate NUMERIC(4, 2) DEFAULT 0.18,
    gst_amount_inr NUMERIC(12, 2) NOT NULL,
    total_amount_inr NUMERIC(12, 2) NOT NULL,
    turnaround_days INT NOT NULL,
    notes TEXT,
    status VARCHAR(30) DEFAULT 'SUBMITTED' CHECK (status IN ('SUBMITTED', 'UNDER_REVIEW', 'ACCEPTED', 'REJECTED', 'EXPIRED')),
    submitted_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Binding Work Orders & Milestones
CREATE TABLE IF NOT EXISTS campaign_work_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    wo_number VARCHAR(50) UNIQUE NOT NULL,
    campaign_id VARCHAR(100) NOT NULL,
    quote_id UUID REFERENCES vendor_quotes(id),
    vendor_id UUID NOT NULL REFERENCES vendors(id),
    service_category VARCHAR(50) NOT NULL,
    scope_of_work TEXT NOT NULL,
    quantity INT NOT NULL,
    unit_pricing_inr NUMERIC(12, 2) NOT NULL,
    subtotal_inr NUMERIC(12, 2) NOT NULL,
    tax_amount_inr NUMERIC(12, 2) NOT NULL,
    total_amount_inr NUMERIC(12, 2) NOT NULL,
    status VARCHAR(30) DEFAULT 'ISSUED' CHECK (status IN ('DRAFT', 'ISSUED', 'ACCEPTED', 'IN_PROGRESS', 'AWAITING_QA', 'COMPLETED', 'DISPUTED', 'CANCELLED')),
    issued_at TIMESTAMPTZ DEFAULT NOW(),
    accepted_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS work_order_milestones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    work_order_id UUID NOT NULL REFERENCES campaign_work_orders(id) ON DELETE CASCADE,
    milestone_name VARCHAR(150) NOT NULL,
    percentage NUMERIC(5, 2) NOT NULL,
    amount_inr NUMERIC(12, 2) NOT NULL,
    trigger_condition VARCHAR(50) NOT NULL CHECK (trigger_condition IN ('ADVANCE_ON_ACCEPTANCE', 'MATERIAL_PRODUCED', 'DELIVERED_TO_VENUE', 'QA_VERIFIED', 'FINAL_RECONCILIATION')),
    status VARCHAR(30) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'TRIGGERED', 'APPROVED', 'DISBURSED')),
    approved_at TIMESTAMPTZ
);

-- 8. Materials, Shipments & Physical Inventory
CREATE TABLE IF NOT EXISTS material_shipments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    shipment_number VARCHAR(50) UNIQUE NOT NULL,
    campaign_id VARCHAR(100) NOT NULL,
    origin_address TEXT NOT NULL,
    destination_venue TEXT NOT NULL,
    logistics_provider VARCHAR(100) NOT NULL,
    tracking_number VARCHAR(100),
    allocated_quantity INT NOT NULL,
    received_usable_quantity INT DEFAULT 0,
    damaged_quantity INT DEFAULT 0,
    lost_quantity INT DEFAULT 0,
    status VARCHAR(30) DEFAULT 'DISPATCHED' CHECK (status IN ('PENDING_PICKUP', 'DISPATCHED', 'IN_TRANSIT', 'DELIVERED_ON_SITE', 'RECONCILED', 'DISPUTED')),
    dispatched_at TIMESTAMPTZ,
    delivered_at TIMESTAMPTZ,
    received_by_name VARCHAR(150),
    proof_of_delivery_url TEXT
);

-- 9. Manpower Roster & Staffing
CREATE TABLE IF NOT EXISTS staffing_assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id VARCHAR(100) NOT NULL,
    shift_date DATE NOT NULL,
    shift_start_time TIME NOT NULL,
    shift_end_time TIME NOT NULL,
    venue_name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('PROMOTER', 'SUPERVISOR', 'TEAM_LEAD', 'EMCEE', 'STANDBY')),
    tier VARCHAR(20) DEFAULT 'PRIMARY' CHECK (tier IN ('PRIMARY', 'BACKUP', 'STANDBY', 'REPLACEMENT')),
    worker_name VARCHAR(150) NOT NULL,
    worker_phone VARCHAR(20) NOT NULL,
    languages_spoken TEXT[],
    checkin_status VARCHAR(30) DEFAULT 'PENDING' CHECK (checkin_status IN ('PENDING', 'CHECKED_IN', 'LATE', 'NO_SHOW', 'BACKUP_ACTIVATED')),
    checkin_timestamp TIMESTAMPTZ
);

-- 10. Operational Readiness Dependency Table
CREATE TABLE IF NOT EXISTS campaign_execution_dependencies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id VARCHAR(100) NOT NULL,
    dependency_type VARCHAR(50) NOT NULL CHECK (dependency_type IN ('VENUE_PERMISSION', 'STAFFING_CONFIRMED', 'SUPERVISOR_ASSIGNED', 'MATERIALS_DELIVERED', 'FINANCIAL_ALLOCATION')),
    severity VARCHAR(20) NOT NULL CHECK (severity IN ('CRITICAL', 'HIGH', 'MEDIUM', 'LOW')),
    status VARCHAR(30) NOT NULL CHECK (status IN ('SATISFIED', 'PENDING', 'BLOCKED')),
    blocker_reason TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for high performance
CREATE INDEX IF NOT EXISTS idx_vendor_coverage ON vendor_coverage(coverage_value);
CREATE INDEX IF NOT EXISTS idx_vendor_rfqs_campaign ON vendor_rfqs(campaign_id);
CREATE INDEX IF NOT EXISTS idx_work_orders_campaign ON campaign_work_orders(campaign_id);
CREATE INDEX IF NOT EXISTS idx_shipments_campaign ON material_shipments(campaign_id);
CREATE INDEX IF NOT EXISTS idx_staffing_campaign_date ON staffing_assignments(campaign_id, shift_date);
