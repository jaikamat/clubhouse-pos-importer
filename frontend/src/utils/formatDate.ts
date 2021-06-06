import moment from 'moment';

function formatDate(date: string) {
    return moment(date).format('MM/DD/YYYY - h:mm A');
}

export default formatDate;
