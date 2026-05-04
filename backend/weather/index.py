import os
import json
import urllib.request

def handler(event: dict, context) -> dict:
    """Получает текущую погоду в Сочи через OpenWeatherMap API"""
    cors_headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
    }

    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': cors_headers, 'body': ''}

    api_key = os.environ.get('OPENWEATHER_API_KEY', '')

    if not api_key:
        mock_data = {
            "temp": 24,
            "feels_like": 26,
            "humidity": 65,
            "wind_speed": 3.5,
            "description": "Ясно",
            "icon": "01d",
            "city": "Сочи",
            "mock": True
        }
        return {
            'statusCode': 200,
            'headers': {**cors_headers, 'Content-Type': 'application/json'},
            'body': json.dumps(mock_data, ensure_ascii=False)
        }

    url = f"https://api.openweathermap.org/data/2.5/weather?q=Sochi,RU&appid={api_key}&units=metric&lang=ru"

    req = urllib.request.Request(url)
    with urllib.request.urlopen(req, timeout=10) as resp:
        data = json.loads(resp.read().decode())

    result = {
        "temp": round(data["main"]["temp"]),
        "feels_like": round(data["main"]["feels_like"]),
        "humidity": data["main"]["humidity"],
        "wind_speed": data["wind"]["speed"],
        "description": data["weather"][0]["description"].capitalize(),
        "icon": data["weather"][0]["icon"],
        "city": "Сочи",
        "mock": False
    }

    return {
        'statusCode': 200,
        'headers': {**cors_headers, 'Content-Type': 'application/json'},
        'body': json.dumps(result, ensure_ascii=False)
    }
