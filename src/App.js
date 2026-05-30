import React, {useState, useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {StatusBar, View, Text, StyleSheet} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Colors} from './theme/colors';
import {setToken} from './api/client';

// 页面
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import HomeScreen from './screens/HomeScreen';
import PetDetailScreen from './screens/PetDetailScreen';
import MatchScreen from './screens/MatchScreen';
import MessageScreen from './screens/MessageScreen';
import ChatScreen from './screens/ChatScreen';
import ProfileScreen from './screens/ProfileScreen';
import CreatePetScreen from './screens/CreatePetScreen';
import MomentsScreen from './screens/MomentsScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// 简易图标组件（纯文字，避免原生依赖）
function TabIcon({label, focused}) {
  const icons = {
    首页: '🏠',
    匹配: '💕',
    消息: '💬',
    动态: '📸',
    我的: '👤',
  };
  return (
    <Text style={{fontSize: focused ? 26 : 22, opacity: focused ? 1 : 0.5}}>
      {icons[label] || '●'}
    </Text>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({focused}) => (
          <TabIcon label={route.name} focused={focused} />
        ),
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.tabInactive,
        tabBarStyle: {
          backgroundColor: Colors.tabBar,
          borderTopColor: Colors.border,
          borderTopWidth: 1,
          height: 60,
          paddingBottom: 8,
          paddingTop: 4,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
        headerStyle: {
          backgroundColor: Colors.primary,
        },
        headerTintColor: Colors.textWhite,
        headerTitleStyle: {
          fontWeight: 'bold',
          fontSize: 18,
        },
      })}>
      <Tab.Screen
        name="首页"
        component={HomeScreen}
        options={{headerTitle: '你配吗'}}
      />
      <Tab.Screen
        name="匹配"
        component={MatchScreen}
        options={{headerTitle: '匹配'}}
      />
      <Tab.Screen
        name="消息"
        component={MessageScreen}
        options={{headerTitle: '消息'}}
      />
      <Tab.Screen
        name="动态"
        component={MomentsScreen}
        options={{headerTitle: '动态'}}
      />
      <Tab.Screen
        name="我的"
        component={ProfileScreen}
        options={{headerTitle: '我的'}}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(null); // null = 加载中

  useEffect(() => {
    checkLogin();
  }, []);

  async function checkLogin() {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        setToken(token);
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    } catch {
      setIsLoggedIn(false);
    }
  }

  async function handleLogin(token) {
    await AsyncStorage.setItem('token', token);
    setToken(token);
    setIsLoggedIn(true);
  }

  async function handleLogout() {
    await AsyncStorage.removeItem('token');
    setToken(null);
    setIsLoggedIn(false);
  }

  if (isLoggedIn === null) {
    return (
      <View style={styles.loading}>
        <Text style={styles.loadingText}>🐾 你配吗 🐾</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <StatusBar backgroundColor={Colors.primary} barStyle="light-content" />
      <Stack.Navigator
        screenOptions={{
          headerStyle: {backgroundColor: Colors.primary},
          headerTintColor: Colors.textWhite,
          headerTitleStyle: {fontWeight: 'bold'},
        }}>
        {isLoggedIn ? (
          <>
            <Stack.Screen name="Main" component={MainTabs} options={{headerShown: false}} />
            <Stack.Screen name="PetDetail" component={PetDetailScreen} options={{headerTitle: '宠物详情'}} />
            <Stack.Screen name="Chat" component={ChatScreen} options={{headerTitle: '聊天'}} />
            <Stack.Screen name="CreatePet" component={CreatePetScreen} options={{headerTitle: '添加宠物'}} />
          </>
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} options={{headerShown: false}} />
            <Stack.Screen name="Register" component={RegisterScreen} options={{headerShown: false}} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.primaryLight,
  },
  loadingText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.primary,
  },
});
