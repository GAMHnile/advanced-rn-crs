import React, { Component } from "react";
import { View, StyleSheet, Animated } from "react-native";

class Ball extends Component {
    constructor(props){
        super(props)
        this.state={
            position: new Animated.ValueXY({x: 0, y: 0})
        }
    }
  componentDidMount() {
    // this.position = new Animated.ValueXY({ x: 0, y: 0 });
    Animated.spring(this.state.position, {
      toValue: { x: 200, y: 200 },
      useNativeDriver: false
    }).start();
  }
  render() {
    return (
      <Animated.View style={this.state.position.getLayout()}>
        <View style={styles.ball} />
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  ball: {
    height: 60,
    width: 60,
    borderRadius: 30,
    borderWidth: 30,
    borderColor: "black",
  },
});

export default Ball;
