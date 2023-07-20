import React, { useEffect, useRef, useState } from 'react';
import { Text, StyleSheet, View, SafeAreaView, TouchableOpacity, Dimensions, Image, FlatList, Animated } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Slider from '@react-native-community/slider';
import songs from '../modal/data';
import TrackPlayer, { Capability, Event, RepeatMode, State, usePlaybackState, useProgress, useTrackPlayerEvents } from 'react-native-track-player';


const { width, height } = Dimensions.get('window');

const setupPlayer = async () => {
    try {
        await TrackPlayer.setupPlayer();
        await TrackPlayer.add(songs);
    } catch (e) {
        console.log(e)
    }
};

const togglePlayBack = async playBackState => {
    const currentTrack = await TrackPlayer.getCurrentTrack();
    console.log(currentTrack, playBackState, State.Playing);
    if (currentTrack != null) {
        if (playBackState == State.Paused) {
            await TrackPlayer.play();
        } else {
            await TrackPlayer.pause();
        }
    }
};

const MusicPlayer = () => {
    const playBackState = usePlaybackState();
    const [songIndex, setSongIndex] = useState(0);

    // custom reference
    const scrollX = useRef(new Animated.Value(0)).current;
    const songSlider = useRef(null); // Flatlist reference

    useEffect(() => {
        setupPlayer();

        scrollX.addListener(({ value }) => {
            //console.log(`ScrollX : ${value} | Device Width : ${width} `);
            const index = Math.round(value / width);
            setSongIndex(index);
            //  console.log(index);
        });
    }, []);

    const skipToNext = () => {
        songSlider.current.scrollToOffset({
            offset: (songIndex + 1) * width,
        });
    };

    const skipToPrevious = () => {
        songSlider.current.scrollToOffset({
            offset: (songIndex - 1) * width,
        });
    };

    const renderSongs = ({ item, index }) => {
        return (
            <Animated.View style={styles.mainImageWrapper}>
                <View style={[styles.imageWrapper, styles.elevation]} >
                    <Image
                        source={item.artwork}
                        style={styles.musicImage}
                    />
                </View>
            </Animated.View>
        )
    }


    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.mainContainer}>
                {/* image */}
                <Animated.FlatList
                    ref={songSlider}
                    renderItem={renderSongs}
                    data={songs}
                    keyExtractor={item => item.id}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    scrollEventThrottle={16}
                    onScroll={Animated.event(
                        [
                            {
                                nativeEvent: {
                                    contentOffset: { x: scrollX },
                                },
                            },
                        ],
                        { useNativeDriver: true },
                    )}
                />

                {/* Song content */}
                <View>
                    <Text style={[styles.songTitle, styles.songContent]}>{songs[songIndex].title}</Text>
                    <Text style={[styles.songArtist, styles.songContent]}>{songs[songIndex].artist}</Text>
                </View>

                {/* slider */}
                <View>
                    <Slider
                        style={styles.progressBar}
                        value={10}
                        minimumValue={0}
                        maximumValue={100}
                        thumbTintColor='#FFD369'
                        minimumTrackTintColor='#FFD369'
                        maximumTrackTintColor='#FFF'
                        onSlidingComplete={() => { }}
                    />
                    {/* Music progress durations */}
                    <View style={styles.progressLevelDuration}>
                        <Text style={styles.progressLabelText}>00:00</Text>
                        <Text style={styles.progressLabelText}>00:00</Text>
                    </View>
                </View>

                {/* music controls */}
                <View style={styles.musicControlsContainer}>
                    <TouchableOpacity onPress={skipToPrevious}>
                        <Icon name='play-skip-back-outline' size={35} color='#FFD369' />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => togglePlayBack(playBackState)}>
                        <Icon
                            name={playBackState === State.Playing ? 'pause-circle' : 'play-circle'}
                            size={75} color='#FFD369' />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={skipToNext}>
                        <Icon name='play-skip-forward-outline' size={35} color='#FFD369' />
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.bottomContainer}>
                <View style={styles.bottomIconWrapper}>
                    <TouchableOpacity onPress={() => { }}>
                        <Icon name='heart-outline' size={30} color='#888888' />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => { }}>
                        <Icon name='repeat' size={30} color='#888888' />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => { }}>
                        <Icon name='share-outline' size={30} color='#888888' />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => { }}>
                        <Icon name='ellipsis-horizontal' size={30} color='#888888' />
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    )
}

export default MusicPlayer;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#222831',
    },
    mainContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    bottomContainer: {
        width: width,
        alignItems: 'center',
        paddingVertical: 15,
        borderTopColor: '#393E46',
        borderWidth: 2
    },
    bottomIconWrapper: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '80%'
    },
    mainImageWrapper: {
        width: width,
        justifyContent: 'center',
        alignItems: 'center'
    },
    imageWrapper: {
        width: 300,
        height: 340,
        marginBottom: 25,
        marginTop: 20
    },
    musicImage: {
        width: '100%',
        height: '100%',
        borderRadius: 15
    },
    elevation: {
        elevation: 5,
        shadowColor: '#ccc',
        shadowOffset: {
            width: 5,
            height: 5,
        },
        shadowOpacity: 0.5,
        shadowRadius: 3.84
    },
    songContent: {
        textAlign: 'center',
        color: '#EEEEEE'
    },
    songTitle: {
        fontSize: 18,
        fontWeight: '600',
    },
    songArtist: {
        fontSize: 16,
        fontWeight: '300',
    },
    progressBar: {
        width: 350,
        height: 40,
        marginTop: 25,
        flexDirection: 'row'
    },
    progressLevelDuration: {
        width: 340,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    progressLabelText: {
        color: '#fff',
        fontWeight: '500'
    },
    musicControlsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '60%',
        marginTop: 15
    },
})