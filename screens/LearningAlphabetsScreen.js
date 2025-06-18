import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import * as Speech from 'expo-speech';

const alphabet = Array.from({ length: 26 }, (_, i) =>
  String.fromCharCode(65 + i)
);

export default function LearningAlphabetsScreen({ navigation }) {
  const [phonics, setPhonics] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPhonicsData();
  }, []);

  const fetchPhonicsData = async () => {
    try {
      const response = await fetch('https://mocki.io/v1/99b50a20-5135-4ac7-ab29-57d8bddf50c0');
      const data = await response.json();
      setPhonics(data);
    } catch (error) {
      console.error('Error fetching phonics data:', error);
    } finally {
      setLoading(false);
    }
  };

  const speakLetter = (letter) => {
    Speech.speak(letter, { language: 'en', rate: 0.9, pitch: 1.1 });
  };

  const speakPhonics = (letter) => {
    const phrase = phonics[letter] || `Phonics for ${letter} not found`;
    Speech.speak(phrase, { language: 'en', rate: 0.9, pitch: 1 });
  };

  const renderItem = ({ item }) => (
    <View style={styles.letterContainer}>
      <TouchableOpacity
        style={styles.letterButton}
        onPress={() => speakLetter(item)}
      >
        <Text style={styles.letterText}>{item}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.phonicsButton}
        onPress={() => speakPhonics(item)}
      >
        <Text style={styles.phonicsText}>🔊</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6C63FF" />
        <Text>Loading phonics...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🔤 Learn the Alphabets</Text>
      <FlatList
        data={alphabet}
        keyExtractor={(item) => item}
        renderItem={renderItem}
        numColumns={5}
        contentContainerStyle={styles.grid}
      />
      <TouchableOpacity
        style={styles.endButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.endText}>Back</Text>
      </TouchableOpacity>
    </View>
  );
}

const windowWidth = Dimensions.get('window').width;
const itemSize = windowWidth / 5 - 20;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF9FA',
    alignItems: 'center',
    paddingTop: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6C63FF',
    marginBottom: 20,
  },
  grid: {
    alignItems: 'center',
    paddingBottom: 30,
  },
  letterContainer: {
    alignItems: 'center',
    margin: 8,
  },
  letterButton: {
    width: itemSize,
    height: itemSize,
    backgroundColor: '#ADD8E6',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    elevation: 3,
  },
  letterText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#222',
  },
  phonicsButton: {
    marginTop: 5,
    backgroundColor: '#FFD700',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 20,
    elevation: 2,
  },
  phonicsText: {
    fontSize: 16,
    color: '#000',
    fontWeight: 'bold',
  },
  endButton: {
    marginTop: 20,
    backgroundColor: '#FF6347',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
    elevation: 3,
  },
  endText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
