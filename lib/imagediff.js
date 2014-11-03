var
  spawn = require('child_process').spawn,
  temp = require('temp');

function parseOutput(output, outputFile) {
  return {
    path: outputFile
  };
}

module.exports = function(options, callback) {

  var
    outputFile = temp.path({
      suffix: '.png'
    }),
    child = spawn('perceptualdiff', [options.fimg, options.simg, '-output', outputFile, '-verbose']),

    stdout = child.stdout,
    stderr = child.stderr,
    output = '';
  console.log(child);
  stdout.setEncoding('utf8');
  stderr.setEncoding('utf8');

  stderr.on('data', function(data) {
    console.log("error" + data);
    return callback(data, null);
  });
  // buffer the stdout output
  stdout.on('data', function(data) {
    output += data;
  });
  stdout.on('close', function() {
    console.log("output" + output);
    return callback(null, parseOutput(output, outputFile));
  });
};