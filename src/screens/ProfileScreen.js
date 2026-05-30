import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import {Colors} from '../theme/colors';
import {getMe, getMyPets} from '../api/client';

export default function ProfileScreen({navigation, onLogout}) {
  const [user, setUser] = useState(null);
  const [pets, setPets] = useState([]);

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    try {
      const userData = await getMe();
      setUser(userData);
      const petsData = await getMyPets();
      setPets(petsData.items || petsData || []);
    } catch (e) {
      console.log('加载个人资料失败', e.message);
    }
  }

  function handleLogout() {
    Alert.alert('退出登录', '确定要退出吗？', [
      {text: '取消', style: 'cancel'},
      {text: '退出', onPress: () => onLogout && onLogout(), style: 'destructive'},
    ]);
  }

  return (
    <ScrollView style={styles.container}>
      {/* 用户信息卡片 */}
      <View style={styles.userCard}>
        <View style={styles.userAvatar}>
          <Text style={styles.userAvatarText}>👤</Text>
        </View>
        <Text style={styles.userName}>{user?.nickname || '未设置昵称'}</Text>
        <Text style={styles.userPhone}>{user?.phone || ''}</Text>

        {/* 社交偏好标签 */}
        <View style={styles.tags}>
          <View style={styles.tag}>
            <Text style={styles.tagText}>
              {prefLabel(user?.social_pref)}
            </Text>
          </View>
          <View style={styles.tag}>
            <Text style={styles.tagText}>
              {visLabel(user?.visibility)}
            </Text>
          </View>
        </View>
      </View>

      {/* 我的宠物 */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>我的宠物</Text>
          <TouchableOpacity
            style={styles.addBtn}
            onPress={() => navigation.navigate('CreatePet')}>
            <Text style={styles.addBtnText}>+ 添加</Text>
          </TouchableOpacity>
        </View>

        {pets.length === 0 ? (
          <View style={styles.emptyPets}>
            <Text style={styles.emptyPetsIcon}>🐾</Text>
            <Text style={styles.emptyPetsText}>还没有添加宠物</Text>
            <Text style={styles.emptyPetsSub}>添加宠物开始相亲之旅</Text>
          </View>
        ) : (
          pets.map(pet => (
            <View key={pet.id} style={styles.petCard}>
              <View style={styles.petAvatar}>
                <Text style={styles.petAvatarText}>🐕</Text>
              </View>
              <View style={styles.petInfo}>
                <Text style={styles.petName}>{pet.name}</Text>
                <Text style={styles.petBreed}>{pet.breed?.name || ''}</Text>
              </View>
              <Text style={styles.petGender}>
                {pet.gender === 'male' ? '♂' : '♀'}
              </Text>
            </View>
          ))
        )}
      </View>

      {/* 设置 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>设置</Text>
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuText}>编辑资料</Text>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuText}>隐私设置</Text>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuText}>关于我们</Text>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>
      </View>

      {/* 退出登录 */}
      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Text style={styles.logoutText}>退出登录</Text>
      </TouchableOpacity>

      <View style={{height: 40}} />
    </ScrollView>
  );
}

function prefLabel(p) {
  const map = {active: '😄 爱社交', reserved: '😊 有点社恐', pet_only: '🐕 只聊宠物', anonymous: '👻 完全隐身'};
  return map[p] || '🐕 只聊宠物';
}

function visLabel(v) {
  const map = {public: '🌍 公开', matched_only: '🔒 仅匹配后可见', pet_card_only: '🐾 只看宠物卡片'};
  return map[v] || '🐾 只看宠物卡片';
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  userCard: {
    alignItems: 'center',
    paddingVertical: 30,
    backgroundColor: Colors.card,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 20,
    shadowColor: Colors.shadow,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 3,
  },
  userAvatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  userAvatarText: {
    fontSize: 36,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
  },
  userPhone: {
    fontSize: 14,
    color: Colors.textLight,
    marginTop: 4,
  },
  tags: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 8,
  },
  tag: {
    backgroundColor: Colors.primaryLight,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  tagText: {
    fontSize: 12,
    color: Colors.primaryDark,
    fontWeight: '600',
  },
  section: {
    marginHorizontal: 16,
    marginTop: 20,
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 16,
    shadowColor: Colors.shadow,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
  },
  addBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  addBtnText: {
    color: Colors.textWhite,
    fontSize: 13,
    fontWeight: '600',
  },
  emptyPets: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  emptyPetsIcon: {
    fontSize: 40,
    marginBottom: 8,
  },
  emptyPetsText: {
    fontSize: 15,
    color: Colors.text,
    fontWeight: '600',
  },
  emptyPetsSub: {
    fontSize: 12,
    color: Colors.textLight,
    marginTop: 2,
  },
  petCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.bg,
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  petAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  petAvatarText: {
    fontSize: 22,
  },
  petInfo: {
    flex: 1,
  },
  petName: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text,
  },
  petBreed: {
    fontSize: 12,
    color: Colors.textLight,
  },
  petGender: {
    fontSize: 18,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  menuText: {
    fontSize: 15,
    color: Colors.text,
  },
  menuArrow: {
    fontSize: 22,
    color: Colors.textLight,
  },
  logoutBtn: {
    marginHorizontal: 16,
    marginTop: 24,
    backgroundColor: Colors.card,
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.error,
  },
  logoutText: {
    fontSize: 16,
    color: Colors.error,
    fontWeight: '600',
  },
});
