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
            'max': 2160 // Maximum value to cover 24 hours for day one and 24 hours for day two minus 1 minute
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
    const day = Math.floor(minutes / 1440);
    const hours = Math.floor((minutes % 1440) / 60);
    const mins = minutes % 60;
    const dayPrefix = day === 1 ? "1:" : "";
    const formattedTime = `${dayPrefix}${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
    console.log('Formatted time:', formattedTime);
    return formattedTime;
}

function timeToMinutes(time) {
    console.log('Converting time to minutes:', time);
    const parts = time.split(':');
    let dayOffset = 0;
    let hours = 0;
    let minutes = 0;

    if (parts.length === 3) {
        dayOffset = 1440;
        hours = parseInt(parts[1], 10);
        minutes = parseInt(parts[2], 10);
    } else if (parts.length === 2) {
        hours = parseInt(parts[0], 10);
        minutes = parseInt(parts[1], 10);
    }

    const totalMinutes = dayOffset + hours * 60 + minutes;
    console.log('Converted to total minutes:', totalMinutes);
    return totalMinutes;
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
