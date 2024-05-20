function createBlocks(container, startTime, endTime, blockLength) {
    container.innerHTML = '';
    let start = timeStringToMoment(startTime);
    let end = timeStringToMoment(endTime);
    let blockDuration = moment.duration(blockLength, 'minutes');

    while (start.isBefore(end)) {
        const block = document.createElement('div');
        block.className = 'time-block';
        block.dataset.time = start.format('DD:HH:mm');
        block.innerHTML = `
            <span>${start.format('H:mm')}</span>
            <input type="checkbox" class="checkbox">
            <div contenteditable="true" class="editable"></div>
        `;
        container.appendChild(block);
        start.add(blockDuration);
    }
}

function timeStringToMoment(time) {
    const parts = time.split(':');
    if (parts.length === 3) {
        return moment().startOf('day').add(1, 'days').add(parseInt(parts[1]), 'hours').add(parseInt(parts[2]), 'minutes');
    }
    return moment().startOf('day').add(parseInt(parts[0]), 'hours').add(parseInt(parts[1]), 'minutes');
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
        localStorage.setItem(block.dataset.time, event.target.innerHTML);
    } else if (event.target.classList.contains('checkbox')) {
        const block = event.target.closest('.time-block');
        localStorage.setItem(block.dataset.time + '-checked', event.target.checked);
    }
}

function loadContent() {
    document.querySelectorAll('.time-block').forEach(block => {
        const content = localStorage.getItem(block.dataset.time);
        const isChecked = localStorage.getItem(block.dataset.time + '-checked') === 'true';
        block.querySelector('.editable').innerHTML = content || '';
        block.querySelector('.checkbox').checked = isChecked;
    });
}
