/**
 * Created by Jack on 2017/3/13.
 */
let loginURL = "http://120.77.176.18/jztsgz/user/login";
let checkLoginURL =  "http://120.77.176.18/jztsgz/user/checkUserInfo";
let processURL = "http://120.77.176.18/jztsgz/user/getProcess";
let medicalCardURL = "http://120.77.176.18/jztsgz/user/getMedicalCard";
let visitRecordURL = "http://120.77.176.18/jztsgz/user/getVisitRecord";
let messageStateURL = "http://120.77.176.18/jztsgz/user/getMessageState";
let setMessageURL = "http://120.77.176.18/jztsgz/user/setMessageState";
let searchURL = "http://120.77.176.18/jztsgz/user/searchLocation";
let getBeaconURL = "http://120.77.176.18/jztsgz/user/getBeaconLocation";

import Constants from './Constants'
import Storage from './StorageUtil'

let NetUtil = {
    // 登录
    postLogin(data, callback){
        console.log('post login cardid: ' + data.cardid + ' token: ' + data.token);
        let fetchOptions = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({data}),
        };

        fetch(loginURL, fetchOptions)
            .then((response) => response.json())
            .then((responseData) => {
                // let responseData = JSON.parse(responseText);
                if (responseData.code === Constants.CODE_LOGIN_SUCCESS)
                {
                    console.log('login result: ' + JSON.stringify(responseData));
                    responseData.success = true;
                }
                else
                {
                    responseData.success = false;
                }
                callback(responseData);
            }).catch((error) =>{
                console.error(error);
			    let returnData = {
				    success : false,
				    msg : '',
			    };
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
        let fetchOptions = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'token': data.token,
                'cardid': data.cardid,
            },
        };

        fetch(checkLoginURL, fetchOptions)
            .then((response) => response.json())
            .then((responseData) => {
                // console.log('check login result: ' + responseData);
                console.log('check login result: ' + responseData.code + ',' + responseData.msg);
                if (responseData.code === Constants.CODE_RIGHT_TOKEN)
                {
                    responseData.success = true;
                }
                else
                {
					responseData.success = false;
                }
                callback(responseData);
            }).catch((error) =>{
			console.error(error);
			let returnData = {
				success : false,
				msg : '',
			};
			returnData.success = 'false';
			returnData.msg = '服务器打瞌睡啦~';
			callback(returnData);
        });
    },

    // 获取就诊流程
    getProcess(callback) {
        Storage.getUserInfo((data) => {
            let fetchOptions = {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'token': data.token,
                    'cardid': data.cardid,
                },
            };

            let returnData = {
                success : false,
                data: '',
                msg: '',
            };
            fetch(processURL, fetchOptions)
                .then((response) => response.json())
                .then((responseData) => {
                    if (responseData.code === Constants.CODE_GERDATA_SUCCESS) {
                        returnData.success = true;
                        returnData.data = this.formatJson(responseData.data);
                        // console.log('process data: ' + JSON.stringify(returnData.data));
                    }
                    else {
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

    // 处理就诊流程原始数据
    formatJson(data) {
        // console.log('data: ' + JSON.stringify(data));
        // isSame: 这一条记录与下一条记录是否属于同一环节；isChild: 当前记录是否上一条记录的子记录（环节一样）
        let length = data.length, jsonArray = new Array(), isSame = false, isChild = false;
        for (let i = 0; i < length; i++) {

            if (i !== length - 1)
            {
                if (data[i].protid === data[i + 1].protid) {
                    isSame = true;
                }
                else {
                    isSame = false;
                }
            }

			// console.log('formatJSON data' + i + ': ' + JSON.stringify(data[i]) + '  isSame: ' + isSame + '  isChild: ' + isChild);

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
						queNum: data[i].queNum,
                    };
                    detailArray.push(detailObj);
                }
                // 将环节和细节一并存入
                else {
                    let detailObj = {
                        prodid: data[i].prodid,
                        prodetailname: data[i].prodetailname,
                        prodetailloc: data[i].prodetailloc,
                        prodstate: data[i].prodstate,
						queNum: data[i].queNum,
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
            	// 与上一条记录环节一致
				if (isChild) {
					let detailArray = jsonArray[jsonArray.length - 1].details;
					let detailObj = {
						prodid: data[i].prodid,
						prodetailname: data[i].prodetailname,
						prodetailloc: data[i].prodetailloc,
						prodstate: data[i].prodstate,
						queNum: data[i].queNum,
					};
					detailArray.push(detailObj);
					isChild = isSame ? true : false;
				}
				else {
					jsonArray.push(data[i]);
					isChild = false;
				}
            }
        }
        // console.log('formatJSON: ' + JSON.stringify(jsonArray));
        return jsonArray;
    },

    // 获取用户所有就诊卡
    getMedicalCard(callback) {
        Storage.getUserInfo((data) => {
            let fetchOptions = {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'token': data.token,
                    'cardid': data.cardid,
                },
            };

            fetch(medicalCardURL, fetchOptions)
                .then((response) => response.json())
                .then((responseData) => {
                    if (responseData.code == Constants.CODE_GERDATA_SUCCESS) {
                        responseData.success = true;
                    }
					else {
                        responseData.success = false;
                    }
                    callback(responseData);
                }).catch((error) => {
				console.error(error);
				let returnData = {
					success : false,
					msg : '',
				};
				returnData.success = 'false';
				returnData.msg = '服务器打瞌睡啦~';
				callback(returnData);
            });
        });
    },

    // 获取用户历史就诊记录
    getVisitRecord(callback) {
        Storage.getUserInfo((data) => {
            let fetchOptions = {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'token': data.token,
                    'cardid': data.cardid,
                },
            };

            fetch(visitRecordURL, fetchOptions)
                .then((response) => response.json())
                .then((responseData) => {
                    if (responseData.code == Constants.CODE_GERDATA_SUCCESS) {
						responseData.success = true;
					}
					else {
						responseData.success = false;
					}
					callback(responseData);
                }).catch((error) => {
                console.error(error);
				let returnData = {
					success : false,
					msg : '',
				};
				returnData.success = 'false';
				returnData.msg = '服务器打瞌睡啦~';
				callback(returnData);
            });
        });
    },

    // 获取用户短信推送开关状态
    getMessageState(callback) {
        Storage.getUserInfo((data) => {
            let fetchOptions = {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'token': data.token,
                    'cardid': data.cardid,
                },
            };

            fetch(messageStateURL, fetchOptions)
                .then((response) => response.json())
                .then((responseData) => {
                    if (responseData.code == Constants.CODE_GERDATA_SUCCESS) {
						responseData.success = true;
					}
					else {
						responseData.success = false;
					}
					callback(responseData);
                }).catch((error) => {
				console.error(error);
				let returnData = {
					success : false,
					msg : '',
				};
				returnData.success = 'false';
				returnData.msg = '服务器打瞌睡啦~';
				callback(returnData);
            });
        });
    },

    // 设置用户短信推送开关
    setMessageState(data, callback){
        Storage.getUserInfo((result) => {
            let fetchOptions = {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'token': result.token,
                    'cardid': result.cardid,
                },
                body: JSON.stringify({data}),
            };

            fetch(setMessageURL, fetchOptions)
                .then((response) => response.json())
                .then((responseData) => {
                    // let responseData = JSON.parse(responseText);
                    console.log("set result: " + JSON.stringify(responseData));
                    if (responseData.code == Constants.CODE_UPDATE_SUCCESS) {
						responseData.success = true;
					}
					else {
						responseData.success = false;
					}
					callback(responseData);
                }).catch((error) =>{
				console.error(error);
				let returnData = {
					success : false,
					msg : '',
				};
				returnData.success = 'false';
				returnData.msg = '服务器打瞌睡啦~';
				callback(returnData);
            });
        });
    },

	// 搜索地点
	getSearchLocation(data, callback) {
		Storage.getUserInfo((result) => {
			let fetchOptions = {
				method: 'POST',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json',
					'token': result.token,
					'cardid': result.cardid,
				},
				body: JSON.stringify({data}),
			};

			fetch(searchURL, fetchOptions)
				.then((response) => response.json())
				.then((responseData) => {
					if (responseData.code == Constants.CODE_GERDATA_SUCCESS) {
						responseData.success = true;
					}
					else {
						responseData.success = false;
					}
					callback(responseData);
				}).catch((error) => {
				console.error(error);
				let returnData = {
					success : false,
					msg : '',
				};
				returnData.success = 'false';
				returnData.msg = '服务器打瞌睡啦~';
				callback(returnData);
			});
		});
	},

	// 获取beacon对应的地图信息点
	getBeaconInfo(data, callback) {
		Storage.getUserInfo((result) => {
			let fetchOptions = {
				method: 'POST',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json',
					'token': result.token,
					'cardid': result.cardid,
				},
				body: JSON.stringify({data}),
			};

			fetch(getBeaconURL, fetchOptions)
				.then((response) => response.json())
				.then((responseData) => {
					if (responseData.code == Constants.CODE_GERDATA_SUCCESS) {
						responseData.success = true;
					}
					else {
						responseData.success = false;
					}
					callback(responseData);
				}).catch((error) => {
				console.error(error);
				let returnData = {
					success : false,
					msg : '',
				};
				returnData.success = 'false';
				returnData.msg = '服务器打瞌睡啦~';
				callback(returnData);
			});
		});
	},
}
export default NetUtil