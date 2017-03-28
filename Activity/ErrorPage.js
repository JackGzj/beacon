/**
 * Created by Jack on 2017/3/27.
 */
import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
} from 'react-native';

export default class ErrorPage extends React.Component {
    render() {
        return(
            <View style={styles.container}>
                <Image source={require('../images/omg.png')} style={styles.icon}/>
                <Text style={styles.sorryText}>SORRY!</Text>
                <Text style={styles.text}>服务器打瞌睡了~点击重试</Text>
            </View>
        );
    }
}

var styles = StyleSheet.create({
    container: {
        width: '100%',
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        // borderColor: 'black',
        // borderWidth: 1,
    },
    icon: {
        width: 80,
        height: 70,
        resizeMode: 'stretch'
    },
    sorryText: {
        marginTop: 13,
        fontSize: 24,
        color: '#828282',
    },
    describeText: {
        marginTop: 28,
        fontSize: 15,
        color: '#828282',
    },
})