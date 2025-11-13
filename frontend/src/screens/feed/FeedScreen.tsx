import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { apiService } from '../../services/apiService';
import Video from 'react-native-video';
import Icon from 'react-native-vector-icons/MaterialIcons';
import FastImage from 'react-native-fast-image';

interface Post {
  id: number;
  user_id: number;
  description: string;
  fichier: string;
  type: 'video' | 'image' | 'texte' | 'live';
  vues: number;
  likes_count: number;
  comments_count: number;
  user: {
    id: number;
    nom: string;
    photo?: string;
  };
  created_at: string;
}

const FeedScreen = () => {
  const navigation = useNavigation();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async (pageNum = 1) => {
    try {
      const response = await apiService.get(`/posts?page=${pageNum}`);
      if (pageNum === 1) {
        setPosts(response.data.data.data);
      } else {
        setPosts(prev => [...prev, ...response.data.data.data]);
      }
    } catch (error) {
      console.error('Error loading posts:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    setPage(1);
    loadPosts(1);
  };

  const handleLike = async (postId: number) => {
    try {
      await apiService.post(`/posts/${postId}/like`);
      // Mettre à jour localement
      setPosts(prev => prev.map(post => 
        post.id === postId 
          ? { ...post, likes_count: post.likes_count + (post.liked ? -1 : 1), liked: !post.liked }
          : post
      ));
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const renderPost = ({ item }: { item: Post }) => (
    <TouchableOpacity
      style={styles.postContainer}
      onPress={() => navigation.navigate('PostDetail' as never, { postId: item.id } as never)}
    >
      <View style={styles.postHeader}>
        <TouchableOpacity
          onPress={() => navigation.navigate('UserProfile' as never, { userId: item.user_id } as never)}
          style={styles.userInfo}
        >
          {item.user.photo ? (
            <FastImage source={{ uri: item.user.photo }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Icon name="person" size={20} color="#999" />
            </View>
          )}
          <Text style={styles.username}>{item.user.nom}</Text>
        </TouchableOpacity>
        {item.type === 'live' && (
          <View style={styles.liveBadge}>
            <Text style={styles.liveText}>LIVE</Text>
          </View>
        )}
      </View>

      {item.description && (
        <Text style={styles.description}>{item.description}</Text>
      )}

      {item.type === 'video' && item.fichier && (
        <Video
          source={{ uri: item.fichier }}
          style={styles.media}
          resizeMode="contain"
          paused={false}
          repeat
          muted
        />
      )}

      {item.type === 'image' && item.fichier && (
        <FastImage source={{ uri: item.fichier }} style={styles.media} resizeMode={FastImage.resizeMode.cover} />
      )}

      <View style={styles.postFooter}>
        <TouchableOpacity onPress={() => handleLike(item.id)} style={styles.actionButton}>
          <Icon name="favorite" size={24} color={item.liked ? '#FF6B6B' : '#999'} />
          <Text style={styles.actionText}>{item.likes_count}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate('PostDetail' as never, { postId: item.id } as never)}
          style={styles.actionButton}
        >
          <Icon name="comment" size={24} color="#999" />
          <Text style={styles.actionText}>{item.comments_count}</Text>
        </TouchableOpacity>

        <View style={styles.actionButton}>
          <Icon name="visibility" size={24} color="#999" />
          <Text style={styles.actionText}>{item.vues}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading && posts.length === 0) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#FF6B6B" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={posts}
        renderItem={renderPost}
        keyExtractor={item => item.id.toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        onEndReached={() => {
          const nextPage = page + 1;
          setPage(nextPage);
          loadPosts(nextPage);
        }}
        onEndReachedThreshold={0.5}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  postContainer: {
    backgroundColor: '#FFF',
    marginBottom: 10,
    padding: 15,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  avatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  username: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  liveBadge: {
    backgroundColor: '#FF0000',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
  liveText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 12,
  },
  description: {
    fontSize: 14,
    color: '#333',
    marginBottom: 10,
  },
  media: {
    width: '100%',
    height: 300,
    marginBottom: 10,
    borderRadius: 10,
  },
  postFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  actionText: {
    marginLeft: 5,
    fontSize: 14,
    color: '#666',
  },
});

export default FeedScreen;

