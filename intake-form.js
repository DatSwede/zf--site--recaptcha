  document.addEventListener("DOMContentLoaded", function () {
    // Select all sections and buttons
    const sections = document.querySelectorAll('form[form-section="section"] section');
    const btnNext = document.querySelector('[form-section="btn-next"]');
    const btnBack = document.querySelector('[form-section="btn-back"]');
    
    // Initialize the current section index
    let currentSectionIndex = 0;

    // Function to scroll to a specific section
    function scrollToSection(index) {
      sections[index].scrollIntoView({ behavior: 'smooth' });
    }

    // Disable regular scrolling for the form
    document.querySelector('form[form-section="section"]').style.overflow = 'hidden';

    // Function to update button visibility
    function updateButtonVisibility() {
      if (currentSectionIndex === 0) {
        btnBack.style.pointerEvents = 'none';
        btnBack.style.opacity = '0';
      } else {
        btnBack.style.pointerEvents = 'auto';
        btnBack.style.opacity = '1';
      }

      if (currentSectionIndex === sections.length - 1) {
        btnNext.style.pointerEvents = 'none';
        btnNext.style.opacity = '0';
      } else {
        btnNext.style.pointerEvents = 'auto';
        btnNext.style.opacity = '1';
      }
    }

    // Event listener for the Next button
    btnNext.addEventListener('click', function () {
      if (currentSectionIndex < sections.length - 1) {
        currentSectionIndex++;
        scrollToSection(currentSectionIndex);
        updateButtonVisibility();
      }
    });

    // Event listener for the Back button
    btnBack.addEventListener('click', function () {
      if (currentSectionIndex > 0) {
        currentSectionIndex--;
        scrollToSection(currentSectionIndex);
        updateButtonVisibility();
      }
    });

    // Ensure the page starts at the top
    window.scrollTo(0, 0);

    // Initialize button visibility
    updateButtonVisibility();
  });
</script>
<script>
document.addEventListener('DOMContentLoaded', function () {
  const form = document.querySelector('form');
  const clientIdInput = document.querySelector('[name="client-ID"]');
  const idFalse = document.querySelector('[form-upload="id-false"]');
  const idValid = document.querySelector('[form-upload="id-valid"]');
  const disableElem = document.querySelector('[form-upload="disable"]');
  const uploadBtn = document.querySelector('[form-upload="upload-btn"]');
  const statusText = document.querySelector('[form-upload="status-text"]');
  const statusIdText = document.querySelector('[form-upload="status-id"]');
  const progressWrap = document.querySelector('[form-upload="progress-wrap"]');
  const progressBar = document.querySelector('[form-upload="progress-bar"]');
  const fileListTextArea = document.getElementById('file-list'); // Reference to the textarea

  const validateClientIdUrl = 'https://charming-bonbon-eb7a90.netlify.app/.netlify/functions/validate-and-upload';
  const getWebhookUrl = 'https://charming-bonbon-eb7a90.netlify.app/.netlify/functions/get-webhook-url';

  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.style.display = 'none';
  document.body.appendChild(fileInput);

  const handleInput = async function () {
    idFalse.style.display = 'none';
    idValid.style.display = 'none';
    disableElem.style.display = 'block';
    uploadBtn.style.display = 'none';
    statusIdText.textContent = 'Validating client ID...';

    const clientId = clientIdInput.value;
    if (clientId.length === 6) {
      try {
        const response = await fetch(validateClientIdUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ clientId }),
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const result = await response.json();

        if (result.clientExists) {
          idFalse.style.display = 'none';
          idValid.style.display = 'block';
          disableElem.style.display = 'none';
          uploadBtn.style.display = 'block';
          statusIdText.textContent = 'Client ID validated. You can now upload a file.';
        } else {
          idFalse.style.display = 'block';
          idValid.style.display = 'none';
          disableElem.style.display = 'block';
          uploadBtn.style.display = 'none';
          statusIdText.textContent = 'Invalid client ID. Please try again.';
        }
      } catch (error) {
        console.error('Error:', error);
        statusIdText.textContent = 'An error occurred. Please try again later.';
      }
    } else {
      statusIdText.textContent = 'Please enter a 6-character client ID.';
    }
  };

  clientIdInput.addEventListener('input', handleInput);
  clientIdInput.addEventListener('paste', (e) => {
    setTimeout(handleInput, 0);
  });

  uploadBtn.addEventListener('click', () => {
    fileInput.click();
  });

  fileInput.addEventListener('change', async function (event) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async function (e) {
        try {
          const fileContent = btoa(new Uint8Array(e.target.result).reduce((data, byte) => data + String.fromCharCode(byte), ''));
          const fileName = file.name;
          progressWrap.style.display = 'flex';
          statusText.textContent = `0% ${fileName}`;
          progressBar.style.width = '0%';

          const webhookResponse = await fetch(getWebhookUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              clientId: clientIdInput.value,
            }),
          });

          if (!webhookResponse.ok) {
            throw new Error('Failed to fetch webhook URL');
          }

          const { webhookUrl } = await webhookResponse.json();

          const formData = new FormData(form);
          const payload = {
            clientId: clientIdInput.value,
            fileName,
            fileContent,
          };

          formData.forEach((value, key) => {
            payload[key] = value;
          });

          const uploadResponse = await fetch(webhookUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
          });

          if (!uploadResponse.ok) {
            throw new Error('Upload failed');
          }

          progressBar.style.width = '100%';
          statusText.textContent = `100% ${fileName} - Upload complete`;

          // Add file name to the textarea
          if (fileListTextArea.value) {
            fileListTextArea.value += `, ${fileName}`;
          } else {
            fileListTextArea.value = fileName;
          }

          // Append the file name to the file list
          const fileListItem = document.querySelector('[form-upload="file-list-item"]');
          if (fileListItem && fileListItem.textContent === 'No files uploaded') {
            fileListItem.textContent = fileName;
          } else {
            const newFileListItem = document.createElement('div');
            newFileListItem.setAttribute('form-upload', 'file-list-item');
            newFileListItem.textContent = fileName;
            document.querySelector('[form-upload="file-list"]').appendChild(newFileListItem);
          }

          progressWrap.style.display = 'none';
        } catch (error) {
          console.error('Upload error:', error);
          statusText.textContent = `Upload failed: ${error.message}`;
          progressWrap.style.display = 'none'; // Hide the progress bar on error
        }
      };
      reader.readAsArrayBuffer(file);
    }
  });
});
