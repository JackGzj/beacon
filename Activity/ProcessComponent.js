/**
 * Created by Jack on 2017/3/14.
 */
import React from 'react';
import {
    View,
    Text,
    Image,
    ListView,
    StyleSheet,
    RefreshControl,
    ActivityIndicator,
    TouchableOpacity,
} from 'react-native';

import NodataPage from './NodataPage'
import ErrorPage from './ErrorPage'
import Constants from '../Util/Constants'
import NetUtil from '../Util/NetUtil'
import Cell from '../Component/Cell'

const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

export default class ProcessComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSource: '',
            loaded: false,
            refreshing: false,
            error: false,
        };
    }

    componentWillMount() {
        NetUtil.getProcess((result) => {
            if (result.success) {
                this.setState({dataSource : result.data, loaded:true, error: false});
            }
            else {
                this.setState({error: true});
            }
        });
    }

    _refresh() {
		NetUtil.getProcess((result) => {
			if (result.success) {
				this.setState({dataSource: result.data, refreshing: false, error: false});
			}
			else {
				this.setState({error: true});
			}
		});
    }

    _pullRefresh() {
        this.setState({refreshing: true});
        NetUtil.getProcess((result) => {
            if (result.success) {
                this.setState({dataSource: result.data, refreshing: false, error: false});
            }
            else {
                this.setState({error: true});
            }
        });
    }



    _renderRow(rowData, sectionID, rowID) {
        // console.log('rowData:' + JSON.stringify(rowData) + ',' + sectionID + ',' + rowID);
        return (
            <Cell data={rowData} rowID={rowID}/>
        );
    }

    _renderFooter() {
        return (
            <View style={{flex:1}}>
                <View style={styles.rowContainer}>
                    <View style={styles.leftContainer}>
                        <Image source={require('../images/end.png')} style={styles.tacheIcon}/>
                    </View>
                    <View style={styles.listHeaderContainer}>
                        <Text style={{color: '#8A8A8A',fontSize: 18}}>结束</Text>
                    </View>
                </View>
                <View style={styles.rowContainer}>
                    <View style={styles.hintContainer}>
                        <Text style={styles.hintText}>{Constants.PROCESS_HINT}</Text>
                    </View>
                </View>
            </View>
        );
    }
    _renderList() {
        // 数据加载是否成功
        if (this.state.loaded) {
            // 加载是否出错
            if (this.state.error) {
                return (<ErrorPage />);
            }
            else {
                // 数据是否为空
                if (this.state.dataSource === '' || this.state.dataSource.length === 0 || this.state.dataSource === null) {
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
                            renderFooter={this._renderFooter.bind(this)}
                            refreshControl={
                    <RefreshControl
                        refreshing={this.state.refreshing}
                        onRefresh={this._pullRefresh.bind(this)}
                        title={'加载中...'}
                        tintColor={'#000000'}
                        progressBackgroundColor="#ffffff"
                     />

                }/>
                    );
                }
            }
        } else {
            return (
                <ActivityIndicator animating={true}
                                   style={[styles.centering]}
                                   size="large"
                                   color="#cccccc"
                />
            );
        }
    }

    render(){
        return (
            <View style={styles.container}>
                <View style={styles.topView}>
                    <View style={{flex: 1}}/>
                    <View style={{flex: 1, justifyContent: 'center'}}>
                        <Text style={styles.title}>就诊流程</Text>
                    </View>
                    <View style={{flex: 1}}>
                        <TouchableOpacity onPress={this._refresh.bind(this)}>
                        <Image source={require('../images/refresh.png')} style={styles.refreshBtn} />
                    </TouchableOpacity>
                    </View>
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
        backgroundColor: '#EFEFEF',
    },
    listStyle: {
        width: '100%',
        paddingTop: 33,
        backgroundColor: '#EFEFEF',
    },
    topView: {
        backgroundColor: '#3FBDF0',
        height: 75,
        width: '100%',
        paddingTop: 25,
        flexDirection: 'row',
        alignItems: 'center',
    },
    title: {
        fontSize: 20,
        color:'#FFFFFF',
        alignSelf: 'center'
    },
    refreshBtn: {
        marginRight: 30,
        width: 25,
        height: 25,
        alignSelf: 'flex-end'
    },
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
	hintContainer: {
		flex: 63,
		height: 25,
		marginBottom: 30,
		justifyContent: 'center',
		alignItems : 'flex-start',
		paddingRight: 15,
        paddingLeft: 15,
	},
    tacheIcon: {
        width: 35,
        height: 35,
        alignSelf: 'center'
    },
    hintText: {
        fontSize: 12,
        color: '#A7A7A7',
        lineHeight: 14,
    }
})
