"""
Ziggers Offline Audience Intelligence - Empirical Estimation Service Contract
Module: ml_service/model_contract.py

Defines the FastAPI & Statistical Estimation pipeline interface for offline campaign planning.
Explicitly labeled as EMPIRICAL_BASELINE_ESTIMATOR (Maturity Level 2: External Data & Heuristic Model).
Does NOT claim Machine Learning / LightGBM regressors until a true trained model artifact registry is deployed.
"""

from dataclasses import dataclass, field
from typing import List, Dict, Any, Optional
import enum

class IntelligenceMaturityLevel(enum.IntEnum):
    LEVEL_0_NO_DATA = 0
    LEVEL_1_HEURISTIC = 1
    LEVEL_2_EXTERNAL_DATA_MODEL = 2
    LEVEL_3_ZIGGERS_EMPIRICAL = 3
    LEVEL_4_VALIDATED_PREDICTIVE_MODEL = 4

class ConfidenceTier(str, enum.Enum):
    LOW = "LOW"
    MODERATE = "MODERATE"
    HIGH = "HIGH"

@dataclass
class CampaignTargetingPayload:
    objective: str
    target_locations: List[str]
    radius_km: float = 3.0
    age_min: int = 18
    age_max: int = 35
    gender: str = "All"
    sec_classification: str = "SEC A/B"
    selected_interests: List[str] = field(default_factory=list)
    promoter_count: int = 10
    shift_hours: int = 5
    campaign_days: int = 1
    budget_inr: float = 35000.0

@dataclass
class ProvenanceMetric:
    estimated_value: int
    min_range: int
    max_range: int
    source_type: str = "MODELLED_ESTIMATE"
    confidence: ConfidenceTier = ConfidenceTier.MODERATE
    methodology: str = "population_grid_and_heuristic_rates"

@dataclass
class AudiencePlanningResponse:
    potential_audience: ProvenanceMetric
    qualified_audience: ProvenanceMetric
    estimated_reach: ProvenanceMetric
    expected_interactions: ProvenanceMetric
    expected_leads: ProvenanceMetric
    expected_app_installs: ProvenanceMetric
    estimated_cpl_range: str
    match_alignment_tier: str
    maturity_level: IntelligenceMaturityLevel = IntelligenceMaturityLevel.LEVEL_2_EXTERNAL_DATA_MODEL
    model_version: str = "v1.0_empirical_baseline"
    uncertainty_drivers: List[Dict[str, str]] = field(default_factory=list)
    recommendations: List[str] = field(default_factory=list)

class ZiggersEmpiricalEstimator:
    """
    Statistical Baseline Estimator for Ziggers Offline Campaigns.
    Uses spatial population bounds and operational conversion assumptions.
    Upgrades to Level 4 (Trained Model) only when 500+ verified campaign observations exist in registry.
    """
    def __init__(self, model_version: str = "v1.0_empirical_baseline"):
        self.model_version = model_version
        self.maturity_level = IntelligenceMaturityLevel.LEVEL_2_EXTERNAL_DATA_MODEL
        self.is_ml_trained = False

    def estimate(self, payload: CampaignTargetingPayload) -> AudiencePlanningResponse:
        node_name = payload.target_locations[0] if payload.target_locations else "T. Nagar"
        
        # Operational capacity baseline (Planning assumption)
        shift_hours = payload.shift_hours or 5
        hourly_rate = 35 # conservative planning baseline
        max_physical_capacity = payload.promoter_count * shift_hours * payload.campaign_days * hourly_rate

        # Spatial aggregation estimate
        base_pop = 140000 if "T. Nagar" in node_name else 115000
        potential = int(base_pop * (1.0 + (payload.radius_km - 1.0) * 0.20))

        # Demographic qualification
        age_span = max(5, payload.age_max - payload.age_min)
        age_ratio = min(1.0, age_span / 45.0)
        gender_ratio = 1.0 if payload.gender == "All" else 0.49
        
        qualified = int(potential * age_ratio * gender_ratio)
        reach = int(qualified * 0.25)

        # Capacity capped interactions
        interactions = min(max_physical_capacity, int(reach * 0.30))
        
        # Conversion heuristics
        conv_leads = 0.20 if "lead" in payload.objective.lower() else 0.12
        leads = int(interactions * conv_leads)
        installs = int(interactions * 0.25) if "app" in payload.objective.lower() else int(interactions * 0.05)
        
        min_leads = max(1, int(leads * 0.70))
        max_leads = int(leads * 1.35)
        min_cpl = int(payload.budget_inr / max_leads)
        max_cpl = int(payload.budget_inr / min_leads)

        alignment_tier = "HIGH" if len(payload.selected_interests) >= 3 else "MODERATE"

        return AudiencePlanningResponse(
            potential_audience=ProvenanceMetric(
                estimated_value=potential,
                min_range=int(potential * 0.8),
                max_range=int(potential * 1.25),
                source_type="MODELLED_ESTIMATE",
                confidence=ConfidenceTier.MODERATE,
                methodology="population_grid_aggregation"
            ),
            qualified_audience=ProvenanceMetric(
                estimated_value=qualified,
                min_range=int(qualified * 0.75),
                max_range=int(qualified * 1.30),
                source_type="HEURISTIC",
                confidence=ConfidenceTier.MODERATE,
                methodology="demographic_ratio_heuristic"
            ),
            estimated_reach=ProvenanceMetric(
                estimated_value=reach,
                min_range=int(reach * 0.70),
                max_range=int(reach * 1.35),
                source_type="HEURISTIC",
                confidence=ConfidenceTier.LOW,
                methodology="physical_footfall_funnel"
            ),
            expected_interactions=ProvenanceMetric(
                estimated_value=interactions,
                min_range=int(interactions * 0.80),
                max_range=int(interactions * 1.20),
                source_type="HEURISTIC",
                confidence=ConfidenceTier.MODERATE,
                methodology="staffing_capacity_constraint"
            ),
            expected_leads=ProvenanceMetric(
                estimated_value=leads,
                min_range=min_leads,
                max_range=max_leads,
                source_type="HEURISTIC",
                confidence=ConfidenceTier.LOW,
                methodology="conversion_prior_heuristic"
            ),
            expected_app_installs=ProvenanceMetric(
                estimated_value=installs,
                min_range=int(installs * 0.65),
                max_range=int(installs * 1.40),
                source_type="HEURISTIC",
                confidence=ConfidenceTier.LOW,
                methodology="conversion_prior_heuristic"
            ),
            estimated_cpl_range=f"₹{min_cpl} – ₹{max_cpl}",
            match_alignment_tier=alignment_tier,
            maturity_level=IntelligenceMaturityLevel.LEVEL_2_EXTERNAL_DATA_MODEL,
            model_version=self.model_version,
            uncertainty_drivers=[
                {"factor": "Lack of venue-specific historical campaign observations", "impact": "HIGH"},
                {"factor": "Promoter pitch variation across field shifts", "impact": "MEDIUM"}
            ],
            recommendations=[
                f"Promoter team capacity ({max_physical_capacity} interactions) planned for campaign duration.",
                "Ensure local municipal or property permissions are verified prior to promoter dispatch."
            ]
        )
