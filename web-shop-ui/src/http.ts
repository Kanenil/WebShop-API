import  axios  from 'axios';
import { APP_ENV } from './env';

export default axios.create({
    baseURL: APP_ENV.REMOTE_HOST_NAME,
    headers: {
        "Content-Type": "application/json"
    }
});