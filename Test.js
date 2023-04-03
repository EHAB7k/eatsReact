import {
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Animated,
} from 'react-native';
import React from 'react';
// import Animated from 'react-native-reanimated';
const DummyData = [
  {
    id: 1,
    name: 'Name 1',
    image: 'https://picsum.photos/200/300?random=1',
  },
  {
    id: 2,
    name: 'Name 2',
    image: 'https://picsum.photos/200/300?random=2',
  },
  {
    id: 3,
    name: 'Name 3',
    image: 'https://picsum.photos/200/300?random=3',
  },
  {
    id: 4,
    name: 'Name 4',
    image: 'https://picsum.photos/200/300?random=4',
  },
  {
    id: 5,
    name: 'Name 5',
    image: 'https://picsum.photos/200/300?random=5',
  },
  {
    id: 6,
    name: 'Name 6',
    image: 'https://picsum.photos/200/300?random=6',
  },
  {
    id: 7,
    name: 'Name 7',
    image: 'https://picsum.photos/200/300?random=7',
  },
  {
    id: 8,
    name: 'Name 8',
    image: 'https://picsum.photos/200/300?random=8',
  },
  {
    id: 9,
    name: 'Name 9',
    image: 'https://picsum.photos/200/300?random=9',
  },
  {
    id: 10,
    name: 'Name 10',
    image: 'https://picsum.photos/200/300?random=10',
  },
];
const AVATAR_SIZE = 180;
const ITEM_SIZE = AVATAR_SIZE + 20 * 3;
const Test = () => {
  const scrollY = React.useRef(new Animated.Value(0)).current;

  const renderItem = ({item, index}) => {
    const inputRange = [-1, 0, ITEM_SIZE * index, ITEM_SIZE * (index + 2)];
    const opacityInputRange = [
      -1,
      0,
      ITEM_SIZE * index,
      ITEM_SIZE * (index + 0.5),
    ];

    const scale = scrollY.interpolate({
      inputRange,
      outputRange: [1, 1, 1, 0],
    });

    const opacity = scrollY.interpolate({
      inputRange: opacityInputRange,
      outputRange: [1, 1, 1, 0],
    });

    return (
      <Animated.View
        style={{
          width: '96%',
          alignSelf: 'center',
          height: 200,
          justifyContent: 'space-between',
          borderRadius: 10,
          backgroundColor: 'white',
          shadowColor: 'silver',
          shadowOpacity: 0.6,
          shadowRadius: 3,
          padding: 2,
          shadowOffset: {width: 0, height: 0},
          marginTop: 20,
          opacity,
          transform: [{scale}],
        }}>
        <Text style={{padding: 10, fontWeight: 'bold'}}>{item.name}</Text>
        <Image
          source={{uri: item.image}}
          style={{
            width: '100%',
            height: AVATAR_SIZE,
            resizeMode: 'cover',
            borderRadius: 10,
          }}></Image>
      </Animated.View>
    );
  };
  return (
    <SafeAreaView
      style={{
        width: '100%',
        padding: 10,
        backgroundColor: '#EFEFEF',
      }}>
      <Animated.FlatList
        onScroll={Animated.event(
          [{nativeEvent: {contentOffset: {y: scrollY}}}],
          {useNativeDriver: true},
        )}
        data={DummyData}
        renderItem={renderItem}
      />
    </SafeAreaView>
  );
};

export default Test;

const styles = StyleSheet.create({});
