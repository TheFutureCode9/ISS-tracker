import React, { Component } from 'react';
import { Text, View, FlatList,Dimensions, SafeAreaView, Platform, StatusBar, StyleSheet, Image, ImageBackground} from 'react-native';
import axios from 'axios';

export default class MeteorScreen extends Component {
    constructor(){
        super();
        this.state={
            meteors:{}
        }
    
    }

    getMeteors= ()=>{
        axios.get("https://api.nasa.gov/neo/rest/v1/feed?api_key=dfuVzKwftIRk08a3857879Y1UGXs8dcTYAqnHBwY")
        .then((response)=>{
           this.setState({meteors:response})
        })
        .catch((error)=>{
            alert(error.message)
        })
    }

    componentDidMount(){
        this.meteors()
    }

    display = ({item})=>{
      var meteor = item;
      var bgImg, speed, size;
      if (meteor.threat_score <= 30){
         bgImg = require("../assets/meteorbg3.jpeg");
         speed = require("../assets/meteor_speed1.gif");
         size = 100;
      }
      else if (meteor.threat_score <= 75){
        bgImg = require("../assets/meteorbg2.jpeg");
        speed = require("../assets/meteor_speed2.gif");
        size = 150;
      }
      else{
        bgImg = require("../assets/meteorbg1.jpeg");
        speed = require("../assets/meteor_speed3.gif");
        size = 200;
      }

      return(
        <View>
            <ImageBackground style = {styles.backgroundImage} source = {bgImg} > 
             <View style = {styles.gifContainer}>
              <Image source = {speed} style={{width:size, height:size,alignSelf:"center"}}/>
              <View>
                <Text style = {styles.cardTitle}> {item.name} </Text>
                <Text style = {[styles.cardText,{marginTop:20}]}>velocity (km/h): {item.close_approach_data.relative_velocity.kilometers_per_hour} </Text>
              </View>
             </View>
            </ImageBackground>
        </View>
      )

    }

    render() {
       if(Object.keys(this.state.meteors).length === 0){
        return (
            <View
                style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center"
                }}>
                <Text>Loading</Text>
            </View>
        )
       }
       else{
        var meteorArray = Object.keys(this.state.meteors).map((index)=>{
            return this.state.meteors[index]
        })
        var meteors = [].concat.apply([], meteorArray)
        meteors.forEach(function(item){
            var diameter = (item.estimated_diameter.kilometers.estimated_diameter_min + item.estimated_diameter.kilometers.estimated_diameter_max)/2
            var threatScore = (diameter/item.close_approach_data[0].miss_distance.kilometers)*1000000000
            item.threat_score = threatScore
        });
        meteors.sort(function(a,b){
         return b.threat_score - a.threat_score  
        })
        meteors = meteors.slice(0,5)

        return (
            <View
                style={{
                    flex: 1,
                }}>
                <SafeAreaView style = {styles.safeArea} />
                <FlatList
                 data={meteors}
                 renderItem={this.display}
                 keyExtractor={(item,index)=>{index.toString()}}
                 horizontal={true}
                />
            </View>
        )
       }
    }
}

const styles = StyleSheet.create({
    safeArea:{marginTop:Platform.OS==="android"?StatusBar.currentHeight:0},
    backgroundImage: {
        flex: 1,
        resizeMode: 'cover',
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height
    },
    titleBar: {
        flex: 0.15,
        justifyContent: "center",
        alignItems: "center"
    },
    titleText: {
        fontSize: 30,
        fontWeight: "bold",
        color: "white"
    },
    meteorContainer: {
        flex: 0.85
    },
    listContainer: {
        backgroundColor: 'rgba(52, 52, 52, 0.5)',
        justifyContent: "center",
        marginLeft: 10,
        marginRight: 10,
        marginTop: 5,
        borderRadius: 10,
        padding: 10
    },
    cardTitle: {
        fontSize: 20,
        marginBottom: 10,
        fontWeight: "bold",
        color: "white"
    },
    cardText: {
        color: "white"
    },
    threatDetector: {
        height: 10,
        marginBottom: 10
    },
    gifContainer: {
        justifyContent: "center",
        alignItems: "center",
        flex: 1
    },
    meteorDataContainer: {
        justifyContent: "center",
        alignItems: "center",

    }
})