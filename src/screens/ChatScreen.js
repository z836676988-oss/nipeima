import React, {useState} from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {Colors} from '../theme/colors';

export default function ChatScreen({route}) {
  const {user} = route.params;
  const [messages, setMessages] = useState([
    {id: 1, text: '你好呀~', isMe: false},
    {id: 2, text: '你家宠物好可爱！', isMe: false},
    {id: 3, text: '谢谢！你家也是 😊', isMe: true},
  ]);
  const [input, setInput] = useState('');

  function sendMessage() {
    if (!input.trim()) return;
    setMessages(prev => [
      ...prev,
      {id: Date.now(), text: input.trim(), isMe: true},
    ]);
    setInput('');
  }

  function renderMessage({item}) {
    return (
      <View style={[styles.msgRow, item.isMe && styles.msgRowMe]}>
        <View style={[styles.bubble, item.isMe ? styles.bubbleMe : styles.bubbleOther]}>
          <Text style={[styles.msgText, item.isMe && styles.msgTextMe]}>
            {item.text}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={90}>
      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={item => String(item.id)}
        contentContainerStyle={styles.list}
        inverted={false}
      />
      <View style={styles.inputBar}>
        <TextInput
          style={styles.input}
          placeholder="输入消息..."
          placeholderTextColor={Colors.textLight}
          value={input}
          onChangeText={setInput}
          multiline
          maxLength={500}
        />
        <TouchableOpacity style={styles.sendBtn} onPress={sendMessage}>
          <Text style={styles.sendText}>发送</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  list: {
    padding: 16,
    paddingBottom: 8,
  },
  msgRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  msgRowMe: {
    justifyContent: 'flex-end',
  },
  bubble: {
    maxWidth: '75%',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  bubbleOther: {
    backgroundColor: Colors.card,
    borderBottomLeftRadius: 4,
  },
  bubbleMe: {
    backgroundColor: Colors.primary,
    borderBottomRightRadius: 4,
  },
  msgText: {
    fontSize: 15,
    color: Colors.text,
    lineHeight: 22,
  },
  msgTextMe: {
    color: Colors.textWhite,
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: Colors.card,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  input: {
    flex: 1,
    backgroundColor: Colors.inputBg,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 15,
    color: Colors.text,
    maxHeight: 100,
  },
  sendBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginLeft: 8,
  },
  sendText: {
    color: Colors.textWhite,
    fontSize: 15,
    fontWeight: 'bold',
  },
});
