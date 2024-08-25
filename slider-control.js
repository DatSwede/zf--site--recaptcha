document.addEventListener('DOMContentLoaded', function () {
    console.log('DOM fully loaded and parsed');

    function initSliderNavigation() {
        console.log('Initializing slider navigation');

        // Select and validate slider element
        const slider = document.querySelector('[zf-slider="slider"]');
        if (!slider) {
            console.error('Slider element with attribute zf-slider="slider" not found');
            return;
        }
        console.log('Slider element found:', slider);

        // Select and validate native back button
        const nativeBackButton = slider.querySelector('[zf-slider="back"]');
        if (!nativeBackButton) {
            console.error('Native back button with attribute zf-slider="back" not found');
            return;
        }
        console.log('Native back button found:', nativeBackButton);

        // Select and validate native next button
        const nativeNextButton = slider.querySelector('[zf-slider="next"]');
        if (!nativeNextButton) {
            console.error('Native next button with attribute zf-slider="next" not found');
            return;
        }
        console.log('Native next button found:', nativeNextButton);

        // Function to trigger Webflow interactions for slider actions
        function triggerSliderAction(action) {
            if (action === 'previous') {
                nativeBackButton.click();
                console.log('Triggered Webflow slider action: previous');
            } else if (action === 'next') {
                nativeNextButton.click();
                console.log('Triggered Webflow slider action: next');
            }
        }

        // Function to navigate to a specific slide using Webflow interactions
        function goToSlide(slideIndex) {
            const navDots = slider.querySelectorAll('.w-slider-nav .w-slider-dot');
            if (navDots[slideIndex]) {
                navDots[slideIndex].click();
                console.log(`Navigated to slide index: ${slideIndex}`);
            } else {
                console.error(`Slide navigation dot for index ${slideIndex} not found`);
            }
        }

        // Add event listener for custom back button
        const backButton = document.querySelector('[zf-slider="click-back"]');
        if (backButton) {
            backButton.addEventListener('click', function () {
                console.log('Custom back button clicked');
                triggerSliderAction('previous');
            });
            console.log('Custom back button event listener added:', backButton);
        } else {
            console.error('Custom back button not found');
        }

        // Add event listener for custom next button
        const nextButton = document.querySelector('[zf-slider="click-next"]');
        if (nextButton) {
            nextButton.addEventListener('click', function () {
                console.log('Custom next button clicked');
                triggerSliderAction('next');
            });
            console.log('Custom next button event listener added:', nextButton);
        } else {
            console.error('Custom next button not found');
        }

        // Set up event listeners for direct slide buttons
        const slideButtons = {
            'slide-1': 0,
            'slide-2': 1,
            'slide-3': 2
        };

        for (const [attr, index] of Object.entries(slideButtons)) {
            const button = document.querySelector(`[zf-slider="${attr}"]`);
            console.log(`Button for ${attr}:`, button);
            if (button) {
                button.addEventListener('click', function () {
                    console.log(`Button ${attr} clicked, navigating to slide index ${index}`);
                    goToSlide(index);
                });
                console.log(`Event listener added for button: ${attr}`, button);
            } else {
                console.error(`Button with attribute zf-slider="${attr}" not found`);
            }
        }
    }

    // Ensure Webflow's IX2 API is ready
    if (window.Webflow && window.Webflow.require) {
        console.log('Webflow IX2 API detected, initializing...');
        initSliderNavigation();
    } else {
        console.log('Webflow IX2 API not detected, waiting...');
        document.addEventListener('readystatechange', function () {
            if (document.readyState === 'complete') {
                initSliderNavigation();
            }
        });
    }
});
