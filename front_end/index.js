

let value = "__session=MTczOTQzMDEyN3xEWDhFQVFMX2dBQUJFQUVRQUFEX3FmLUFBQVFHYzNSeWFXNW5EQWtBQjNWelpYSmZhV1FHYzNSeWFXNW5EQm9BR0RZM1lXUTVORGRpWVRBd05UYzRNbU0wWXpObFpXSXpZd1p6ZEhKcGJtY01Cd0FGWlcxaGFXd0djM1J5YVc1bkRCY0FGV2xoYld4MVkybGtOalk1UUdkdFlXbHNMbU52YlFaemRISnBibWNNQmdBRWJtRnRaUVp6ZEhKcGJtY01Cd0FGVEhWamFXUUdjM1J5YVc1bkRBOEFEV0YxZEdobGJuUnBZMkYwWldRRVltOXZiQUlDQUFFPXxLHwhtIw3wQ51YY0O40qqSHJs0qQ1XNsaxAd_cTs1yDg=="
const sampleTestData = [
    {
      _id: "1",
      createdAt: new Date("2023-01-05"),
      date: new Date("2023-01-05"),
      totalMarks: 100,
      passMarks: 60,
      totalQuestions: 20,
      testData: {},
      submittedBy: "user1",
    },
    {
      _id: "2",
      createdAt: new Date("2023-01-12"),
      date: new Date("2023-01-12"),
      totalMarks: 50,
      passMarks: 30,
      totalQuestions: 10,
      testData: {},
      submittedBy: "user1",
    },
    {
      _id: "3",
      createdAt: new Date("2023-01-19"),
      date: new Date("2023-01-19"),
      totalMarks: 100,
      passMarks: 60,
      totalQuestions: 20,
      testData: {},
      submittedBy: "user1",
    },
    {
      _id: "4",
      createdAt: new Date("2023-01-26"),
      date: new Date("2023-01-26"),
      totalMarks: 50,
      passMarks: 20,
      totalQuestions: 20,
      testData: {},
      submittedBy: "user1",
    },
    {
      _id: "5",
      createdAt: new Date("2023-02-02"),
      date: new Date("2023-02-02"),
      totalMarks: 200,
      passMarks: 120,
      totalQuestions: 40,
      testData: {},
      submittedBy: "user1",
    },
  ]

  const newStore  = {
    _id: "5",
    createdAt: new Date("2023-02-02"),
    date: new Date("2023-02-02"),
    totalMarks: 200,
    passMarks: 120,
    totalQuestions: 40,
    testData: {
        "userId" : {"score" : 2, 'full' : 4},
        "userId2" : {2 : 5 , 6 : 6}
    },
    submittedBy: "user1",
  }
  




// console.log(session_name, session_token)
