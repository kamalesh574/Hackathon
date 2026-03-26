const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

async function testUpload() {
  try {
    const formData = new FormData();
    formData.append('file', fs.createReadStream('chennai_customers_100.csv'));
    
    console.log("Sending upload request...");
    const uploadRes = await axios.post('http://127.0.0.1:8000/upload/customers', formData, {
      headers: formData.getHeaders()
    });
    
    console.log("Upload Success:", uploadRes.data);
    
    console.log("Sending predict request...");
    const predictRes = await axios.post(`http://127.0.0.1:8000/predict/batch?file_path=data/uploads/${uploadRes.data.filename}`);
    
    console.log("Predict Success:", predictRes.data);
  } catch (e) {
    if (e.response) {
      console.error("HTTP Error:", e.response.status, e.response.data);
    } else {
      console.error("Network Error:", e.message);
    }
  }
}

testUpload();
