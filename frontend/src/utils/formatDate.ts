import moment from 'moment';

const formatDate = (dateString: string) => {
    return moment(dateString).format('MMMM Do, YYYY');
};

export default formatDate;
