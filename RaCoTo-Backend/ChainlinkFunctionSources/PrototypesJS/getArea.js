async function getArea(geoStore = "f3ceac63-34cb-e9d6-e436-f0c42cafff10") {
  const gfwBaseURL = "https://data-api.globalforestwatch.org/" // Make sure to define the gfwBaseURL
  const requestedData = await fetch(`${gfwBaseURL}geostore/${geoStore}`)
  const json = await requestedData.json()
  return json["data"]["gfw_area__ha"]
}
