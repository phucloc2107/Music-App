import React from 'react';
import { Text, StyleSheet, View, SafeAreaView, TouchableOpacity, Dimensions, Image } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Slider from '@react-native-community/slider';

const { width, height } = Dimensions.get('window');

const MusicPlayer = () => {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.mainContainer}>
                {/* image */}
                <View style={[styles.imageWrapper, styles.elevation]}>
                    <Image
                        source={require('../assets/img/img1.jpg')}
                        style={styles.musicImage} />
                </View>

                {/* Song content */}
                <View>
                    <Text style={[styles.songTitle, styles.songContent]}>Some Title</Text>
                    <Text style={[styles.songArtist, styles.songContent]}>Some Artist Name</Text>
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
                    <TouchableOpacity onPress={() => { }}>
                        <Icon name='play-skip-back-outline' size={35} color='#FFD369' />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => { }}>
                        <Icon name='pause-circle' size={75} color='#FFD369' />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => { }}>
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
    }
})