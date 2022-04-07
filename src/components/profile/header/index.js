import { useNavigation } from '@react-navigation/native'
import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { Avatar } from 'react-native-paper'
import  buttonStyles  from  '../../../styles/buttonStyles'
import styles from './styles'

export default function ProfileHeader({ user }) {
    const navigation = useNavigation()
    return (
        <View style={styles.container}>
            <Avatar.Image size={80} source={{uri: user?.profile}} />
            <Text style={styles.emailText}>{user?.email}</Text>
            <View style={styles.counterContainer}>
                <View style={styles.counterItemContainer}>
                    <Text style={styles.counterNumberText}>0</Text>
                    <Text style={styles.counterLabelText}>Following</Text>
                </View>
                <View style={styles.counterItemContainer}>
                    <Text style={styles.counterNumberText}>0</Text>
                    <Text style={styles.counterLabelText}>Followers</Text>
                </View>
                <View style={styles.counterItemContainer}>
                    <Text style={styles.counterNumberText}>0</Text>
                    <Text style={styles.counterLabelText}>Likes</Text>
                </View>
            </View>
            <TouchableOpacity
                style={buttonStyles.grayOutlinedButton}
                onPress={() => navigation.navigate('profileComment')}
            >
                <Text>See Reviews</Text>
            </TouchableOpacity>
        </View>
    )
}
