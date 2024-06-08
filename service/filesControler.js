const NodeCache = require('node-cache');
const { spawn } = require('child_process');

const cache = new NodeCache();

function upLoadFile(email, file, model="default", callback) {
  // Modify the command to pass the selected model as an argument
  const python_process = spawn('python3', ['service/runModel.py', model]);
  console.log("run model");

  let result = ''; // Accumulate the data

  python_process.stdout.on('data', (data) => {
    const newData = data.toString();
    console.log("model data:", newData);
    result += newData; // Accumulate the data
  });

  // When the process ends, call the callback with the accumulated data
  python_process.on('close', (code) => {
    callback(result);
  });
  console.log("end run model");
}


module.exports = {
  upLoadFile,
};
