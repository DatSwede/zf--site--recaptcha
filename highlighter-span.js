document.addEventListener("DOMContentLoaded", function() {
  // Get the span element
  const spanElement = document.querySelector('[span-wrap="wrap-1"]');
  console.log("spanElement:", spanElement);

  // Get the img element
  const imgElement = document.querySelector('[span-img="img-1"]');
  console.log("imgElement:", imgElement);

  // Ensure both elements exist
  if (spanElement && imgElement) {
    // Move the img element inside the span element
    spanElement.appendChild(imgElement);
    console.log("Appended imgElement inside spanElement");

    // Set the styles
    spanElement.style.position = "relative";
    imgElement.style.position = "absolute";

    // Optionally set the positioning of the img element inside the span element
    // Example: bottom right corner
    imgElement.style.bottom = "0";
    imgElement.style.right = "0";
    imgElement.style.width = "100%"; // Adjust width if needed
    imgElement.style.height = "auto"; // Adjust height if needed
    
    console.log("Styles applied to imgElement");
  } else {
    console.error("Either span element or img element not found");
  }
});
