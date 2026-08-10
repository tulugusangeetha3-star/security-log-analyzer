from collections import Counter
from typing import List, Dict


def detect_brute_force(logs: List[Dict]) -> List[Dict]:
    """
    Detect multiple failed login attempts from the same IP.
    """

    failed_logins = Counter()

    for log in logs:
        if (
            log.get("action") == "login"
            and log.get("status") == "failed"
            and log.get("ip")
        ):
            failed_logins[log["ip"]] += 1

    alerts = []

    for ip, count in failed_logins.items():
        if count >= 5:
            alerts.append({
                "type": "BRUTE_FORCE",
                "severity": "HIGH",
                "message": f"{count} failed login attempts detected",
                "ip": ip,
                "count": count
            })

    return alerts


def detect_suspicious_paths(logs: List[Dict]) -> List[Dict]:
    """
    Detect suspicious web paths.
    """

    suspicious_patterns = [
        "../",
        "/etc/passwd",
        "/admin",
        "wp-admin",
        ".env",
        "phpmyadmin"
    ]

    alerts = []

    for log in logs:
        path = log.get("path")

        if not path:
            continue

        path_lower = path.lower()

        for pattern in suspicious_patterns:
            if pattern.lower() in path_lower:
                alerts.append({
                    "type": "SUSPICIOUS_PATH",
                    "severity": "HIGH",
                    "message": f"Suspicious web path detected: {path}",
                    "ip": log.get("ip"),
                    "path": path
                })
                break

    return alerts


def detect_failed_authentication(logs: List[Dict]) -> List[Dict]:
    """
    Detect individual failed authentication events.
    """

    alerts = []

    for log in logs:
        if (
            log.get("action") == "login"
            and log.get("status") == "failed"
        ):
            alerts.append({
                "type": "FAILED_LOGIN",
                "severity": "MEDIUM",
                "message": "Failed login attempt detected",
                "ip": log.get("ip"),
                "user": log.get("user")
            })

    return alerts


def detect_cloud_threats(logs: List[Dict]) -> List[Dict]:
    """
    Detect suspicious cloud IAM activity.
    """

    suspicious_actions = {
        "CreateAccessKey",
        "CreateUser",
        "DeleteUser",
        "BucketPolicyChange"
    }

    alerts = []

    for log in logs:
        action = log.get("action")

        if action in suspicious_actions:
            alerts.append({
                "type": "SUSPICIOUS_CLOUD_ACTIVITY",
                "severity": "HIGH",
                "message": f"Suspicious cloud action detected: {action}",
                "ip": log.get("ip"),
                "user": log.get("user"),
                "provider": log.get("provider"),
                "service": log.get("service"),
                "action": action
            })

    return alerts


def detect_threats(logs: List[Dict]) -> List[Dict]:
    """
    Run all detection rules.
    """

    alerts = []

    alerts.extend(detect_brute_force(logs))
    alerts.extend(detect_suspicious_paths(logs))
    alerts.extend(detect_failed_authentication(logs))
    alerts.extend(detect_cloud_threats(logs))

    return alerts