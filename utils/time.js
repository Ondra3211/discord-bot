module.exports = {
    secToStr(sec) {
        let hours = Math.floor(sec % (3600 * 24) / 3600);
        let minutes = Math.floor(sec % 3600 / 60);
        let seconds = Math.floor(sec % 60);


        let message = '';

        if (hours > 0 && minutes < 10) minutes = `0${minutes}`;
        if (seconds < 10) seconds = `0${seconds}`;

        if (hours > 0) message += `${hours}:`;

        message += `${minutes}:`
        message += seconds;

        return message;
    },

    strToSec(str) {

        const t = str.split(':');

        if (t.length > 2) return (+t[0]) * 60 * 60 + (+t[1]) * 60 + (+t[2]);
        if (t.length > 1) return ((+t[0]) * 60 + (+t[1]));

        return (+t[0]);
    }
}