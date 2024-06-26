function createBlocks(container, startTime, endTime, blockLength) {
    container.innerHTML = '';
    let start = minutesToMoment(timeToMinutes(startTime));
    let end = minutesToMoment(timeToMinutes(endTime));
    let blockDuration = moment.duration(blockLength, 'minutes');
    console.log('Creating blocks from', start.format('DD:HH:mm'), 'to', end.format('DD:HH:mm'), 'with block length', blockDuration.asMinutes(), 'minutes');
    while (start.isBefore(end)) {
        const timeString = start.format('DD:HH:mm');
        if (!mergedBlocks.includes(timeString)) {
            const block = document.createElement('div');
            block.className = `time-block d-flex align-items-center ${start.isBefore(moment()) ? 'time-block-past' : ''}`;
            block.dataset.time = timeString;
            block.innerHTML = `
                <span class="block-time">${start.format('H:mm')}</span>
                <div contenteditable="true" class="editable flex-grow-1 mx-3"></div>
                <input type="checkbox" class="checkbox">
            `;
            block.querySelector('.checkbox').addEventListener('change', () => selectBlock(block));
            // block.addEventListener('click', () => selectBlock(block));
            container.appendChild(block);

            // Load content from localStorage
            const savedContent = localStorage.getItem(timeString);
            if (savedContent) {
                block.querySelector('.editable').innerHTML = savedContent;
            }
        }
        start.add(blockDuration);
    }

    // Update block status for past blocks
    updateBlockStatus();
}

function timeStringToMoment(time) {
    const parts = time.split(':');
    if (parts.length === 3) {
        return moment().startOf('day').add(1, 'days').add(parseInt(parts[1]), 'hours').add(parseInt(parts[2]), 'minutes');
    }
    return moment().startOf('day').add(parseInt(parts[1]), 'hours').add(parseInt(parts[2]), 'minutes');
}

function minutesToMoment(minutes) {
    return moment().startOf('day').add(minutes, 'minutes');
}

function updateBlockStatus() {
    const now = moment();
    document.querySelectorAll('.time-block').forEach(block => {
        const blockTime = timeStringToMoment(block.dataset.time);
        if (blockTime.isBefore(now)) {
            block.classList.add('past');
        } else {
            block.classList.remove('past');
        }
    });
}

function handleInput(event) {
    if (event.target.classList.contains('editable')) {
        const block = event.target.closest('.time-block');
        const time = block.dataset.time;
        localStorage.setItem(time, event.target.innerHTML);
    } else if (event.target.classList.contains('checkbox')) {
        const block = event.target.closest('.time-block');
        const time = block.dataset.time;
        if (event.target.checked) {
            selectedTimeslots.push(time);
        } else {
            selectedTimeslots = selectedTimeslots.filter(t => t !== time);
        }
        console.log('Selected Timeslots:', selectedTimeslots);
    }
}

function loadContent() {
    document.querySelectorAll('.time-block').forEach(block => {
        const content = localStorage.getItem(block.dataset.time);
        block.querySelector('.editable').innerHTML = content || '';
    });
}

function selectBlock(block) {
    if (blocksToMerge.includes(block)) {
        block.classList.remove('selected');
        blocksToMerge = blocksToMerge.filter(b => b !== block);
    } else {
        block.classList.add('selected');
        blocksToMerge.push(block);
    }
    console.log('Blocks to Merge:', blocksToMerge);
}

function mergeBlocks() {
    if (blocksToMerge.length < 2) return;

    // Sort blocks by their time
    blocksToMerge.sort((a, b) => timeStringToMoment(a.dataset.time) - timeStringToMoment(b.dataset.time));

    const earliestBlock = blocksToMerge[0];
    const earliestTime = earliestBlock.dataset.time;
    let mergedContent = '';

    blocksToMerge.forEach(block => {
        if (block !== earliestBlock) {
            mergedContent += block.querySelector('.editable').innerHTML + ' ';
            localStorage.removeItem(block.dataset.time);
            mergedBlocks.push(block.dataset.time);
            block.remove();
        } else {
            mergedContent += block.querySelector('.editable').innerHTML + ' ';
        }
    });

    earliestBlock.querySelector('.editable').innerHTML = mergedContent.trim();
    localStorage.setItem(earliestTime, mergedContent.trim());
    localStorage.setItem('mergedBlocks', JSON.stringify(mergedBlocks));
    earliestBlock.classList.remove('selected');
    blocksToMerge = [];

    console.log('Merged Content:', mergedContent);
}

function unmergeBlocks() {
    mergedBlocks = [];
    localStorage.removeItem('mergedBlocks');
    initialize();
}
