async function uploadFile() {
  const fileInput = document.getElementById('fileInput');
  const fileList = document.getElementById('fileList');

  const file = fileInput.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append('uploadedFile', file);

  try {
    const response = await fetch('/api/uploadFile', {
      method: 'POST',
      body: formData,
    });

    const result = await response.json();
    if (result.success) {
      alert('File uploaded successfully.');
      loadFiles();
    } else {
      alert('Error uploading file.');
    }
  } catch (error) {
    console.error('Error uploading file:', error);
    alert('Error uploading file.');
  }
}

async function deleteFile(fileName) {
  try {
    const response = await fetch(`/api/deleteFile/${fileName}`, {
      method: 'DELETE',
    });

    const result = await response.json();
    if (result.success) {
      alert('File deleted successfully.');
      loadFiles();
    } else {
      alert('Error deleting file.');
    }
  } catch (error) {
    console.error('Error deleting file:', error);
    alert('Error deleting file.');
  }
}
/*
async function loadFiles() {
  const fileList = document.getElementById('fileList');

  try {
    const response = await fetch('/api/getUploadedFiles');
    const result = await response.json();

    fileList.innerHTML = result.files.map(fileName => {
      return `<li>${fileName} <button onclick="deleteFile('${fileName}')">Delete</button></li>`;
    }).join('');
  } catch (error) {
    console.error('Error fetching uploaded files:', error);
    alert('Error fetching uploaded files.');
  }
}
*/
async function loadFiles() {
  const fileList = document.getElementById('fileList');

  try {
    const response = await fetch('/api/getFiles');
    const result = await response.json();

    fileList.innerHTML = result.files.map(fileName => {
      return `<li>${fileName} <button onclick="deleteFile('${fileName}')">Delete</button></li>`;
    }).join('');
  } catch (error) {
    console.error('Error fetching files:', error);
    alert('Error fetching files.');
  }
} 
// Load files when the page loads
loadFiles();