import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Button, RefreshControl, Alert } from 'react-native';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';

type User = { _id: string; name: string; email: string; role?: string };

export default function UsersScreen({ navigation }: any) {
  const { logout } = useAuth();
  const [users, setUsers] = useState<User[]>([]);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/api/users/list');
      setUsers(res.data.data || []);
    } catch (e: any) {
      Alert.alert('Error', e?.response?.data?.message || e.message);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
        <Text style={{ fontSize: 24, fontWeight: '700' }}>Users</Text>
        <Button title="Logout" onPress={logout} />
      </View>

      <FlatList
        data={users}
        keyExtractor={(item) => item._id}
        refreshControl={<RefreshControl refreshing={false} onRefresh={fetchUsers} />}
        renderItem={({ item }) => (
          <View style={{ padding: 12, borderWidth: 1, borderRadius: 10, marginBottom: 8 }}>
            <Text style={{ fontSize: 16, fontWeight: '600' }}>{item.name} <Text style={{ fontWeight: '400' }}>({item.email})</Text></Text>
            <Text style={{ marginTop: 4 }}>role: {item.role || 'student'}</Text>
          </View>
        )}
        ListEmptyComponent={<Text>ไม่พบผู้ใช้</Text>}
      />

      <Button title="Go to Login" onPress={() => navigation.navigate('Login')} />
      <Button title="Go to Register" onPress={() => navigation.navigate('Register')} />
    </View>
  );
}
