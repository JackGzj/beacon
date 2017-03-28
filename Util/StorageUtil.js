/**
 * Created by Jack on 2017/3/17.
 */
import { AsyncStorage } from 'react-native';
import Constants from './Constants'
let StorageUtil = {
    saveItem(key, vaule, callback) {
        try {
            AsyncStorage.setItem(
                key,
                vaule,
            ).then(() => {
                console.log('数据 ' + key + ':' + vaule + '存储成功');
                callback(true);
            });
        } catch (error) {
            console.log('数据 ' + key + ':' + vaule + '存储错误,' + error);
            callback(false);
        }
    },

    saveUserInfo(carid, token, callback) {
        var data = [[Constants.CODE_STORAGE_CRADID, carid],[Constants.CODE_STORAGE_TOKEN, token]];
        try {
            AsyncStorage.multiSet(
                data
            ).then(() => {
                console.log('用户信息存储成功');
                callback(true);
            });

        } catch (error) {
            console.log('用户信息存储失败');
            callback(false)
        }
    },

    getItem(key, callback) {
        AsyncStorage.getItem(key)
            .then(  //使用Promise机制的方法
                (result)=> {   //使用Promise机制,如果操作成功不会有error参数
                    if (result == null) {
                        console.log('数据 ' + key + '读取错误，没有该key值');
                        callback('error');
                    }
                    callback(result);
                    // console.log("sex:" + result);
                }
            ).catch((error)=> {  //读取操作失败
            console.log('数据 ' + key + '读取错误,' + error);
            callback('error');
        });
    },

    getUserInfo(callback) {
        let data = {
            cardid : '',
            token : '',
        }
        this.getItem(Constants.CODE_STORAGE_CRADID, (text) => {
            data.cardid = text;
            this.getItem(Constants.CODE_STORAGE_TOKEN, (text) => {
                data.token = text;
                callback(data);
            });
        });
    }

}
export default StorageUtil