
// This file contains dummy data for development purposes
// It will be replaced with actual data loading from CSV files later

export const themes = [
  {
    id: "well-being",
    name: "Well-being (Core Focus)",
    variableCount: 7,
  },
  {
    id: "socioeconomic",
    name: "Socio-economic Background",
    variableCount: 5,
  },
  {
    id: "demographics",
    name: "Student Demographics",
    variableCount: 2,
  },
  {
    id: "performance",
    name: "School Performance",
    variableCount: 3,
  },
];

export const variables = [
  {
    id: "BELONG",
    name: "Sense of belonging at school",
    description: "Measures students' feelings of acceptance and connectedness at school.",
    theme: "well-being",
    type: "bar",
  },
  {
    id: "BULLIED",
    name: "Exposure to bullying",
    description: "Measures students' experiences with different forms of bullying.",
    theme: "well-being",
    type: "bar",
  },
  {
    id: "FAMSUP",
    name: "Family support",
    description: "Measures the level of emotional support that students receive from their families.",
    theme: "well-being",
    type: "bar",
  },
  {
    id: "FEELSAFE",
    name: "Feeling safe at school",
    description: "Measures students' perceptions of safety within the school environment.",
    theme: "well-being",
    type: "bar",
  },
  {
    id: "ESCS",
    name: "Economic, Social and Cultural Status",
    description: "Composite index of family socioeconomic background.",
    theme: "socioeconomic",
    type: "bar",
  },
  {
    id: "PV1MATH",
    name: "Math Performance",
    description: "First plausible value of student performance in mathematics.",
    theme: "performance",
    type: "bar",
  },
];

// Updated to European countries only
export const europeanCountries = [
  { code: "ALB", name: "Albania", lat: 41.153332, lng: 20.168331 },
  { code: "AUT", name: "Austria", lat: 47.516231, lng: 14.550072 },
  { code: "BEL", name: "Belgium", lat: 50.503887, lng: 4.469936 },
  { code: "BGR", name: "Bulgaria", lat: 42.733883, lng: 25.48583 },
  { code: "HRV", name: "Croatia", lat: 45.1, lng: 15.2 },
  { code: "CYP", name: "Cyprus", lat: 35.126413, lng: 33.429859 },
  { code: "CZE", name: "Czech Republic", lat: 49.817492, lng: 15.472962 },
  { code: "DNK", name: "Denmark", lat: 56.26392, lng: 9.501785 },
  { code: "EST", name: "Estonia", lat: 58.595272, lng: 25.013607 },
  { code: "FIN", name: "Finland", lat: 61.92411, lng: 25.748151 },
  { code: "FRA", name: "France", lat: 46.227638, lng: 2.213749 },
  { code: "DEU", name: "Germany", lat: 51.165691, lng: 10.451526 },
  { code: "GRC", name: "Greece", lat: 39.074208, lng: 21.824312 },
  { code: "HUN", name: "Hungary", lat: 47.162494, lng: 19.503304 },
  { code: "ISL", name: "Iceland", lat: 64.963051, lng: -19.020835 },
  { code: "IRL", name: "Ireland", lat: 53.41291, lng: -8.24389 },
  { code: "ITA", name: "Italy", lat: 41.87194, lng: 12.56738 },
  { code: "LVA", name: "Latvia", lat: 56.879635, lng: 24.603189 },
  { code: "LTU", name: "Lithuania", lat: 55.169438, lng: 23.881275 },
  { code: "LUX", name: "Luxembourg", lat: 49.815273, lng: 6.129583 },
  { code: "MLT", name: "Malta", lat: 35.937496, lng: 14.375416 },
  { code: "NLD", name: "Netherlands", lat: 52.132633, lng: 5.291266 },
  { code: "NOR", name: "Norway", lat: 60.472024, lng: 8.468946 },
  { code: "POL", name: "Poland", lat: 51.919438, lng: 19.145136 },
  { code: "PRT", name: "Portugal", lat: 39.399872, lng: -8.224454 },
  { code: "ROU", name: "Romania", lat: 45.943161, lng: 24.96676 },
  { code: "SVK", name: "Slovakia", lat: 48.669026, lng: 19.699024 },
  { code: "SVN", name: "Slovenia", lat: 46.151241, lng: 14.995463 },
  { code: "ESP", name: "Spain", lat: 40.463667, lng: -3.74922 },
  { code: "SWE", name: "Sweden", lat: 60.128161, lng: 18.643501 },
  { code: "CHE", name: "Switzerland", lat: 46.818188, lng: 8.227512 },
  { code: "GBR", name: "United Kingdom", lat: 55.378051, lng: -3.435973 },
];

// Sample data for the map
export const sampleMapData = {
  BELONG: {
    "FIN": 0.67,
    "EST": 0.52,
    "NOR": 0.43,
    "SWE": 0.35,
    "DNK": 0.31,
    "CHE": 0.25,
    "NLD": 0.21,
    "DEU": 0.14,
    "GBR": 0.05,
    "FRA": -0.09,
    "ESP": -0.12,
    "ITA": -0.17,
    "BGR": -0.29,
  },
  BULLIED: {
    "FIN": -0.45,
    "EST": -0.30,
    "NOR": -0.55,
    "SWE": -0.42,
    "DNK": -0.39,
    "CHE": -0.20,
    "NLD": -0.29,
    "DEU": -0.05,
    "GBR": 0.12,
    "FRA": 0.22,
    "ESP": 0.15,
    "ITA": 0.25,
    "BGR": 0.35,
  },
  PV1MATH: {
    "FIN": 504,
    "EST": 523,
    "NOR": 454,
    "SWE": 478,
    "DNK": 489,
    "CHE": 515,
    "NLD": 495,
    "DEU": 475,
    "GBR": 473,
    "FRA": 474,
    "ESP": 473,
    "ITA": 471,
    "BGR": 426,
  }
};

