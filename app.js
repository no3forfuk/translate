// APP ID：20190617000308200

// 密钥：ib5Wt8e1S5RAtM1MDzO9

const fs = require('fs')
const path = require('path')
const readline = require('readline')
const rp = require('request-promise');
const md5 = require('js-md5')
var encoding = require('encoding');
const rl = readline.createInterface({
    input: fs.createReadStream('./test.json'),
    encoding: 'utf-8'
});
let reg = /[\u4e00-\u9fa5]+/g
function translate(word, fn) {
    let q = word,
        from = 'zh',
        to = 'en',
        appid = 20190617000308200,
        salt = 0,
        key = 'ib5Wt8e1S5RAtM1MDzO9'
    let signStr = encodeURI(appid) + q + encodeURI(salt) + encodeURI(key)
    let sign = md5(signStr)
    var options = {
        uri: 'http://api.fanyi.baidu.com/api/trans/vip/translate',
        qs: {
            q: encodeURI(word),
            from: 'zh',
            to: 'en',
            appid: encodeURI(appid),
            salt: 0,
            sign: sign
        },
        method: 'GET',
        headers: {
            'Access-Control-Allow-Origin': '*'
        },
        json: true // Automatically parses the JSON string in the response
    };
    rp(options).then(res => {
        fn(res)
    }).catch(err => { throw err })
}
rl.on('line', (line) => {
    if (line.match(reg)) {
        let word = line.match(reg)[0]
        // let newLine = line.replace(word, 's') + '\n'
        translate(word, res => {
            console.log(res)
            fs.appendFile('./result.json', res, (err) => {
                if (err) throw err;

            });
        })
    } else {
        line += '\n'
        fs.appendFile('./result.json', line, (err) => {
            if (err) throw err;
            console.log('文件已被保存');
        });
    }
});
