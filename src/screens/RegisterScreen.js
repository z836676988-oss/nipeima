import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import {Colors} from '../theme/colors';
import {register} from '../api/client';

const SOCIAL_OPTIONS = [
  {key: 'active', label: '爱社交', icon: '😄'},
  {key: 'reserved', label: '有点社恐', icon: '😊'},
  {key: 'pet_only', label: '只聊宠物', icon: '🐕'},
  {key: 'anonymous', label: '完全隐身', icon: '👻'},
];

const VISIBILITY_OPTIONS = [
  {key: 'public', label: '公开', icon: '🌍'},
  {key: 'matched_only', label: '仅匹配后可见', icon: '🔒'},
  {key: 'pet_card_only', label: '只看宠物卡片', icon: '🐾'},
];

export default function RegisterScreen({navigation, onLogin}) {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [socialPref, setSocialPref] = useState('pet_only');
  const [visibility, setVisibility] = useState('pet_card_only');
  const [loading, setLoading] = useState(false);

  async function handleRegister() {
    if (!phone || !password || !nickname) {
      Alert.alert('提示', '请填写所有必填项');
      return;
    }
    if (phone.length !== 11) {
      Alert.alert('提示', '请输入正确的手机号');
      return;
    }
    setLoading(true);
    try {
      const res = await register(phone, password, nickname, socialPref, visibility);
      Alert.alert('注册成功', '欢迎加入你配吗！', [
        {text: '好的', onPress: () => onLogin(res.access_token)},
      ]);
    } catch (e) {
      Alert.alert('注册失败', e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled">
        {/* 顶部 */}
        <View style={styles.header}>
          <Text style={styles.headerIcon}>🐾</Text>
          <Text style={styles.headerTitle}>注册账号</Text>
          <Text style={styles.headerSub}>为你和宠物找到另一半</Text>
        </View>

        {/* 基本信息 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>基本信息</Text>

          <Text style={styles.label}>手机号</Text>
          <TextInput
            style={styles.input}
            placeholder="请输入手机号"
            placeholderTextColor={Colors.textLight}
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
            maxLength={11}
          />

          <Text style={styles.label}>昵称</Text>
          <TextInput
            style={styles.input}
            placeholder="给自己取个名字吧"
            placeholderTextColor={Colors.textLight}
            value={nickname}
            onChangeText={setNickname}
          />

          <Text style={styles.label}>密码</Text>
          <TextInput
            style={styles.input}
            placeholder="设置密码（至少6位）"
            placeholderTextColor={Colors.textLight}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>

        {/* 社交偏好 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>社交偏好</Text>
          <Text style={styles.sectionDesc}>
            社恐也没关系，按你舒服的方式来
          </Text>
          <View style={styles.optionsGrid}>
            {SOCIAL_OPTIONS.map(opt => (
              <TouchableOpacity
                key={opt.key}
                style={[
                  styles.optionCard,
                  socialPref === opt.key && styles.optionCardActive,
                ]}
                onPress={() => setSocialPref(opt.key)}>
                <Text style={styles.optionIcon}>{opt.icon}</Text>
                <Text
                  style={[
                    styles.optionLabel,
                    socialPref === opt.key && styles.optionLabelActive,
                  ]}>
                  {opt.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* 可见性 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>资料可见性</Text>
          <Text style={styles.sectionDesc}>
            控制谁可以看到你的信息
          </Text>
          {VISIBILITY_OPTIONS.map(opt => (
            <TouchableOpacity
              key={opt.key}
              style={[
                styles.visibilityRow,
                visibility === opt.key && styles.visibilityRowActive,
              ]}
              onPress={() => setVisibility(opt.key)}>
              <Text style={styles.visibilityIcon}>{opt.icon}</Text>
              <Text
                style={[
                  styles.visibilityLabel,
                  visibility === opt.key && styles.visibilityLabelActive,
                ]}>
                {opt.label}
              </Text>
              {visibility === opt.key && (
                <Text style={styles.checkmark}>✓</Text>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* 注册按钮 */}
        <TouchableOpacity
          style={[styles.btn, loading && styles.btnDisabled]}
          onPress={handleRegister}
          disabled={loading}>
          <Text style={styles.btnText}>
            {loading ? '注册中...' : '注册并加入'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.linkBtn}
          onPress={() => navigation.goBack()}>
          <Text style={styles.linkText}>
            已有账号？<Text style={styles.linkHighlight}>去登录</Text>
          </Text>
        </TouchableOpacity>

        <View style={{height: 40}} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  scroll: {
    paddingHorizontal: 24,
    paddingTop: 60,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  headerIcon: {
    fontSize: 48,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.primary,
    marginTop: 8,
  },
  headerSub: {
    fontSize: 14,
    color: Colors.textLight,
    marginTop: 4,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 4,
  },
  sectionDesc: {
    fontSize: 13,
    color: Colors.textLight,
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 6,
    marginLeft: 4,
  },
  input: {
    backgroundColor: Colors.inputBg,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: Colors.text,
    marginBottom: 14,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  optionCard: {
    width: '47%',
    backgroundColor: Colors.card,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.border,
    paddingVertical: 16,
    paddingHorizontal: 12,
    alignItems: 'center',
    marginBottom: 8,
  },
  optionCardActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryLight,
  },
  optionIcon: {
    fontSize: 28,
    marginBottom: 4,
  },
  optionLabel: {
    fontSize: 14,
    color: Colors.text,
    fontWeight: '500',
  },
  optionLabelActive: {
    color: Colors.primaryDark,
    fontWeight: '700',
  },
  visibilityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.border,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  visibilityRowActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryLight,
  },
  visibilityIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  visibilityLabel: {
    fontSize: 15,
    color: Colors.text,
    fontWeight: '500',
    flex: 1,
  },
  visibilityLabelActive: {
    color: Colors.primaryDark,
    fontWeight: '700',
  },
  checkmark: {
    fontSize: 18,
    color: Colors.primary,
    fontWeight: 'bold',
  },
  btn: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: Colors.primary,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  btnDisabled: {
    opacity: 0.6,
  },
  btnText: {
    color: Colors.textWhite,
    fontSize: 18,
    fontWeight: 'bold',
  },
  linkBtn: {
    marginTop: 16,
    alignItems: 'center',
  },
  linkText: {
    fontSize: 14,
    color: Colors.textLight,
  },
  linkHighlight: {
    color: Colors.primary,
    fontWeight: '600',
  },
});
