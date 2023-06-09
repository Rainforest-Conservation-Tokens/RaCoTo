const geoJSON = args[0]
const lastClaim = args[1]

const datasetURL = "https://data-api.globalforestwatch.org/dataset/gfw_forest_carbon_net_flux/latest"
const field = "gfw_forest_carbon_net_flux__Mg_CO2e"
const applicationHeaders = { "content-type": "application/json" }
const authHeaders = { Authorization: secrets.gfwAuthHeader }

const headers = { ...authHeaders, ...applicationHeaders }
const data = {
  sql: `SELECT SUM(${field}) FROM results`,
  geostore_id: geoJSON,
  geostore_origin: "gfw",
}

// get the net co2 flux for the patch
const globalforestwatch = Functions.makeHttpRequest({
  url: `${datasetURL}/query/json`,
  method: "GET",
  headers: headers,
  params: data,
  timeout: "10000ms",
})
const globalforestwatchResponse = await globalforestwatch
let netCO2Flux = 0
if (!globalforestwatchResponse.error) {
  netCO2Flux = Math.floor(
    ((Date.now() / 1000 - lastClaim) / 662256000) *
      globalforestwatchResponse["data"]["data"][0]["gfw_forest_carbon_net_flux__Mg_CO2e"]
  )
} else {
  ;("Global Forest Watch API query for net CO2 flux failed.")
}
// need to add deforestation area queries. claim should only be possible until the most recent available deforestation alerts.
// return CO2 absorption in tonnes for the time since the last claim
return Functions.encodeUint256(Math.abs(Math.round(netCO2Flux)))
