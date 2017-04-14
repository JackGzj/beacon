/**
 * Created by Jack on 2017/3/13.
 */
import React, { Component } from 'react';
import {
    View,
    Navigator,
    ActivityIndicator,
} from 'react-native';
import Main from './Activity/LoginActivity';
import StorageUtil from './Util/StorageUtil';
import NetUtil from './Util/NetUtil';
import LoginSuccess from './Activity/LoginSuccess';

export default class navigator extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLogin : false,
            loaded : false,
        };
    }

    componentDidMount() {
        StorageUtil.getUserInfo((data) => NetUtil.checkLogin(data, (result) => {
                if (result.success == true) {
                    this.setState({isLogin : true});
                }
                /*else {
                    this.isLogin = false;
                    // 此处应弹出如"登录信息失效"的提示
                }*/
                this.setState({loaded:true});
            }
        ));
    }

    render() {
        if (!this.state.loaded) {
            return (
                <View style={{alignItems: 'center', justifyContent: 'center', flex: 1, backgroundColor: 'white'}}>
                    <ActivityIndicator animating={true}
                                       size="large"
                                       color="#cccccc"
                    />
                </View>
            );
        }
        else {
            let defaultName = this.state.isLogin ? 'LoginSuccess' : 'LoginPage';
            let defaultComponent = this.state.isLogin ? LoginSuccess : Main;
            return (
                <Navigator
                    initialRoute = {{name : defaultName, component: defaultComponent}}
                    configureScene = {(route) => {
                        // return Navigator.SceneConfigs.HorizontalSwipeJump;
                        let configure = Navigator.SceneConfigs.HorizontalSwipeJump;
						return {
							...configure,
							gestures:{}
						};
                    }}
                    renderScene={(route,navigator) => {
                        let Component = route.component;
                        return <Component {...route.params} navigator = {navigator} />
                    }}
                />
            );
        }
    }

};