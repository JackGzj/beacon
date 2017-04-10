/**
 * Created by Jack on 2017/3/13.
 */
let loginURL = "http://120.77.176.18/jztsgz/user/login";
let checkLoginURL =  "http://120.77.176.18/jztsgz/user/checkUserInfo"
let processURL = "http://120.77.176.18/jztsgz/user/getProcess";
let medicalCardURL = "http://120.77.176.18/jztsgz/user/getMedicalCard";
let visitRecordURL = "http://120.77.176.18/jztsgz/user/getVisitRecord";
let messageStateURL = "http://120.77.176.18/jztsgz/user/getMessageState";
let setMessageURL = "http://120.77.176.18/jztsgz/user/setMessageState";

import Constants from './Constants'
import Storage from './StorageUtil'

let NetUtil = {
    // 登录
    postLogin(data, callback){
        console.log('post login cardid: ' + data.cardid + ' token: ' + data.token);
        var fetchOptions = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({data}),
        };

        var returnData = {
            success : false,
            msg : '',
            token : '',
        };
        fetch(loginURL, fetchOptions)
            .then((response) => response.json())
            .then((responseData) => {
                // var responseData = JSON.parse(responseText);
                console.log('login result: ' + responseData.code + ',' + responseData.msg);
                if (responseData.code == Constants.CODE_LOGIN_SUCCESS)
                {
                    returnData.success = true;
                    returnData.msg = responseData.msg;
                    returnData.token = responseData.token;
                }
                else
                {
                    returnData.success = 'false';
                    returnData.msg = responseData.msg;
                }
                callback(returnData);
            }).catch((error) =>{
                console.error(error);
                returnData.success = 'false';
                returnData.msg = '服务器打瞌睡啦~';
                callback(returnData);
        });
            /*.catch((error) =>
            {
                console.log(error);
            });*/
    },

    // 检查登录状态
    checkLogin(data, callback) {
        console.log('check login cardid: ' + data.cardid + ' token: ' + data.token);
        var fetchOptions = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'token': data.token,
                'cardid': data.cardid,
            },
        };

        var returnData = {
            success : false,
            msg : '',
            token : '',
        };
        fetch(checkLoginURL, fetchOptions)
            .then((response) => response.json())
            .then((responseData) => {
                // console.log('check login result: ' + responseData);
                console.log('check login result: ' + responseData.code + ',' + responseData.msg);
                if (responseData.code == Constants.CODE_RIGHT_TOKEN)
                {
                    returnData.success = true;
                    returnData.msg = responseData.msg;
                }
                else
                {
                    returnData.success = 'false';
                    returnData.msg = responseData.msg;
                }
                callback(returnData);
            }).catch((error) =>{
            console.error(error);
            returnData.success = 'false';
            returnData.msg = '服务器打瞌睡啦~';
            callback(returnData);
        });
    },

    // 获取就诊流程
    getProcess(callback) {
        Storage.getUserInfo((data) => {
            var fetchOptions = {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'token': data.token,
                    'cardid': data.cardid,
                },
            };

            var returnData = {
                success : false,
                data: '',
                msg: '',
            };
            fetch(processURL, fetchOptions)
                .then((response) => response.json())
                .then((responseData) => {
                    if (responseData.code == Constants.CODE_GERDATA_SUCCESS) {
                        returnData.success = true;
                        returnData.data = this.formatJson(responseData.data);
                    }
                    else {
                        returnData.msg = responseData.msg;
                    }
                    callback(returnData);
                }).catch((error) =>{
                console.error(error);
                returnData.msg = '服务器打瞌睡啦~';
                callback(returnData);
            });
        });
    },

    // 处理就诊流程原始数据
    formatJson(data) {
        // console.log('data: ' + JSON.stringify(data));
        // isSame: 这一条记录与下一条记录是否属于同一环节；isChild: 当前记录是否上一条记录的子记录（环节一样）
        let length = data.length, jsonArray = new Array(), isSame = false, isChild = false;
        for (let i = 0; i < length; i++) {
            // console.log('formatJSON data' + i + ': ' + data[i].toString());
            if (i != length - 1)
            {
                if (data[i].protid == data[i + 1].protid) {
                    isSame = true;
                }
                else {
                    isSame = false;
                }
            }

            // 同一环节，将就诊细节抽出来，作为一个json数组
            if (isSame) {
                // 只需将细节存入
                if (isChild) {
                    let detailArray = jsonArray[jsonArray.length - 1].details;
                    let detailObj = {
                        prodid: data[i].prodid,
                        prodetailname: data[i].prodetailname,
                        prodetailloc: data[i].prodetailloc,
                        prodstate: data[i].prodstate,
                    };
                    detailArray.push(detailObj);
                }
                else {
                    let detailObj = {
                        prodid: data[i].prodid,
                        prodetailname: data[i].prodetailname,
                        prodetailloc: data[i].prodetailloc,
                        prodstate: data[i].prodstate,
                    };
                    let detailArray = new Array();
                    detailArray.push(detailObj);
                    let tacheObj = {
                        protid: data[i].protid,
                        protachename: data[i].protachename,
                        // protabove = data[i].protabove,
                        protstate: data[i].protstate,
                        details: detailArray,
                    };
                    jsonArray.push(tacheObj);
                    isChild = true;
                }
            }
            // 非同一环节，直接存入新数组中
            else {
                jsonArray.push(data[i]);
                isChild = false;
            }
        }
        // console.log('formatJSON: ' + JSON.stringify(jsonArray));
        return jsonArray;
    },

    // 获取用户所有就诊卡
    getMedicalCard(callback) {
        Storage.getUserInfo((data) => {
            var fetchOptions = {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'token': data.token,
                    'cardid': data.cardid,
                },
            };


            var returnData = {
                success: false,
                data: '',
                msg: '',
            };
            fetch(medicalCardURL, fetchOptions)
                .then((response) => response.json())
                .then((responseData) => {
                    if (responseData.code == Constants.CODE_GERDATA_SUCCESS) {
                        returnData.success = true;
                        returnData.data = responseData.data;
                    }
                    else {
                        returnData.msg = responseData.msg;
                    }
                    callback(returnData);
                }).catch((error) => {
                console.error(error);
                returnData.msg = '服务器打瞌睡啦~';
                callback(returnData);
            });
        });
    },

    // 获取用户历史就诊记录
    getVisitRecord(callback) {
        Storage.getUserInfo((data) => {
            var fetchOptions = {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'token': data.token,
                    'cardid': data.cardid,
                },
            };


            var returnData = {
                success: false,
                data: '',
                msg: '',
            };
            fetch(visitRecordURL, fetchOptions)
                .then((response) => response.json())
                .then((responseData) => {
                    if (responseData.code == Constants.CODE_GERDATA_SUCCESS) {
                        returnData.success = true;
                        returnData.data = responseData.data;
                    }
                    else {
                        returnData.msg = responseData.msg;
                    }
                    callback(returnData);
                }).catch((error) => {
                console.error(error);
                returnData.msg = '服务器打瞌睡啦~';
                callback(returnData);
            });
        });
    },

    getMessageState(callback) {
        Storage.getUserInfo((data) => {
            var fetchOptions = {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'token': data.token,
                    'cardid': data.cardid,
                },
            };


            var returnData = {
                success: false,
                data: '',
                msg: '',
            };
            fetch(messageStateURL, fetchOptions)
                .then((response) => response.json())
                .then((responseData) => {
                    if (responseData.code == Constants.CODE_GERDATA_SUCCESS) {
                        returnData.success = true;
                        returnData.data = responseData.data;
                    }
                    else {
                        returnData.msg = responseData.msg;
                    }
                    callback(returnData);
                }).catch((error) => {
                console.error(error);
                returnData.msg = '服务器打瞌睡啦~';
                callback(returnData);
            });
        });
    },
    setMessageState(data, callback){
        Storage.getUserInfo((result) => {
            var fetchOptions = {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'token': result.token,
                    'cardid': result.cardid,
                },
                body: JSON.stringify({data}),
            };

            var returnData = {
                success : false,
                msg : '',
            };
            fetch(setMessageURL, fetchOptions)
                .then((response) => response.json())
                .then((responseData) => {
                    // var responseData = JSON.parse(responseText);
                    console.log("set result: " + JSON.stringify(responseData));
                    if (responseData.code == Constants.CODE_UPDATE_SUCCESS)
                    {
                        returnData.success = true;
                        returnData.msg = responseData.msg;
                    }
                    else
                    {
                        returnData.success = 'false';
                        returnData.msg = responseData.msg;
                    }
                    callback(returnData);
                }).catch((error) =>{
                console.error(error);
                returnData.success = 'false';
                returnData.msg = '服务器打瞌睡啦~';
                callback(returnData);
            });
        });
    },
}
export default NetUtil