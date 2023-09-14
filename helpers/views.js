const weekdays = [ "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday" ];

module.exports = {

    hbsHelpers: {
        getDate: (data) => { return `${new Date(data).toLocaleDateString('fr-FR')}` },
        getDuration: (value) => { return value.slice(0, 5) },
        dateToHourStr: (data) => { return `${new Date(data).toLocaleTimeString('fr-FR', {hour: '2-digit', minute: '2-digit'})}` },
        capacityLoop: (capacityMin, capacityMax, block) => {
            var content = '';
            for (let i = capacityMin; i <= capacityMax; i += 1)
                content += block.fn(i);
            return content;
        }
    }

}