const NodeCache = require('node-cache');
const { spawn } = require('child_process');

const cache = new NodeCache();

function upLoadFile(email, file, callback) {
  const python_process = spawn('python3', ['service/runModel.py']);
  console.log("run model");

  let result = ''; // Accumulate the data

  python_process.stdout.on('data', (data) => {
    const newData = data.toString();
    console.log(newData);
    result += newData; // Accumulate the data
  });

  // When the process ends, call the callback with the accumulated data
  python_process.on('close', (code) => {
    callback(result);
  });
}

module.exports = {
  upLoadFile,
};
