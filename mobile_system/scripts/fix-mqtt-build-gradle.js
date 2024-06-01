const fs = require('fs');
const filePath = 'node_modules/react-native-mqtt/android/build.gradle';

fs.readFile(filePath, 'utf8', (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  // Zamień wszystkie wystąpienia 'compile' na 'implementation'
  const result = data.replace(/\bcompile\b/g, 'implementation');

  fs.writeFile(filePath, result, 'utf8', (err) => {
    if (err) {
      console.error(err);
    }
  });
});

