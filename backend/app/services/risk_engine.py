from typing import List, Dict


SEVERITY_SCORES = {
    "LOW": 25,
    "MEDIUM": 50,
    "HIGH": 75,
    "CRITICAL": 100,
}


TYPE_BONUS = {
    "BRUTE_FORCE": 10,
    "SUSPICIOUS_PATH": 10,
    "FAILED_LOGIN": 0,
    "SUSPICIOUS_CLOUD_ACTIVITY": 15,
}


def calculate_risk_score(alert: Dict) -> int:
    """
    Calculate a risk score from 0 to 100.
    """

    severity = alert.get("severity", "LOW").upper()

    base_score = SEVERITY_SCORES.get(severity, 25)

    alert_type = alert.get("type", "")

    bonus = TYPE_BONUS.get(alert_type, 0)

    score = base_score + bonus

    # Keep score within 0-100.
    return min(score, 100)


def get_risk_level(score: int) -> str:
    """
    Convert numerical risk score into a risk level.
    """

    if score >= 90:
        return "CRITICAL"

    if score >= 70:
        return "HIGH"

    if score >= 40:
        return "MEDIUM"

    return "LOW"


def enrich_alert(alert: Dict) -> Dict:
    """
    Add risk score and risk level to an alert.
    """

    score = calculate_risk_score(alert)
    risk_level = get_risk_level(score)

    enriched_alert = alert.copy()

    enriched_alert["risk_score"] = score
    enriched_alert["risk_level"] = risk_level

    return enriched_alert


def calculate_risk(alerts: List[Dict]) -> List[Dict]:
    """
    Calculate risk for every detection alert.
    """

    return [enrich_alert(alert) for alert in alerts]