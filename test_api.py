import requests

def run_test():
    print("Testing Upload API...")
    with open('chennai_customers_100.csv', 'rb') as f:
        files = {'file': ('chennai_customers_100.csv', f, 'text/csv')}
        r1 = requests.post('http://127.0.0.1:8000/upload/customers', files=files)
        print("Upload Response:", r1.status_code, r1.json())
        
        if r1.status_code == 200:
            filename = r1.json().get('filename')
            print("Testing Predict API...")
            r2 = requests.post(f'http://127.0.0.1:8000/predict/batch?file_path=data/uploads/{filename}')
            print("Predict Response:", r2.status_code, r2.json())

if __name__ == '__main__':
    run_test()
