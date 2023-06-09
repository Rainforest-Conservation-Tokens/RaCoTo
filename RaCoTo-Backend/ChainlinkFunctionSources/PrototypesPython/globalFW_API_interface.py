import requests
import json
import pandas as pd
from dotenv import dotenv_values
import time, datetime

gfwBaseURL = 'https://data-api.globalforestwatch.org/'
applicationHeaders = {'content-type': 'application/json'}
geostoreGeometry = '{ "geometry": { "type": "string", "coordinates": [ [ [   -64.48111132990033,              -7.26380551976348             ],            [              -64.5836061807908,              -7.807104232575085             ],             [              -63.56702459848742,              -7.813321216519867            ],            [              -63.48335533245408,              -7.245130631814632            ],            [              -64.48111132990033,              -7.26380551976348            ]          ]        ],        "type": "Polygon"      }}'


def getGFWConfig(file: str = '.env'):
    config = dotenv_values(file)
    return config

def createGeostoreIDfromGeometry(geometry: str = geostoreGeometry):
    config = getGFWConfig()
    response = requests.post(
        url = 'https://data-api.globalforestwatch.org/geostore/', 
        headers= {'Authorization' : config['gfwAuthHeader'] } | applicationHeaders, data=geometry)
    return response.json()

def getArea(
        geoJSON:str = "f3ceac63-34cb-e9d6-e436-f0c42cafff10"
    ):
    requestedData=requests.get(url=f'{gfwBaseURL}geostore/{geoJSON}')
    return requestedData.json()['data']['gfw_area__ha']

def getDataSetUrl(
        baseURL: str = gfwBaseURL, 
        datasetName: str = 'umd_glad_sentinel2_alerts',
        datasetVersion: str = 'latest') -> str:
    return f"{baseURL}dataset/{datasetName}/{datasetVersion}"

def getDataSetFields(datasetURL: str):
    config = getGFWConfig()
    headers = {'Authorization' : config['gfwAuthHeader']}  | applicationHeaders  
    return requests.get(url=f"{datasetURL}/fields", headers= headers).json()


def queryCO2NetFlux(
        datasetURL: str = 'https://data-api.globalforestwatch.org/dataset/gfw_forest_carbon_net_flux/latest', 
        geoJSON: str = "f3ceac63-34cb-e9d6-e436-f0c42cafff10",
        field: str = 'gfw_forest_carbon_net_flux__Mg_CO2e', #gfw_forest_carbon_net_flux__Mg_CO2e', #wur_radd_alerts
        lastClaim: float|int = 1680300000.0 # 1st of April '23
    ) -> int:
    config = getGFWConfig()
    headers = {'Authorization' : config['gfwAuthHeader']}  | applicationHeaders  
    data = {
        "sql" : f"SELECT SUM({field}) FROM results",
        "geostore_id" : geoJSON,   
        "geostore_origin" : "gfw"
    }
    # get the net co2 flux for the patch
    requestedData=requests.get(url=f'{datasetURL}/query/json', params= data, headers=headers)

    # need to add deforestation area queries. claim should only be possible until the most recent available deforestation alerts.

    # return CO2 absorption in tonnes for the time since the last claim
    return int((time.time()-lastClaim)/662256000 * requestedData.json()['data'][0]['gfw_forest_carbon_net_flux__Mg_CO2e'])

def queryDeforestationAlerts(
        datasetURL: str = 'https://data-api.globalforestwatch.org/dataset/umd_glad_sentinel2_alerts/latest', 
        geoJSON: str = "f3ceac63-34cb-e9d6-e436-f0c42cafff10",
        fromDate: str = "2023-04-01",
        endDate: str = "2023-04-30",
        confidence: str = 'high', # ['nominal', 'high', 'highest', 'not_detected'] but highest seems to not exist
        field: str = 'umd_glad_sentinel2_alerts', #wur_radd_alerts
    ):
    config = getGFWConfig()
    headers = {'Authorization' : config['gfwAuthHeader']}  | applicationHeaders  
    data = {
        "sql" : f"SELECT {field}__date, {field}__confidence FROM results WHERE {field}__confidence == '{confidence}' AND {field}__date >= '{fromDate}' AND {field}__date <='{endDate}'",
        "geostore_id" : geoJSON,   
        "geostore_origin" : "gfw"
    }
    requestedData=requests.get(url=f'{datasetURL}/query/json', params= data, headers=headers)
    return requestedData.json()