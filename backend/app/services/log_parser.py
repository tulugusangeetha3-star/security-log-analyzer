import re
from pathlib import Path


LOG_PATTERN = re.compile(
    r"^(?P<timestamp>\S+\s+\S+)\s+"
    r"(?P<level>\w+)\s+"
    r"(?P<fields>.*)$"
)


def parse_log_line(line: str) -> dict | None:
    """
    Convert one raw security log line into structured data.
    """

    line = line.strip()

    if not line:
        return None

    match = LOG_PATTERN.match(line)

    if not match:
        return None

    timestamp = match.group("timestamp")
    level = match.group("level")
    fields_text = match.group("fields")

    fields = {}

    for item in fields_text.split():
        if "=" in item:
            key, value = item.split("=", 1)
            fields[key] = value

    return {
        "timestamp": timestamp,
        "level": level,
        "user": fields.get("user"),
        "action": fields.get("action"),
        "status": fields.get("status"),
        "ip": fields.get("ip") or fields.get("source_ip"),
        "provider": fields.get("provider"),
        "service": fields.get("service"),
        "method": fields.get("method"),
        "path": fields.get("path"),
    }


def parse_log_file(file_path: str) -> list[dict]:
    """
    Parse every line in a log file.
    """

    path = Path(file_path)

    if not path.exists():
        raise FileNotFoundError(f"Log file not found: {file_path}")

    parsed_logs = []

    with path.open("r", encoding="utf-8") as file:
        for line in file:
            parsed = parse_log_line(line)

            if parsed:
                parsed_logs.append(parsed)

    return parsed_logs