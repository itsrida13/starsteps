import React, { useContext } from 'react';
import { View, StyleSheet } from 'react-native';
import { Switch, Text, List } from 'react-native-paper';
import { ThemeContext } from '../contexts/ThemeContext';

export default function SettingsScreen() {
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);

  return (
    <View style={styles.container}>
      <List.Section>
        <List.Subheader>App Preferences</List.Subheader>
        <List.Item
          title="Dark Mode"
          left={() => <List.Icon icon="theme-light-dark" />}
          right={() => (
            <Switch value={isDarkMode} onValueChange={toggleTheme} />
          )}
        />
      </List.Section>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
});
