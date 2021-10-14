import moment from 'moment';

function formatDateTime(date: string) {
    return moment(date).format('MM/DD/YYYY - h:mm A');
}

export default formatDateTime;
