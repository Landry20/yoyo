import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { apiService } from '../../services/apiService';
import Video from 'react-native-video';
import Icon from 'react-native-vector-icons/MaterialIcons';
import FastImage from 'react-native-fast-image';

interface Comment {
  id: number;
  contenu: string;
  anonyme: boolean;
  user: {
    id: number;
    nom: string;
    photo?: string;
  };
  created_at: string;
}

interface Post {
  id: number;
  description: string;
  fichier: string;
  type: string;
  user: {
    id: number;
    nom: string;
    photo?: string;
  };
  comments: Comment[];
}

const PostDetailScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { postId } = route.params as { postId: number };
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadPost();
  }, []);

  const loadPost = async () => {
    try {
      const response = await apiService.get(`/posts/${postId}`);
      setPost(response.data.data);
    } catch (error) {
      console.error('Error loading post:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitComment = async () => {
    if (!comment.trim()) return;

    setSubmitting(true);
    try {
      await apiService.post(`/posts/${postId}/comments`, {
        contenu: comment,
        anonyme: isAnonymous,
      });
      setComment('');
      setIsAnonymous(false);
      loadPost(); // Recharger pour afficher le nouveau commentaire
    } catch (error) {
      console.error('Error submitting comment:', error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#FF6B6B" />
      </View>
    );
  }

  if (!post) {
    return (
      <View style={styles.center}>
        <Text>Post non trouvé</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Post</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.postContainer}>
          <View style={styles.postHeader}>
            {post.user.photo ? (
              <FastImage source={{ uri: post.user.photo }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Icon name="person" size={20} color="#999" />
              </View>
            )}
            <Text style={styles.username}>{post.user.nom}</Text>
          </View>

          {post.description && (
            <Text style={styles.description}>{post.description}</Text>
          )}

          {post.type === 'video' && post.fichier && (
            <Video
              source={{ uri: post.fichier }}
              style={styles.media}
              resizeMode="contain"
              controls
            />
          )}

          {post.type === 'image' && post.fichier && (
            <FastImage source={{ uri: post.fichier }} style={styles.media} resizeMode={FastImage.resizeMode.cover} />
          )}
        </View>

        <View style={styles.commentsSection}>
          <Text style={styles.sectionTitle}>Commentaires</Text>

          {post.comments.map((comment) => (
            <View key={comment.id} style={styles.comment}>
              <View style={styles.commentHeader}>
                <Text style={styles.commentAuthor}>
                  {comment.anonyme ? 'Utilisateur anonyme' : comment.user.nom}
                </Text>
                {comment.anonyme && (
                  <Icon name="lock" size={16} color="#999" />
                )}
              </View>
              <Text style={styles.commentText}>{comment.contenu}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      <View style={styles.commentInputContainer}>
        <TouchableOpacity
          onPress={() => setIsAnonymous(!isAnonymous)}
          style={styles.anonymousButton}
        >
          <Icon
            name={isAnonymous ? 'lock' : 'lock-open'}
            size={20}
            color={isAnonymous ? '#FF6B6B' : '#999'}
          />
        </TouchableOpacity>
        <TextInput
          style={styles.commentInput}
          placeholder="Ajouter un commentaire..."
          value={comment}
          onChangeText={setComment}
          multiline
        />
        <TouchableOpacity
          onPress={handleSubmitComment}
          disabled={submitting || !comment.trim()}
          style={styles.sendButton}
        >
          {submitting ? (
            <ActivityIndicator size="small" color="#FFF" />
          ) : (
            <Icon name="send" size={20} color="#FFF" />
          )}
        </TouchableOpacity>
      </View>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  content: {
    flex: 1,
  },
  postContainer: {
    backgroundColor: '#FFF',
    padding: 15,
    marginBottom: 10,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
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
  description: {
    fontSize: 14,
    color: '#333',
    marginBottom: 10,
  },
  media: {
    width: '100%',
    height: 300,
    borderRadius: 10,
  },
  commentsSection: {
    backgroundColor: '#FFF',
    padding: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  comment: {
    marginBottom: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  commentAuthor: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginRight: 5,
  },
  commentText: {
    fontSize: 14,
    color: '#666',
  },
  commentInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  anonymousButton: {
    marginRight: 10,
    padding: 5,
  },
  commentInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    maxHeight: 100,
  },
  sendButton: {
    marginLeft: 10,
    backgroundColor: '#FF6B6B',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default PostDetailScreen;

