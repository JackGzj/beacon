/**
 * Created by Jack on 2017/3/14.
 */
import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    WebView,
    TouchableOpacity,
    DeviceEventEmitter,
} from 'react-native';
import Beacons from 'react-native-beacons-manager'
import BluetoothState from 'react-native-bluetooth-state';
import SearchPage from './SearchPage'
import Constants from '../Util/Constants'
import NetUtil from '../Util/NetUtil'

let url = 'http://120.77.176.18/jztsgz/views/phone/map.jsp';

const region = {
    identifier: 'Jack\'s region',
    uuid: '14F55A33-175B-427A-BB19-D451C724F8BE',
};
let beaconInfo = null;

export default class MapComponent extends React.Component {
    constructor() {
        super();
        this.state = {
            text: '',
            bluetoothState : '',
        };
    }

    componentWillMount() {
        Beacons.requestWhenInUseAuthorization();
        Beacons.startRangingBeaconsInRegion(region);
        Beacons.startUpdatingLocation();
    }

    componentDidMount() {
        // 若地图页面未加载，则不能接收到流程发过来的消息，因此应设置标志
        Constants.isMapLoaded = true;
        // 处理因地图页面未加载而缓存的需要搜索的就诊细节
        if (Constants.tempDetail !== '')
        {
            // 需等待地图加载完才能请求数据并注入地图
            this._getDetail(Constants.tempDetail);
            Constants.tempDetail = '';
        }
        this.subscription = DeviceEventEmitter.addListener('changeSearch',this._getDetail.bind(this));
        this.listener = DeviceEventEmitter.addListener('jumpToMap',this._getDetail.bind(this));

        BluetoothState.subscribe(
            bluetoothState => {
                this.setState({bluetoothState : bluetoothState});
            }
        );
        BluetoothState.initialize();
        // 请求从就诊流程过来的数据
        
        /*this.beaconsDidRange = DeviceEventEmitter.addListener(
            'beaconsDidRange',
            (data) => {
                if (data.beacons.length > 0) {
                    let maxRssi = -999;
                    let maxValue = null;
                    for (var value of data.beacons) {
                        if (value.rssi > maxRssi) {
                            maxRssi = value.rssi;
                            maxValue = value;
                        }
                    };
                    console.log("探测到:" + data.beacons.length + "个beacon\n");
                }
            }
        );*/
    }

    componentWillUnmount() {
        this.subscription.remove();
        this.listener.remove();

        BluetoothState.subscribe.remove();
        Constants.isMapLoaded = false;
        console.log('Map Unmount!');
    }

    webview = null;
    //执行JS代码，会被转为字符串，使用injectedJavaScript方法用eval执行字符串方法
    postMessage = (data) => {
        if (this.webview) {
            this.webview.postMessage(data);
            console.log('post to web:' + data);
            // this.webview.postMessage('window.postMessage("Title："+document.title);');
        }
    }

    //接收WebView JS事件消息
    /*onMessage = e => {
        alert(e.nativeEvent.data);
    }

    getRandomNum(Min,Max) {
        var Range = Max - Min;
        var Rand = Math.random();
        return(Min + Math.round(Rand * Range));
    };

    getRandomPOI() {
        let x = this.getRandomNum(12961573.0231339, 12961707.685251622);
        let y;
        if (x < 12961662.770918518)
            y = this.getRandomNum(4861792.597207305, 4861880.007132653);
        else
        {
            y = this.getRandomNum(4861792.269194061, 4861831.144750178);
        }

        let coord = {
            locx : x,
            locy : y,
            locgound : 1,
            flag : 0,
        }
        return coord;
    };*/

    // 跳转到搜索页面
    _jumpToSearch() {
        const { navigator } = this.props;
        if (navigator) {
            navigator.push({
                name: 'SearchPage',
                component: SearchPage,
                params: {
                    text: this.state.text,
                },
            });
        }
    }

    // 获取到流程页面发送过来的就诊细节名
    _getDetail(data) {
		if (data !== '') {
			this.setState({text: data});
			this._search(data);
		}
    }

    // 搜索地点
    _search(data) {
		var datas = {search:data};
		NetUtil.getSearchLocation(datas, (result) => {
			if (result.success === true) {
				let jsonstr = '{"points":' + JSON.stringify(result.data) + ',"flag":0}';
				this.postMessage(jsonstr);
			}
		});
    }

    // 监听iBeacon
    _getLocation() {
        // alert(this.state.bluetoothState);
        if (this.state.bluetoothState !== 'on') {
            alert('定位需要打开手机蓝牙哟~');
            return;
        }
        else {
            new Promise(function(resolve, reject) {
				const subscription = DeviceEventEmitter.addListener(
                    'beaconsDidRange',
                    (data) => {
                        if (data.beacons.length > 0) {
                            let maxRssi = -999;
                            let maxValue = null;
                            for (let value of data.beacons) {
                                if (value.rssi > maxRssi) {
                                    maxRssi = value.rssi;
                                    maxValue = value;
                                }
                            };
                            beaconInfo = maxValue;
                            console.log("探测到:" + data.beacons.length + "个beacon uuid:" + maxValue.uuid + ' major:' + maxValue.major + ' minor:' + maxValue.minor);
							subscription.remove();
                            resolve('get location success!');
                        }
                    }
                );
                setTimeout(function(){
                    // Beacons.stopUpdatingLocation();
                    // throw new Error('No beacon detected!');
                    reject('No beacon detected!');
                }, 1500);
            })
                .then((data) => {
                    this._getBeaconInfo();
                })
                .catch((error) => {
                    alert(error);
                });
        }
    }

    // 获取iBeacon对应地点
    _getBeaconInfo() {
        if (beaconInfo !== null) {
			let data = {major: beaconInfo.major, minor: beaconInfo.minor};
			NetUtil.getBeaconInfo(data, (result) => {
				if (result.success === true) {
					console.log('search result: ' + JSON.stringify(result.data));
					let jsonstr = '{"points":[' + JSON.stringify(result.data) + '],"flag":1}';
					this.postMessage(jsonstr);
				}
			});
        }

        beaconInfo = null;
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.topView}>
                    <View style={styles.topLeft}>
                        <Image source={require('../images/location.png')} style={styles.locIcon}/>
                        <Text style={styles.locText} numberOfLines={1}>中南财经政法大学</Text>
                    </View>
                    <View style={styles.topMiddle}>
                        <TouchableOpacity onPress={this._jumpToSearch.bind(this)} >
                            <View style={styles.searchBox}>
                                <Text style={styles.searchText}>{this.state.text === '' ? '搜地点' : this.state.text}</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.topRigth}>
                        <TouchableOpacity onPress={this._getLocation.bind(this)} >
                            <Image source={require('../images/navi.png')} style={styles.naviIcon}/>
                        </TouchableOpacity>
                    </View>
                </View>
                <WebView
                    ref={webview => { this.webview = webview; } }
                    style={{
                        // flex: 1,
                        width: '100%',
                        height: '100%',
                        borderWidth: 1,
                        borderColor: 'black'
                    }}
                    source={{uri:url}}
                    onMessage={this.onMessage}
                />
            </View>
        );
        // <TextInput placeholder='搜地点' placeholderTextColor='#C2C2C2' style={styles.searchBox} />
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    topView: {
        flexDirection: 'row',
        paddingTop: 23,
        paddingBottom: 6,
        height: 60,
    },
    topLeft: {
        flex: 2,
        marginLeft: 7,
        flexDirection: 'row',
    },
    topMiddle: {
        flex: 4,
        marginLeft: 10,
    },
    topRight: {
        flex: 1,
        // marginLeft: 8,
        // marginRight:8,
    },
    naviIcon: {
        height: 27,
        width: 27,
        resizeMode: 'stretch',
        marginLeft: 8,
        marginRight: 8,
    },
    searchBox: {
        height: 27,
        width: '100%',
        backgroundColor: '#F3F2F2',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    searchText: {
        color: '#C2C2C2',
        // textAlign: 'center',
        fontSize: 15,
    },
    locIcon: {
        width: 17,
        height: 24,
        marginTop: 3,
        resizeMode: 'stretch'
    },
    locText: {
        width: 79,
        color: '#313131',
        fontSize: 12,
        marginTop: 9,
        marginBottom: 6,
        marginLeft: 6,
    }
});
