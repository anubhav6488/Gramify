try {

    const AWS = require('aws-sdk');

    AWS.config.update({
        accessKeyId: 'keyid',
        secretAccessKey: 'accesskey',
        region: 'ap-south-1'
    })

    const S3 = new AWS.S3();

    module.exports = (data) => {

        console.log(data)

        const params = {
            Bucket: 'bucketname',
            Key: 'logs/PROJECT-NAME/debugger.log',
            Body: data,
            ACL: 'public-read'
        }

        S3.upload(params, (err) => {
            if (err) {
                console.log('S3 Upload Error:: \n', err)
            }
        })
    }

} catch (e) {

    console.log(e);

}