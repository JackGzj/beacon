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
export default class MedicalCard extends React.Component {
    constructor() {
        super();
        this.state = {
            loaded: false,
            dataSource: '',
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
        NetUtil.getMedicalCard((data) => {
            if (data.success == true) {
                this.setState({dataSource: data.data, refreshing: false, error: false});
            }
            else {
                this.setState({error: true});
            }
        });
    }

    componentWillMount() {
        NetUtil.getMedicalCard((data) => {
            if (data.success  == true) {
                this.setState({dataSource: data.data, loaded: true, error: false});
            }
            else {
                this.setState({error: true});
            }
        });
    }

    _renderRow(rowData, sectionID, rowID) {
        // console.log('rowData:' + JSON.stringify(rowData) + ',' + sectionID + ',' + rowID);
        return (
            <View style={styles.rowContainer}>
                <View style={styles.rowTop}>
                    <View style={styles.rowLeft}>
                        <Image source={require('../images/card.png')} style={styles.cardIcon}/>
                        <Text style={styles.rowText}>{rowData.pathcardid}</Text>
                    </View>
                </View>
                <View style={styles.rowBottom}>
                    <View style={styles.rowLeft}>
                        <Image source={require('../images/hospital.png')} style={styles.hospitalIcon}/>
                        <Text style={styles.rowText}>{rowData.hosname}</Text>
                    </View>
                </View>
            </View>
        );
    }


    _renderList() {
        // 数据是否加载成功
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
                        <TouchableOpacity onPress={this._pullRefresh.bind(this)}>
                            <NodataPage/>
                        </TouchableOpacity>
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
                };
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
                    <View style={styles.topMiddle}><Text style={styles.title}>我的就诊卡</Text></View>
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
        height: 94,
        borderBottomWidth: 1,
        borderColor: '#E6E6E6',
    },
    rowTop: {
        flex: 1,
        flexDirection: 'row',
        marginTop: 20,
    },
    rowBottom: {
        flex: 1,
        marginTop: 12,
        flexDirection: 'row',
        marginBottom: 20,
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
    rowText: {
        marginLeft: 10,
        fontSize: 18,
        color: '#222222',
    },
    cardIcon: {
        marginLeft: 5,
        width: 24,
        height: 18,
        resizeMode: 'stretch',
    },
    hospitalIcon: {
        marginLeft: 5,
        width: 20,
        height: 24,
        resizeMode: 'stretch',
    },
})