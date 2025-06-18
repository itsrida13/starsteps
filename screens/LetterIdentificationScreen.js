import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { Audio, InterruptionModeIOS, InterruptionModeAndroid } from 'expo-av';
import AsyncStorage from '@react-native-async-storage/async-storage';

import successSoundFile from '../assets/sounds/success.mp3';
import failSoundFile from '../assets/sounds/fail.mp3';

const questions = [
  { question: 'Identify the letter A', options: ['A', 'M', 'C'], correctAnswer: 'A' },
  { question: 'Identify the letter B', options: ['D', 'B', 'E'], correctAnswer: 'B' },
  { question: 'Identify the letter C', options: ['G', 'C', 'F'], correctAnswer: 'C' },
  { question: 'Identify the letter D', options: ['D', 'H', 'A'], correctAnswer: 'D' },
  { question: 'Identify the letter E', options: ['E', 'L', 'B'], correctAnswer: 'E' },
];

export default function LetterIdentificationScreen() {
  const [started, setStarted] = useState(false);
  const [loadingSounds, setLoadingSounds] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [progressSaved, setProgressSaved] = useState(false);

  const successSoundRef = useRef(null);
  const failSoundRef = useRef(null);

  // Prepare audio on mount
  useEffect(() => {
    const prepareAudio = async () => {
      try {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
          staysActiveInBackground: false,
          interruptionModeIOS: InterruptionModeIOS.DoNotMix,
          playsInSilentModeIOS: true,
          shouldDuckAndroid: true,
          interruptionModeAndroid: InterruptionModeAndroid.DoNotMix,
          playThroughEarpieceAndroid: false,
        });

        const { sound: success } = await Audio.Sound.createAsync(successSoundFile, { shouldPlay: false });
        const { sound: fail } = await Audio.Sound.createAsync(failSoundFile, { shouldPlay: false });

        successSoundRef.current = success;
        failSoundRef.current = fail;
      } catch (error) {
        console.error('Audio initialization error:', error);
      } finally {
        setLoadingSounds(false);
      }
    };

    prepareAudio();

    return () => {
      successSoundRef.current?.unloadAsync();
      failSoundRef.current?.unloadAsync();
    };
  }, []);

  // Save progress after last question
  useEffect(() => {
    if (currentQuestion >= questions.length && !progressSaved) {
      setProgressSaved(true);
      saveProgress();
    }
  }, [currentQuestion]);

  const playSound = async (soundRef) => {
    if (!soundRef) return;
    try {
      setIsPlaying(true);
      await soundRef.replayAsync();
      soundRef.setOnPlaybackStatusUpdate((status) => {
        if (status.didJustFinish) {
          setIsPlaying(false);
        }
      });
    } catch (error) {
      console.error('Sound playback error:', error);
      setIsPlaying(false);
    }
  };

  const handleAnswer = async (selectedOption) => {
    if (isPlaying || currentQuestion >= questions.length) return;

    const correct = questions[currentQuestion].correctAnswer;
    const isCorrect = selectedOption === correct;

    if (isCorrect) {
      setCorrectCount((prev) => prev + 1);
    } else {
      setWrongCount((prev) => prev + 1);
    }

    setFeedback(isCorrect ? 'You passed!' : 'Better next time');
    await playSound(isCorrect ? successSoundRef.current : failSoundRef.current);

    setTimeout(() => {
      setFeedback('');
      setCurrentQuestion((prev) => prev + 1);
    }, 1000);
  };

  const startQuiz = () => {
    if (loadingSounds) return;
    setStarted(true);
    setCurrentQuestion(0);
    setFeedback('');
    setCorrectCount(0);
    setWrongCount(0);
    setProgressSaved(false);
  };

  const saveProgress = async () => {
    const now = new Date();
    const newEntry = {
      date: now.toLocaleDateString(),
      time: now.toLocaleTimeString(),
      correct: correctCount,
      wrong: wrongCount,
      total: questions.length,
    };

    try {
      const existing = await AsyncStorage.getItem('letterProgress');
      const parsed = existing ? JSON.parse(existing) : [];
      parsed.push(newEntry);
      await AsyncStorage.setItem('letterProgress', JSON.stringify(parsed));
      console.log('Letter quiz progress saved!');
    } catch (error) {
      console.error('Error saving progress:', error);
    }
  };

  // Render loading screen
  if (loadingSounds) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#6C63FF" />
        <Text>Loading sounds...</Text>
      </View>
    );
  }

  // Render welcome/start screen
  if (!started) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Letter Identification Quiz</Text>
        <TouchableOpacity style={styles.startButton} onPress={startQuiz}>
          <Text style={styles.startText}>Start</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Render result screen
  if (currentQuestion >= questions.length) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Quiz Completed 🎉</Text>
        <Text style={{ fontSize: 18, marginBottom: 10 }}>
          ✅ {correctCount} Correct — ❌ {wrongCount} Wrong
        </Text>
        <TouchableOpacity style={styles.startButton} onPress={startQuiz}>
          <Text style={styles.startText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Render quiz screen
  const question = questions[currentQuestion];

  return (
    <View style={styles.container}>
      <Text style={styles.question}>{question.question}</Text>
      {question.options.map((option, index) => (
        <TouchableOpacity
          key={index}
          style={[styles.optionButton, isPlaying && { backgroundColor: '#ccc' }]}
          onPress={() => handleAnswer(option)}
          disabled={isPlaying}
        >
          <Text style={styles.optionText}>{option}</Text>
        </TouchableOpacity>
      ))}
      {feedback !== '' && <Text style={styles.feedback}>{feedback}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 80,
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: '#E6F0FA',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#3B3B98',
    marginBottom: 40,
  },
  startButton: {
    backgroundColor: '#6C63FF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  startText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  question: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 30,
    color: '#333',
    textAlign: 'center',
  },
  optionButton: {
    backgroundColor: '#FFB6C1',
    padding: 12,
    borderRadius: 10,
    marginVertical: 8,
    width: '80%',
    alignItems: 'center',
  },
  optionText: {
    color: '#3B3B98',
    fontSize: 18,
    fontWeight: '500',
  },
  feedback: {
    marginTop: 20,
    fontSize: 20,
    fontWeight: '600',
    color: '#FF7EB3',
  },
});
