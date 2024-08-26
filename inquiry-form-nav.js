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
    const targetSection = sections[index];
    const targetRect = targetSection.getBoundingClientRect();
    const scrollContainer = form;
    const containerRect = scrollContainer.getBoundingClientRect();

    const targetTop = targetRect.top - containerRect.top + scrollContainer.scrollTop;

    scrollContainer.scrollTo({
      top: targetTop,
      behavior: 'smooth'
    });

    // Focus on the first visible input after a short delay to ensure scrolling is complete
    setTimeout(() => focusVisibleInput(targetSection), 300);
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
