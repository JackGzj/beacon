/**
 * Created by Jack on 2017/3/13.
 */
import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
} from 'react-native';
import TabNavigator from 'react-native-tab-navigator';
import ProcessComponent from './ProcessComponent'
import MapComponent from './MapComponent'
import UserComponent from './UserComponent'

export default class LoginSuccess extends React.Component {
    constructor() {
        super();
        this.state = {
            selectedTab: '就诊流程',
        };
    }

    componentWillMount() {
        if (this.props.tab != 'undefined' && this.props.tab != null) {
            this.setState({selectedTab: this.props.tab})
        };
        if (this.props.detail != 'undefined' && this.props.detail != null) {
            console.log('detail: ' + this.props.detail);
        };
    }

    componentWillUnmount() {
        console.log('LoginSuccess Unmount!');
    }

    render() {
        return (
            <View style={styles.container} >
                <TabNavigator tabBarStyle={styles.tabBarStyle}>
                    <TabNavigator.Item
                        selected={this.state.selectedTab === '就诊流程'}
                        title="就诊流程"
                        titleStyle={styles.tabText}
                        selectedTitleStyle={styles.selectedTabText}
                        renderIcon={() => <Image style={styles.icon} source={require("../images/flow_normal.png")} />}
                        renderSelectedIcon={() => <Image style={styles.icon} source={require("../images/flow_press.png")} />}
                        onPress={() => this.setState({ selectedTab: '就诊流程' })}>
                        <ProcessComponent navigator={this.props.navigator}/>
                    </TabNavigator.Item>
                    <TabNavigator.Item
                        selected={this.state.selectedTab === '地图'}
                        title="地图"
                        titleStyle={styles.tabText}
                        selectedTitleStyle={styles.selectedTabText}
                        renderIcon={() => <Image style={styles.icon} source={require("../images/map_normal.png")} />}
                        renderSelectedIcon={() => <Image style={styles.icon} source={require("../images/map_press.png")} />}
                        onPress={() => this.setState({ selectedTab: '地图' })}>
                        <MapComponent navigator={this.props.navigator}/>
                    </TabNavigator.Item>
                    <TabNavigator.Item
                        selected={this.state.selectedTab === '我的'}
                        title="我的"
                        titleStyle={styles.tabText}
                        selectedTitleStyle={styles.selectedTabText}
                        renderIcon={() => <Image style={styles.icon} source={require("../images/my_normal.png")} />}
                        renderSelectedIcon={() => <Image style={styles.icon} source={require("../images/my_press.png")} />}
                        onPress={() => this.setState({ selectedTab: '我的' })}>
                        <UserComponent navigator={this.props.navigator}/>
                    </TabNavigator.Item>
                </TabNavigator>
            </View>
        );
    }
}
    const styles = StyleSheet.create({
        container: {
            flex: 1
        },
        tabText: {
            color: "#8A8A8A",
            fontSize: 15
        },
        selectedTabText: {
            color: "#3FBCEF",
            fontSize: 15
        },
        icon: {
            width: 27,
            height: 27,
        },
        tabBarStyle: {
            height:65,
            justifyContent:'center',
            paddingBottom: 10,
            paddingTop: 13,
            backgroundColor: '#F8F8F8',
        },
    });