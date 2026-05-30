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
import {login} from '../api/client';

export default function LoginScreen({navigation, onLogin}) {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    if (!phone || !password) {
      Alert.alert('提示', '请填写手机号和密码');
      return;
    }
    setLoading(true);
    try {
      const res = await login(phone, password);
      onLogin(res.access_token);
    } catch (e) {
      Alert.alert('登录失败', e.message);
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
        {/* Logo 区域 */}
        <View style={styles.logoArea}>
          <Text style={styles.logoIcon}>🐾</Text>
          <Text style={styles.logoText}>你配吗</Text>
          <Text style={styles.slogan}>宠物相亲 · 主人社交</Text>
        </View>

        {/* 输入框 */}
        <View style={styles.form}>
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

          <Text style={styles.label}>密码</Text>
          <TextInput
            style={styles.input}
            placeholder="请输入密码"
            placeholderTextColor={Colors.textLight}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <TouchableOpacity
            style={[styles.btn, loading && styles.btnDisabled]}
            onPress={handleLogin}
            disabled={loading}>
            <Text style={styles.btnText}>
              {loading ? '登录中...' : '登 录'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.linkBtn}
            onPress={() => navigation.navigate('Register')}>
            <Text style={styles.linkText}>
              还没有账号？<Text style={styles.linkHighlight}>立即注册</Text>
            </Text>
          </TouchableOpacity>
        </View>
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
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingVertical: 40,
  },
  logoArea: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoIcon: {
    fontSize: 64,
    marginBottom: 8,
  },
  logoText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 4,
  },
  slogan: {
    fontSize: 14,
    color: Colors.textLight,
  },
  form: {
    width: '100%',
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
    marginBottom: 16,
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
    marginTop: 20,
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
