import React, {useState} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {Colors} from '../theme/colors';

// 匹配页面（演示数据，实际对接后端 /pets/match 相关接口）
const DEMO_MATCHES = [
  {id: 1, name: '布丁', breed: '金毛', gender: 'female', age: 2, status: 'matched', owner: '小花'},
  {id: 2, name: '团子', breed: '布偶猫', gender: 'male', age: 1, status: 'pending', owner: '阿杰'},
  {id: 3, name: '豆豆', breed: '柯基', gender: 'female', age: 3, status: 'pending', owner: '莉莉'},
];

export default function MatchScreen() {
  const [matches] = useState(DEMO_MATCHES);

  function renderMatch({item}) {
    const isMatched = item.status === 'matched';
    return (
      <TouchableOpacity
        style={[styles.card, isMatched && styles.cardMatched]}
        activeOpacity={0.8}>
        <View style={[styles.avatar, isMatched && styles.avatarMatched]}>
          <Text style={styles.avatarText}>🐾</Text>
        </View>
        <View style={styles.info}>
          <View style={styles.nameRow}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.gender}>
              {item.gender === 'male' ? '♂' : '♀'}
            </Text>
            <Text style={styles.age}>{item.age}岁</Text>
          </View>
          <Text style={styles.breed}>{item.breed}</Text>
          <Text style={styles.owner}>主人: {item.owner}</Text>
        </View>
        <View style={styles.statusBadge}>
          <Text style={[styles.statusText, isMatched && styles.statusMatched]}>
            {isMatched ? '✅ 已匹配' : '⏳ 待回应'}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={matches}
        renderItem={renderMatch}
        keyExtractor={item => String(item.id)}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.headerTitle}>💕 匹配记录</Text>
            <Text style={styles.headerSub}>你发出的匹配请求</Text>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>💔</Text>
            <Text style={styles.emptyText}>还没有匹配记录</Text>
            <Text style={styles.emptySub}>去首页看看有没有心仪的宠物吧</Text>
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
  header: {
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
  },
  headerSub: {
    fontSize: 13,
    color: Colors.textLight,
    marginTop: 2,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: Colors.shadow,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 2,
  },
  cardMatched: {
    borderLeftWidth: 4,
    borderLeftColor: Colors.success,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarMatched: {
    backgroundColor: '#D4EDDA',
  },
  avatarText: {
    fontSize: 28,
  },
  info: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
    marginRight: 6,
  },
  gender: {
    fontSize: 14,
    marginRight: 6,
  },
  age: {
    fontSize: 13,
    color: Colors.textLight,
  },
  breed: {
    fontSize: 13,
    color: Colors.textLight,
  },
  owner: {
    fontSize: 12,
    color: Colors.primary,
    marginTop: 2,
  },
  statusBadge: {
    marginLeft: 8,
  },
  statusText: {
    fontSize: 12,
    color: Colors.warning,
    fontWeight: '600',
  },
  statusMatched: {
    color: Colors.success,
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
