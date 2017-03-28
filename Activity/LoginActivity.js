/**
 * Created by Jack on 2017/3/13.
 */
import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Image,
    TextInput,
    TouchableOpacity,
    Alert,
} from 'react-native';

import LoginButton from '../Component/LoginButton';
import LoginSuccess from './LoginSuccess';
import NetUitl from '../Util/NetUtil';
import StorageUtil from '../Util/StorageUtil'
// import Constant from '../Util/Constants'

export default class LoginActivity extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cardid : 'GZJ123456789',
            password : '123456',
        };
        // this.cardid = "";
        // this.password = "";
    }

    /*componentWillMount() {
        StorageUtil.getUserInfo((data) => {
            this.setState({cardid: data.cardid, token: data.token});
            this.postLoginInfo();
        });
    }*/

    render() {
        return (

            <View style={LoginStyles.loginView}>
                <View   style={{marginTop: 70,justifyContent: 'center',alignItems: 'center',}}>
                    <Image source={require('../images/logo.png')} style={{width: 100,height: 116,resizeMode: Image.resizeMode.contain}}/>
                    <Text style={{marginTop: 21, fontSize: 21, color:'#7E95C4'}}>Easy Doctor</Text>
                    <Text style={{marginTop: 10, fontSize: 16, color:'#98B2E9'}}>轻松看病，看病轻松</Text>
                </View>
                <View style={{marginTop: 20,padding : 45}}>
                    <View style={LoginStyles.TextInputView}>
                        <Image style={{flex: 1, height: 24, width: 24,resizeMode: Image.resizeMode.stretch}} source={require('../images/user.png')}/>
                        <TextInput style={LoginStyles.TextInput}
                                   placeholder='请输入就诊卡号/医保卡号'
                                   onChangeText={
                                       (text) => {
                                           this.setState({cardid: text});
                                       // this.cardid = text;
                                       }
                                   }
                                   secureTextEntry={false}
                        />
                    </View>
                    <View style={LoginStyles.TextInputView}>
                        <Image style={{flex: 1, height: 24, width: 24,resizeMode: Image.resizeMode.stretch}} source={require('../images/psw.png')}/>
                        <TextInput style={LoginStyles.TextInput}
                                   placeholder='请输入密码'
                                   onChangeText={
                                       (text) => {
                                           this.setState({password: text});
                                       // this.password = text;
                                       }
                                   }
                               secureTextEntry={true}
                    />
                </View>
                    <LoginButton name='登 录' onPressCallback={this.onPressCallback} fontsize={20}/>
                    <Text style={{color:"#4A90E2",textAlign:'center',marginTop:10}} >忘记密码？</Text>
                </View>
            </View>
        )
    }


    onPressCallback = () => {
        if (this.state.cardid == "")
        {
            alert("请输入用户名");
        }
        else {
            if (this.state.password == "") {
                alert("请输入密码");
            }
            else {
                this.postLoginInfo();
            }
        }
    }

    postLoginInfo() {
        var data = {cardid: this.state.cardid, upass: this.state.password};
        NetUitl.postLogin(data, (responseText) => {
            if (responseText.success == true) {
                // 存储用户信息
                StorageUtil.saveUserInfo(this.state.cardid, responseText.token, (response) => {
                    if (response == true) {
                        this.onLoginSuccess();
                    }
                    else {
                        Alert.alert('登录结果', '登录失败，请重试');
                    }
                });

            }
            else {
                Alert.alert('登录结果', '登录失败，' + responseText.msg);
            }
        });
    }

    //跳转到第二个页面去
    onLoginSuccess(){
        const { navigator } = this.props;
        if (navigator) {
            navigator.resetTo({
                name : 'LoginSuccess',
                component : LoginSuccess,
            });
        }
    }

}


const LoginStyles = StyleSheet.create({
    loginView: {
        flex: 1,
        marginTop: 25,
        backgroundColor: '#ffffff',
    },
    TextInputView: {
        padding: 1,
        marginTop: 10,
        height:40,
        backgroundColor: '#ffffff',
        // borderWidth:0.5,
        borderColor:'#B5C1D8',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomWidth: 0.5,
    },

    TextInput: {
        flex : 9,
        backgroundColor: '#ffffff',
        marginLeft:15,
        color: '#B5C1D8',
        fontSize: 18,
        // borderColor:'black',
        // borderWidth: 1,
    },
});