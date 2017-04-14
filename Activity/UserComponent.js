/**
 * Created by Jack on 2017/3/14.
 */
import React from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity,
    InteractionManager,
} from 'react-native';
import SettingPage from './SettingPage'
import VisitRecord from './VisitRecord'
import MedicalCard from './MedicalCard'
import StorageUtil from '../Util/StorageUtil'

export default class UserComponent extends React.Component {
    constructor() {
        super();
        this.state = {
            name: '',
        }
    }

    componentWillMount() {
        StorageUtil.getItem('name', (value) => {
            if (value != 'error') {
                this.setState({name: value});
            }
        })
    }

    _jumpToSetting() {
        // 耗时较长的任务，防止卡顿，掉帧
        InteractionManager.runAfterInteractions(() => {
            const { navigator } = this.props;
            if (navigator) {
                navigator.push({
                    name : 'SettingPage',
                    component : SettingPage,
                });
            }
        });
    }

    _jumpToVisitRecord() {
        // 耗时较长的任务，防止卡顿，掉帧
        InteractionManager.runAfterInteractions(() => {
            const { navigator } = this.props;
            if (navigator) {
                navigator.push({
                    name : 'VisitRecord',
                    component : VisitRecord,
                });
            }
        });
    }

    _jumpToMedicalCard() {
        // 耗时较长的任务，防止卡顿，掉帧
        InteractionManager.runAfterInteractions(() => {
            const { navigator } = this.props;
            if (navigator) {
                navigator.push({
                    name : 'MedicalCard',
                    component : MedicalCard,
                });
            }
        });
    }

    render(){
        return (
            <View style={styles.container}>
                <View style={styles.topContainer}>
                    <View style={styles.topLeft}></View>
                    <View style={styles.topMiddle}>
                        <Image source={require('../images/center.png')} style={styles.centerIcon}/>
                        <Text style={styles.userName}>{this.state.name == '' ? 'Jennie' : this.state.name}</Text>
                    </View>
                    <View style={styles.topRigth}>
                        <TouchableOpacity onPress={this._jumpToSetting.bind(this)}>
                            <Image source={require('../images/set.png')} style={styles.settingIcon}/>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.bottomContainer}>
                    <TouchableOpacity onPress={this._jumpToVisitRecord.bind(this)}>
                        <View style={styles.rowContainer}>
                            <View style={styles.rowLeft}>
                                <Text style={styles.rowText}>就诊记录</Text>
                            </View>
                            <View style={styles.rowRight}>
                                <Image source={require('../images/next.png')} style={styles.rowIcon} />
                            </View>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this._jumpToMedicalCard.bind(this)}>
                        <View style={styles.rowContainer}>
                            <View style={styles.rowLeft}>
                                <Text style={styles.rowText}>我的就诊卡</Text>
                            </View>
                            <View style={styles.rowRight}>
                                <Image source={require('../images/next.png')} style={styles.rowIcon} />
                            </View>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>


        );

    }
}

var styles = StyleSheet.create ({
    container: {
        flex: 1,
        alignItems: 'center',
    },
    topContainer: {
        flex: 2,
        width: '100%',
        backgroundColor: '#3FBCEF',
        flexDirection: 'row',
    },
    topLeft: {
        flex: 1,
    },
    topMiddle: {
        flex: 2,
        alignItems: 'center',
        justifyContent: 'center',
    },
    topRigth: {
        flex: 1,
        alignItems: 'flex-end',
        justifyContent: 'flex-start',
    },
    centerIcon: {
        height: 65,
        width: 63,
		resizeMode: 'stretch',
    },
    userName: {
        fontSize: 30,
        color: '#FFFFFF',
        marginTop: 18,
    },
    settingIcon: {
        marginRight: 25,
        marginTop: 25,
        width: 24,
        height: 24,
        resizeMode: 'stretch',
    },
    bottomContainer: {
        flex: 3,
        width: '100%',
    },
    rowContainer: {
        height: 85,
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
        width: 16,
    }
})

