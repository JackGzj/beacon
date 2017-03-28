/**
 * Created by Jack on 2017/3/24.
 */
import React from 'react';
import {
    View,
    Text,
    Switch,
    Image,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
} from 'react-native';
import LoginButton from '../Component/LoginButton'
import NetUtil from '../Util/NetUtil'

export default class ConfigPage extends React.Component {
    constructor() {
        super();
        this.state = {switchIsOn: false, loaded: false, error: false};
    }

    _back() {
        const { navigator } = this.props;
        if (navigator) {
            navigator.pop();
        }
    }

    componentWillMount() {
        NetUtil.getMessageState((data) => {
            if (data.success == true) {
                this.setState({switchIsOn: data.data == 0 ? false : true, loaded: true, error: false});
            }
            else {
                this.setState({error: true});
            }
        });
    }

    _refresh() {
        NetUtil.getMessageState((data) => {
            if (data.success == true) {
                this.setState({switchIsOn: data.data == 0 ? false : true, error: false});
            }
            else {
                this.setState({error: true});
            }
        });
    }

    _switchChange(state) {
        var data = {state:state ? 1 : 0};
        NetUtil.setMessageState(data, (result) => {
            if (result.success == true) {
                this.setState({switchIsOn: state});
            }
        });

    }

    _renderList() {
        // 数据加载是否成功
        if (this.state.loaded) {
            // 加载是否出错
            if (this.state.error) {
                return (
                    <TouchableOpacity onPress={this._refresh.bind(this)}>
                        <NodataPage/>
                    </TouchableOpacity>
                );
            }
            else {
                return (
                    <View style={styles.rowsContainer}>
                        <TouchableOpacity>
                            <View style={styles.rowContainer}>
                                <View style={styles.rowLeft}>
                                    <Text style={styles.rowText}>修改密码</Text>
                                </View>
                                <View style={styles.rowRight}>
                                    <Image source={require('../images/next.png')} style={styles.rowIcon}/>
                                </View>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <View style={styles.rowContainer}>
                                <View style={styles.rowLeft}>
                                    <Text style={styles.rowText}>是否接受短信推送</Text>
                                </View>
                                <View style={styles.rowRight}>
                                    <Switch onValueChange={this._switchChange.bind(this)} onTintColor={'#93C1FF'}
                                            style={styles.switch} value={this.state.switchIsOn}></Switch>
                                </View>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <View style={styles.rowContainer}>
                                <View style={styles.rowLeft}>
                                    <Text style={styles.rowText}>关于我们</Text>
                                </View>
                                <View style={styles.rowRight}>
                                    <Image source={require('../images/next.png')} style={styles.rowIcon}/>
                                </View>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <View style={styles.rowContainer}>
                                <View style={styles.rowLeft}>
                                    <Text style={styles.rowText}>意见反馈</Text>
                                </View>
                                <View style={styles.rowRight}>
                                    <Image source={require('../images/next.png')} style={styles.rowIcon}/>
                                </View>
                            </View>
                        </TouchableOpacity>
                        <View style={styles.buttonContainer}>
                            <LoginButton name="退 出 登 录" fontsize={15}/>
                        </View>
                    </View>
                );
            }
        }
        else {
            return (
                <View style={styles.rowsContainer}>
                    <ActivityIndicator animating={true}
                                       style={{alignSelf: 'center'}}
                                       size="large"
                                       color="#cccccc"
                    />
                </View>
            );
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.topView}>
                    <View style={styles.topLeft}>
                        <TouchableOpacity onPress={this._back.bind(this)}>
                            <Image source={require('../images/back.png')} style={styles.backIcon}/>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.topMiddle}><Text style={styles.title}>个人设置</Text></View>
                    <View style={styles.topMiddle}></View>
                </View>
                {this._renderList()}
            </View>
        );
    }
}

var styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        paddingTop: 25,
    },
    topView: {
        width: '100%',
        height: 42,
        borderBottomWidth: 1,
        borderColor: '#E6E6E6',
        flexDirection: 'row',
    },
    topLeft: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    topMiddle: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    backIcon: {
        marginLeft: 16,
        height: 18,
    },
    title: {
        fontSize: 18,
        color: '#333333',
    },
    rowsContainer: {
       width: '100%',
        height: '100%',
    },
    rowContainer: {
        height: 75,
        flexDirection: 'row',
        marginLeft: 25,
        marginRight: 25,
        borderBottomWidth: 1,
        borderColor: '#E6E6E6',
    },
    rowLeft: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    rowRight: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'flex-end',
    },
    rowText: {
        marginLeft: 12,
        fontSize: 15,
        color: '#222222',
    },
    rowIcon: {
        marginRight: 10,
        height: 24,
    },
    switch: {
        marginRight: 10,
        height: 35,
        width: 65,
    },
    buttonContainer: {
        marginTop: 25,
        width: '100%',
        paddingLeft: 25,
        paddingRight: 25,
    }
})