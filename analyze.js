const fs = require('fs');
const path = require('path');

// Función recursiva para listar archivos
function listFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  files.forEach((file) => {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      listFiles(filePath, fileList);
    } else {
      fileList.push(filePath);
    }
  });
  return fileList;
}

// Analiza el proyecto
const projectFiles = listFiles(process.cwd());
console.log('Archivos en el proyecto:');
projectFiles.forEach((file) => console.log(file));

// Verifica si hay archivos vacíos
console.log('\nArchivos vacíos o incompletos:');
projectFiles.forEach((file) => {
  const stats = fs.statSync(file);
  if (stats.size === 0) {
    console.log(`${file} - Vacío`);
  } else if (stats.size < 100) {
    console.log(`${file} - Posiblemente incompleto`);
  }
});
