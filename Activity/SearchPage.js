/**
 * Created by Jack on 2017/3/28.
 */
import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TextInput,
    TouchableOpacity,
    DeviceEventEmitter,
} from 'react-native';

export default class SearchPage extends React.Component {
    constructor() {
        super();
        this.state = {
            text : '',
        };
    }

    _back() {
        const { navigator } = this.props;
        if (navigator) {
            navigator.pop();

        }
    }

    _search() {
        // pop方法无法带参，需使用监听器传参
        if (this.state.text != '') {
            DeviceEventEmitter.emit('changeSearch',this.state.text);
        }

        const { navigator } = this.props;
        if (navigator) {
            navigator.pop();

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
                    <View style={styles.topMiddle}>
                        <TextInput placeholder='搜地点' placeholderTextColor='#C2C2C2' style={styles.searchBox} onChangeText={(text) => this.setState({text: text})}/>
                    </View>
                    <TouchableOpacity onPress={this._search.bind(this)}>
                        <View style={styles.topRight}>
                            <Text style={styles.searchText}>搜索</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={styles.bottomContainer}>
                    <View style={styles.facilityContainer}>
                        <Text style={styles.bottomText}>便民设施</Text>
                        <View style={styles.facilityItems}>
                            <TouchableOpacity>
                                <View style={styles.facilityItem}>
                                    <Text style={styles.facilityText}>洗手间</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity>
                                <View style={styles.facilityItem}>
                                    <Text style={styles.facilityText}>ATM取款机</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={styles.historyContainer}>
                        <Text style={styles.bottomText}>历史记录</Text>
                    </View>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
    },
    topView: {
        flexDirection: 'row',
        paddingTop: 24,
        height: 60,
        alignItems: 'center'
    },
    topLeft: {
        flex: 1,
    },
    topMiddle: {
        flex: 4,
    },
    topRight: {
        width: 50,
        height: 27,
        // marginTop: 3,
        marginLeft: 10,
        marginRight:6,
        backgroundColor: '#92C1FF',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
    },
    searchBox: {
        flex: 1,
        height: 27,
        backgroundColor: '#F3F2F2',
        color: '#C2C2C2',
        borderRadius: 10,
        paddingLeft: 5,
    },
    searchText: {
        fontSize: 15,
        color: "#FFFFFF"
    },
    backIcon: {
        marginLeft: 17,
        height: 18,
    },
    bottomContainer: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
    },
    facilityContainer: {
        flex: 1,
        width: '100%',
        paddingTop: 27,
    },
    facilityItems: {
        marginTop: 18,
        marginBottom: 50,
        width: '100%',
        height: 27,
        flexDirection: 'row'
    },
    facilityItem: {
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#92C1FF',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 20,
        paddingLeft: 12,
        paddingRight: 12,
        paddingTop: 3,
        paddingBottom: 3,
    },
    facilityText: {
        fontSize: 15,
    },
    bottomText: {
        fontSize: 15,
        color: '#92C1FF',
        marginLeft: 17,
    },
    historyContainer: {
        flex: 4,
        width: '100%',
    },
})