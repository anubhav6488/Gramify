module.exports = {
    // Check Null, Undefined and Empty String 
    check_string: async function (value) {
        return new Promise((resolve, reject) => {
            try {
                if (value != undefined && value != null && value != "") {
                    resolve(value)
                } else {
                    resolve("")
                }
            }
            catch (e) {
                reject(e)
            }
        })
    },
    // Check Null, Undefined and 0
    check_int: async function (value) {
        return new Promise((resolve, reject) => {
            try {
                if (value != undefined && value != null && value != "") {
                    resolve(value)
                } else {
                    resolve(0)
                }
            }
            catch (e) {
                reject(e)
            }
        })
    },
    // Check Null, Undefined and false
    check_bool: async function (value) {
        return new Promise((resolve, reject) => {
            try {
                if (value != undefined && value != null && value != "") {
                    resolve(value)
                } else {
                    resolve(false)
                }
            }
            catch (e) {
                reject(e)
            }
        })
    },
    query_builder: async function (data_object, table_name) {
        return new Promise((resolve, reject) => {
            try {
                let query = `insert into ` + table_name + ` (` + Object.keys(data_object).join() + `) values (` + Object.keys(data_object).map(t => `?`).join() + `) `;
                let data = Object.values(data_object)
                resolve({
                    query: query,
                    data: data
                })
            }
            catch (e) {
                console.log(e)
                reject(e)
            }
        })
    }
}