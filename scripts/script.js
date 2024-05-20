document.addEventListener('DOMContentLoaded', (event) => {
    const settingsButton = document.getElementById('settingsButton');
    const settingsModal = new bootstrap.Modal(document.getElementById('settingsModal'), {});
    const saveSettingsButton = document.getElementById('saveSettings');
    const timeBlocksContainer = document.getElementById('timeBlocks');

    // Load settings from localStorage
    let startTime = localStorage.getItem('startTime') || '00:00';
    let endTime = localStorage.getItem('endTime') || '23:00';
    let blockLength = parseInt(localStorage.getItem('blockLength')) || 15;

    createBlocks(timeBlocksContainer, startTime, endTime, blockLength);

    settingsButton.addEventListener('click', () => {
        console.log('Settings button clicked');
        settingsModal.show();
    });

    initializeSlider(startTime, endTime);

    saveSettingsButton.addEventListener('click', () => {
        blockLength = saveSettings();
        createBlocks(timeBlocksContainer, startTime, endTime, blockLength);
        settingsModal.hide();
    });

    setInterval(() => {
        updateBlockStatus();
    }, 60000);

    document.addEventListener('input', (event) => {
        handleInput(event);
    });

    loadContent();
});
