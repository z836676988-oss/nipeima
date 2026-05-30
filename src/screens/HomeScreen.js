import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  Image,
  ActivityIndicator,
} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {Colors} from '../theme/colors';
import {getNearbyPets} from '../api/client';

export default function HomeScreen({navigation}) {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useFocusEffect(
    useCallback(() => {
      loadPets(1, true);
    }, []),
  );

  async function loadPets(p, replace = false) {
    try {
      const res = await getNearbyPets(p);
      const items = res.items || [];
      if (replace) {
        setPets(items);
      } else {
        setPets(prev => [...prev, ...items]);
      }
      setHasMore(items.length >= 20);
      setPage(p);
    } catch (e) {
      console.log('加载失败', e.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  function onRefresh() {
    setRefreshing(true);
    loadPets(1, true);
  }

  function loadMore() {
    if (!loading && hasMore) {
      loadPets(page + 1);
    }
  }

  function renderPetCard({item}) {
    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('PetDetail', {pet: item})}
        activeOpacity={0.9}>
        {/* 宠物头像 */}
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {item.avatar ? '🐾' : item.breed_name ? '🐕' : '🐱'}
            </Text>
          </View>
        </View>

        {/* 信息 */}
        <View style={styles.cardInfo}>
          <View style={styles.cardHeader}>
            <Text style={styles.petName}>{item.name}</Text>
            <Text style={styles.gender}>
              {item.gender === 'male' ? '♂' : '♀'}
            </Text>
            <Text style={styles.age}>{item.age}岁</Text>
          </View>
          <Text style={styles.breed}>{item.breed_name}</Text>
          <Text style={styles.personality} numberOfLines={1}>
            {item.personality || '性格温顺'}
          </Text>
          <View style={styles.ownerRow}>
            <Text style={styles.ownerLabel}>主人:</Text>
            <Text style={styles.ownerName}>{item.owner_nickname}</Text>
            {item.distance > 0 && (
              <Text style={styles.distance}>
                {item.distance < 1
                  ? `${Math.round(item.distance * 1000)}m`
                  : `${item.distance.toFixed(1)}km`}
              </Text>
            )}
          </View>
        </View>

        {/* 匹配按钮 */}
        <TouchableOpacity
          style={styles.matchBtn}
          onPress={() => navigation.navigate('PetDetail', {pet: item})}>
          <Text style={styles.matchBtnText}>💕</Text>
        </TouchableOpacity>
      </TouchableOpacity>
    );
  }

  if (loading && pets.length === 0) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>正在寻找附近的宠物...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* 顶部横幅 */}
      <View style={styles.banner}>
        <Text style={styles.bannerTitle}>🐾 附近的小可爱</Text>
        <Text style={styles.bannerSub}>帮你的宠物找对象吧</Text>
      </View>

      <FlatList
        data={pets}
        renderItem={renderPetCard}
        keyExtractor={(item, index) => String(item.id || index)}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[Colors.primary]}
            tintColor={Colors.primary}
          />
        }
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>🐶</Text>
            <Text style={styles.emptyText}>附近还没有宠物哦</Text>
            <Text style={styles.emptySub}>先去添加你的宠物吧</Text>
          </View>
        }
        ListFooterComponent={
          hasMore && pets.length > 0 ? (
            <ActivityIndicator
              style={styles.footer}
              color={Colors.primary}
            />
          ) : null
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
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.bg,
  },
  loadingText: {
    marginTop: 12,
    color: Colors.textLight,
    fontSize: 14,
  },
  banner: {
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  bannerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.primaryDark,
  },
  bannerSub: {
    fontSize: 13,
    color: Colors.textLight,
    marginTop: 2,
  },
  list: {
    padding: 16,
    paddingBottom: 80,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    shadowColor: Colors.shadow,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 3,
    alignItems: 'center',
  },
  avatarContainer: {
    marginRight: 14,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 32,
  },
  cardInfo: {
    flex: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  petName: {
    fontSize: 17,
    fontWeight: 'bold',
    color: Colors.text,
    marginRight: 6,
  },
  gender: {
    fontSize: 16,
    marginRight: 8,
  },
  age: {
    fontSize: 13,
    color: Colors.textLight,
  },
  breed: {
    fontSize: 13,
    color: Colors.textLight,
    marginBottom: 2,
  },
  personality: {
    fontSize: 13,
    color: Colors.text,
    marginBottom: 4,
  },
  ownerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ownerLabel: {
    fontSize: 12,
    color: Colors.textLight,
    marginRight: 4,
  },
  ownerName: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: '600',
  },
  distance: {
    fontSize: 11,
    color: Colors.textLight,
    marginLeft: 8,
  },
  matchBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  matchBtnText: {
    fontSize: 22,
  },
  empty: {
    alignItems: 'center',
    paddingTop: 60,
  },
  emptyIcon: {
    fontSize: 64,
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
  footer: {
    paddingVertical: 20,
  },
});
