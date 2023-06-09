const fs = require("fs")

// Loads environment variables from .env file (if it exists)
require("dotenv").config()

async function createGeostoreIDfromGeometry(geometry = geostoreGeometry) {
    const applicationHeaders = {'content-type': 'application/json'};
    const headers = { process.env.gfwAuthHeader, ...applicationHeaders };
  
    const response = await fetch('https://data-api.globalforestwatch.org/geostore/', {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(geometry)
    });
  
    return await response.json();
  }