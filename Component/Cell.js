/**
 * Created by Jack on 2017/3/18.
 */
import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    DeviceEventEmitter,
} from 'react-native';
import LoginSuccess from '../Activity/LoginSuccess'

export default class Cell extends React.Component {
    constructor() {
        super();
        this.uri = '';
    }

    _jumpToMap(detail) {
        /*const { navigator } = this.props;
        if (navigator) {
            navigator.replace({
                name : 'LoginSuccess',
                component : LoginSuccess,
                params: {
                    tab: '地图',
                    detail: detail,
                }
            });
        }*/
        DeviceEventEmitter.emit('jumpToMap', detail);
    }

    _getPicURI(tache, state) {
        switch (tache) {
            case '挂号' : this.uri = require('../images/log.png'); break;
            case '缴费' : this.uri = state == 2 ? require('../images/pay_p.png') : state == 1 ? require('../images/pay_n.png') : require('../images/pay_f.png'); break;
            case '门诊' : this.uri = state == 2 ? require('../images/inquiry_p.png') : state == 1 ? require('../images/inquiry_n.png') : require('../images/inquiry_f.png'); break;
            case '门诊检验' : this.uri = state == 2 ? require('../images/check_p.png') : state == 1 ? require('../images/inquiry_n.png') : require('../images/inquiry_f.png'); break;
        }
    }

    // 环节状态：0-未完成；1-进行中；2-已完成
    // 细节状态：0-未完成；1-已完成
    render() {
        this._getPicURI(this.props.data.protachename, this.props.data.protstate);
        // 挂号作为就诊流程的开始
        if (this.props.rowID == 0 && this.props.data.protachename == '挂号') {
            return (
                <View style={styles.rowContainer}>
                    <View style={styles.leftContainer}>
                        <Image source={this.uri} style={styles.tacheIcon}/>
                        <View style={styles.linkLine}></View>
                    </View>
                    <View style={styles.listHeaderContainer}>
                        <Text style={{color: '#8A8A8A',fontSize: 18}}>{this.props.data.protachename}</Text>
                    </View>
                </View>
            );
        }
        // 其它就诊环节
        else {
            let details = [];
            // 只有一个就诊细节
            if (this.props.data.details == null || this.props.data.details == 'undefined') {
                // 是否需要渲染右侧小图标
                if (this.props.data.protstate == 1 && this.props.data.prodstate == 0) {
                    var icon = (
                        <View style={styles.detailIcon}><Image source={require('../images/now.png')} style={{width:20, height: 20}}/></View>
                    );
                }
                else {
                    var icon = (
                        <View style={styles.detailIcon}></View>
                    );
                }
                details.push(
                    <TouchableOpacity onPress={this._jumpToMap.bind(this, this.props.data.prodetailname)} key={0}>
                        <View style={styles.detailContainer}>
                            <View style={styles.detailLeft}>
                                <Text style={this.props.data.protstate == 1 ? (this.props.data.prodstate == 1 ? styles.text_past : styles.text_now) : (this.props.data.protstate == 0 ? styles.text_future : styles.text_past)}>{this.props.data.prodetailname}</Text>
                            </View>
                            <View style={styles.detailRight}>
                                <View style={styles.detailTextRow}>
                                    <Image source={(this.props.data.protstate == 1) ? ((this.props.data.prodstate == 0) ? require('../images/place.png') : require('../images/place_g.png')) : require('../images/place_g.png')} style={styles.detailTextIcon}/>
                                    <Text style={(this.props.data.protstate == 1) ? (this.props.data.prodstate == 1 ? styles.text_past : styles.text_now) : styles.text_past}>{this.props.data.prodetailloc}</Text>
                                </View>
                            </View>
                            {icon}
                        </View>
                    </TouchableOpacity>
                );
            }
            else {
                let detailsData = this.props.data.details;
                for (let i = 0; i < detailsData.length; i++) {
                    // 是否需要渲染右侧小图标
                    if (this.props.data.protstate == 1 && this.props.data.prodstate == 0) {
                        var icon = (
                            <View style={styles.detailIcon}><Image source={require('../images/now.png')} style={{width:20, height: 20}}/></View>
                        );
                    }
                    else {
                        var icon = (
                            <View style={styles.detailIcon}></View>
                        );
                    }
                    details.push(
                        <TouchableOpacity onPress={this._jumpToMap.bind(this, detailsData[i].prodetailname)} key={i}>
                            <View style={styles.detailContainer}>
                                <View style={styles.detailLeft}>
                                    <Text style={this.props.data.protstate == 1 ? (detailsData[i].prodstate == 1 ? styles.text_past : styles.text_now) : (this.props.data.protstate == 0 ? styles.text_future : styles.text_past)}>{detailsData[i].prodetailname}</Text>
                                </View>
                                <View style={styles.detailRight}>
                                    <View style={styles.detailTextRow}>
                                        <Image source={(this.props.data.protstate == 1) ? (detailsData[i].prodstate == 0 ? require('../images/place.png') : require('../images/place_g.png')) : require('../images/place_g.png')} style={styles.detailTextIcon}/>
                                        <Text style={this.props.data.protstate == 1 ? (detailsData[i].prodstate == 1 ? styles.text_past : styles.text_now) : styles.text_past}>{detailsData[i].prodetailloc}</Text>
                                    </View>
                                </View>
                                {icon}
                            </View>
                        </TouchableOpacity>
                    )
                    // 多个细节，渲染分割线
                    if (i < detailsData.length - 1) {
                        details.push(
                            <View style={styles.separator} key={i + 100}></View>
                        )
                    }
                }
            }
            return (
                <View style={styles.rowContainer}>
                    <View style={styles.leftContainer}>
                        <Image source={this.uri} style={styles.tacheIcon}/>
                        <View style={styles.linkLine}></View>
                    </View>
                    <View style={styles.cardContainer}>
                        <View style={this.props.data.protstate == 2 ? styles.cardHeader_past : (this.props.data.protstate == 1 ? styles.cardHeader_now : styles.cardHeader_future)}>
                            <Image source={require('../images/纹理.png')} style={styles.textureImage}>
                            <Text style={styles.tacheTitle}>{this.props.data.protachename}</Text>
                            </Image>
                        </View>
                        {details}
                    </View>
                </View>
            );
        }
    }
    // 渲染逻辑：1、是否当前环节；2、是否属于同一环节；3、有没有细节（与2貌似冲突）
}

const styles = StyleSheet.create({
    rowContainer: {
        width: '100%',
        flexDirection: 'row',
    },
    leftContainer: {
        flex: 12,
        alignItems: 'center',
    },
    listHeaderContainer: {
        flex: 63,
        height: 35,
        marginRight: 5,
        marginBottom: 30,
        justifyContent: 'center',
        alignItems : 'flex-start',
        paddingLeft: 22.5,
    },
    cardContainer: {
        flex: 63,
        marginRight: 5,
        marginBottom: 30,
        borderRadius: 10,
        backgroundColor: '#FFFFFF',
    },
    cardHeader_past: {
        backgroundColor: '#DEDEDE',
        height: 45,
        width: '100%',
        borderTopRightRadius: 5,
        borderTopLeftRadius: 5,
        justifyContent: 'center',
    },
    cardHeader_now: {
        backgroundColor: '#79C471',
        height: 45,
        width: '100%',
        borderTopRightRadius: 5,
        borderTopLeftRadius: 5,
        justifyContent: 'center',
    },
    cardHeader_future: {
        backgroundColor: '#3FBCEf',
        height: 45,
        width: '100%',
        borderTopRightRadius: 5,
        borderTopLeftRadius: 5,
        justifyContent: 'center',
    },
    tacheTitle: {
        fontSize: 18,
        color : '#FFFFFF',
        alignSelf: 'flex-start',
        marginLeft: 20,
    },
    detailContainer: {
        height: 85,
        paddingLeft: 22,
        paddingRight: 22,
        backgroundColor: '#FFFFFF',
        borderBottomLeftRadius: 5,
        borderBottomRightRadius: 5,
        flexDirection: 'row',
    },
    detailLeft: {
        flex: 3,
        justifyContent: 'center',
        alignItems: 'flex-start',
        // borderColor: '#000000',
        // borderWidth: 1,
    },
    detailRight: {
        flex: 5,
        justifyContent: 'center',
        alignItems: 'flex-start',
        // borderColor: '#000000',
        // borderWidth: 1,
    },
    detailIcon: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    detailTextRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    separator: {
        height: 1,
        backgroundColor: '#E6E6E6',
        marginLeft: 22,
        marginRight: 22,
    },
    text_future: {
        fontSize: 15,
    },
    text_now: {
        color: '#79C470',
        fontSize: 15,
    },
    text_past: {
        color: '#999999',
        fontSize: 15,
    },
    linkLine: {
        flex: 1,
        width: 1.5,
        backgroundColor: '#E6E6E6',
    },
    textureImage: {
        width: '100%',
        height: '100%',
        justifyContent: 'center'
    },
    tacheIcon: {
        width: 35,
        height: 35,
        alignSelf: 'center'
    },
    detailTextIcon: {
        width: 17,
        height: 22,
        marginRight: 10,
        resizeMode: Image.resizeMode.cover
    },
})

