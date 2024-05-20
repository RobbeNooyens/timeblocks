function initializeSlider(startTime, endTime) {
    console.log('Initializing slider with startTime:', startTime, 'endTime:', endTime);

    const timeIntervalSlider = document.getElementById('timeIntervalSlider');
    const startTimeInMinutes = timeToMinutes(startTime);
    const endTimeInMinutes = timeToMinutes(endTime);

    console.log('Converted startTime to minutes:', startTimeInMinutes, 'endTime to minutes:', endTimeInMinutes);

    noUiSlider.create(timeIntervalSlider, {
        start: [startTimeInMinutes, endTimeInMinutes],
        connect: true,
        range: {
            'min': 0,
            'max': 1440
        },
        step: 15,
        tooltips: [true, true],
        format: {
            to: function (value) {
                return formatTime(Math.round(value));
            },
            from: function (value) {
                return value;
            }
        }
    });

    timeIntervalSlider.noUiSlider.on('update', (values, handle) => {
        // Do nothing if values is [Nan, Nan]
        console.log('Slider updated with values:', values);
        document.getElementById('timeIntervalValues').innerHTML = `Start: ${values[0]}, End: ${values[1]}`;
        if (handle === 0) {
            startTime = values[0];
        } else {
            endTime = values[1];
        }
    });
}

function formatTime(minutes) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
}

function timeToMinutes(time) {
    console.log('Converting time to minutes:', time);
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
}

function saveSettings() {
    const blockLength = parseInt(document.getElementById('blockLength').value);
    const timeIntervalSlider = document.getElementById('timeIntervalSlider').noUiSlider.get();
    console.log('Saving settings:', { startTime: timeIntervalSlider[0], endTime: timeIntervalSlider[1], blockLength });
    localStorage.setItem('startTime', timeIntervalSlider[0]);
    localStorage.setItem('endTime', timeIntervalSlider[1]);
    localStorage.setItem('blockLength', blockLength);
    return blockLength;
}
