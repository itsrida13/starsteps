import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated as RNAnimated, SafeAreaView } from 'react-native';
import * as Speech from 'expo-speech';
import { Audio } from 'expo-av';
import Animated, { BounceInDown } from 'react-native-reanimated';
import AsyncStorage from '@react-native-async-storage/async-storage';

const questions = [
  {
    prompt: 'Choose the circle shape',
    correct: 'Circle',
    options: ['Circle', 'Rectangle', 'Square'],
  },
  {
    prompt: 'Choose the square shape',
    correct: 'Square',
    options: ['Rectangle', 'Square', 'Circle'],
  },
  {
    prompt: 'Choose the rectangle shape',
    correct: 'Rectangle',
    options: ['Square', 'Circle', 'Rectangle'],
  },
];

export default function ShapeIdentificationScreen({ navigation }) {
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [message, setMessage] = useState('');
  const [quizEnded, setQuizEnded] = useState(false);
  const [balloonsAnim] = useState(new RNAnimated.Value(0));
  const [correctCount, setCorrectCount] = useState(0);

  // ✅ Set up audio mode for mobile devices
  useEffect(() => {
    const initAudio = async () => {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        staysActiveInBackground: false,
        interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
        playThroughEarpieceAndroid: false,
      });
    };

    const fetchProgress = async () => {
      const data = await AsyncStorage.getItem('shapeProgress');
      if (data) {
        console.log('Shape progress history:', JSON.parse(data));
      }
    };

    initAudio();
    fetchProgress();
  }, []);

  // ✅ Fixed speech prompt
  const speakPrompt = async (text) => {
    try {
      await Speech.stop();
      await Speech.speak(text, {
        language: 'en',
        rate: 0.9,
        pitch: 1.1,
      });
    } catch (error) {
      console.log('Speech error:', error);
    }
  };

  const playFeedback = (correct) => {
    Speech.speak(correct ? 'You passed!' : 'Better luck next time', {
      language: 'en',
      rate: 1.0,
      pitch: 1.1,
    });
  };

  const playCelebrationSound = async () => {
    const { sound } = await Audio.Sound.createAsync(
      require('../assets/sounds/yay.mp3')
    );
    await sound.playAsync();
  };

  const triggerCelebration = () => {
    RNAnimated.timing(balloonsAnim, {
      toValue: 1,
      duration: 1500,
      useNativeDriver: true,
    }).start();
    playCelebrationSound();

    setTimeout(() => {
      saveLocalProgress();
      setQuizEnded(true);
    }, 300);
  };

  const saveLocalProgress = async () => {
    const newEntry = {
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString(),
      correct: correctCount,
      wrong: questions.length - correctCount,
      total: questions.length,
    };

    try {
      const existing = await AsyncStorage.getItem('shapeProgress');
      const parsed = existing ? JSON.parse(existing) : [];
      parsed.push(newEntry);
      await AsyncStorage.setItem('shapeProgress', JSON.stringify(parsed));
      console.log('Progress saved locally:', newEntry);
    } catch (e) {
      console.error('Failed to save local progress:', e);
    }
  };

  const handleAnswer = async (option) => {
    const currentQ = questions[currentQIndex];
    const isCorrect = option === currentQ.correct;
    if (isCorrect) setCorrectCount((prev) => prev + 1);

    setMessage(isCorrect ? '✅ You passed!' : '❌ Better luck next time');
    playFeedback(isCorrect);

    setTimeout(() => {
      if (currentQIndex < questions.length - 1) {
        const nextIndex = currentQIndex + 1;
        setCurrentQIndex(nextIndex);
        setMessage('');
        speakPrompt(questions[nextIndex].prompt);
      } else {
        setMessage('🎉 Quiz completed!');
        triggerCelebration();
      }
    }, 2000);
  };

  // ✅ Updated to delay speech a bit for mobile reliability
  const startQuiz = async () => {
    console.log('Start button pressed');
    setQuizStarted(true);

    setTimeout(() => {
      speakPrompt(questions[0].prompt);
    }, 300);
  };

  const renderQuestion = () => {
    const currentQ = questions[currentQIndex];
    return (
      <View style={styles.quizBox}>
        <Text style={styles.prompt}>{currentQ.prompt}</Text>
        <View style={styles.optionsContainer}>
          {currentQ.options.map((option, index) => (
            <Animated.View
              key={option}
              entering={BounceInDown.delay(index * 300)}
              style={styles.shapeButtonWrapper}
            >
              <TouchableOpacity
                style={[styles.shapeButton, getShapeStyle(option)]}
                onPress={() => handleAnswer(option)}
              >
                <Text style={styles.shapeText}>{option}</Text>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Text style={styles.title}>🟢 Shape Identification Quiz</Text>
        {!quizStarted ? (
          <TouchableOpacity style={styles.startButton} onPress={startQuiz}>
            <Text style={styles.startText}>Start Quiz</Text>
          </TouchableOpacity>
        ) : (
          renderQuestion()
        )}

        {quizStarted && !quizEnded && message === '' && (
          <Text style={{ marginTop: 10, color: 'gray' }}>Loading quiz...</Text>
        )}

        {message !== '' && <Text style={styles.message}>{message}</Text>}

        {quizEnded && (
          <>
            <RNAnimated.Text
              style={[
                styles.celebrationText,
                {
                  opacity: balloonsAnim,
                  transform: [
                    {
                      translateY: balloonsAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [50, 0],
                      }),
                    },
                  ],
                },
              ]}
            >
              🎈🎉🎊 Hurray! 🎊🎉🎈
            </RNAnimated.Text>

            <TouchableOpacity
              style={styles.endButton}
              onPress={() => navigation.navigate('SpecialChild')}
            >
              <Text style={styles.endText}>End Quiz</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

const getShapeStyle = (shape) => {
  switch (shape) {
    case 'Circle':
      return {
        backgroundColor: '#FFB6C1',
        width: 100,
        height: 100,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
      };
    case 'Square':
      return {
        backgroundColor: '#ADD8E6',
        width: 100,
        height: 100,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
      };
    case 'Rectangle':
      return {
        backgroundColor: '#90EE90',
        width: 160,
        height: 80,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
      };
    default:
      return {};
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF9FA',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#6C63FF',
  },
  startButton: {
    backgroundColor: '#6C63FF',
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 30,
    elevation: 4,
  },
  startText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  quizBox: {
    width: '100%',
    alignItems: 'center',
  },
  prompt: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 20,
    color: '#333',
  },
  optionsContainer: {
    flexDirection: 'column',
    gap: 20,
  },
  shapeButtonWrapper: {
    alignItems: 'center',
  },
  shapeText: {
    color: '#222',
    fontSize: 16,
    fontWeight: 'bold',
  },
  message: {
    marginTop: 30,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#D2691E',
  },
  endButton: {
    marginTop: 30,
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
  celebrationText: {
    fontSize: 32,
    marginTop: 30,
    textAlign: 'center',
  },
});
