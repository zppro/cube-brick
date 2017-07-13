/**
 * Created by zppro on 17-7-13.
 */

const responser = {
    default: msg => {
        return {success: true, code: 0, msg: msg};
    },
    error: err => {
        return {success: false, code: err.code, msg: err.message};
    },
    ret: (ret, msg) => {
        return {success: true, code: 0, msg: msg, ret: ret};
    },
    rows: (rows, msg) => {
        return {success: true, code: 0, msg: msg, rows: rows};
    }
}

export default responser;