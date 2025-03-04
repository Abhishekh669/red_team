

// let value = "__session=MTczOTQzMDEyN3xEWDhFQVFMX2dBQUJFQUVRQUFEX3FmLUFBQVFHYzNSeWFXNW5EQWtBQjNWelpYSmZhV1FHYzNSeWFXNW5EQm9BR0RZM1lXUTVORGRpWVRBd05UYzRNbU0wWXpObFpXSXpZd1p6ZEhKcGJtY01Cd0FGWlcxaGFXd0djM1J5YVc1bkRCY0FGV2xoYld4MVkybGtOalk1UUdkdFlXbHNMbU52YlFaemRISnBibWNNQmdBRWJtRnRaUVp6ZEhKcGJtY01Cd0FGVEhWamFXUUdjM1J5YVc1bkRBOEFEV0YxZEdobGJuUnBZMkYwWldRRVltOXZiQUlDQUFFPXxLHwhtIw3wQ51YY0O40qqSHJs0qQ1XNsaxAd_cTs1yDg=="
// const sampleTestData = [
//     {
//       _id: "1",
//       createdAt: new Date("2023-01-05"),
//       date: new Date("2023-01-05"),
//       totalMarks: 100,
//       passMarks: 60,
//       totalQuestions: 20,
//       testData: {},
//       submittedBy: "user1",
//     },
//     {
//       _id: "2",
//       createdAt: new Date("2023-01-12"),
//       date: new Date("2023-01-12"),
//       totalMarks: 50,
//       passMarks: 30,
//       totalQuestions: 10,
//       testData: {},
//       submittedBy: "user1",
//     },
//     {
//       _id: "3",
//       createdAt: new Date("2023-01-19"),
//       date: new Date("2023-01-19"),
//       totalMarks: 100,
//       passMarks: 60,
//       totalQuestions: 20,
//       testData: {},
//       submittedBy: "user1",
//     },
//     {
//       _id: "4",
//       createdAt: new Date("2023-01-26"),
//       date: new Date("2023-01-26"),
//       totalMarks: 50,
//       passMarks: 20,
//       totalQuestions: 20,
//       testData: {},
//       submittedBy: "user1",
//     },
//     {
//       _id: "5",
//       createdAt: new Date("2023-02-02"),
//       date: new Date("2023-02-02"),
//       totalMarks: 200,
//       passMarks: 120,
//       totalQuestions: 40,
//       testData: {},
//       submittedBy: "user1",
//     },
//   ]

//   const newStore  = {
//     _id: "5",
//     createdAt: new Date("2023-02-02"),
//     date: new Date("2023-02-02"),
//     totalMarks: 200,
//     passMarks: 120,
//     totalQuestions: 40,
//     testData: {
//         "userId" : {"score" : 2, 'full' : 4},
//         "userId2" : {2 : 5 , 6 : 6}
//     },
//     submittedBy: "user1",
//   }
  


const crypto = require('crypto');
const readline = require('readline');
const fs = require('fs');

// File to store user data
const dataFile = 'userData.json';

// Helper functions
function convertToHex(str) {
  return str.split('').map((char) => char.charCodeAt(0).toString(16).padStart(2, '0')).join('').toUpperCase();
}

function convertToBase64(hex) {
  return Buffer.from(hex, 'hex').toString('base64').replace(/=/g, '');
}

function generateSHA512(str) {
  const hash = crypto.createHash('sha512');
  hash.update(str);
  return hash.digest('hex').substring(0, 32); // Truncate to 32 bytes (64 characters)
}

function getPublicId(fullName, codeName, dob, number) {
  const concatenatedBase64 = [
    convertToBase64(convertToHex('TMONR')),
    convertToBase64(convertToHex(fullName)),
    convertToBase64(convertToHex(codeName)),
    convertToBase64(convertToHex(dob)),
    convertToBase64(convertToHex(number.toString())),
  ].join('');

  return generateSHA512(concatenatedBase64);
}

function processData(fullName, codeName, dob, password, number) {
  const concatenatedBase64 = [
    convertToBase64(convertToHex('TMONR')),
    convertToBase64(convertToHex(fullName)),
    convertToBase64(convertToHex(codeName)),
    convertToBase64(convertToHex(dob)),
    convertToBase64(convertToHex(password)),
    convertToBase64(convertToHex(number.toString())),
  ].join('');

  return generateSHA512(concatenatedBase64);
}

// Store data in a file
function storeUserData(publicId, privateId, fullName, codeName, dob, number, password) {
    let data = {};
    if (fs.existsSync(dataFile)) {
      data = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
    }
    data[publicId] = { fullName, codeName, dob, number, privateId, password };
    fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
    console.log("Data successfully stored!");
  }
  

// Read input from the user
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question('Enter full name: ', (fullName) => {
  rl.question('Enter code name: ', (codeName) => {
    rl.question('Enter date of birth (YYYY-MM-DD): ', (dob) => {
      rl.question('Enter password: ', (password) => {
        rl.question('Enter phone number: ', (number) => {
          const publicId = getPublicId(fullName, codeName, dob, number);
          const privateId = processData(fullName, codeName, dob, password, number);

          storeUserData(publicId, privateId, fullName, codeName, dob, number, password);
          console.log('Generated IDs:');
          console.log('Public ID (StudentId):', publicId);
          console.log('Private ID:', privateId);

          rl.close();
        });
      });
    });
  });
});






