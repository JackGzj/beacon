/**
 * Created by Jack on 2017/3/26.
 */
import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
} from 'react-native';

export default class NodataPage extends React.Component {
    render() {
        return(
            <View style={styles.container}>
                <Image source={require('../images/omg.png')} style={styles.icon}/>
                <Text style={styles.text}>您当前没有记录哦~</Text>
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
        width: 180,
        height: 168,
        resizeMode: 'stretch'
    },
    text: {
        marginTop: 20,
        fontSize: 15,
        color: '#828282',
    }
})