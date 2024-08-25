document.addEventListener('DOMContentLoaded', function() {
  function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
  }

  function filterAndRemoveCMSItems(clientId) {
    const cmsItems = document.querySelectorAll('[cms="status"] .w-dyn-item');
    let matchedItemFound = false;

    cmsItems.forEach(item => {
      const itemClientId = item.getAttribute('data-client-id');
      if (itemClientId === clientId) {
        matchedItemFound = true;
      } else {
        item.remove(); // Completely remove non-matching items from the DOM
      }
    });

    return matchedItemFound;
  }

  const clientId = getUrlParameter('clientId');

  if (clientId) {
    console.log(`Filtering CMS items with clientId: ${clientId}`);
    const matchedItemFound = filterAndRemoveCMSItems(clientId);

    if (matchedItemFound) {
      console.log('Matching item found, displaying content.');
      document.body.style.visibility = 'visible'; // Make the body visible
    } else {
      console.log('No matching client ID found in CMS items, redirecting to 404.');
      window.location.href = '/404'; // Redirect to the 404 error page
    }
  } else {
    console.log('No client ID provided in URL, redirecting to 404.');
    window.location.href = '/404'; // Redirect to the 404 error page
  }
});
