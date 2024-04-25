// Assume initialConfig is set based on the server's configuration
    let initialConfig = {
      autoRestart: {
        status: false,
        time: 40,
        note: 'BOT IS ABOUT TO RESTART',
      },
    };

    // Set the initial values on page load
    document.querySelector(`input[name="autoRestart"][value="${initialConfig.autoRestart.status}"]`).checked = true;
    document.querySelector('input[name="time"]').value = initialConfig.autoRestart.time;

    function saveConfig() {
      const formData = new FormData(document.getElementById('configForm'));
      const autoRestart = formData.get('autoRestart');
      const time = formData.get('time');
      const config = { autoRestart, time };

      // Simulate updating the initialConfig with the new values
      initialConfig = { ...initialConfig, autoRestart: { status: autoRestart === 'true', time: parseInt(time) } };

      // Use fetch to send the configuration to your server
      fetch('/api/saveConfig', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ config }),
      })
      .then(response => response.json())
      .then(data => {
        alert(data.message);
      })
      .catch(error => {
        console.error('Error saving config:', error);
      });
    }