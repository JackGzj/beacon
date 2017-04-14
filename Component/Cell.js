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
import Constants from '../Util/Constants'

export default class Cell extends React.Component {
    constructor() {
        super();
        this.uri = '';
    }

    _jumpToMap(detail) {
        if (!Constants.isMapLoaded) {
            Constants.tempDetail = detail;
        }
        DeviceEventEmitter.emit('jumpToMap', detail);
    }

    _getPicURI(tache, state) {
        if (tache === '挂号') {
			this.uri = require('../images/log.png');
			return;
        }
        if (tache === '缴费') {
			this.uri = state === 2 ? require('../images/pay_p.png') : state === 1 ? require('../images/pay_n.png') : require('../images/pay_f.png');
			return;
        }
        if (tache === '门诊') {
			this.uri = state === 2 ? require('../images/inquiry_p.png') : state === 1 ? require('../images/inquiry_n.png') : require('../images/inquiry_f.png');
			return;
        }
        if (tache === '门诊检验') {
			this.uri = state === 2 ? require('../images/check_p.png') : state === 1 ? require('../images/check_n.png') : require('../images/check_f.png');
			return;
        }
        /*switch (tache) {
            case '挂号' : this.uri = require('../images/log.png'); break;
            case '缴费' :
            case '门诊' : this.uri = state === 2 ? require('../images/inquiry_p.png') : state === 1 ? require('../images/inquiry_n.png') : require('../images/inquiry_f.png'); break;
            case '门诊检验' : this.uri = state === 2 ? require('../images/check_p.png') : state === 1 ? require('../images/inquiry_n.png') : require('../images/inquiry_f.png'); break;
        }*/
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
            let details = [], icon = null;
            // 只有一个就诊细节
            if (this.props.data.details == null || this.props.data.details == 'undefined') {
                // 存储环节状态和细节状态
                let protstate = this.props.data.protstate, prodstate = this.props.data.prodstate

                // 是否需要渲染右侧小图标
                if (protstate === 1 && prodstate === 0) {
                    icon = (
                        <View style={styles.detailIcon}><Image source={require('../images/now.png')} style={{width:22, height: 22}}/></View>
                    );
                }
                else {
                    icon = (
                        <View style={styles.detailIcon}/>
                    );
                }

                let dettailRows = [];
                // 有排队信息
                if (this.props.data.queNum != 0 && prodstate == 0) {
                    dettailRows.push(
                        <View style={styles.detailRight} key={0}>
                            <View style={styles.detailTextRowWithMargin}>
                                <Image source={(protstate === 1) ? ((prodstate === 0) ? require('../images/place.png') : require('../images/place_g.png')) : require('../images/place_g.png')} style={styles.detailTextIcon}/>
                                <Text style={(protstate === 1) ? (prodstate === 1 ? styles.text_past : styles.text_now) : styles.text_past}>{this.props.data.prodetailloc}</Text>
                            </View>
                            <View style={styles.detailTextRowWithMargin}>
                                <Image source={(protstate === 1) ? ((prodstate === 0) ? require('../images/people.png') : require('../images/people_g.png')) : require('../images/people_g.png')} style={styles.detailTextIconSquare}/>
                                <Text style={(protstate === 1) ? (prodstate === 1 ? styles.text_past : styles.text_now) : styles.text_past}>{this.props.data.queNum + '人'}</Text>
                            </View>
                            <View style={styles.detailTextRowWithMargin}>
                                <Image source={(protstate === 1) ? ((prodstate === 0) ? require('../images/time.png') : require('../images/time_g.png')) : require('../images/time_g.png')} style={styles.detailTextIconSquare}/>
                                <Text style={(protstate === 1) ? (prodstate === 1 ? styles.text_past : styles.text_now) : styles.text_past}>{this.props.data.queNum * 5 + '分钟'}</Text>
                            </View>
                        </View>
                    )
                }
                else {
                    dettailRows.push(
                        <View style={styles.detailRight} key={0}>
                            <View style={styles.detailTextRow}>
                                <Image source={(protstate === 1) ? ((prodstate === 0) ? require('../images/place.png') : require('../images/place_g.png')) : require('../images/place_g.png')} style={styles.detailTextIcon}/>
                                <Text style={(protstate === 1) ? (prodstate === 1 ? styles.text_past : styles.text_now) : styles.text_past}>{this.props.data.prodetailloc}</Text>
                            </View>
                        </View>
                    );
                }
                // 将该就诊环节作为一行
				details.push(
                    <TouchableOpacity onPress={this._jumpToMap.bind(this, this.props.data.prodetailname)} key={0}>
                        <View style={styles.detailContainer}>
                            <View style={styles.detailLeft}>
                                <Text style={protstate === 1 ? (prodstate === 1 ? styles.detail_past : styles.detail_now) : (protstate === 0 ? styles.detail_future : styles.detail_past)}>{this.props.data.prodetailname}</Text>
                            </View>
                            {dettailRows}
							{icon}
                        </View>
                    </TouchableOpacity>
				);
            }
            else {
				let protstate = this.props.data.protstate, detailsData = this.props.data.details;
				let icon = null;
                for (let i = 0; i < detailsData.length; i++) {
                    let prodstate = detailsData[i].prodstate;
                    // 是否需要渲染右侧小图标
                    if (protstate === 1 && prodstate === 0) {
                        icon = (
                            <View style={styles.detailIcon}><Image source={require('../images/now.png')} style={{width:22, height: 22}}/></View>
                        );
                    }
                    else {
                        icon = (
                            <View style={styles.detailIcon}/>
                        );
                    }

					let dettailRows = [];
					// 有排队信息
					if (detailsData[i].queNum != 0 && prodstate == 0) {
						dettailRows.push(
                            <View style={styles.detailRight} key={0}>
                                <View style={styles.detailTextRowWithMargin}>
                                    <Image source={(protstate === 1) ? ((prodstate === 0) ? require('../images/place.png') : require('../images/place_g.png')) : require('../images/place_g.png')} style={styles.detailTextIcon}/>
                                    <Text style={(protstate === 1) ? (prodstate === 1 ? styles.text_past : styles.text_now) : styles.text_past}>{detailsData[i].prodetailloc}</Text>
                                </View>
                                <View style={styles.detailTextRowWithMargin}>
                                    <Image source={(protstate === 1) ? ((prodstate === 0) ? require('../images/people.png') : require('../images/people_g.png')) : require('../images/people_g.png')} style={styles.detailTextIconSquare}/>
                                    <Text style={(protstate === 1) ? (prodstate === 1 ? styles.text_past : styles.text_now) : styles.text_past}>{detailsData[i].queNum + '人'}</Text>
                                </View>
                                <View style={styles.detailTextRowWithMargin}>
                                    <Image source={(protstate === 1) ? ((prodstate === 0) ? require('../images/time.png') : require('../images/time_g.png')) : require('../images/time_g.png')} style={styles.detailTextIconSquare}/>
                                    <Text style={(protstate === 1) ? (prodstate === 1 ? styles.text_past : styles.text_now) : styles.text_past}>{detailsData[i].queNum * 5 + '分钟'}</Text>
                                </View>
                            </View>
						)
					}
					else {
						dettailRows.push(
                            <View style={styles.detailRight} key={0}>
                                <View style={styles.detailTextRow}>
                                    <Image source={(protstate === 1) ? ((prodstate === 0) ? require('../images/place.png') : require('../images/place_g.png')) : require('../images/place_g.png')} style={styles.detailTextIcon}/>
                                    <Text style={(protstate === 1) ? (prodstate === 1 ? styles.text_past : styles.text_now) : styles.text_past}>{detailsData[i].prodetailloc}</Text>
                                </View>
                            </View>
						);
					}

                    details.push(
                        <TouchableOpacity onPress={this._jumpToMap.bind(this, detailsData[i].prodetailname)} key={i}>
                            <View style={styles.detailContainer}>
                                <View style={styles.detailLeft}>
                                    <Text style={protstate === 1 ? (prodstate === 1 ? styles.detail_past : styles.detail_now) : (protstate == 0 ? styles.detail_future : styles.detail_past)}>{detailsData[i].prodetailname}</Text>
                                </View>
                                {dettailRows}
                                {icon}
                            </View>
                        </TouchableOpacity>
                    );
                    // 多个细节，渲染分割线
                    if (i < detailsData.length - 1) {
                        details.push(
                            <View style={styles.separator} key={i + 100}/>
                        )
                    }
                }
            }
            return (
                <View style={styles.rowContainer}>
                    <View style={styles.leftContainer}>
                        <Image source={this.uri} style={styles.tacheIcon}/>
                        <View style={styles.linkLine}/>
                    </View>
                    <View style={styles.cardContainer}>
                        <View style={this.props.data.protstate === 2 ? styles.cardHeader_past : (this.props.data.protstate === 1 ? styles.cardHeader_now : styles.cardHeader_future)}>
                            <Image source={require('../images/纹理.png')} style={styles.textureImage}>
                                <Text style={styles.tacheTitle}>{this.props.data.protachename}</Text>
                            </Image>
                        </View>
                        {details}
                    </View>
                </View>
            );
            // <Image source={require('../images/纹理.png')} style={styles.textureImage}>
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
        // height: 45,
        // width: '100%',
        // borderTopRightRadius: 5,
        // borderTopLeftRadius: 5,
        justifyContent: 'center',
    },
    cardHeader_now: {
        backgroundColor: '#79C471',
		justifyContent: 'center',
    },
    cardHeader_future: {
        backgroundColor: '#3FBCEf',
        // height: 45,
        // width: '100%',
        // borderTopRightRadius: 5,
        // borderTopLeftRadius: 5,
        justifyContent: 'center',
    },
    tacheTitle: {
        fontSize: 18,
        color : '#FFFFFF',
        alignSelf: 'flex-start',
        marginLeft: 20,
        backgroundColor: '#00000000', // 背景色透明
    },
    detailContainer: {
        flex: 1,
        paddingTop: 20,
        paddingBottom: 17,
        paddingLeft: 12,
        paddingRight: 12,
        backgroundColor: '#FFFFFF',
        borderBottomLeftRadius: 5,
        borderBottomRightRadius: 5,
        flexDirection: 'row',
    },
    detailLeft: {
        flex: 3,
        justifyContent: 'center',
        alignItems: 'center',
        // borderColor: '#000000',
        // borderWidth: 1,
    },
    detailRight: {
        flex: 5,
        justifyContent: 'center',
        alignItems: 'flex-start',
        paddingLeft: 15,
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
    detailTextRowWithMargin: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		marginBottom: 6,
    },
    separator: {
        height: 1,
        backgroundColor: '#E6E6E6',
        marginLeft: 12,
        marginRight: 12,
    },
    text_future: {
        fontSize: 14,
    },
    text_now: {
        color: '#79C470',
        fontSize: 14,
    },
    text_past: {
        color: '#999999',
        fontSize: 14,
    },
    detail_future: {
		fontSize: 15,
    },
	detail_now: {
		color: '#79C470',
		fontSize: 15,
	},
	detail_past: {
		color: '#999999',
		fontSize: 15,
	},
    linkLine: {
        flex: 1,
        width: 1.5,
        backgroundColor: '#E6E6E6',
    },
    textureImage: {
		height: 45,
		width: '100%',
		borderTopRightRadius: 5,
		borderTopLeftRadius: 5,
		justifyContent: 'center',
    },
    tacheIcon: {
        width: 35,
        height: 35,
        alignSelf: 'center'
    },
    detailTextIcon: {
        width: 14,
        height: 18,
        marginRight: 10,
        marginLeft: 2,
        resizeMode: 'stretch'
    },
	detailTextIconSquare: {
		width: 18,
		height: 18,
		marginRight: 10,
		resizeMode: 'stretch'
	},
})

