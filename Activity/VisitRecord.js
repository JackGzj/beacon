/**
 * Created by Jack on 2017/3/24.
 */
import React from 'react';
import {
    View,
    Text,
    Image,
    ListView,
    StyleSheet,
    RefreshControl,
    TouchableOpacity,
    ActivityIndicator,
} from 'react-native';
import NodataPage from './NodataPage'
import ErrorPage from './ErrorPage'
import NetUtil from '../Util/NetUtil'

const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
export default class visitRecord extends React.Component {
    constructor() {
        super();
        this.state = {
            loaded: false,
            dataSource: '',// ['2016年12月24日', '2016年8月21日', '2016年7月5日', '2016年5月3日', '2016年2月27日'],
            refreshing: false,
            error : false,
        }
    }

    _back() {
        const { navigator } = this.props;
        if (navigator) {
            navigator.pop();
        }
    }

    _pullRefresh() {
        this.setState({refreshing: true});
        NetUtil.getVisitRecord((data) => {
            if (data.success == true) {
                this.setState({dataSource: data.data, refreshing: true, error: false});
            }
        });
    }

    componentWillMount() {
        NetUtil.getVisitRecord((data) => {
            if (data.success == true) {
                this.setState({dataSource: data.data, loaded: true, error: false});
            }
        });
    }



    _renderRow(rowData, sectionID, rowID) {
        // console.log('rowData:' + JSON.stringify(rowData) + ',' + sectionID + ',' + rowID);
        return (
            <View style={styles.rowContainer}>
                <View style={styles.rowLeft}>
                    <Image source={require('../images/record.png')} style={styles.recordIcon}/>
                    <Text style={styles.rowText}>{rowData.year}年{rowData.month}月{rowData.day}日</Text>
                </View>
                <View style={styles.rowRight}>
                    <Image source={require('../images/next.png')} style={styles.rowIcon} />
                </View>
            </View>
        );
    }


    _renderList() {
        // 数据加载是否成功
        if (this.state.loaded) {
            // 加载是否出错
            if (this.state.error) {
                return (
                    <TouchableOpacity onPress={this._pullRefresh.bind(this)}>
                        <NodataPage/>
                    </TouchableOpacity>
                );
            }
            else {
                // 数据是否为空
                if (this.state.dataSource == '' || this.state.dataSource.length == 0 || this.state.dataSource == null) {
                    return (
                        <NodataPage/>
                    );
                }
                else {
                    return (
                        <ListView
                            dataSource={ds.cloneWithRows(this.state.dataSource)}
                            renderRow={this._renderRow.bind(this)}
                            style={styles.listStyle}
                            refreshControl={
                                <RefreshControl
                                    refreshing={this.state.refreshing}
                                    onRefresh={this._pullRefresh.bind(this)}
                                    title={'加载中...'}
                                    tintColor={'#000000'}
                                    progressBackgroundColor="#ffffff"
                                />}

                        />
                    );
                }
            }
        } else {
            return (
                <View style={{alignItems: 'center', justifyContent: 'center', flex: 1, backgroundColor: 'white'}}>
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
                    <View style={styles.topMiddle}><Text style={styles.title}>就诊记录</Text></View>
                    <View style={styles.topMiddle}></View>
                </View>
                <View style={styles.rowsContainer}>
                    {this._renderList()}
                </View>
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
        justifyContent: 'center',
    },
    listStyle: {
        paddingLeft: 35,
        paddingRight: 35,
    },
    rowContainer: {
        height: 75,
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderColor: '#E6E6E6',
    },
    rowLeft: {
        flex: 2,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    rowRight: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'flex-end',
    },
    rowIcon: {
        marginRight: 10,
        height: 24,
    },
    rowText: {
        marginLeft: 10,
        fontSize: 18,
        color: '#222222',
    },
    recordIcon: {
        marginLeft: 5,
        width: 18,
        height: 24,
        resizeMode: 'stretch',
    }
})