import React, {useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  TextInput,
} from 'react-native';
import {Colors} from '../theme/colors';
import {matchPet} from '../api/client';

export default function PetDetailScreen({route, navigation}) {
  const {pet} = route.params;
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  async function handleMatch() {
    setSending(true);
    try {
      await matchPet(pet.id, message);
      Alert.alert('已发送', '匹配请求已发送，等待对方回应 💕');
      navigation.goBack();
    } catch (e) {
      Alert.alert('发送失败', e.message);
    } finally {
      setSending(false);
    }
  }

  return (
    <ScrollView style={styles.container}>
      {/* 宠物头像大图 */}
      <View style={styles.hero}>
        <View style={styles.heroAvatar}>
          <Text style={styles.heroEmoji}>
            {pet.avatar ? '🐾' : pet.breed_name ? '🐕' : '🐱'}
          </Text>
        </View>
        <Text style={styles.heroName}>
          {pet.name}
          <Text style={styles.heroGender}>
            {' '}{pet.gender === 'male' ? '♂' : '♀'}
          </Text>
        </Text>
        <Text style={styles.heroBreed}>{pet.breed_name}</Text>
      </View>

      {/* 详细信息 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>基本信息</Text>
        <View style={styles.infoGrid}>
          <InfoItem label="年龄" value={`${pet.age}岁`} />
          <InfoItem label="体型" value={sizeMap(pet.size)} />
          <InfoItem label="体重" value={pet.weight ? `${pet.weight}kg` : '-'} />
          <InfoItem label="颜色" value={pet.color || '-'} />
          <InfoItem label="已绝育" value={pet.is_neutered ? '是' : '否'} />
          <InfoItem label="已疫苗" value={pet.is_vaccinated ? '是' : '否'} />
        </View>
      </View>

      {pet.personality ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>性格特点</Text>
          <Text style={styles.descText}>{pet.personality}</Text>
        </View>
      ) : null}

      {pet.bio ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>自我介绍</Text>
          <Text style={styles.descText}>{pet.bio}</Text>
        </View>
      ) : null}

      {/* 主人信息 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>主人</Text>
        <View style={styles.ownerCard}>
          <View style={styles.ownerAvatarSmall}>
            <Text style={styles.ownerEmoji}>👤</Text>
          </View>
          <View>
            <Text style={styles.ownerName}>{pet.owner_nickname || '匿名主人'}</Text>
            <Text style={styles.ownerHint}>匹配后可查看详细资料</Text>
          </View>
        </View>
      </View>

      {/* 匹配区域 */}
      <View style={styles.matchSection}>
        <Text style={styles.matchTitle}>💕 想和它做朋友？</Text>
        <TextInput
          style={styles.messageInput}
          placeholder="给对方主人留个言吧..."
          placeholderTextColor={Colors.textLight}
          value={message}
          onChangeText={setMessage}
          multiline
          maxLength={200}
        />
        <TouchableOpacity
          style={[styles.matchBtn, sending && styles.btnDisabled]}
          onPress={handleMatch}
          disabled={sending}>
          <Text style={styles.matchBtnText}>
            {sending ? '发送中...' : '💕 发送匹配请求'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={{height: 40}} />
    </ScrollView>
  );
}

function InfoItem({label, value}) {
  return (
    <View style={styles.infoItem}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

function sizeMap(s) {
  const map = {small: '小型', medium: '中型', large: '大型'};
  return map[s] || s;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  hero: {
    alignItems: 'center',
    paddingVertical: 30,
    backgroundColor: Colors.primaryLight,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  heroAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.card,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  heroEmoji: {
    fontSize: 48,
  },
  heroName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
  },
  heroGender: {
    fontSize: 20,
  },
  heroBreed: {
    fontSize: 15,
    color: Colors.textLight,
    marginTop: 4,
  },
  section: {
    marginHorizontal: 20,
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
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 12,
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  infoItem: {
    width: '50%',
    marginBottom: 10,
  },
  infoLabel: {
    fontSize: 12,
    color: Colors.textLight,
  },
  infoValue: {
    fontSize: 15,
    color: Colors.text,
    fontWeight: '500',
    marginTop: 2,
  },
  descText: {
    fontSize: 14,
    color: Colors.text,
    lineHeight: 22,
  },
  ownerCard: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ownerAvatarSmall: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  ownerEmoji: {
    fontSize: 22,
  },
  ownerName: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text,
  },
  ownerHint: {
    fontSize: 12,
    color: Colors.textLight,
    marginTop: 2,
  },
  matchSection: {
    marginHorizontal: 20,
    marginTop: 20,
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 20,
    shadowColor: Colors.shadow,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 2,
  },
  matchTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 12,
    textAlign: 'center',
  },
  messageInput: {
    backgroundColor: Colors.inputBg,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    color: Colors.text,
    minHeight: 80,
    textAlignVertical: 'top',
    marginBottom: 12,
  },
  matchBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  btnDisabled: {
    opacity: 0.6,
  },
  matchBtnText: {
    color: Colors.textWhite,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
