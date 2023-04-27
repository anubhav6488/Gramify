// All Invalid Requests will have Response Code as 400, 
// All Response of Invalid Requests will have subcode like A1, A2, A3 etc.

// A1: Null/Empty/Undefined Value
// A2: Invalid Value (Should be A, B, or C but request is sending D)
module.exports = {
    already_exists: {
        code: 409,
        message: 'Value Already Exists'
    },
    does_not_exist: {
        code: 404,
        message: 'Does Not Exist'
    },
    success: {
        code: 200,
        message: 'Success'
    },
    internal_server_error: {
        code: 500,
        message: 'Something went wrong'
    },
    required: function (value) {
        return {
            code: 400,
            sub_code: 'A1',
            key: value,
            message: 'Required'
        }
    },
    false_value: function (value) {
        return {
            code: 400,
            sub_code: 'A2',
            key: value,
            message: 'False Value'
        }
    },
    size_exceeded: function (value) {
        return {
            code: 400,
            sub_code: 'A3',
            key: value,
            message: 'Size Exceeded'
        }
    },
    value_already_exists: function (value) {
        return {
            key: value,
            code: 409,
            message: 'Value Already Exists'
        }
    },
}