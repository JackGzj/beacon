/**
 * Created by Jack on 2017/3/21.
 */
import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Animated,
    Image,
} from 'react-native';

export default class ListCards extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            showAnim:new Animated.Value(0)
        };
        this.showorhide=0;
        this.uri = '';
    }

    _showorhideItems(){
        if(typeof(this.props.name)=='undefined'||this.props.name==null){
            return;
        }
        Animated.timing(          // Uses easing functions
            this.state.showAnim,    // The value to drive
            {
                toValue: this.showorhide==0?1:0
            }            // Configuration
        ).start();
        this.showorhide=this.showorhide==0?1:0;
    }

    _getPicURI(tache) {
        let uri = '../images/';
        switch (tache) {
            case '挂号' : this.uri = require('../images/log.png'); break;
            case '缴费' : this.uri = require('../images/pay_n.png'); break;
            case '门诊' : this.uri = require('../images/inquiry_f.png'); break;
            case '门诊检验' : this.uri = require('../images/check_f.png'); break;
        }
    }

    render(){
        this._getPicURI(this.props.title);
        return(
            <View>
                <TouchableOpacity onPress={this._showorhideItems.bind(this)}>
                    <View style={styles.headerLine}>
                        <View style={{flex: 2,backgroundColor: 'yellow'}}><Text>{this.props.name}</Text></View>
                        <View style={styles.headerRows}>
                            <Image source={this.uri} style={{height: 50, width: 50}}/>
                        </View>
                        <View style={{flex: 2,backgroundColor: 'green'}}></View>
                    </View>
                </TouchableOpacity>
                <Animated.View
                    style={{
               height:this.state.showAnim.interpolate({
                 inputRange: [0, 1],
                 outputRange: [0, 40]
               }),
               overflow:'hidden'
             }
            }
                >
                    <View style={styles.showitemContain}>
                            <Text style={{color:"black"}}>{this.props.title==null?'':this.props.title}</Text>
                            <Text style={{color:"black"}}>{this.props.fromwhere==null?'':this.props.fromwhere}</Text>
                    </View>
                </Animated.View>

            </View>

        )
    }
}

const styles=StyleSheet.create({
    headerLine:{
        height:100,
        flexDirection:'row',
        borderBottomWidth:1,
        borderBottomColor:'grey',
    },
    headerRows:{
        flex:1,
        justifyContent:'center',
        alignItems:'center',
    },
    showitemContain:{
        height:40,
        justifyContent:'center',
        alignItems:'center',
    }

});
