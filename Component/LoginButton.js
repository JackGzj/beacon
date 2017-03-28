/**
 * Created by Jack on 2017/3/13.
 */
import React, { Component } from 'react';
import {
    ToolbarAndroid,
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Image,
    TextInput,
    TouchableOpacity
} from 'react-native';
var size = 15;
export default class LoginButton extends Component {
    constructor(props) {
        super(props);
        this.state = {text: ''};
    }

    componentWillMount() {
        size = this.props.fontsize;
    }

    render() {
        return (
            <TouchableOpacity onPress={this.props.onPressCallback} style={LoginStyles.loginTextView}>
                <Text style={LoginStyles.loginText}>
                    {this.props.name}
                </Text>
            </TouchableOpacity>
        );
    }
}
const LoginStyles = StyleSheet.create({

    loginText: {
        color: '#ffffff',
        fontWeight: 'bold',
        // width:30,
        textAlign:'center',
        fontSize: size,
    },
    loginTextView: {
        marginTop: 30,
        height:50,
        backgroundColor: '#93C1FF',
        borderRadius:5,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems:'center',
    },
});