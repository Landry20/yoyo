import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { apiService } from '../../services/apiService';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { ImagePickerResponse, launchImageLibrary, launchCamera } from 'react-native-image-picker';
import FastImage from 'react-native-fast-image';

interface Message {
  id: number;
  sender_id: number;
  receiver_id: number;
  contenu: string;
  type: string;
  fichier?: string;
  created_at: string;
  sender: {
    id: number;
    nom: string;
    photo?: string;
  };
}

const ChatScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { userId } = route.params as { userId: number };
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    loadMessages();
    // TODO: Configurer WebSocket ou polling pour les nouveaux messages
  }, []);

  const loadMessages = async () => {
    try {
      const response = await apiService.get(`/messages/${userId}`);
      setMessages(response.data.data);
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: false });
      }, 100);
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!message.trim()) return;

    const messageText = message;
    setMessage('');
    setSending(true);

    try {
      await apiService.post('/messages', {
        receiver_id: userId,
        contenu: messageText,
        type: 'texte',
      });
      loadMessages();
    } catch (error) {
      console.error('Error sending message:', error);
      setMessage(messageText); // Restaurer le message en cas d'erreur
    } finally {
      setSending(false);
    }
  };

  const sendMedia = async (type: 'image' | 'video', uri: string) => {
    setSending(true);
    try {
      const formData = new FormData();
      formData.append('receiver_id', userId.toString());
      formData.append('type', type);
      formData.append('fichier', {
        uri,
        type: type === 'image' ? 'image/jpeg' : 'video/mp4',
        name: `media.${type === 'image' ? 'jpg' : 'mp4'}`,
      } as any);

      await apiService.upload('/messages', formData);
      loadMessages();
    } catch (error) {
      console.error('Error sending media:', error);
    } finally {
      setSending(false);
    }
  };

  const pickImage = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        quality: 0.8,
      },
      (response: ImagePickerResponse) => {
        if (response.assets && response.assets[0]) {
          sendMedia('image', response.assets[0].uri || '');
        }
      }
    );
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isSent = item.sender_id !== userId;
    const isMedia = item.type !== 'texte';

    return (
      <View
        style={[
          styles.messageContainer,
          isSent ? styles.sentMessage : styles.receivedMessage,
        ]}
      >
        {isMedia && item.fichier && (
          <FastImage source={{ uri: item.fichier }} style={styles.mediaMessage} />
        )}
        {item.contenu && (
          <Text style={[styles.messageText, isSent && styles.sentMessageText]}>
            {item.contenu}
          </Text>
        )}
        <Text style={[styles.timestamp, isSent && styles.sentTimestamp]}>
          {new Date(item.created_at).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </Text>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#FF6B6B" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={90}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chat</Text>
        <View style={{ width: 24 }} />
      </View>

      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={item => item.id.toString()}
        style={styles.messagesList}
        contentContainerStyle={styles.messagesContent}
      />

      <View style={styles.inputContainer}>
        <TouchableOpacity onPress={pickImage} style={styles.mediaButton}>
          <Icon name="image" size={24} color="#FF6B6B" />
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          placeholder="Tapez un message..."
          value={message}
          onChangeText={setMessage}
          multiline
          maxLength={5000}
        />
        <TouchableOpacity
          onPress={sendMessage}
          disabled={sending || !message.trim()}
          style={[styles.sendButton, (!message.trim() || sending) && styles.sendButtonDisabled]}
        >
          {sending ? (
            <ActivityIndicator size="small" color="#FFF" />
          ) : (
            <Icon name="send" size={20} color="#FFF" />
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
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
  messagesList: {
    flex: 1,
  },
  messagesContent: {
    padding: 15,
  },
  messageContainer: {
    maxWidth: '75%',
    marginBottom: 10,
    padding: 12,
    borderRadius: 12,
  },
  sentMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#FF6B6B',
  },
  receivedMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFF',
  },
  messageText: {
    fontSize: 14,
    color: '#333',
  },
  sentMessageText: {
    color: '#FFF',
  },
  mediaMessage: {
    width: 200,
    height: 200,
    borderRadius: 8,
    marginBottom: 5,
  },
  timestamp: {
    fontSize: 10,
    color: '#999',
    marginTop: 5,
  },
  sentTimestamp: {
    color: 'rgba(255, 255, 255, 0.8)',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  mediaButton: {
    marginRight: 10,
    padding: 5,
  },
  input: {
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
  sendButtonDisabled: {
    opacity: 0.5,
  },
});

export default ChatScreen;

