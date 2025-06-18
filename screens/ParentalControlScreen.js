import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Switch, Divider } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';

export default function ParentalControlScreen() {
  const [settings, setSettings] = useState({
    showLetters: true,
    showShapes: true,
    showTasks: true,
  });

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const storedSettings = await AsyncStorage.getItem('moduleSettings');
        if (storedSettings) {
          setSettings(JSON.parse(storedSettings));
        }
      } catch (error) {
        console.error('Error loading parental settings:', error);
      }
    };
    loadSettings();
  }, []);

  const updateSetting = async (key, value) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);

    try {
      await AsyncStorage.setItem('moduleSettings', JSON.stringify(newSettings));
      Toast.show({
        type: 'success',
        text1: `Updated setting: ${key}`,
        position: 'bottom',
      });
    } catch (error) {
      console.error('Failed to save setting:', error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Parental Control</Text>

      <View style={styles.settingRow}>
        <Text style={styles.label}>Enable Letters Module</Text>
        <Switch
          value={settings.showLetters}
          onValueChange={(val) => updateSetting('showLetters', val)}
        />
      </View>
      <Divider style={styles.divider} />

      <View style={styles.settingRow}>
        <Text style={styles.label}>Enable Shapes Module</Text>
        <Switch
          value={settings.showShapes}
          onValueChange={(val) => updateSetting('showShapes', val)}
        />
      </View>
      <Divider style={styles.divider} />

      <View style={styles.settingRow}>
        <Text style={styles.label}>Enable Tasks Module</Text>
        <Switch
          value={settings.showTasks}
          onValueChange={(val) => updateSetting('showTasks', val)}
        />
      </View>

      <Toast />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    alignSelf: 'center',
    color: '#6200ee',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
  },
  divider: {
    marginBottom: 10,
  },
});
