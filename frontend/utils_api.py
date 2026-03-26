import requests
import streamlit as st

BASE_URL = "http://127.0.0.1:8000"

def get_api(endpoint):
    try:
        response = requests.get(f"{BASE_URL}{endpoint}")
        if response.status_code == 200:
            return response.json()
        return None
    except Exception as e:
        return None

def post_api(endpoint, data=None, files=None):
    try:
        if files:
            response = requests.post(f"{BASE_URL}{endpoint}", files=files)
        else:
            response = requests.post(f"{BASE_URL}{endpoint}", json=data)
        if response.status_code == 200:
            return response.json()
        return None
    except Exception as e:
        return None
