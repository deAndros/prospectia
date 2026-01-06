import leadApi from './leadApi.js';
import listApi from './listApi.js';
import userApi from './userApi.js';

export default {
    ...leadApi,
    ...listApi,
    ...userApi
};
