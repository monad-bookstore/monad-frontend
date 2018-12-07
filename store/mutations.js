import _client from './mutations/client'
import _data from './mutations/data'
import _interface from './mutations/interface';

export default {
    ..._client,
    ..._data,
    ..._interface
}