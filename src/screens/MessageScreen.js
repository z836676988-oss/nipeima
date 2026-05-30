import React, {useState} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {Colors} from '../theme/colors';

const DEMO_CONVERSATIONS = [
  {id: 1, name: '小花', lastMsg: '你家狗狗好可爱呀~', time: '10:30', unread: 2, avatar: '👩'},
  {id: 2, name: '阿杰', lastMsg: '周末一起遛狗吗？', time: '昨天', unread: 0, avatar: '👨'},
  {id: 3, name: '莉莉', lastMsg: '好的，下次约', time: '周二', unread: 0, avatar: '👩'},
];

export default function MessageScreen({navigation}) {
  const [conversations] = useState(DEMO_CONVERSATIONS);

  function renderConversation({item}) {
    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('Chat', {user: item})}
        activeOpacity={0.8}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{item.avatar}</Text>
          {item.unread > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{item.unread}</Text>
            </View>
          )}
        </View>
        <View style={styles.info}>
          <View style={styles.topRow}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.time}>{item.time}</Text>
          </View>
          <Text style={styles.lastMsg} numberOfLines={1}>
            {item.lastMsg}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={conversations}
        renderItem={renderConversation}
        keyExtractor={item => String(item.id)}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>💬</Text>
            <Text style={styles.emptyText}>暂无消息</Text>
            <Text style={styles.emptySub}>匹配成功后就可以聊天啦</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  list: {
    padding: 16,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    alignItems: 'center',
    shadowColor: Colors.shadow,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 2,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: Colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    position: 'relative',
  },
  avatarText: {
    fontSize: 24,
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: Colors.error,
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: Colors.textWhite,
    fontSize: 11,
    fontWeight: 'bold',
  },
  info: {
    flex: 1,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
  },
  time: {
    fontSize: 12,
    color: Colors.textLight,
  },
  lastMsg: {
    fontSize: 14,
    color: Colors.textLight,
  },
  empty: {
    alignItems: 'center',
    paddingTop: 60,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 16,
    color: Colors.text,
    fontWeight: '600',
  },
  emptySub: {
    fontSize: 13,
    color: Colors.textLight,
    marginTop: 4,
  },
});
