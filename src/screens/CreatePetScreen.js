import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {Colors} from '../theme/colors';
import {createPet, getBreeds} from '../api/client';

export default function CreatePetScreen({navigation}) {
  const [name, setName] = useState('');
  const [gender, setGender] = useState('male');
  const [age, setAge] = useState('');
  const [size, setSize] = useState('medium');
  const [personality, setPersonality] = useState('');
  const [bio, setBio] = useState('');
  const [breeds, setBreeds] = useState([]);
  const [selectedBreed, setSelectedBreed] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadBreeds();
  }, []);

  async function loadBreeds() {
    setLoading(true);
    try {
      const res = await getBreeds();
      setBreeds(res.items || res || []);
    } catch (e) {
      console.log('加载品种失败', e.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit() {
    if (!name || !age) {
      Alert.alert('提示', '请填写宠物名称和年龄');
      return;
    }
    setSubmitting(true);
    try {
      await createPet({
        name,
        gender,
        age: parseInt(age) || 0,
        size,
        breed_id: selectedBreed,
        personality,
        bio,
      });
      Alert.alert('成功', '宠物添加成功！', [
        {text: '好的', onPress: () => navigation.goBack()},
      ]);
    } catch (e) {
      Alert.alert('添加失败', e.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* 宠物名称 */}
      <Text style={styles.label}>宠物名字 *</Text>
      <TextInput
        style={styles.input}
        placeholder="给宠物取个名字"
        placeholderTextColor={Colors.textLight}
        value={name}
        onChangeText={setName}
      />

      {/* 性别 */}
      <Text style={styles.label}>性别</Text>
      <View style={styles.row}>
        <TouchableOpacity
          style={[styles.optionBtn, gender === 'male' && styles.optionActive]}
          onPress={() => setGender('male')}>
          <Text style={[styles.optionText, gender === 'male' && styles.optionTextActive]}>
            ♂ 男生
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.optionBtn, gender === 'female' && styles.optionActive]}
          onPress={() => setGender('female')}>
          <Text style={[styles.optionText, gender === 'female' && styles.optionTextActive]}>
            ♀ 女生
          </Text>
        </TouchableOpacity>
      </View>

      {/* 年龄 */}
      <Text style={styles.label}>年龄（岁）*</Text>
      <TextInput
        style={styles.input}
        placeholder="例如: 2"
        placeholderTextColor={Colors.textLight}
        keyboardType="number-pad"
        value={age}
        onChangeText={setAge}
      />

      {/* 体型 */}
      <Text style={styles.label}>体型</Text>
      <View style={styles.row}>
        {[
          {key: 'small', label: '小型'},
          {key: 'medium', label: '中型'},
          {key: 'large', label: '大型'},
        ].map(s => (
          <TouchableOpacity
            key={s.key}
            style={[styles.optionBtn, size === s.key && styles.optionActive]}
            onPress={() => setSize(s.key)}>
            <Text style={[styles.optionText, size === s.key && styles.optionTextActive]}>
              {s.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* 品种 */}
      <Text style={styles.label}>品种</Text>
      {loading ? (
        <ActivityIndicator color={Colors.primary} />
      ) : (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.breedScroll}>
          {breeds.map(b => (
            <TouchableOpacity
              key={b.id}
              style={[styles.breedChip, selectedBreed === b.id && styles.breedChipActive]}
              onPress={() => setSelectedBreed(b.id)}>
              <Text style={[styles.breedChipText, selectedBreed === b.id && styles.breedChipTextActive]}>
                {b.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {/* 性格 */}
      <Text style={styles.label}>性格特点</Text>
      <TextInput
        style={styles.input}
        placeholder="例如: 活泼好动、温顺粘人"
        placeholderTextColor={Colors.textLight}
        value={personality}
        onChangeText={setPersonality}
      />

      {/* 简介 */}
      <Text style={styles.label}>自我介绍</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="介绍一下你的宠物吧..."
        placeholderTextColor={Colors.textLight}
        value={bio}
        onChangeText={setBio}
        multiline
        maxLength={500}
      />

      {/* 提交 */}
      <TouchableOpacity
        style={[styles.submitBtn, submitting && styles.btnDisabled]}
        onPress={handleSubmit}
        disabled={submitting}>
        <Text style={styles.submitText}>
          {submitting ? '添加中...' : '🐾 添加宠物'}
        </Text>
      </TouchableOpacity>

      <View style={{height: 40}} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  content: {
    padding: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 6,
    marginTop: 12,
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
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  optionBtn: {
    flex: 1,
    backgroundColor: Colors.card,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.border,
    paddingVertical: 12,
    alignItems: 'center',
  },
  optionActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryLight,
  },
  optionText: {
    fontSize: 15,
    color: Colors.text,
    fontWeight: '500',
  },
  optionTextActive: {
    color: Colors.primaryDark,
    fontWeight: '700',
  },
  breedScroll: {
    marginBottom: 4,
  },
  breedChip: {
    backgroundColor: Colors.card,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
  },
  breedChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  breedChipText: {
    fontSize: 14,
    color: Colors.text,
  },
  breedChipTextActive: {
    color: Colors.textWhite,
    fontWeight: '600',
  },
  submitBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 24,
    shadowColor: Colors.primary,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  btnDisabled: {
    opacity: 0.6,
  },
  submitText: {
    color: Colors.textWhite,
    fontSize: 18,
    fontWeight: 'bold',
  },
});
