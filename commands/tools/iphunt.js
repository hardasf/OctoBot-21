const axios = require('axios');

module.exports = async function ({ dstryr, event, parameters }) {
  try {
    const parameterSearch = parameters.join(' ');

    if (!parameterSearch) {
      dstryr.sendMessage('Please provide a parameter for the IP lookup.', event.threadID);
      return;
    }

    const apiUrl = `https://ipinfo.io/${encodeURIComponent(parameterSearch)}/geo`;
    const response = await axios.get(apiUrl);

    const {
      ip,
      city,
      region,
      country,
      loc,
      org,
      postal,
      timezone
    } = response.data;

    const infoMessage = `IP: ${ip}\nCity: ${city}\nRegion: ${region}\nCountry: ${country}\nLocation: ${loc}\nOrganization: ${org}\nPostal Code: ${postal}\nTimezone: ${timezone}`;

    dstryr.sendMessage(infoMessage, event.threadID);
  } catch (error) {
    console.error(error);
    dstryr.sendMessage('An error occurred while fetching IP information. 🥺', event.threadID);
  }
};
