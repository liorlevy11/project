const NodeCache = require('node-cache');
const { spawn } = require('child_process');

const cache = new NodeCache();

function upLoadFile(email, file, model="default", callback) {
  //console.log('test2');
  const python_process = spawn('python', ['../service/runModel.py', model]);

  console.log("run model");

  let result = ''; // Accumulate the data

  python_process.stdout.on('data', (data) => {
    const newData = data.toString();
    console.log("model data:", newData);
    result += newData; // Accumulate the data
  });

  python_process.stderr.on('data', (error) => {
    console.error(`stderr: ${error}`);
  });

  python_process.on('close', (code) => {
    callback(result);
  });

  console.log("end run model");
}

function upLoadFileForMalCheck(email, file, callback) {
  const python_process = spawn('python', ['../service/detectMalware.py']);

  console.log("run MalCheck");

  let result = ''; // Accumulate the data

  python_process.stdout.on('data', (data) => {
    const newData = data.toString();
    result += newData; // Accumulate the data
  });

  python_process.stderr.on('data', (error) => {
    console.error(`stderr: ${error}`);
  });

  python_process.on('close', (code) => {
    callback(result);
    return result;
  });

  console.log("end run Malcheck");
}

module.exports = {
  upLoadFile,
  upLoadFileForMalCheck,
};
