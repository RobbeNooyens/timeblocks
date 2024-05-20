document.addEventListener('DOMContentLoaded', (event) => {
    const settingsButton = document.getElementById('settingsButton');
    const settingsModal = new bootstrap.Modal(document.getElementById('settingsModal'), {});
    const saveSettingsButton = document.getElementById('saveSettings');
    const timeBlocksContainer = document.getElementById('timeBlocks');

    let selectedTimeslots = [];
    let blocksToMerge = [];
    let mergedBlocks = JSON.parse(localStorage.getItem('mergedBlocks')) || [];

    // Load settings from localStorage
    let startTime = localStorage.getItem('startTime') || '00:00';
    let endTime = localStorage.getItem('endTime') || '23:00';
    let blockLength = parseInt(localStorage.getItem('blockLength')) || 15;

    function initialize() {
        selectedTimeslots = [];
        blocksToMerge = [];
        createBlocks(timeBlocksContainer, startTime, endTime, blockLength);
    }

    initialize();

    settingsButton.addEventListener('click', () => {
        settingsModal.show();
    });

    initializeSlider(startTime, endTime);

    saveSettingsButton.addEventListener('click', () => {
        blockLength = saveSettings();
        initialize();
        settingsModal.hide();
    });

    setInterval(() => {
        updateBlockStatus();
    }, 60000);

    document.addEventListener('input', (event) => {
        handleInput(event);
    });

    const mergeButton = document.createElement('button');
    mergeButton.innerText = 'Merge Selected Blocks';
    mergeButton.id = 'mergeButton';
    mergeButton.classList.add('btn', 'btn-secondary', 'ml-2');
    mergeButton.addEventListener('click', mergeBlocks);
    document.querySelector('.d-flex').appendChild(mergeButton);

    const unmergeButton = document.createElement('button');
    unmergeButton.innerText = 'Unmerge Blocks';
    unmergeButton.id = 'unmergeButton';
    unmergeButton.classList.add('btn', 'btn-secondary', 'ml-2');
    unmergeButton.addEventListener('click', unmergeBlocks);
    document.querySelector('.d-flex').appendChild(unmergeButton);

    loadContent();
});
