document.addEventListener("DOMContentLoaded", function () {
  // Select all sections and buttons
  const sections = document.querySelectorAll('form[form-section="section"] section');
  const btnNext = document.querySelector('[form-section="btn-next"]');
  const btnBack = document.querySelector('[form-section="btn-back"]');
  const form = document.querySelector('form[form-section="section"]');
  
  // Initialize the current section index
  let currentSectionIndex = 0;

  // Function to scroll to a specific section and focus on the visible input
  function scrollToSection(index) {
    sections[index].scrollIntoView({ behavior: 'smooth' });
    focusVisibleInput(sections[index]);
  }

  // Function to focus on the first visible input in a section
  function focusVisibleInput(section) {
    const visibleInputs = section.querySelectorAll('input:not([type="hidden"]):not([style*="display: none"]), select:not([style*="display: none"]), textarea:not([style*="display: none"])');
    if (visibleInputs.length > 0) {
      visibleInputs[0].focus();
    }
  }

  // Disable regular scrolling for the form
  form.style.overflow = 'hidden';

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

  // Function to move to the next section
  function moveToNextSection() {
    if (currentSectionIndex < sections.length - 1) {
      currentSectionIndex++;
      scrollToSection(currentSectionIndex);
      updateButtonVisibility();
    }
  }

  // Function to move to the previous section
  function moveToPreviousSection() {
    if (currentSectionIndex > 0) {
      currentSectionIndex--;
      scrollToSection(currentSectionIndex);
      updateButtonVisibility();
    }
  }

  // Event listener for the Next button
  btnNext.addEventListener('click', moveToNextSection);

  // Event listener for the Back button
  btnBack.addEventListener('click', moveToPreviousSection);

  // Event listener for the Tab and Shift+Tab keys
  document.addEventListener('keydown', function(event) {
    if (event.key === 'Tab') {
      event.preventDefault(); // Prevent default tab behavior
      if (event.shiftKey) {
        moveToPreviousSection();
      } else {
        moveToNextSection();
      }
    }
  });

  // Event listener for the Enter key
  form.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
      event.preventDefault(); // Prevent form submission
      if (currentSectionIndex === sections.length - 1) {
        // If in the last section, allow form submission
        form.submit();
      } else {
        // Otherwise, move to the next section
        moveToNextSection();
      }
    }
  });

  // Ensure the page starts at the top
  window.scrollTo(0, 0);

  // Initialize button visibility and focus on the first input
  updateButtonVisibility();
  scrollToSection(currentSectionIndex);
});
</script>
<script>
document.addEventListener('DOMContentLoaded', function() {
  // Function to update the prices in the form based on the CMS data
  function updatePrices() {
    const cmsItems = document.querySelectorAll('[form-addon="cms"] [role="listitem"]');

    cmsItems.forEach(cmsItem => {
      const productName = cmsItem.querySelector('[data-product-name]').textContent.trim();
      const productPrice = cmsItem.querySelector('[data-product-price]').textContent.trim();

      const addonElements = document.querySelectorAll('[form-addon="addon"]');
      addonElements.forEach(addonElement => {
        if (addonElement.textContent.trim() === productName) {
          const parentTag = addonElement.closest('.form_check_tag-addon, .form_check_tag');
          if (parentTag) {
            const priceElement = parentTag.querySelector('[form-addon="price"]');
            if (priceElement) {
              priceElement.textContent = productPrice;
            }
          }
        }
      });
    });
  }

  // Function to update the addon names in the "addons" input field
  function updateAddonNames() {
    const addonElements = document.querySelectorAll('[extra="addon"] input[type="checkbox"]');
    const selectedAddons = [];

    addonElements.forEach(checkbox => {
      if (checkbox.checked) {
        selectedAddons.push(checkbox.name);
      }
    });

    document.getElementById('addons').value = selectedAddons.join(', ');
  }

  // Function to update the page names in the "pages" input field
  function updatePageNames() {
    const pageElements = document.querySelectorAll('[extra="pages"] input[type="checkbox"]');
    const selectedPages = [];

    pageElements.forEach(checkbox => {
      if (checkbox.checked) {
        selectedPages.push(checkbox.name);
      }
    });

    document.getElementById('pages').value = selectedPages.join(', ');
  }

  // Function to update the style names in the "styles" input field
  function updateStyleNames() {
    const styleElements = document.querySelectorAll('[extra="styles"] input[type="checkbox"]');
    const selectedStyles = [];

    styleElements.forEach(checkbox => {
      if (checkbox.checked) {
        selectedStyles.push(checkbox.name);
      }
    });

    document.getElementById('styles').value = selectedStyles.join(', ');
  }

  // Update estimate with base price, selected addons, styles, and urgency
  let basePrice = 0;
  let urgencyPrice = 0;

  function formatPrice(price) {
    return "USD " + price.toFixed(2);
  }

  function updateEstimate() {
    let total = basePrice;

    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
      if (checkbox.checked) {
        let priceElement;
        if (checkbox.closest('.form_check_tag-addon')) {
          priceElement = checkbox.closest('.form_check_tag-addon').querySelector('[form-addon="price"]');
        } else if (checkbox.closest('.form_check_tag')) {
          priceElement = checkbox.closest('.form_check_tag').querySelector('[form-addon="price"]');
        }

        if (priceElement) {
          let price = parseFloat(priceElement.textContent);

          // Check for multiplier attributes and apply multiplication
          const multiplierElement = checkbox.closest('[multiplier]');
          if (multiplierElement) {
            const multiplierType = multiplierElement.getAttribute('multiplier');
            let multiplierInput;

            if (multiplierType === 'revision') {
              multiplierInput = document.getElementById('revision-number');
              if (!multiplierInput.value) {
                multiplierInput.value = 1; // Set default value to 1
              }
            } else if (multiplierType === 'language') {
              multiplierInput = document.getElementById('language-number');
              if (!multiplierInput.value) {
                multiplierInput.value = 2; // Set default value to 2
              }
            }

            if (multiplierInput && multiplierInput.value) {
              const multiplierValue = parseInt(multiplierInput.value, 10);
              if (!isNaN(multiplierValue)) {
                price *= multiplierValue;
              }
            }
          }

          total += price;
        }
      }
    });

    total += urgencyPrice;
    estimateElement.textContent = formatPrice(total);

    // Update the hidden input field with the estimated price
    document.getElementById('estimated-price').value = total;
  }

  const cmsItems = document.querySelectorAll('[form-addon="cms"] [data-product-name]');
  cmsItems.forEach(item => {
    if (item.getAttribute('data-product-name') === "One and Done") {
      const price = parseFloat(item.nextElementSibling.getAttribute('data-product-price'));
      basePrice = price;
    }
  });

  const estimateElement = document.querySelector('[form-estimate="price"]');
  estimateElement.textContent = formatPrice(basePrice);

  const checkboxes = document.querySelectorAll('input[type="checkbox"]');
  checkboxes.forEach(checkbox => {
    checkbox.addEventListener('change', function() {
      updateEstimate();
      updateAddonNames(); // Update the addon names when any checkbox changes
      updatePageNames();  // Update the page names when any checkbox changes
      updateStyleNames(); // Update the style names when any checkbox changes
    });
  });

  // Add event listener to the input fields to update the estimate when the multiplier values change
  const multiplierInputs = document.querySelectorAll('#revision-number, #language-number');
  multiplierInputs.forEach(input => {
    input.addEventListener('input', function() {
      updateEstimate();
    });
  });

  // Add event listener to the select field for urgency
  const urgencySelect = document.getElementById('select-urgency');
  urgencySelect.addEventListener('change', function () {
    const selectedValue = urgencySelect.value;

    if (selectedValue === '7-days') {
      urgencyPrice = 899;
    } else if (selectedValue === '1-month') {
      urgencyPrice = 499;
    } else {
      urgencyPrice = 0;
    }

    updateEstimate();
  });

  // Initial updates on page load
  updatePrices();
  updateEstimate();
  updateAddonNames();
  updatePageNames();
  updateStyleNames();
});
