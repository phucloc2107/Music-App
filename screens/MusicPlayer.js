import React, { useEffect, useRef, useState } from 'react';
import { Text, StyleSheet, View, SafeAreaView, TouchableOpacity, Dimensions, Image, FlatList, Animated } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Slider from '@react-native-community/slider';
import songs from '../modal/data';
import TrackPlayer, { Capability, Event, RepeatMode, State, usePlaybackState, useProgress, useTrackPlayerEvents } from 'react-native-track-player';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const { width, height } = Dimensions.get('window');

const setupPlayer = async () => {
    try {
        await TrackPlayer.setupPlayer();
        await TrackPlayer.updateOptions({
            capabilities: [
                Capability.Play,
                Capability.Pause,
                Capability.SkipToNext,
                Capability.SkipToPrevious,
                Capability.Stop,
            ],
        });
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
    const progress = useProgress();
    const [songIndex, setSongIndex] = useState(0);
    const [tracktitle, setTrackTitle] = useState();
    const [trackArtist, setTrackArtist] = useState();
    const [trackArtWork, setTrackArtWork] = useState();

    const [repeatMode, setRepeatMode] = useState('off');

    // custom reference
    const scrollX = useRef(new Animated.Value(0)).current;
    const songSlider = useRef(null); // Flatlist reference

    // Changing the track
    useTrackPlayerEvents([Event.PlaybackTrackChanged], async event => {
        if (event.type === Event.PlaybackTrackChanged && event.nextTrack !== null) {
            const track = await TrackPlayer.getTrack(event.nextTrack);
            const { title, artist, artwork } = track;
            setTrackTitle(title);
            setTrackArtist(artist);
            setTrackArtWork(artwork);
        }
    });

    const repeatIcon = () => {
        if (repeatMode == 'off') {
            return 'repeat-off';
        }

        if (repeatMode == 'track') {
            return 'repeat-once';
        }

        if (repeatMode == 'repeat') {
            return 'repeat';
        }
    };

    const changeRepeatMode = () => {
        if (repeatMode == 'off') {
            TrackPlayer.setRepeatMode(RepeatMode.Track);
            setRepeatMode('track');
        }

        if (repeatMode == 'track') {
            TrackPlayer.setRepeatMode(RepeatMode.Queue);
            setRepeatMode('repeat');
        }

        if (repeatMode == 'repeat') {
            TrackPlayer.setRepeatMode(RepeatMode.Off);
            setRepeatMode('off');
        }
    };

    const skipTo = async trackId => {
        await TrackPlayer.skip(trackId);
    };

    useEffect(() => {
        setupPlayer();

        scrollX.addListener(({ value }) => {
            //console.log(`ScrollX : ${value} | Device Width : ${width} `);
            const index = Math.round(value / width);
            skipTo(index);
            setSongIndex(index);
            //  console.log(index);
        });

        return () => {
            scrollX.removeAllListeners();
            TrackPlayer.destroy();
        };
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
                        source={trackArtWork}
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
                    <Text style={[styles.songTitle, styles.songContent]}>{tracktitle}</Text>
                    <Text style={[styles.songArtist, styles.songContent]}>{trackArtist}</Text>
                </View>

                {/* slider */}
                <View>
                    <Slider
                        style={styles.progressBar}
                        value={progress.position}
                        minimumValue={0}
                        maximumValue={progress.duration}
                        thumbTintColor='#FFD369'
                        minimumTrackTintColor='#FFD369'
                        maximumTrackTintColor='#FFF'
                        onSlidingComplete={async value => {
                            await TrackPlayer.seekTo(value);
                        }}
                    />
                    {/* Music progress durations */}
                    <View style={styles.progressLevelDuration}>
                        <Text style={styles.progressLabelText}>
                            {new Date(progress.position * 1000).toLocaleTimeString().substring(3)}
                        </Text>

                        <Text style={styles.progressLabelText}>
                            {new Date((progress.duration - progress.position) * 1000).toLocaleTimeString().substring(3)}
                        </Text>
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

                    <TouchableOpacity onPress={changeRepeatMode}>
                        <MaterialCommunityIcons
                            name={`${repeatIcon()}`}
                            size={30}
                            color={RepeatMode !== 'off' ? '#FFD369' : '#888888'}

                        />
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