import React, { useContext, useEffect, useState } from 'react'
import { View, Text, FlatList,ActivityIndicator } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import styles from './style'
import ProfileNavBar from '../../components/profile/navbar'
import ProfileHeader from '../../components/profile/header'
import ProfilePostList from '../../components/profile/postList'
import { SafeAreaView } from 'react-native-safe-area-context'
import { CurrentUserProfileItemInViewContext } from '../../navigation/feed'
import { useUser } from '../../hooks/useUser'
import { getPostsByUserId } from '../../services/posts'
import { useFocusEffect } from '@react-navigation/native';
import ProfilePostListItem from '../../components/profile/postList/item'
import { getProfilePosts } from '../../Apis/LaravelApis/postApi'
import { Title } from 'react-native-paper'

export default function ProfileScreen({ route },props) {
    const [userPosts, setUserPosts] = useState([])
    const dispatch = useDispatch();
    const user = route?.params.user
    const [nextpage, setnextpage] = useState(null)
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setloading] = useState(true)

    useFocusEffect(
        React.useCallback(() => {
            dispatch(getProfilePosts(`posts/user/${user?.id}`))
            .then((data)=>{
                setloading(false);
                setUserPosts(data?.data?.data);
                setnextpage(data?.data?.next_page_url);
            })
            .catch(err=>{
                console.log(err)
            })
            return () => {
             /*    setloading(false);
                setUserPosts([]);
                setnextpage(null); */
            }
        }, [user])
    );

    const onEnd = () => {
        if (nextpage != null && !refreshing) {
            setRefreshing(true);
            dispatch(getProfilePosts(nextpage))
                .then(data => {
                    let dataa = [...userPosts, ...data?.data?.data];
                    setUserPosts(dataa);
                    setnextpage(data?.data?.next_page_url);
                    setRefreshing(false);
                }).catch(err => {
                    console.log(err)
                    setRefreshing(false);
                });
        } else {
            console.log(nextpage)
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <ProfileNavBar />
            <ProfileHeader user={user} />
            <View style={styles.container}>
            {loading == true || userPosts?.length <= 0 ?
            <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
                <ActivityIndicator color="black" size="small" style={{ display: loading ? "flex" : "none" }} />
                <Text style={{ marginTop: 25, display: loading ? "flex" : "none" }}>Loading <Title>Posts</Title></Text>
                <Text style={{ display: !loading && userPosts?.length <= 0 ? "flex" : "none" }}>User Don't have any <Title>Posts</Title></Text>
            </View>
            :
            <FlatList
                numColumns={3}
                removeClippedSubviews={true}
                maxToRenderPerBatch={20}
                updateCellsBatchingPeriod={10}
                initialNumToRender={20}
                data={userPosts}
                ListFooterComponent={() => <ActivityIndicator color='black' size="small" style={{ marginVertical: 10, display: refreshing ? "flex" : "none" }} />}
                onEndReached={onEnd}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (<ProfilePostListItem item={item} />)}
            />
        }
            </View>
        </SafeAreaView>
    )
}