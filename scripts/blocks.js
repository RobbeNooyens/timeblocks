function createBlocks(container, startTime, endTime, blockLength) {
    container.innerHTML = '';
    let start = moment(startTime, 'HH:mm');
    let end = moment(endTime, 'HH:mm');
    while (start.isBefore(end)) {
        const block = document.createElement('div');
        block.className = 'time-block';
        block.dataset.time = start.format('HH:mm');
        block.innerHTML = `
            <span>${start.format('HH:mm')}</span>
            <input type="checkbox" class="checkbox">
            <div contenteditable="true" class="editable"></div>
        `;
        container.appendChild(block);
        start.add(blockLength, 'minutes');
    }
}

function updateBlockStatus() {
    const now = moment();
    document.querySelectorAll('.time-block').forEach(block => {
        const blockTime = moment(block.dataset.time, 'HH:mm');
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
