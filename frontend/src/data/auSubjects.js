// Anna University R2021 B.Tech Information Technology
// Official subject codes and titles — all 8 semesters
// Source: cac.annauniv.edu B.Tech.IT.pdf (Regulation 2021)

export const AU_SUBJECTS = {
  1:[
    {code:"HS3151",name:"Professional English – I",type:"theory",credits:3},
    {code:"MA3151",name:"Matrices and Calculus",type:"theory",credits:4},
    {code:"PH3151",name:"Engineering Physics",type:"theory",credits:3},
    {code:"CY3151",name:"Engineering Chemistry",type:"theory",credits:3},
    {code:"GE3151",name:"Problem Solving and Python Programming",type:"theory",credits:3},
    {code:"GE3171",name:"Problem Solving and Python Programming Lab",type:"lab",credits:2},
    {code:"BS3171",name:"Physics and Chemistry Laboratory",type:"lab",credits:2},
    {code:"GE3172",name:"English Laboratory",type:"lab",credits:1},
  ],
  2:[
    {code:"HS3251",name:"Professional English – II",type:"theory",credits:2},
    {code:"MA3251",name:"Statistics and Numerical Methods",type:"theory",credits:4},
    {code:"PH3256",name:"Physics for Information Science",type:"theory",credits:3},
    {code:"BE3251",name:"Basic Electrical and Electronics Engineering",type:"theory",credits:3},
    {code:"GE3251",name:"Engineering Graphics",type:"theory",credits:4},
    {code:"CS3251",name:"Programming in C",type:"theory",credits:3},
    {code:"GE3271",name:"Engineering Practices Laboratory",type:"lab",credits:2},
    {code:"CS3271",name:"Programming in C Laboratory",type:"lab",credits:2},
    {code:"GE3272",name:"Communication Laboratory / Foreign Language",type:"lab",credits:2},
  ],
  3:[
    {code:"MA3354",name:"Discrete Mathematics",type:"theory",credits:4},
    {code:"CS3351",name:"Digital Principles and Computer Organization",type:"theory",credits:4},
    {code:"CS3352",name:"Foundations of Data Science",type:"theory",credits:3},
    {code:"CD3291",name:"Data Structures and Algorithms",type:"theory",credits:3},
    {code:"CS3391",name:"Object Oriented Programming",type:"theory",credits:3},
    {code:"CD3281",name:"Data Structures and Algorithms Laboratory",type:"lab",credits:2},
    {code:"CS3381",name:"Object Oriented Programming Laboratory",type:"lab",credits:1},
    {code:"CS3361",name:"Data Science Laboratory",type:"lab",credits:2},
    {code:"GE3361",name:"Professional Development",type:"lab",credits:1},
  ],
  4:[
    {code:"CS3452",name:"Theory of Computation",type:"theory",credits:3},
    {code:"CS3491",name:"Artificial Intelligence and Machine Learning",type:"theory",credits:4},
    {code:"CS3492",name:"Database Management Systems",type:"theory",credits:3},
    {code:"IT3401",name:"Web Essentials",type:"theory",credits:4},
    {code:"CS3451",name:"Introduction to Operating Systems",type:"theory",credits:3},
    {code:"GE3451",name:"Environmental Sciences and Sustainability",type:"theory",credits:2},
    {code:"CS3461",name:"Operating Systems Laboratory",type:"lab",credits:1},
    {code:"CS3481",name:"Database Management Systems Laboratory",type:"lab",credits:1},
  ],
  5:[
    {code:"CS3591",name:"Computer Networks",type:"theory",credits:4},
    {code:"IT3501",name:"Full Stack Web Development",type:"theory",credits:3},
    {code:"CS3551",name:"Distributed Computing",type:"theory",credits:3},
    {code:"CS3691",name:"Embedded Systems and IoT",type:"theory",credits:3},
    {code:"IT3511",name:"Full Stack Web Development Laboratory",type:"lab",credits:2},
    {code:"CS3581",name:"Computer Networks and Security Laboratory",type:"lab",credits:2},
  ],
  6:[
    {code:"CCS356",name:"Object Oriented Software Engineering",type:"theory",credits:3},
    {code:"IT3601",name:"Cryptography and Network Security",type:"theory",credits:3},
    {code:"IT3002",name:"Professional Elective I",type:"elective",credits:3},
    {code:"IT3003",name:"Professional Elective II",type:"elective",credits:3},
    {code:"OE3001",name:"Open Elective I",type:"elective",credits:3},
    {code:"IT3681",name:"Mobile Application Development Laboratory",type:"lab",credits:2},
    {code:"IT3691",name:"Project Work Phase I",type:"lab",credits:2},
  ],
  7:[
    {code:"GE3791",name:"Human Values and Ethics",type:"theory",credits:3},
    {code:"IT3004",name:"Professional Elective III",type:"elective",credits:3},
    {code:"IT3005",name:"Professional Elective IV",type:"elective",credits:3},
    {code:"OE3002",name:"Open Elective II",type:"elective",credits:3},
    {code:"IT3781",name:"Project Work Phase II",type:"lab",credits:6},
  ],
  8:[
    {code:"IT3811",name:"Project Work / Internship",type:"lab",credits:12},
  ],
};

// Batch → pass-out year mapping
// Current year: 2025
// IV Year (2021 batch) → pass-out 2025
// III Year (2022 batch) → pass-out 2026
// II Year  (2023 batch) → pass-out 2027
// I Year   (2024 batch) → pass-out 2028
export const BATCHES = [
  {label:"2021–2025 Batch (IV Year)",passOut:2025,currentYear:"IV Year",sems:[1,2,3,4,5,6,7,8]},
  {label:"2022–2026 Batch (III Year)",passOut:2026,currentYear:"III Year",sems:[1,2,3,4,5,6]},
  {label:"2023–2027 Batch (II Year)", passOut:2027,currentYear:"II Year", sems:[1,2,3,4]},
  {label:"2024–2028 Batch (I Year)",  passOut:2028,currentYear:"I Year",  sems:[1,2]},
];

export const SECTIONS_BY_YEAR={
  "I Year":["A","B","C"],"II Year":["A","B","C"],
  "III Year":["A","B"],"IV Year":["A","B"],
};

// Generate mock result for a subject (seeded by code+section for consistency)
function seedRand(str){let h=0;for(const c of str)h=(Math.imul(31,h)+c.charCodeAt(0))|0;return(h>>>0)/4294967295;}

export function getMockResults(sem,section,batchPassOut){
  return AU_SUBJECTS[sem].map(s=>{
    const seed=seedRand(s.code+section+batchPassOut);
    const passP=Math.round(55+seed*42);
    const avg=Math.round(48+seed*38);
    const students=section==="C"?58:section==="B"?60:62;
    return{...s,passP,avgMarks:avg,arrears:Math.round(students*(1-passP/100))};
  });
}

export function getMockInternalResults(sem,section,batchPassOut){
  return AU_SUBJECTS[sem].filter(s=>s.type!=="lab").map(s=>{
    const seed=seedRand(s.code+section+batchPassOut+"int");
    return{
      ...s,
      avgT1:Math.round(50+seed*35),
      avgT2:Math.round(53+seed*35),
      avgT3:Math.round(55+seed*35),
    };
  });
}
