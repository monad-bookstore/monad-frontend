import _client from './actions/client'
import _data from './actions/data'
import _interface from './actions/interface'
export default {
    ..._client,
    ..._data,
    ..._interface,
}