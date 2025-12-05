import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { useScribela } from '../contexts/ScribelaContext';
import { Avatar } from '../components/ui/Avatar';
import { Button } from '../components/ui/Button';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { getRelativeTime } from '../utils/relativeTime';
import { toast } from '../utils/toast';
import { responsive, getResponsiveFontSize, getResponsivePadding, getResponsiveMargin } from '../utils/responsive';

type DuoDiscussionRouteProp = RouteProp<
  { DuoDiscussion: { duoName: string } },
  'DuoDiscussion'
>;

interface DuoMessage {
  id: string;
  user: { name: string };
  content: string;
  timestamp: Date;
}

export const DuoDiscussionScreen: React.FC = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const route = useRoute<DuoDiscussionRouteProp>();
  const { duoName } = route.params;
  const { duoMessages, addDuoMessage, currentUser, markAsRead } = useScribela();

  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  const messages = (duoMessages[duoName] || []).sort((a, b) => {
    return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
  });

  useEffect(() => {
    markAsRead(duoName, 'duo');
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: false });
    }, 100);
  }, [duoName, messages.length]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    setLoading(true);
    try {
      await addDuoMessage(duoName, {
        user: { name: currentUser },
        content: newMessage.trim(),
        date: 'à l\'instant',
      });
      setNewMessage('');
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    } catch (error) {
      console.error('Erreur lors de l\'envoi:', error);
      toast.error('Erreur lors de l\'envoi du message');
    } finally {
      setLoading(false);
    }
  };

  const renderMessage = ({ item }: { item: DuoMessage }) => {
    const isOwnMessage = item.user.name === currentUser;

    return (
      <View
        style={[
          styles.messageContainer,
          isOwnMessage && styles.ownMessageContainer,
        ]}
      >
        {!isOwnMessage && <Avatar name={item.user.name} size={32} />}
        <View
          style={[
            styles.messageBubble,
            isOwnMessage ? styles.ownMessageBubble : styles.otherMessageBubble,
          ]}
        >
          {!isOwnMessage && (
            <Text
              style={[
                styles.messageAuthor,
                { fontFamily: typography.fonts.lora },
              ]}
            >
              {item.user.name}
            </Text>
          )}
          <Text
            style={[
              styles.messageContent,
              { fontFamily: typography.fonts.lora },
            ]}
          >
            {item.content}
          </Text>
          <Text
            style={[
              styles.messageTime,
              { fontFamily: typography.fonts.lora },
            ]}
          >
            {getRelativeTime(item.timestamp)}
          </Text>
        </View>
        {isOwnMessage && <Avatar name={item.user.name} size={32} />}
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      {/* Header */}
      <View style={[styles.header, { paddingTop: Math.max(insets.top, getResponsivePadding(12)) }]}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Avatar name={duoName} size={responsive.width(40)} />
          <Text
            style={[
              styles.headerTitle,
              { fontFamily: typography.fonts.dancingScript },
            ]}
          >
            {duoName}
          </Text>
        </View>
        <View style={styles.placeholder} />
      </View>

      {/* Messages */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessage}
        contentContainerStyle={[
          styles.messagesList,
          { paddingBottom: responsive.height(100) }, // Space for input
        ]}
        onContentSizeChange={() => {
          flatListRef.current?.scrollToEnd({ animated: true });
        }}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text
              style={[
                styles.emptyText,
                { fontFamily: typography.fonts.lora },
              ]}
            >
              Aucun message pour le moment.
            </Text>
            <Text
              style={[
                styles.emptySubtext,
                { fontFamily: typography.fonts.lora },
              ]}
            >
              Commencez la conversation !
            </Text>
          </View>
        }
      />

      {/* Input */}
      <View style={[
        styles.inputContainer,
        { paddingBottom: Math.max(insets.bottom, getResponsivePadding(16)) },
      ]}>
        <TextInput
          style={[
            styles.input,
            { fontFamily: typography.fonts.lora },
          ]}
          placeholder="Écrire un message..."
          placeholderTextColor={colors.mutedForeground}
          value={newMessage}
          onChangeText={setNewMessage}
          multiline
          maxLength={500}
        />
        <Button
          onPress={handleSendMessage}
          disabled={!newMessage.trim() || loading}
          loading={loading}
          style={styles.sendButton}
          size="icon"
        >
          →
        </Button>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: getResponsivePadding(16),
    paddingBottom: getResponsivePadding(12),
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    padding: getResponsivePadding(8),
  },
  backText: {
    fontSize: getResponsiveFontSize(24),
    color: colors.foreground,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    gap: getResponsiveMargin(12),
  },
  headerTitle: {
    fontSize: getResponsiveFontSize(28),
    fontWeight: typography.weights.medium,
    color: colors.foreground,
    fontFamily: typography.fonts.dancingScript,
  },
  placeholder: {
    width: responsive.width(40),
  },
  messagesList: {
    padding: getResponsivePadding(16),
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: getResponsiveMargin(16),
    alignItems: 'flex-end',
  },
  ownMessageContainer: {
    flexDirection: 'row-reverse',
  },
  messageBubble: {
    maxWidth: responsive.isSmallDevice ? '75%' : '70%',
    padding: getResponsivePadding(12),
    borderRadius: responsive.radius(10),
    marginHorizontal: getResponsiveMargin(8),
  },
  ownMessageBubble: {
    backgroundColor: colors.primary,
  },
  otherMessageBubble: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  messageAuthor: {
    fontSize: getResponsiveFontSize(12),
    fontWeight: typography.weights.semibold,
    color: colors.mutedForeground,
    marginBottom: getResponsiveMargin(4),
    lineHeight: responsive.height(18),
  },
  messageContent: {
    fontSize: getResponsiveFontSize(16),
    color: colors.foreground,
    lineHeight: responsive.height(24),
    fontWeight: typography.weights.normal,
  },
  messageTime: {
    fontSize: getResponsiveFontSize(11),
    color: colors.mutedForeground,
    marginTop: getResponsiveMargin(4),
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: getResponsivePadding(16),
    paddingTop: getResponsivePadding(16),
    backgroundColor: colors.card,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: responsive.radius(6),
    paddingHorizontal: getResponsivePadding(12),
    paddingVertical: getResponsivePadding(4),
    maxHeight: responsive.height(100),
    fontSize: getResponsiveFontSize(16),
    color: colors.foreground,
    backgroundColor: colors.inputBackground,
    lineHeight: responsive.height(24),
  },
  sendButton: {
    marginLeft: getResponsiveMargin(8),
    borderRadius: responsive.radius(20),
    width: responsive.width(40),
    height: responsive.height(40),
  },
  emptyContainer: {
    paddingVertical: responsive.height(60),
    paddingHorizontal: getResponsivePadding(16),
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: responsive.screenHeight * 0.3,
  },
  emptyText: {
    fontSize: getResponsiveFontSize(16),
    color: colors.mutedForeground,
    marginBottom: getResponsiveMargin(8),
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: getResponsiveFontSize(14),
    color: colors.mutedForeground,
    textAlign: 'center',
  },
});

