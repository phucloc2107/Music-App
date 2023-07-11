import React from 'react';
import { Text, StyleSheet, View, SafeAreaView, TouchableOpacity, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const { width, height } = Dimensions.get('window');

const MusicPlayer = () => {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.mainContainer}>
                {/* image */}

                {/* slider */}

                {/* music controls */}
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
    }
})