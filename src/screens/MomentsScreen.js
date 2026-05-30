import React, {useState} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from 'react-native';
import {Colors} from '../theme/colors';

const DEMO_MOMENTS = [
  {
    id: 1,
    user: '小花',
    pet: '布丁',
    content: '今天带布丁去公园玩，它好开心！',
    likes: 5,
    comments: 2,
    time: '2小时前',
  },
  {
    id: 2,
    user: '阿杰',
    pet: '团子',
    content: '团子学会了新技能 🎉',
    likes: 12,
    comments: 3,
    time: '5小时前',
  },
  {
    id: 3,
    user: '莉莉',
    pet: '豆豆',
    content: '周末一起去野餐~',
    likes: 8,
    comments: 1,
    time: '昨天',
  },
];

export default function MomentsScreen() {
  const [moments] = useState(DEMO_MOMENTS);

  function renderMoment({item}) {
    return (
      <View style={styles.card}>
        {/* 用户信息 */}
        <View style={styles.cardHeader}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>🐾</Text>
          </View>
          <View style={styles.headerInfo}>
            <Text style={styles.userName}>{item.user}</Text>
            <Text style={styles.petName}>@{item.pet}</Text>
          </View>
          <Text style={styles.time}>{item.time}</Text>
        </View>

        {/* 内容 */}
        <Text style={styles.content}>{item.content}</Text>

        {/* 互动 */}
        <View style={styles.actions}>
          <TouchableOpacity style={styles.actionBtn}>
            <Text style={styles.actionText}>❤️ {item.likes}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn}>
            <Text style={styles.actionText}>💬 {item.comments}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* 发布动态入口 */}
      <TouchableOpacity style={styles.createBtn}>
        <Text style={styles.createBtnText}>📸 分享你和宠物的日常</Text>
      </TouchableOpacity>

      <FlatList
        data={moments}
        renderItem={renderMoment}
        keyExtractor={item => String(item.id)}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>📸</Text>
            <Text style={styles.emptyText}>还没有动态</Text>
            <Text style={styles.emptySub}>快来分享你和宠物的日常吧</Text>
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
  createBtn: {
    backgroundColor: Colors.primaryLight,
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 4,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.primary,
    borderStyle: 'dashed',
  },
  createBtnText: {
    fontSize: 15,
    color: Colors.primary,
    fontWeight: '600',
  },
  list: {
    padding: 16,
  },
  card: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: Colors.shadow,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  avatarText: {
    fontSize: 20,
  },
  headerInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: Colors.text,
  },
  petName: {
    fontSize: 12,
    color: Colors.textLight,
  },
  time: {
    fontSize: 12,
    color: Colors.textLight,
  },
  content: {
    fontSize: 15,
    color: Colors.text,
    lineHeight: 22,
    marginBottom: 12,
  },
  actions: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: 10,
  },
  actionBtn: {
    marginRight: 24,
  },
  actionText: {
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
