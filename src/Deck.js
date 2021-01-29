import React, { Component } from "react";
import {
  View,
  Animated,
  PanResponder,
  Dimensions,
  StyleSheet,
} from "react-native";

const SCREEN_WIDTH = Dimensions.get("window").width;
const SWIPE_THRESHOLD = 0.25 * SCREEN_WIDTH;
const SWIPE_OUT_DURATION = 250;

class Deck extends Component {
  static defaultProps = {
    onSwipeRight: () => {},
    onSwipeLeft: () => {},
  };

  constructor(props) {
    super(props);
    const position = new Animated.ValueXY();
    const panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (event, gesture) => {
        //console.log(gesture);
        position.setValue({ x: gesture.dx, y: gesture.dy });
      },
      onPanResponderRelease: (event, gesture) => {
        if (gesture.dx > SWIPE_THRESHOLD) {
          //console.log("swipe right")
          this.forceSwipe("right");
        } else if (gesture.dx < -SWIPE_THRESHOLD) {
          //console.log("swipe left")
          this.forceSwipe("left");
        } else {
          this.resetPosition();
        }
      },
    });

    this.state = { panResponder, position, index: 0 };
  }
  forceSwipe = (direction) => {
    const x = direction === "right" ? SCREEN_WIDTH : -SCREEN_WIDTH;
    Animated.timing(this.state.position, {
      toValue: { x, y: 0 },
      duration: SWIPE_OUT_DURATION,
      useNativeDriver: false,
    }).start(() => {
      this.onSwipeComplete(direction);
    });
  };

  onSwipeComplete = (direction) => {
    const { onSwipeLeft, onSwipeRight, data } = this.props;
    const item = data[this.state.index];
    direction === "right" ? onSwipeRight(item) : onSwipeLeft(item);
    this.state.position.setValue({ x: 0, y: 0 });
    this.setState({ index: this.state.index + 1 });
  };

  resetPosition = () => {
    Animated.spring(this.state.position, {
      toValue: { x: 0, y: 0 },
      useNativeDriver: false,
    }).start();
  };

  getCardStyle = () => {
    const { position } = this.state;
    const rotate = position.x.interpolate({
      inputRange: [-SCREEN_WIDTH * 1.5, 0, SCREEN_WIDTH * 1.5],
      outputRange: ["-120deg", "0deg", "120deg"],
    });
    return {
      ...position.getLayout(),
      transform: [{ rotate }],
    };
  };

  renderedCards() {
    const { index } = this.state;
    if (index >= this.props.data.length) {
      return this.props.renderNoMoreCards();
    }
    return this.props.data.map((item, idx) => {
      if (idx === index) {
        return (
          <Animated.View
            key={item.id}
            style={[ style.cardStyle, this.getCardStyle(), {zIndex: 2}]}
            {...this.state.panResponder.panHandlers}
          >
            {this.props.renderCard(item)}
          </Animated.View>
        );
      } else if (idx > index) {
        return (
          //use animated view to prevent flash when changing from normal view to animated view
          <Animated.View key={item.id} style={[style.cardStyle, {zIndex: 1}]}>
            {this.props.renderCard(item)}
          </Animated.View>
        );
      } else if (idx < index) {
        return null;
      }
    }).reverse();
  }
  render() {
    return  <View>{this.renderedCards()}</View>
    
  }
}

const style = StyleSheet.create({
  cardStyle: {
    position: "absolute",
    width: SCREEN_WIDTH
  },
});

export default Deck;
