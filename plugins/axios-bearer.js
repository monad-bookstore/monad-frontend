import Cookie from 'js-cookie'
/**
 *
 *  
 */
export default function ({ $axios }) {
    $axios.onRequest(config => {
        const bearer = Cookie.get('bearer')
        if (bearer !== undefined) {
            config.headers = { 'Authorization': 'Bearer ' + bearer };
        }
    })
}